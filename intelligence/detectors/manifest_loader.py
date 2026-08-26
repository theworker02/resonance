"""Detector pack manifest loader and validator.

Each detector pack ships a ``manifest.yaml`` that declares its name, version,
inputs, outputs, and any required capabilities.  This module loads, validates,
and returns typed ``DetectorManifest`` objects.

Privacy enforcement is applied here: any manifest that requests a prohibited
capability causes a hard ``ProhibitedCapabilityError`` so the service refuses
to start.
"""

from __future__ import annotations

import os
from pathlib import Path
from typing import Any, Optional

import yaml
import structlog
from pydantic import BaseModel, Field, field_validator, model_validator

log = structlog.get_logger(__name__)

# ---------------------------------------------------------------------------
# Prohibited capabilities — enforced at load time
# ---------------------------------------------------------------------------

PROHIBITED_CAPABILITIES: frozenset[str] = frozenset(
    {
        "speech_recognition",
        "speaker_identification",
        "voiceprint_storage",
        "face_recognition",
        "biometric_identification",
        "geolocate_individual",
    }
)


class ProhibitedCapabilityError(Exception):
    """Raised when a detector manifest requests a prohibited capability.

    This is a hard error — the service must not start if any detector pack
    claims a capability that violates Resonance's privacy constraints.
    """

    def __init__(self, detector_name: str, capabilities: list[str]) -> None:
        self.detector_name = detector_name
        self.capabilities = capabilities
        super().__init__(
            f"Detector '{detector_name}' requests prohibited capabilities: "
            f"{capabilities}. Service startup aborted."
        )


class ManifestValidationError(Exception):
    """Raised when a manifest is structurally invalid or missing required fields."""


# ---------------------------------------------------------------------------
# Pydantic manifest model
# ---------------------------------------------------------------------------


class DetectorManifest(BaseModel):
    """Validated representation of a detector pack's manifest.yaml."""

    name: str = Field(..., description="Unique detector pack identifier.")
    version: str = Field(..., description="Semantic version, e.g. '0.5.0'.")
    description: str = Field(default="", description="Human-readable description.")
    author: str = Field(default="Resonance Contributors")
    license: str = Field(default="Apache-2.0")

    inputs: list[str] = Field(
        ..., description="Feature types consumed by this detector."
    )
    outputs: list[str] = Field(
        ..., description="Class names produced by this detector."
    )

    prohibited_capabilities: list[str] = Field(
        default_factory=list,
        description="Must always be empty for a valid detector pack.",
    )
    required_capabilities: list[str] = Field(
        default_factory=list,
        description="Capabilities the detector needs from the runtime.",
    )

    min_snr_db: float = Field(
        default=0.0, description="Minimum SNR required for reliable detection."
    )
    min_peak_energy_db: float = Field(
        default=40.0, description="Minimum peak energy (dBFS) required."
    )

    # Optional metadata
    notes: Optional[str] = Field(default=None)
    changelog: Optional[list[str]] = Field(default=None)

    model_config = {"extra": "allow"}

    @field_validator("name")
    @classmethod
    def name_is_snake_case(cls, v: str) -> str:
        if not v.replace("_", "").isalnum():
            raise ValueError(
                f"Manifest name must be alphanumeric with underscores, got '{v}'"
            )
        return v

    @field_validator("version")
    @classmethod
    def version_is_semver(cls, v: str) -> str:
        parts = v.split(".")
        if len(parts) != 3 or not all(p.isdigit() for p in parts):
            raise ValueError(f"version must be MAJOR.MINOR.PATCH semver, got '{v}'")
        return v

    @field_validator("outputs")
    @classmethod
    def outputs_include_unknown(cls, v: list[str]) -> list[str]:
        # Ensure at least one output contains 'unknown' (case-insensitive)
        has_unknown = any("unknown" in o.lower() for o in v)
        if not has_unknown:
            # Add a generic unknown rather than rejecting — detectors must always
            # be able to express "I don't know".
            v = list(v) + ["unknown"]
        return v

    @model_validator(mode="after")
    def no_prohibited_required_capabilities(self) -> "DetectorManifest":
        bad = [c for c in self.required_capabilities if c in PROHIBITED_CAPABILITIES]
        if bad:
            raise ValueError(
                f"required_capabilities contains prohibited entries: {bad}"
            )
        return self


