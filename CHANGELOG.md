# Changelog

All notable changes to the Resonance project are documented here.

The format follows [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [4.0.0] — 2025-08-25

### Added
- VectorWave 2 direction-of-arrival engine with dual-ring array geometry
- EchoGraph reflection-aware localization model
- WavePrint v2 acoustic fingerprinting
- Acoustic Probability Surface (APS) for probabilistic event localization
- ConflictGuard contradiction detection system
- Confidence timeline tracking with deterministic replay
- Scene health assessment
- Production hardware family specifications (RN-D1, RN-F1, RN-P1)
- Chronos precision timing system (GPS PPS + NTP fallback)
- Atmosphere Engine environmental compensation (temperature, humidity, wind, pressure)
- OpenAPI v1 specification (`specifications/api-v1.yaml`)
- Complete engineering specification set
- Professional branding package (`brand/`)
- GitHub Pages documentation site (`apps/docs-site/`)
- Security documentation (threat model, secure boot chain, fleet identity)
- Privacy documentation (architecture, prohibited capabilities, audio retention)
- RFC process and example hardware RFC (dual-ring array)
- Competitive architecture analysis
- Repository completion report
- GitHub issue templates (bug, feature, hardware, documentation)
- Funding documentation

### Changed
- Repository consolidated to canonical structure (`crates/`, `apps/`, `tools/`, `specifications/`)
- Workspace version bumped to 4.0.0
- CITATION.cff updated to reflect v4.0.0 scope and keywords
- Architecture documentation rewritten for production reference architecture

### Removed
- Legacy duplicate directories (`core/`, `edge/`, `cli/`, `console/`, `meshlab/`, `deploy/`, `db/`, `rep/`)
- Obsolete `protocol/` crate (types consolidated into resonance-core and resonance-protocol)
- Obsolete `sensor/` crate (superseded by resonance-edge)
- Empty directories (`done/`, `echo/`)

---

## [Unreleased / 0.5.0-dev]

### Added
- REP protocol v1 with Ed25519 signing, replay protection, and offline buffering
- Edge node (`resonance-edge`) binary with full DSP pipeline
- Hardware Abstraction Layer (HAL) with Linux and Simulator backends
- Privacy Kernel enforcing compile-time prohibited capability list
- Encrypted ring buffer for audio sample retention (max 5 s by default)
- DSP pipeline: Normalizer → ImpulseDetector → FeatureExtractor
- MFCC extraction (13 coefficients, 40 mel filters, 20–8000 Hz)
- Spectral centroid, spectral rolloff, zero-crossing rate features
- SHA-256 acoustic fingerprint over normalized feature vector
- Environmental baseline learner (168 hourly buckets, EMA α=0.05)
- NATS publisher with offline queue and reconnect replay
- Health monitor with composite health score (0–100)
- Privacy attestation publishing on startup and every 5 min
- `sensor.example.toml` and `privacy-policy.yaml` for operators
- `rep/` directory with JSON Schema, Protobuf3 definition, and protocol spec

### Changed
- N/A (initial development release)

### Security
- Ed25519 signatures on all REP events
- Replay-protection nonce (random 16 bytes) in every event
- Private key generated on first run, stored in secure local path
- No raw PCM ever leaves the privacy kernel

---

## [0.1.0] — 2024-01-15

### Added
- Initial project skeleton and workspace layout
- Placeholder `edge`, `core`, and `cli` workspace members
- Basic NATS connectivity proof-of-concept
- Preliminary REP event schema (pre-v1 draft)

---

[4.0.0]: https://github.com/resonance-project/resonance/compare/v0.5.0-dev...v4.0.0
[Unreleased / 0.5.0-dev]: https://github.com/resonance-project/resonance/compare/v0.1.0...v0.5.0-dev
[0.1.0]: https://github.com/resonance-project/resonance/releases/tag/v0.1.0
