"""Fireworks detector — aerial bursts, ground-level, sustained displays.

Key discriminators vs. gunfire:
  - Longer, more complex decay tail with secondary pops
  - Lower spectral centroid (shell fragments vs. propellant)
  - Sustained display: repeated irregular bursts over multi-second window
"""

from __future__ import annotations

import time

import numpy as np
import structlog

from intelligence.detectors.base import BaseDetector, DetectorOutput, FeatureVector

log = structlog.get_logger(__name__)

SUPPORTED_CLASSES = [
    "fireworks_aerial_burst",
    "fireworks_ground_level",
    "fireworks_sustained_display",
    "unknown_fireworks",
]


def _count_secondary_pops(envelope: np.ndarray, peak_idx: int) -> int:
    """Count secondary energy peaks after the main burst."""
    if peak_idx >= len(envelope) - 3:
        return 0
    tail = envelope[peak_idx + 2:]
    if tail.size == 0:
        return 0
    try:
        from scipy.signal import find_peaks  # type: ignore[import]
        threshold = envelope[peak_idx] * 0.08
        peaks, _ = find_peaks(tail, height=threshold, distance=2)
        return len(peaks)
    except Exception:
        return 0


def _tail_entropy(envelope: np.ndarray, peak_idx: int) -> float:
    """Normalized entropy of decay envelope — measure of tail complexity."""
    tail = envelope[peak_idx:]
    if tail.size < 3:
        return 0.0
    tail = tail + 1e-10
    p = tail / tail.sum()
    entropy = -float(np.sum(p * np.log(p + 1e-10)))
    # Normalize to [0, 1] using max possible entropy for this length
    max_entropy = float(np.log(len(p)))
    if max_entropy < 1e-8:
        return 0.0
    return float(np.clip(entropy / max_entropy, 0.0, 1.0))


class FireworksDetector(BaseDetector):
    """Heuristic detector for fireworks events."""

    FRAME_HOP_MS: float = 10.0

    def __init__(self) -> None:
        self._loaded = False
        self._model_version = "heuristic-0.5.0"
        self._calibration_version = "none-0.5.0"

    @property
    def name(self) -> str:
        return "fireworks_event"

    @property
    def version(self) -> str:
        return "0.5.0"

    @property
    def supported_classes(self) -> list[str]:
        return list(SUPPORTED_CLASSES)

    def load(self, model_dir: str) -> None:
        log.info("fireworks_detector_loaded", model_dir=model_dir)
        self._loaded = True

    def is_healthy(self) -> bool:
        return self._loaded

    def predict(self, features: FeatureVector) -> DetectorOutput:
        t_start = time.perf_counter()
        try:
            result = self._run_heuristics(features)
        except Exception as exc:
            log.error("fireworks_predict_error", error=str(exc))
            result = {cls: 0.05 for cls in SUPPORTED_CLASSES}
            result["unknown_fireworks"] = 0.90

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
            unknown_probability=result["unknown_fireworks"],
            inference_latency_ms=round(latency_ms, 3),
        )

    def _run_heuristics(self, features: FeatureVector) -> dict[str, float]:
        env = features.envelope
        if env.size == 0:
            return {cls: 0.02 for cls in SUPPORTED_CLASSES}

        peak_idx = int(np.argmax(env))
        attack_ms = peak_idx * self.FRAME_HOP_MS
        decay_frames = 0
        peak_val = env[peak_idx]
        threshold = peak_val * 0.1
        tail_after_peak = env[peak_idx:]
        below = np.where(tail_after_peak < threshold)[0]
        if below.size > 0:
            decay_frames = int(below[0])
        decay_ms = decay_frames * self.FRAME_HOP_MS

        secondary_pops = _count_secondary_pops(env, peak_idx)
        tail_ent = _tail_entropy(env, peak_idx)
        centroid = features.spectral_centroid_hz
        peak_db = features.peak_energy_db

        # --- Aerial burst ---
        s_aerial = 0.0
        if peak_db >= 65.0:
            s_aerial += 0.25
        elif peak_db >= 55.0:
            s_aerial += 0.10
        if attack_ms <= 80.0:
            s_aerial += 0.15
        if decay_ms >= 100.0:
            s_aerial += 0.15
        if secondary_pops >= 2:
            s_aerial += 0.25
        elif secondary_pops == 1:
            s_aerial += 0.10
        if tail_ent >= 0.45:
            s_aerial += 0.20
        elif tail_ent >= 0.30:
            s_aerial += 0.08
        if centroid <= 4000.0:
            s_aerial += 0.05

        # --- Ground level ---
        s_ground = 0.0
        if 55.0 <= peak_db <= 78.0:
            s_ground += 0.30
        elif peak_db > 78.0:
            s_ground += 0.05
        if attack_ms <= 150.0:
            s_ground += 0.15
        if centroid <= 3000.0:
            s_ground += 0.20
        if features.snr_db >= 4.0:
            s_ground += 0.10
        if secondary_pops <= 1:
            s_ground += 0.15

        # --- Sustained display: use multiple impulses across the window ---
        # Approximated from high envelope std and multiple peaks
        env_std = float(np.std(env))
        env_mean = float(np.mean(env))
        cv = env_std / (env_mean + 1e-10)  # coefficient of variation
        s_sustained = 0.0
        if cv >= 0.8:
            s_sustained += 0.40
        elif cv >= 0.5:
            s_sustained += 0.20
        if secondary_pops >= 3:
            s_sustained += 0.30
        if tail_ent >= 0.55:
            s_sustained += 0.20

        scores = {
            "fireworks_aerial_burst": float(np.clip(s_aerial, 0.0, 1.0)),
            "fireworks_ground_level": float(np.clip(s_ground, 0.0, 1.0)),
            "fireworks_sustained_display": float(np.clip(s_sustained, 0.0, 1.0)),
        }

        max_known = max(scores.values())
        if peak_db < 50.0:
            unknown = 0.88
        elif max_known < 0.30:
            unknown = 0.75
        else:
            unknown = max(0.05, 0.65 - max_known * 0.75)
        scores["unknown_fireworks"] = float(np.clip(unknown, 0.0, 1.0))
        return scores