# ---------------------------------------------------------------------------
# Loader
# ---------------------------------------------------------------------------


def load_manifest(manifest_path: str | Path) -> DetectorManifest:
    """Load and validate a single detector pack manifest.

    Parameters
    ----------
    manifest_path:
        Absolute or relative path to the ``manifest.yaml`` file.

    Returns
    -------
    DetectorManifest
        Validated manifest model.

    Raises
    ------
    ProhibitedCapabilityError
        If the manifest lists any prohibited capability in ``prohibited_capabilities``
        or ``required_capabilities``.
    ManifestValidationError
        If the manifest is structurally invalid, missing required fields, or
        cannot be parsed.
    FileNotFoundError
        If the file does not exist.
    """
    path = Path(manifest_path).resolve()
    if not path.exists():
        raise FileNotFoundError(f"Manifest not found: {path}")

    log.debug("loading_manifest", path=str(path))

    try:
        with path.open("r", encoding="utf-8") as fh:
            raw: dict[str, Any] = yaml.safe_load(fh)
    except yaml.YAMLError as exc:
        raise ManifestValidationError(
            f"Failed to parse YAML manifest at {path}: {exc}"
        ) from exc

    if not isinstance(raw, dict):
        raise ManifestValidationError(
            f"Manifest at {path} must be a YAML mapping, got {type(raw).__name__}"
        )

    # Check for prohibited capabilities before pydantic validation so that
    # the error message is unambiguous.
    prohibited_claimed = [
        cap
        for cap in raw.get("prohibited_capabilities", [])
        if cap in PROHIBITED_CAPABILITIES
    ]
    prohibited_required = [
        cap
        for cap in raw.get("required_capabilities", [])
        if cap in PROHIBITED_CAPABILITIES
    ]
    all_prohibited = list(set(prohibited_claimed + prohibited_required))
    if all_prohibited:
        detector_name = raw.get("name", str(path.parent.name))
        raise ProhibitedCapabilityError(detector_name, all_prohibited)

    try:
        manifest = DetectorManifest.model_validate(raw)
    except Exception as exc:
        raise ManifestValidationError(
            f"Manifest validation failed for {path}: {exc}"
        ) from exc

    log.info(
        "manifest_loaded",
        name=manifest.name,
        version=manifest.version,
        outputs=manifest.outputs,
    )
    return manifest


def load_all_manifests(detectors_dir: str | Path) -> dict[str, DetectorManifest]:
    """Discover and load all detector pack manifests under *detectors_dir*.

    Expected directory layout::

        detectors_dir/
          impulsive/manifest.yaml
          fireworks/manifest.yaml
          ...

    Returns a dict mapping detector name → ``DetectorManifest``.

    Any detector pack that fails validation is logged and skipped so that
    one broken pack does not prevent the service from starting.  A
    ``ProhibitedCapabilityError`` however is **re-raised** — it is a hard
    failure that must prevent startup.
    """
    root = Path(detectors_dir).resolve()
    manifests: dict[str, DetectorManifest] = {}

    for child in sorted(root.iterdir()):
        if not child.is_dir():
            continue
        manifest_file = child / "manifest.yaml"
        if not manifest_file.exists():
            log.debug("no_manifest_skipping", directory=str(child))
            continue

        try:
            manifest = load_manifest(manifest_file)
            manifests[manifest.name] = manifest
        except ProhibitedCapabilityError:
            # Hard failure — re-raise immediately
            raise
        except (ManifestValidationError, FileNotFoundError) as exc:
            log.error(
                "manifest_load_failed",
                directory=str(child),
                error=str(exc),
            )

    log.info("manifests_loaded", count=len(manifests), names=list(manifests.keys()))
    return manifests
