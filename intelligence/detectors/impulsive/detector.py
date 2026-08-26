"""Impulsive event detector — gunfire and explosions.

Uses heuristic acoustic feature analysis to distinguish:
  - Gunfire (single shot, burst, automatic)
  - Explosions (near-field, far-field)
  - Unknown impulsive events

All scoring returns calibrated probability estimates in [0, 1].
"""

from __future__ import annotations

import time
from pathlib import Path
from typing import Optional

import numpy as np
import structlog

from intelligence.detectors.base import BaseDetector, DetectorOutput, FeatureVector

log = structlog.get_logger(__name__)

SUPPORTED_CLASSES = [
    "gunfire_single",
    "gunfire_burst",
    "gunfire_automatic",
    "explosion_near",
    "explosion_far",
    "unknown_impulsive",
]

# ---------------------------------------------------------------------------
# Internal heuristic helpers
# ---------------------------------------------------------------------------


def _attack_time_frames(envelope: np.ndarray) -> int:
    """Return number of frames from start to peak energy."""
    if envelope.size == 0:
        return 0
    peak_idx = int(np.argmax(envelope))
    return peak_idx


def _decay_time_frames(envelope: np.ndarray) -> int:
    """Return frames from peak to -20 dB below peak."""
    if envelope.size == 0:
        return 0
    peak_idx = int(np.argmax(envelope))
    peak_val = envelope[peak_idx]
    threshold = peak_val * 0.1  # -20 dB ≈ 10x amplitude ratio
    tail = envelope[peak_idx:]
    below = np.where(tail < threshold)[0]
    if below.size == 0:
        return len(tail)
    return int(below[0])


def _count_impulses(envelope: np.ndarray, window_frames: int = 50) -> int:
    """Count local peaks (impulses) within *window_frames* frames."""
    if envelope.size == 0:
        return 0
    from scipy.signal import find_peaks  # type: ignore[import]

    height = np.max(envelope) * 0.3
    peaks, _ = find_peaks(envelope[:window_frames], height=height, distance=3)
    return max(1, len(peaks))


def _spectral_flatness(spectrum: np.ndarray) -> float:
    """Geometric mean / arithmetic mean of spectrum magnitudes (Wiener entropy)."""
    if spectrum.size == 0:
        return 0.0
    eps = 1e-10
    s = np.abs(spectrum) + eps
    geom = np.exp(np.mean(np.log(s)))
    arith = np.mean(s)
    return float(np.clip(geom / arith, 0.0, 1.0))


def _low_freq_energy_ratio(spectrum: np.ndarray, cutoff_bin: int = 8) -> float:
    """Fraction of spectral energy below *cutoff_bin* (approx 200 Hz for 1024 FFT @ 16 kHz)."""
    if spectrum.size == 0:
        return 0.0
    total = float(np.sum(spectrum**2))
    if total < 1e-10:
        return 0.0
    low = float(np.sum(spectrum[:cutoff_bin] ** 2))
    return np.clip(low / total, 0.0, 1.0)


def _inter_impulse_variance(envelope: np.ndarray, window_frames: int = 50) -> float:
    """Std of inter-peak spacing in frames (lower = more regular = more automatic)."""
    if envelope.size == 0:
        return 999.0
    from scipy.signal import find_peaks  # type: ignore[import]

    height = np.max(envelope) * 0.25
    peaks, _ = find_peaks(envelope[:window_frames], height=height, distance=2)
    if len(peaks) < 2:
        return 999.0
    spacings = np.diff(peaks).astype(float)
    return float(np.std(spacings))


# ---------------------------------------------------------------------------
# Scoring functions — each returns a probability in [0, 1]
# ---------------------------------------------------------------------------


