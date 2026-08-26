"""Glass break detector — residential, commercial, and vehicle glass."""

from __future__ import annotations

import time

import numpy as np
import structlog

from intelligence.detectors.base import BaseDetector, DetectorOutput, FeatureVector

log = structlog.get_logger(__name__)

SUPPORTED_CLASSES = [
    "glass_residential",
    "glass_commercial",
    "glass_vehicle",
    "unknown_glass",
]


def _high_freq_energy_ratio(spectrum: np.ndarray, cutoff_fraction: float = 0.5) -> float:
    """Fraction of energy in the top *cutoff_fraction* of spectrum bins."""
    if spectrum.size == 0:
        return 0.0
    cutoff_bin = int(len(spectrum) * (1.0 - cutoff_fraction))
    total = float(np.sum(spectrum ** 2))
    if total < 1e-10:
        return 0.0
    high = float(np.sum(spectrum[cutoff_bin:] ** 2))
    return float(np.clip(high / total, 0.0, 1.0))


def _ring_duration_estimate(envelope: np.ndarray, peak_idx: int,
                              frame_hop_ms: float = 10.0) -> float:
    """Estimate ringing duration (ms) from the high-frequency decay tail."""
    tail = envelope[peak_idx:]
    if tail.size < 2:
        return 0.0
    peak_val = tail[0]
    # Ring ends when energy drops to 5% of peak (high-freq damping threshold)
    below = np.where(tail < peak_val * 0.05)[0]
    if below.size == 0:
        return float(len(tail) * frame_hop_ms)
    return float(below[0] * frame_hop_ms)


class GlassDetector(BaseDetector):
    """Heuristic detector for glass breaking events."""

    FRAME_HOP_MS = 10.0

    def __init__(self) -> None:
        self._loaded = False
        self._model_version = "heuristic-0.5.0"
        self._calibration_version = "none-0.5.0"

    @property
    def name(self) -> str:
        return "glass_break"

    @property
    def version(self) -> str:
        return "0.5.0"

    @property
    def supported_classes(self) -> list[str]:
        return list(SUPPORTED_CLASSES)

    def load(self, model_dir: str) -> None:
        log.info("glass_detector_loaded", model_dir=model_dir)
        self._loaded = True

    def is_healthy(self) -> bool:
        return self._loaded

    def predict(self, features: FeatureVector) -> DetectorOutput:
        t_start = time.perf_counter()
        try:
            result = self._run_heuristics(features)
        except Exception as exc:
            log.error("glass_predict_error", error=str(exc))
            result = {cls: 0.05 for cls in SUPPORTED_CLASSES}
            result["unknown_glass"] = 0.90

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
            unknown_probability=result["unknown_glass"],
            inference_latency_ms=round(latency_ms, 3),
        )

    def _run_heuristics(self, features: FeatureVector) -> dict[str, float]:
        env = features.envelope
        spec = features.spectrum_magnitude
        peak_db = features.peak_energy_db
        rolloff = features.spectral_rolloff_hz

        peak_idx = int(np.argmax(env)) if env.size > 0 else 0
        high_freq_ratio = _high_freq_energy_ratio(spec, cutoff_fraction=0.50)
        ring_ms = _ring_duration_estimate(env, peak_idx, self.FRAME_HOP_MS)
        low_freq_ratio = 1.0 - high_freq_ratio

        # Spectral flatness (proxy)
        eps = 1e-10
        s = np.abs(spec) + eps
        geom = float(np.exp(np.mean(np.log(s))))
        arith = float(np.mean(s))
        flatness = float(np.clip(geom / arith, 0.0, 1.0))

        # --- Residential glass ---
        s_res = 0.0
        if peak_db >= 52.0:
            s_res += 0.20
        if high_freq_ratio >= 0.30:
            s_res += 0.30
        elif high_freq_ratio >= 0.20:
            s_res += 0.12
        if 50.0 <= ring_ms <= 350.0:
            s_res += 0.25
        elif ring_ms > 350.0:
            s_res += 0.05
        if rolloff >= 4000.0:
            s_res += 0.15
        if features.snr_db >= 4.0:
            s_res += 0.10

        # --- Commercial plate glass ---
        s_com = 0.0
        if peak_db >= 58.0:
            s_com += 0.25
        if high_freq_ratio >= 0.20:
            s_com += 0.20
        if low_freq_ratio >= 0.15:
            s_com += 0.25
        if ring_ms <= 250.0:
            s_com += 0.15
        if features.snr_db >= 5.0:
            s_com += 0.10

        # --- Vehicle glass (tempered) ---
        s_veh = 0.0
        if peak_db >= 50.0:
            s_veh += 0.20
        if high_freq_ratio >= 0.25:
            s_veh += 0.25
        if ring_ms <= 100.0:
            s_veh += 0.30
        if flatness >= 0.35:
            s_veh += 0.20  # tempered shatters evenly → flatter spectrum

        scores = {
            "glass_residential": float(np.clip(s_res, 0.0, 1.0)),
            "glass_commercial": float(np.clip(s_com, 0.0, 1.0)),
            "glass_vehicle": float(np.clip(s_veh, 0.0, 1.0)),
        }

        max_known = max(scores.values())
        if peak_db < 45.0 or high_freq_ratio < 0.10:
            unknown = 0.88
        elif max_known < 0.30:
            unknown = 0.75
        else:
            unknown = max(0.05, 0.65 - max_known * 0.72)
        scores["unknown_glass"] = float(np.clip(unknown, 0.0, 1.0))
        return scores
