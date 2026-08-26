"""Vehicle event detector — crashes, horns, skids, engines, sirens."""

from __future__ import annotations

import time

import numpy as np
import structlog

from intelligence.detectors.base import BaseDetector, DetectorOutput, FeatureVector

log = structlog.get_logger(__name__)

SUPPORTED_CLASSES = [
    "vehicle_crash",
    "vehicle_horn",
    "vehicle_skid",
    "vehicle_engine_rev",
    "emergency_siren",
    "unknown_vehicle",
]


def _harmonicity_ratio(spectrum: np.ndarray) -> float:
    """Rough harmonicity: ratio of energy at periodic intervals vs. total."""
    if spectrum.size < 8:
        return 0.0
    # Use autocorrelation of the spectrum as a proxy
    ac = np.correlate(spectrum, spectrum, mode="full")
    ac = ac[ac.size // 2:]
    if ac[0] < 1e-10:
        return 0.0
    # Find the strongest secondary peak
    from scipy.signal import find_peaks  # type: ignore[import]
    try:
        peaks, props = find_peaks(ac[1:], height=ac[0] * 0.15)
        if len(peaks) == 0:
            return 0.0
        return float(np.clip(ac[1 + peaks[0]] / ac[0], 0.0, 1.0))
    except Exception:
        return 0.0


def _estimate_fundamental(spectrum: np.ndarray, sample_rate: int = 16000) -> float:
    """Estimate fundamental frequency using HPS (harmonic product spectrum)."""
    if spectrum.size < 16:
        return 0.0
    mag = np.abs(spectrum[:512])  # work with lower half
    hps = mag.copy()
    for h in range(2, 5):
        downsampled = mag[::h][: len(hps)]
        hps[: len(downsampled)] *= downsampled
    bin_hz = sample_rate / (2 * len(spectrum))
    return float(np.argmax(hps) * bin_hz)


def _fm_rate(envelope: np.ndarray, frame_hop_ms: float = 10.0) -> float:
    """Estimate amplitude modulation rate in Hz from envelope."""
    if envelope.size < 10:
        return 0.0
    from scipy.signal import find_peaks  # type: ignore[import]
    try:
        peaks, _ = find_peaks(envelope, distance=2)
        if len(peaks) < 2:
            return 0.0
        avg_period_frames = float(np.mean(np.diff(peaks)))
        avg_period_s = avg_period_frames * frame_hop_ms / 1000.0
        return 1.0 / avg_period_s if avg_period_s > 0 else 0.0
    except Exception:
        return 0.0


class VehicleDetector(BaseDetector):
    """Heuristic detector for vehicle acoustic events."""

    FRAME_HOP_MS = 10.0

    def __init__(self) -> None:
        self._loaded = False
        self._model_version = "heuristic-0.5.0"
        self._calibration_version = "none-0.5.0"

    @property
    def name(self) -> str:
        return "vehicle_event"

    @property
    def version(self) -> str:
        return "0.5.0"

    @property
    def supported_classes(self) -> list[str]:
        return list(SUPPORTED_CLASSES)

    def load(self, model_dir: str) -> None:
        log.info("vehicle_detector_loaded", model_dir=model_dir)
        self._loaded = True

    def is_healthy(self) -> bool:
        return self._loaded

    def predict(self, features: FeatureVector) -> DetectorOutput:
        t_start = time.perf_counter()
        try:
            result = self._run_heuristics(features)
        except Exception as exc:
            log.error("vehicle_predict_error", error=str(exc))
            result = {cls: 0.05 for cls in SUPPORTED_CLASSES}
            result["unknown_vehicle"] = 0.90

        latency_ms = (time.perf_counter() - t_start) * 1000.0
        primary = max(result, key=lambda k: result[k])
        return DetectorOutput(
            detector_name=self.name,
            detector_version=self.version,
            model_version=self._model_version,
            calibration_version=self._calibration_version,
            predictions=result,
            primary_class=primary,
            primary_confidence=result[primary],
            unknown_probability=result["unknown_vehicle"],
            inference_latency_ms=round(latency_ms, 3),
        )

    def _run_heuristics(self, features: FeatureVector) -> dict[str, float]:
        env = features.envelope
        spec = features.spectrum_magnitude
        harmonicity = _harmonicity_ratio(spec)
        fundamental = _estimate_fundamental(spec)
        fm_rate = _fm_rate(env, self.FRAME_HOP_MS)
        centroid = features.spectral_centroid_hz
        peak_db = features.peak_energy_db
        zcr = features.zero_crossing_rate

        # --- Crash ---
        s_crash = 0.0
        if peak_db >= 65.0:
            s_crash += 0.30
        elif peak_db >= 55.0:
            s_crash += 0.15
        if harmonicity < 0.25:
            s_crash += 0.20  # broadband
        if features.snr_db >= 5.0:
            s_crash += 0.15
        peak_idx = int(np.argmax(env)) if env.size > 0 else 0
        attack_ms = peak_idx * self.FRAME_HOP_MS
        if attack_ms <= 100.0:
            s_crash += 0.20
        if zcr >= 0.15:
            s_crash += 0.10

        # --- Horn ---
        s_horn = 0.0
        if harmonicity >= 0.50:
            s_horn += 0.35
        elif harmonicity >= 0.35:
            s_horn += 0.15
        if 180.0 <= fundamental <= 900.0:
            s_horn += 0.35
        if zcr <= 0.30:
            s_horn += 0.10
        if peak_db >= 50.0:
            s_horn += 0.10
        if np.std(env) < np.mean(env) * 0.5 if env.size > 0 else False:
            s_horn += 0.10  # sustained/steady signal

        # --- Skid ---
        s_skid = 0.0
        if 800.0 <= centroid <= 4500.0:
            s_skid += 0.40
        elif 600.0 <= centroid < 800.0:
            s_skid += 0.15
        if peak_db >= 45.0:
            s_skid += 0.20
        if harmonicity < 0.30:
            s_skid += 0.20
        if 0.20 <= zcr <= 0.55:
            s_skid += 0.15

        # --- Engine rev ---
        s_engine = 0.0
        if harmonicity >= 0.35:
            s_engine += 0.30
        if 40.0 <= fundamental <= 450.0:
            s_engine += 0.35
        if np.std(env) / (np.mean(env) + 1e-10) > 0.4 if env.size > 0 else False:
            s_engine += 0.20  # increasing/varying amplitude
        if centroid <= 1500.0:
            s_engine += 0.10

        # --- Siren ---
        s_siren = 0.0
        if harmonicity >= 0.55:
            s_siren += 0.25
        if 0.4 <= fm_rate <= 4.0:
            s_siren += 0.45
        elif 0.2 <= fm_rate < 0.4:
            s_siren += 0.15
        if 500.0 <= fundamental <= 1500.0:
            s_siren += 0.20
        if peak_db >= 55.0:
            s_siren += 0.10

        scores = {
            "vehicle_crash": float(np.clip(s_crash, 0.0, 1.0)),
            "vehicle_horn": float(np.clip(s_horn, 0.0, 1.0)),
            "vehicle_skid": float(np.clip(s_skid, 0.0, 1.0)),
            "vehicle_engine_rev": float(np.clip(s_engine, 0.0, 1.0)),
            "emergency_siren": float(np.clip(s_siren, 0.0, 1.0)),
        }

        max_known = max(scores.values())
        if peak_db < 40.0:
            unknown = 0.85
        elif max_known < 0.30:
            unknown = 0.75
        else:
            unknown = max(0.05, 0.65 - max_known * 0.70)
        scores["unknown_vehicle"] = float(np.clip(unknown, 0.0, 1.0))
        return scores