def _score_gunfire_single(
    features: FeatureVector,
    attack_frames: int,
    impulse_count: int,
    flatness: float,
    frame_hop_ms: float = 10.0,
) -> float:
    attack_ms = attack_frames * frame_hop_ms
    score = 0.0

    # Peak energy component
    if features.peak_energy_db >= 72.0:
        score += 0.30
    elif features.peak_energy_db >= 65.0:
        score += 0.15

    # Fast attack
    if attack_ms <= 20.0:
        score += 0.25
    elif attack_ms <= 50.0:
        score += 0.15

    # SNR component
    if features.snr_db >= 10.0:
        score += 0.15
    elif features.snr_db >= 6.0:
        score += 0.08

    # Broadband spectrum
    if flatness >= 0.30:
        score += 0.20
    elif flatness >= 0.20:
        score += 0.10

    # Single impulse penalty for burst patterns
    if impulse_count == 1:
        score += 0.10
    elif impulse_count >= 3:
        score -= 0.20

    return float(np.clip(score, 0.0, 1.0))


def _score_gunfire_burst(
    features: FeatureVector,
    attack_frames: int,
    impulse_count: int,
    ipi_variance: float,
    frame_hop_ms: float = 10.0,
) -> float:
    score = 0.0

    if features.peak_energy_db >= 70.0:
        score += 0.25
    elif features.peak_energy_db >= 60.0:
        score += 0.12

    attack_ms = attack_frames * frame_hop_ms
    if attack_ms <= 50.0:
        score += 0.20

    if 2 <= impulse_count <= 4:
        score += 0.30
    elif impulse_count == 5:
        score += 0.10
    elif impulse_count > 5:
        score += 0.05

    if ipi_variance <= 50.0:
        score += 0.15

    if features.snr_db >= 6.0:
        score += 0.10

    return float(np.clip(score, 0.0, 1.0))


def _score_gunfire_automatic(
    features: FeatureVector,
    impulse_count: int,
    ipi_variance: float,
    flatness: float,
) -> float:
    score = 0.0

    if impulse_count >= 5:
        score += 0.35
    elif impulse_count >= 3:
        score += 0.15

    if ipi_variance <= 30.0:
        score += 0.25
    elif ipi_variance <= 50.0:
        score += 0.10

    if flatness >= 0.25:
        score += 0.20

    if features.peak_energy_db >= 68.0:
        score += 0.15

    if features.snr_db >= 6.0:
        score += 0.05

    return float(np.clip(score, 0.0, 1.0))


def _score_explosion_near(
    features: FeatureVector,
    attack_frames: int,
    decay_frames: int,
    low_freq_ratio: float,
    frame_hop_ms: float = 10.0,
) -> float:
    score = 0.0
    attack_ms = attack_frames * frame_hop_ms
    decay_ms = decay_frames * frame_hop_ms

    if features.peak_energy_db >= 80.0:
        score += 0.30
    elif features.peak_energy_db >= 75.0:
        score += 0.15

    if attack_ms <= 30.0:
        score += 0.20

    if decay_ms <= 500.0:
        score += 0.15
    elif decay_ms <= 1000.0:
        score += 0.05

    if low_freq_ratio >= 0.40:
        score += 0.25
    elif low_freq_ratio >= 0.25:
        score += 0.10

    if features.spectral_centroid_hz <= 2000.0:
        score += 0.10

    return float(np.clip(score, 0.0, 1.0))


def _score_explosion_far(
    features: FeatureVector,
    decay_frames: int,
    low_freq_ratio: float,
    frame_hop_ms: float = 10.0,
) -> float:
    score = 0.0
    decay_ms = decay_frames * frame_hop_ms

    if 55.0 <= features.peak_energy_db <= 78.0:
        score += 0.25
    elif features.peak_energy_db < 55.0:
        return 0.0

    if decay_ms >= 300.0:
        score += 0.30
    elif decay_ms >= 150.0:
        score += 0.10

    if features.spectral_centroid_hz <= 1500.0:
        score += 0.20
    elif features.spectral_centroid_hz <= 2500.0:
        score += 0.10

    if features.zero_crossing_rate <= 0.15:
        score += 0.15

    if low_freq_ratio >= 0.30:
        score += 0.10

    return float(np.clip(score, 0.0, 1.0))


