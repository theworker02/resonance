"""Large explosion detector — industrial, structural, and ordnance."""

from __future__ import annotations

import time

import numpy as np
import structlog

from intelligence.detectors.base import BaseDetector, DetectorOutput, FeatureVector

log = structlog.get_logger(__name__)

SUPPORTED_CLASSES = [
    "explosion_industrial",
    "explosion_structural",
    "explosion_ordnance",
    "unknown_explosion",
]


def _multi_phase_peaks(envelope: np.ndarray) -> int:
    """Count major phase peaks in the envelope (structural demolition indicator)."""
    if envelope.size < 5:
        return 0
    try:
        from scipy.signal import find_peaks  # type: ignore[import]
        height = np.max(envelope) * 0.25
        peaks, _ = find_peaks(envelope, height=height, distance=5)
        return len(peaks)
    except Exception:
        return 0


class ExplosionDetector(BaseDetector):
    """Heuristic detector for large-scale explosion events."""

    FRAME_HOP_MS = 10.0

    def __init__(self) -> None:
        self._loaded = False
        self._model_version = "heuristic-0.5.0"
        self._calibration_version = "none-0.5.0"

    @property
    def name(self) -> str:
        return "large_explosion"

    @property
    def version(self) -> str:
        return "0.5.0"

    @property
    def supported_classes(self) -> list[str]:
        return list(SUPPORTED_CLASSES)

    def load(self, model_dir: str) -> None:
        log.info("explosion_detector_loaded", model_dir=model_dir)
        self._loaded = True

    def is_healthy(self) -> bool:
        return self._loaded

    def predict(self, features: FeatureVector) -> DetectorOutput:
        t_start = time.perf_counter()
        try:
            result = self._run_heuristics(features)
        except Exception as exc:
            log.error("explosion_predict_error", error=str(exc))
            result = {cls: 0.05 for cls in SUPPORTED_CLASSES}
            result["unknown_explosion"] = 0.90

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
            unknown_probability=result["unknown_explosion"],
            inference_latency_ms=round(latency_ms, 3),
        )

    def _run_heuristics(self, features: FeatureVector) -> dict[str, float]:
        env = features.envelope
        spec = features.spectrum_magnitude
        peak_db = features.peak_energy_db

        if env.size == 0:
            return {cls: 0.02 for cls in SUPPORTED_CLASSES}

        peak_idx = int(np.argmax(env))
        attack_ms = peak_idx * self.FRAME_HOP_MS

        # Decay / reverb tail
        peak_val = env[peak_idx]
        threshold = peak_val * 0.1
        tail = env[peak_idx:]
        below = np.where(tail < threshold)[0]
        decay_frames = int(below[0]) if below.size > 0 else len(tail)
        decay_ms = decay_frames * self.FRAME_HOP_MS

        # Low frequency ratio
        low_bins = max(1, len(spec) // 8)
        total_energy = float(np.sum(spec ** 2))
        low_energy = float(np.sum(spec[:low_bins] ** 2))
        low_freq_ratio = float(np.clip(low_energy / (total_energy + 1e-10), 0.0, 1.0))

        # Spectral flatness
        eps = 1e-10
        s = np.abs(spec) + eps
        flatness = float(np.clip(np.exp(np.mean(np.log(s))) / np.mean(s), 0.0, 1.0))

        phases = _multi_phase_peaks(env)

        # --- Industrial ---
        s_ind = 0.0
        if peak_db >= 78.0:
            s_ind += 0.25
        if decay_ms >= 500.0:
            s_ind += 0.25
        elif decay_ms >= 300.0:
            s_ind += 0.10
        if attack_ms >= 20.0:
            s_ind += 0.15  # slower rise
        if low_freq_ratio >= 0.35:
            s_ind += 0.25
        elif low_freq_ratio >= 0.20:
            s_ind += 0.10

        # --- Structural ---
        s_str = 0.0
        if peak_db >= 80.0:
            s_str += 0.25
        if decay_ms >= 800.0:
            s_str += 0.25
        if phases >= 2:
            s_str += 0.35
        elif phases == 1:
            s_str += 0.05

        # --- Ordnance ---
        s_ord = 0.0
        if peak_db >= 85.0:
            s_ord += 0.30
        elif peak_db >= 80.0:
            s_ord += 0.15
        if attack_ms <= 15.0:
            s_ord += 0.25
        elif attack_ms <= 30.0:
            s_ord += 0.10
        if flatness >= 0.35:
            s_ord += 0.20
        if decay_ms >= 1000.0:
            s_ord += 0.20

        scores = {
            "explosion_industrial": float(np.clip(s_ind, 0.0, 1.0)),
            "explosion_structural": float(np.clip(s_str, 0.0, 1.0)),
            "explosion_ordnance": float(np.clip(s_ord, 0.0, 1.0)),
        }

        max_known = max(scores.values())
        if peak_db < 70.0:
            unknown = 0.90
        elif max_known < 0.30:
            unknown = 0.78
        else:
            unknown = max(0.05, 0.65 - max_known * 0.70)
        scores["unknown_explosion"] = float(np.clip(unknown, 0.0, 1.0))
        return scores
