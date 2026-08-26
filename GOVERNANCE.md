# Governance

## Decision Making

Resonance uses a consensus-seeking model. Major architectural decisions require approval from at least two maintainers from different working groups.

## Working Groups

| Group | Scope |
|-------|-------|
| Signal | DSP, VectorWave, FusionCore, beamforming, cross-correlation |
| Hardware | R3 specification, PCB, enclosure, Atmos, calibration |
| Platform | Core backend, protocol, correlation, provenance, storage |
| Intelligence | ML models, detectors, calibration, benchmarks |
| Experience | Console, CLI, docs site, branding, developer experience |

## Release Process

1. Feature branch → PR → review by ≥1 maintainer from relevant group
2. All CI checks must pass
3. Breaking changes require RFC in `docs/rfcs/`
4. Hardware specification changes require review from Hardware + Signal groups
5. Privacy-affecting changes require review from all groups

## Security Response

See [SECURITY.md](SECURITY.md).