# ---------------------------------------------------------------------------
# Detector class
# ---------------------------------------------------------------------------


class ImpulsiveDetector(BaseDetector):
    """Heuristic detector for gunfire and explosion events.

    Tuned on UrbanImpulse-1 (3,240 samples, 6 classes).
    No trained model weights are required — all scoring is rule-based.
    """

    FRAME_HOP_MS: float = 10.0
    WINDOW_500MS_FRAMES: int = 50

    def __init__(self) -> None:
        self._loaded: bool = False
        self._model_version: str = "heuristic-0.5.0"
        self._calibration_version: str = "none-0.5.0"

    @property
    def name(self) -> str:
        return "impulsive_event"

    @property
    def version(self) -> str:
        return "0.5.0"

    @property
    def supported_classes(self) -> list[str]:
        return list(SUPPORTED_CLASSES)

    def load(self, model_dir: str) -> None:
        """No weights to load for the heuristic detector; marks self as healthy."""
        log.info("impulsive_detector_loaded", model_dir=model_dir)
        self._loaded = True

    def is_healthy(self) -> bool:
        return self._loaded

    def predict(self, features: FeatureVector) -> DetectorOutput:
        """Score *features* against all impulsive event patterns.

        Returns calibrated probability estimates for each class.
        UNKNOWN receives a high score when no pattern matches well.
        """
        t_start = time.perf_counter()

        try:
            result = self._run_heuristics(features)
        except Exception as exc:
            log.error("impulsive_predict_error", error=str(exc))
            # Safe fallback: return high unknown probability
            result = {cls: 0.05 for cls in SUPPORTED_CLASSES}
            result["unknown_impulsive"] = 0.90

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
            unknown_probability=result["unknown_impulsive"],
            inference_latency_ms=round(latency_ms, 3),
        )

    def _run_heuristics(self, features: FeatureVector) -> dict[str, float]:
        """Compute heuristic scores for each class."""
        env = features.envelope
        spec = features.spectrum_magnitude

        attack_frames = _attack_time_frames(env)
        decay_frames = _decay_time_frames(env)
        impulse_count = _count_impulses(env, self.WINDOW_500MS_FRAMES)
        flatness = _spectral_flatness(spec)
        low_freq_ratio = _low_freq_energy_ratio(spec)
        ipi_variance = _inter_impulse_variance(env, self.WINDOW_500MS_FRAMES)

        scores: dict[str, float] = {}

        scores["gunfire_single"] = _score_gunfire_single(
            features, attack_frames, impulse_count, flatness, self.FRAME_HOP_MS
        )
        scores["gunfire_burst"] = _score_gunfire_burst(
            features, attack_frames, impulse_count, ipi_variance, self.FRAME_HOP_MS
        )
        scores["gunfire_automatic"] = _score_gunfire_automatic(
            features, impulse_count, ipi_variance, flatness
        )
        scores["explosion_near"] = _score_explosion_near(
            features, attack_frames, decay_frames, low_freq_ratio, self.FRAME_HOP_MS
        )
        scores["explosion_far"] = _score_explosion_far(
            features, decay_frames, low_freq_ratio, self.FRAME_HOP_MS
        )

        # UNKNOWN: high when peak energy is below detector threshold or no
        # pattern scores above 0.35
        max_known = max(
            scores[k] for k in scores if k != "unknown_impulsive"
        ) if scores else 0.0

        if features.peak_energy_db < 60.0:
            unknown = 0.90
        elif max_known < 0.35:
            unknown = 0.80 - max_known * 0.5
        else:
            unknown = max(0.05, 0.70 - max_known * 0.80)

        scores["unknown_impulsive"] = float(np.clip(unknown, 0.0, 1.0))
        return scores
