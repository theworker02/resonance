"""Base detector interface for all Resonance detector packs.

Every detector pack must implement ``BaseDetector``. The contract is intentionally
minimal so that packs can use any underlying technique (heuristic, ONNX, PyTorch,
etc.) as long as they satisfy the typed interface.
"""

from __future__ import annotations

from abc import ABC, abstractmethod
from dataclasses import dataclass, field
from typing import Optional

import numpy as np


@dataclass
class FeatureVector:
    """Acoustic feature vector passed to all detectors.

    Produced by the core signal-processing pipeline and transmitted over
    NATS as a serialized payload. Versions are tracked so detectors can
    reject feature vectors built with an incompatible schema.
    """

    envelope: np.ndarray
    """Normalized RMS energy frames, shape (N,). Typically N=50 frames at 10 ms hop."""

    spectrum_magnitude: np.ndarray
    """FFT magnitude bins, shape (M,). M depends on FFT size configured in core."""

    mfcc: np.ndarray
    """13 mel-frequency cepstral coefficients, shape (13,)."""

    spectral_centroid_hz: float
    """Spectral centroid frequency in Hz."""

    spectral_rolloff_hz: float
    """Frequency below which 85 % of spectral energy is contained, in Hz."""

    zero_crossing_rate: float
    """Fraction of envelope zero-crossings per frame (normalized 0–1)."""

    peak_energy_db: float
    """Peak instantaneous energy relative to full-scale, in dBFS."""

    snr_db: float
    """Estimated signal-to-noise ratio in dB."""

    environmental_noise_db: float
    """Estimated ambient noise floor in dBFS."""

    feature_vector_version: str = "1.0"
    """Schema version. Detectors reject vectors with incompatible versions."""

    def validate(self) -> None:
        """Raise ``ValueError`` if the feature vector is internally inconsistent."""
        if self.envelope.ndim != 1:
            raise ValueError(f"envelope must be 1-D, got shape {self.envelope.shape}")
        if self.mfcc.shape != (13,):
            raise ValueError(f"mfcc must have shape (13,), got {self.mfcc.shape}")
        if not (0.0 <= self.zero_crossing_rate <= 1.0):
            raise ValueError(
                f"zero_crossing_rate must be in [0, 1], got {self.zero_crossing_rate}"
            )


@dataclass
class DetectorOutput:
    """Output produced by a single detector for one feature vector.

    ``predictions`` maps every class supported by this detector to a
    probability in [0, 1].  Probabilities within a single detector are
    *not* required to sum to 1 because each class is scored independently;
    the ensemble normalises them downstream.
    """

    detector_name: str
    """Unique detector pack identifier, e.g. ``impulsive_event``."""

    detector_version: str
    """Semantic version of the detector pack code."""

    model_version: str
    """Version of the model weights/heuristic parameters in use."""

    calibration_version: str
    """Version of the Platt-scaling calibration applied to raw scores."""

    predictions: dict[str, float]
    """Mapping of class name → probability [0, 1]."""

    primary_class: str
    """Name of the class with the highest predicted probability."""

    primary_confidence: float
    """Probability of the primary class, in [0, 1]."""

    unknown_probability: float
    """Explicit probability that the event belongs to no known class."""

    inference_latency_ms: float
    """Wall-clock time for this detector's inference, in milliseconds."""

    metadata: dict = field(default_factory=dict)
    """Optional opaque metadata (debug info, feature scores, etc.)."""


class BaseDetector(ABC):
    """Abstract base class that all detector packs must implement.

    Detector packs are loaded dynamically at startup via ``manifest_loader``
    and registered with the ``ConsensusEngine``.  Each pack must be
    independently loadable — it must not depend on other packs.

    Lifecycle::

        detector = MyDetector()
        detector.load(model_dir="/models/my_detector")
        assert detector.is_healthy()
        output = detector.predict(feature_vector)
    """

    @property
    @abstractmethod
    def name(self) -> str:
        """Unique detector name, matching the ``name`` field in manifest.yaml."""
        ...

    @property
    @abstractmethod
    def version(self) -> str:
        """Semantic version string, e.g. ``"0.5.0"``."""
        ...

    @property
    @abstractmethod
    def supported_classes(self) -> list[str]:
        """All class names this detector can predict, including ``"unknown"``."""
        ...

    @abstractmethod
    def predict(self, features: FeatureVector) -> DetectorOutput:
        """Run inference on *features* and return scored output.

        Implementations must:
        - Time their own inference and populate ``inference_latency_ms``.
        - Always include an ``unknown`` key in ``predictions``.
        - Never raise; catch internal errors and return a high-unknown result.
        """
        ...

    @abstractmethod
    def is_healthy(self) -> bool:
        """Return ``True`` if the detector is loaded and ready to accept predictions."""
        ...

    @abstractmethod
    def load(self, model_dir: str) -> None:
        """Load model weights / calibration parameters from *model_dir*.

        Must be idempotent — calling ``load`` twice must not corrupt state.
        """
        ...
