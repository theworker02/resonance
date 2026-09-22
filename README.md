<p align="center">
  <img src="brand/logo.svg" alt="Resonance" width="96" />
</p>

<h1 align="center">Resonance</h1>

<p align="center"><strong>Open spatial acoustic intelligence infrastructure.</strong></p>

<p align="center">
  <a href="https://crates.io/crates/resonance-sdk"><img src="https://img.shields.io/crates/v/resonance-sdk.svg?label=sdk&color=7667FF" alt="crates.io SDK" /></a>
  <a href="https://crates.io/crates/resonance-platform"><img src="https://img.shields.io/crates/v/resonance-platform.svg?label=platform&color=7667FF" alt="crates.io Platform" /></a>
  <a href="https://crates.io/crates/resonance-edge"><img src="https://img.shields.io/crates/v/resonance-edge.svg?label=edge&color=7667FF" alt="crates.io Edge" /></a>
  <a href="LICENSE"><img src="https://img.shields.io/badge/license-Apache_2.0-blue.svg" alt="License" /></a>
  <a href="https://github.com/theworker02/resonance/releases/latest"><img src="https://img.shields.io/github/v/release/theworker02/resonance?color=5AD7FF" alt="Release" /></a>
  <a href="https://github.com/theworker02/resonance/actions"><img src="https://img.shields.io/github/actions/workflow/status/theworker02/resonance/ci.yml?label=CI" alt="CI" /></a>
</p>

<p align="center">
  <em>A software platform and open reference architecture for distributed acoustic event detection.<br/>
  We build the framework and specifications. Hardware partners build the sensors.</em>
</p>

---

## What Is Resonance?

Resonance is an open-source platform for detecting, localizing, and explaining high-energy acoustic events Ã¢â‚¬â€ gunshots, explosions, vehicle impacts, glass breaking Ã¢â‚¬â€ using networks of calibrated sensor arrays.

Unlike conventional systems that output a single coordinate and a binary classification, Resonance produces:

- **Probabilistic spatial regions** Ã¢â‚¬â€ not a deceptively precise pin on a map
- **Multi-dimensional confidence breakdowns** Ã¢â‚¬â€ not a single opaque percentage
- **Competing hypotheses** Ã¢â‚¬â€ always shows what else the sound could have been
- **Cryptographic provenance** Ã¢â‚¬â€ every step is auditable and deterministically replayable
- **Explicit uncertainty** Ã¢â‚¬â€ if the evidence is ambiguous, the system says so

The architecture is designed so that speech recognition, speaker identification, and continuous surveillance are **structurally impossible** Ã¢â‚¬â€ enforced at the type system and protocol level, not merely by policy.

---

## Architecture

```
Ã¢â€Å’Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€Â    Ã¢â€Å’Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€Â    Ã¢â€Å’Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€Â    Ã¢â€Å’Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€Â    Ã¢â€Å’Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€Â
Ã¢â€â€š   VectorNode    Ã¢â€â€šÃ¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€“Â¶Ã¢â€â€š  Spatial Cell  Ã¢â€â€šÃ¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€“Â¶Ã¢â€â€š    WaveGraph    Ã¢â€â€šÃ¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€“Â¶Ã¢â€â€š Probability Surface Ã¢â€â€šÃ¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€“Â¶Ã¢â€â€š  Evidence Fusion  Ã¢â€â€š
Ã¢â€â€š   (edge DSP)   Ã¢â€â€š    Ã¢â€â€š  (4-8 nodes)   Ã¢â€â€š    Ã¢â€â€š  (propagation)  Ã¢â€â€š    Ã¢â€â€š   (uncertainty)     Ã¢â€â€š    Ã¢â€â€š   (confidence)    Ã¢â€â€š
Ã¢â€â€Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€Ëœ    Ã¢â€â€Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€Ëœ    Ã¢â€â€Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€Ëœ    Ã¢â€â€Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€Ëœ    Ã¢â€â€Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€Ëœ
        Ã¢â€â€š                      Ã¢â€â€š                      Ã¢â€â€š                        Ã¢â€â€š                        Ã¢â€â€š
  VectorWave DOA         Multi-node            Learned acoustic          Spatial probability       Calibrated
  feature extraction     TDOA + overlap        path modeling             density estimates         output + audit
```

The full measurement pipeline:

```
Pressure Wave
     Ã¢â€ â€œ
Multi-channel synchronized acquisition
     Ã¢â€ â€œ
Wavefront reconstruction (VectorWave)
     Ã¢â€ â€œ
Direction-of-arrival ensemble
     Ã¢â€ â€œ
Atmospheric correction (Chronos + Atmos)
     Ã¢â€ â€œ
Direct/reflected path decomposition (EchoGraph)
     Ã¢â€ â€œ
Cross-node temporal correlation
     Ã¢â€ â€œ
Acoustic Probability Surface calculation
     Ã¢â€ â€œ
Acoustic fingerprint comparison (WavePrint)
     Ã¢â€ â€œ
Classification ensemble
     Ã¢â€ â€œ
Evidence fusion (ConflictGuard + Scene Health)
     Ã¢â€ â€œ
Auditable Incident Record
```

Every stage exposes confidence scores and diagnostics. No stage hides uncertainty.

---

## What It Looks Like

<p align="center">
  <img src="brand/screenshot-incident.svg" alt="Incident confidence breakdown" width="780" />
  <br/>
  <em>Every incident includes a full confidence breakdown with per-dimension evidence scores,<br/>alternative hypotheses, spatial context, and a cryptographic provenance chain.</em>
</p>

<p align="center">
  <img src="brand/screenshot-simulation.svg" alt="Simulation terminal output" width="680" />
  <br/>
  <em>The simulator creates virtual sensor networks for development without physical hardware.<br/>Events propagate realistically through the mesh with configurable environmental conditions.</em>
</p>

---

## Published Crates

All core libraries are published on [crates.io](https://crates.io):

| Crate | Description | Link |
|-------|-------------|------|
| **`resonance-sdk`** | Signal processing, DOA estimation, fingerprinting, detector SDK | [![crates.io](https://img.shields.io/crates/v/resonance-sdk.svg)](https://crates.io/crates/resonance-sdk) |
| **`resonance-platform`** | Spatial cells, correlation, incidents, provenance, timing, atmosphere | [![crates.io](https://img.shields.io/crates/v/resonance-platform.svg)](https://crates.io/crates/resonance-platform) |
| **`resonance-edge`** | Edge node runtime: HAL, DSP, privacy kernel, REP publisher | [![crates.io](https://img.shields.io/crates/v/resonance-edge.svg)](https://crates.io/crates/resonance-edge) |

```toml
# Add to your Cargo.toml
[dependencies]
resonance-sdk = "4.0"
```

---

## Why Resonance?

| Capability | Conventional systems | Resonance |
|---|---|---|
| Localization output | Single coordinate | Acoustic Probability Surface with explicit uncertainty |
| Confidence reporting | Single percentage | Multi-dimensional breakdown (classifier, agreement, timing, signal, environment) |
| Privacy | Policy-based | Architecturally enforced Ã¢â‚¬â€ no raw audio protocol fields exist |
| Hardware | Proprietary black box | Open specification, any manufacturer can build |
| Auditability | Vendor report | Cryptographic provenance chain, deterministic replay |
| Environmental compensation | Not core | Native Ã¢â‚¬â€ wind, temperature, humidity correct every estimate |
| Reflection handling | Ignored or confused | EchoGraph explicitly models multi-path propagation |
| Contradiction detection | Hidden in averaging | ConflictGuard surfaces disagreements, caps confidence |
| Offline operation | Cloud-dependent | Edge-first Ã¢â‚¬â€ full detection continues without connectivity |
| Detector development | Vendor-only | Open SDK Ã¢â‚¬â€ third parties can build detector modules |
| Mixed hardware | Fleet replacement required | Protocol-based Ã¢â‚¬â€ different node generations interoperate |

---

## Platform Components

### Signal Processing Ã¢â‚¬â€ `resonance-sdk`

The signal intelligence layer operates on multi-channel acoustic data to produce directional observations with explicit uncertainty.

- **VectorWave** Ã¢â‚¬â€ direction-of-arrival estimation combining GCC-PHAT cross-correlation with delay-and-sum beamforming. Produces bearing vectors with 95% confidence intervals. Never claims precision the physics doesn't support.
- **WavePrint** Ã¢â‚¬â€ perceptual acoustic fingerprinting that captures envelope shape, spectral distribution, impulse width, spectral decay, and temporal profile. Survives propagation differences between sensors.
- **EchoGraph** Ã¢â‚¬â€ multi-path decomposition that separates direct arrivals from reflections. Learns reflection surfaces over time. Late arrivals are analyzed, not discarded.
- **Acoustic Probability Surface (APS)** Ã¢â‚¬â€ continuous spatial probability field over a geographic grid. Replaces point estimates with probabilistic regions showing containment areas.
- **ConflictGuard** Ã¢â‚¬â€ automatic contradiction detection. If sensors disagree on direction, timing, or classification, confidence is capped proportionally rather than hidden in an average.
- **Scene Health** Ã¢â‚¬â€ assesses whether environmental conditions (wind, rain, noise floor, sensor availability) support reliable analysis. Poor conditions automatically cap achievable confidence.
- **Confidence Timeline** Ã¢â‚¬â€ tracks how confidence evolves as evidence arrives. Shows whether the final score was stable or dependent on one late observation.
- **Feature Extraction** Ã¢â‚¬â€ FFT spectrum, 13 MFCCs, spectral centroid/rolloff, zero-crossing rate, envelope analysis, SHA-256 acoustic fingerprint.

### Spatial Intelligence Ã¢â‚¬â€ `resonance-platform`

The backend brain that correlates observations from multiple nodes into incidents.

- **Chronos** Ã¢â‚¬â€ precision timing management. Tracks GNSS PPS quality, oscillator holdover, clock drift. Weights observations by timing reliability.
- **Atmosphere Engine** Ã¢â‚¬â€ computes speed of sound from measured temperature. Applies wind correction to DOA estimates. Never hardcodes 343 m/s.
- **NodeCare** Ã¢â‚¬â€ predictive maintenance scoring. Analyzes microphone health, clock drift, calibration age, thermal state, enclosure humidity. Generates maintenance predictions before failure.
- **Spatial Cells** Ã¢â‚¬â€ geographic regions served by sensor groups. Support 4-node nominal, 3-node degraded, 2-node observation modes.
- **Provenance Chain** Ã¢â‚¬â€ cryptographic hash chain of every processing step. Enables deterministic replay and independent verification.
- **Incident Lifecycle** Ã¢â‚¬â€ explicit state machine: candidate Ã¢â€ â€™ active Ã¢â€ â€™ reviewing Ã¢â€ â€™ confirmed/rejected Ã¢â€ â€™ closed.

### Edge Runtime Ã¢â‚¬â€ `resonance-edge`

The firmware running on each sensor node.

- **Hardware Abstraction Layer** Ã¢â‚¬â€ traits for AudioDevice, ClockSource, LocationProvider, HardwareHealth. Linux and Simulator backends included.
- **DSP Pipeline** Ã¢â‚¬â€ normalizer (calibration + noise floor estimation) Ã¢â€ â€™ impulse detector (hysteresis state machine) Ã¢â€ â€™ feature extractor.
- **Privacy Kernel** Ã¢â‚¬â€ compile-time prohibited capabilities. Raw audio stays in a 5-second ring buffer and never crosses the privacy boundary. Only extracted features are transmitted.
- **REP Publisher** Ã¢â‚¬â€ Ed25519-signed observations with replay-nonce protection. Offline queue with automatic reconnect replay.
- **Health Monitor** Ã¢â‚¬â€ composite health scoring with automatic degradation detection.

### Cloud Platform Ã¢â‚¬â€ `apps/cloud/`

Multi-tenant SaaS control plane built with Fastify + TypeScript.

- **Multi-tenancy** Ã¢â‚¬â€ Organization Ã¢â€ â€™ Workspace Ã¢â€ â€™ Deployment hierarchy with enforced tenant isolation
- **RBAC** Ã¢â‚¬â€ 8 roles (Owner, Administrator, Engineer, Operator, Reviewer, Technician, Researcher, Viewer) with 30+ granular permissions
- **Authentication** Ã¢â‚¬â€ JWT with refresh tokens, API keys with scopes, webhook signing
- **Event-Driven** Ã¢â‚¬â€ typed domain events bus enabling real-time UI, audit logging, and webhook delivery
- **Background Jobs** Ã¢â‚¬â€ BullMQ queues with exponential backoff, jitter, and dead-letter handling
- **State Machines** Ã¢â‚¬â€ explicit lifecycle states for nodes, incidents, models, and deployments with validated transitions
- **Alerting** Ã¢â‚¬â€ policy-based alert engine with conditions, routing (email/Slack/Teams/webhook), and cooldown
- **Configuration Versioning** Ã¢â‚¬â€ every config change gets a version, diff, author, and reason. Supports rollback.
- **Feature Flags** Ã¢â‚¬â€ centralized flag system with boolean, percentage rollout, and org/workspace targeting
- **Data Retention** Ã¢â‚¬â€ configurable lifecycle tiers (hot Ã¢â€ â€™ warm Ã¢â€ â€™ archive Ã¢â€ â€™ delete) per resource type

### Design System Ã¢â‚¬â€ `packages/surface/`

The visual language for all Resonance interfaces.

- Semantic design tokens (colors, spacing, typography, radius, elevation, density, z-index)
- Dark and light theme via CSS custom properties
- Motion specification (micro/navigation/state/spatial/attention) respecting `prefers-reduced-motion`
- Component interface contracts for 15+ primitives (Button, DataTable, ConfidenceCurve, EvidenceGraph, HealthGauge, DirectionPlot, Timeline)
- Accessibility targeting WCAG 2.1 AA

---

## Reference Hardware

**Resonance is a software platform. We do not manufacture hardware.**

We publish open reference designs so that hardware partners, contract manufacturers, and research labs can build compatible sensor nodes. Three reference designs are specified:

| Node | Purpose | Who builds it |
|------|---------|---------------|
| **RN-D1** | Development / education / lab testing | Individual developers, universities |
| **RN-F1** (VectorNode X1) | Production field deployment | Contract electronics manufacturers |
| **RN-P1** | Research / precision timing | Instrumentation companies, national labs |

The VectorNode X1 reference design includes:
- 8Ã¢â‚¬â€œ12 synchronized acoustic channels + precision pressure reference
- Ultrasonic 2D wind vector sensor
- Temperature, humidity, barometric pressure
- Multi-constellation GNSS with PPS (Ã¢â€°Â¤100ns accuracy)
- ARM64 compute with optional NPU
- Secure element for device identity
- IP67 enclosure rated -30Ã‚Â°C to +60Ã‚Â°C

All hardware designs are published under **CERN Open Hardware Licence v2 Ã¢â‚¬â€ Permissive**.

Ã¢â€ â€™ [Full VectorNode X1 specification](specifications/RES-HW-VECTORNODE-X1.md)  
Ã¢â€ â€™ [Manufacturing plan for contract manufacturers](hardware/MANUFACTURING_PLAN.md)  
Ã¢â€ â€™ [Reference BOM and node family definitions](hardware/reference-node/)

---

## Quick Start

```bash
# Clone the repository
git clone https://github.com/theworker02/resonance
cd resonance

# Build all Rust crates
cargo build --workspace

# Run the simulator (no hardware needed)
python simulator/src/main.py --nodes 25 --environment suburban --duration 5m

# Start the Cloud API
cd apps/cloud && npm install && npm run dev

# Open the console
cd apps/console && npm install && npm run dev
# Ã¢â€ â€™ http://localhost:3000
```

### Using the SDK in your own project

```toml
[dependencies]
resonance-sdk = "4.0"
```

```rust
use resonance_sdk::detector::{DetectorInterface, DetectorInput, DetectorOutput};

struct MyDetector;

impl DetectorInterface for MyDetector {
    fn name(&self) -> &str { "my-custom-detector" }
    fn version(&self) -> &str { "1.0.0" }
    fn supported_classes(&self) -> &[&str] { &["gunshot", "explosion", "unknown"] }
    fn analyze(&self, input: &DetectorInput) -> DetectorOutput {
        // Your classification logic here
        todo!()
    }
    fn health(&self) -> bool { true }
}
```

---

## Simulation

Develop the entire platform without manufacturing hardware:

```bash
# 25-node suburban mesh, 5 minutes of simulated time
python simulator/src/main.py --nodes 25 --environment suburban --duration 5m

# Dense urban deployment
python simulator/src/main.py --nodes 64 --environment urban --duration 15m

# Sparse rural network
python simulator/src/main.py --nodes 9 --environment rural --duration 10m
```

The simulator models realistic acoustic propagation (inverse-square law + atmospheric attenuation), clock jitter, packet loss, and node failures. Events are correlated across the virtual mesh exactly as they would be on real hardware.

---

## Privacy by Architecture

Resonance is architecturally incapable of mass surveillance.

The system processes only acoustic features extracted on-device Ã¢â‚¬â€ raw audio never traverses the network. The hardware and software are co-designed to make surveillance physically impossible, not merely policy-prohibited.

| Prohibition | Enforcement mechanism |
|---|---|
| **No speech recognition** | Frequency bands and frame sizes are incompatible with speech decoding. No speech model can be loaded. |
| **No speaker identification** | No voiceprint extraction. No biometric processing fields exist in the protocol. |
| **No continuous streaming** | Sensors transmit only impulsive-event feature vectors. The protocol has no field for raw PCM. |
| **No indefinite storage** | 5-second ring buffer auto-overwrites. No persistent audio archive capability exists. |
| **No keyword monitoring** | Event detection triggers on acoustic energy, not linguistic content. |
| **No individual tracking** | System detects acoustic events at a region level, not people at a coordinate level. |

Privacy attestations are cryptographically signed by each node and independently verifiable.

---

## Security

- **Per-device Ed25519 identity** Ã¢â‚¬â€ every sensor has a unique keypair generated at first boot
- **Signed observations** Ã¢â‚¬â€ every REP message carries an Ed25519 signature; backends reject unsigned data
- **Replay protection** Ã¢â‚¬â€ random 16-byte nonce per event prevents replay attacks
- **Secure boot chain** Ã¢â‚¬â€ ROM Ã¢â€ â€™ signed bootloader Ã¢â€ â€™ signed firmware Ã¢â€ â€™ verified services
- **Hardware root of trust** Ã¢â‚¬â€ TPM/secure element for key storage and attestation
- **Tenant isolation** Ã¢â‚¬â€ multi-tenant data access enforced at the query layer, not just the frontend
- **Audit trail** Ã¢â‚¬â€ append-only cryptographic chain for every significant action

Ã¢â€ â€™ [Threat model](docs/security/threat-model.md)  
Ã¢â€ â€™ [Secure boot specification](docs/security/secure-boot.md)  
Ã¢â€ â€™ [Fleet identity management](docs/security/fleet-identity.md)

---

## Specifications

| Document | Description |
|----------|-------------|
| [VectorNode X1 Hardware Spec](specifications/RES-HW-VECTORNODE-X1.md) | 30+ formal requirements with measurement methods and validation procedures |
| [REP Protocol Specification](specifications/REP-SPEC.md) | Wire protocol for sensor Ã¢â€ â€™ platform communication |
| [OpenAPI v1](specifications/api-v1.yaml) | Complete REST + WebSocket API specification |
| [rep.proto](specifications/rep.proto) | Protobuf3 schema for REP messages |
| [rep_schema.json](specifications/rep_schema.json) | JSON Schema for REP event validation |

---

## Project Structure

```
resonance/
Ã¢â€Å“Ã¢â€â‚¬Ã¢â€â‚¬ platform/         Rust Ã¢â‚¬â€ spatial intelligence, correlation, incidents, API
Ã¢â€Å“Ã¢â€â‚¬Ã¢â€â‚¬ edge/             Rust Ã¢â‚¬â€ sensor node runtime, DSP, privacy kernel
Ã¢â€Å“Ã¢â€â‚¬Ã¢â€â‚¬ sdk/              Rust Ã¢â‚¬â€ signal processing library and detector SDK
Ã¢â€Å“Ã¢â€â‚¬Ã¢â€â‚¬ intelligence/     Python Ã¢â‚¬â€ ML detector packs and ensemble
Ã¢â€Å“Ã¢â€â‚¬Ã¢â€â‚¬ apps/
Ã¢â€â€š   Ã¢â€Å“Ã¢â€â‚¬Ã¢â€â‚¬ cloud/        TypeScript Ã¢â‚¬â€ multi-tenant SaaS control plane
Ã¢â€â€š   Ã¢â€Å“Ã¢â€â‚¬Ã¢â€â‚¬ console/      React Ã¢â‚¬â€ operator dashboard
Ã¢â€â€š   Ã¢â€â€Ã¢â€â‚¬Ã¢â€â‚¬ website/      Astro Ã¢â‚¬â€ GitHub Pages product site
Ã¢â€Å“Ã¢â€â‚¬Ã¢â€â‚¬ packages/
Ã¢â€â€š   Ã¢â€â€Ã¢â€â‚¬Ã¢â€â‚¬ surface/      TypeScript Ã¢â‚¬â€ design system tokens and component contracts
Ã¢â€Å“Ã¢â€â‚¬Ã¢â€â‚¬ hardware/         Reference designs, BOMs, manufacturing plan
Ã¢â€Å“Ã¢â€â‚¬Ã¢â€â‚¬ specifications/   Engineering specs, OpenAPI, protocol definitions
Ã¢â€Å“Ã¢â€â‚¬Ã¢â€â‚¬ simulator/        Python Ã¢â‚¬â€ virtual acoustic mesh
Ã¢â€Å“Ã¢â€â‚¬Ã¢â€â‚¬ docs/             Architecture, security, privacy, ADRs, design specs
Ã¢â€â€Ã¢â€â‚¬Ã¢â€â‚¬ .github/          CI workflows, issue templates, CODEOWNERS
```

---

## Documentation

| Resource | Link |
|----------|------|
| Architecture overview | [ARCHITECTURE.md](ARCHITECTURE.md) |
| Product principles | [PRODUCT_PRINCIPLES.md](PRODUCT_PRINCIPLES.md) |
| Privacy model | [PRIVACY.md](PRIVACY.md) |
| Security documentation | [docs/security/](docs/security/) |
| Design system | [packages/surface/](packages/surface/) |
| ADRs | [docs/adr/](docs/adr/) |
| UX patterns | [docs/design/](docs/design/) |
| Quality gates | [docs/QUALITY_GATES.md](docs/QUALITY_GATES.md) |
| Developer experience | [docs/DEVELOPER_EXPERIENCE.md](docs/DEVELOPER_EXPERIENCE.md) |
| Manufacturing plan | [hardware/MANUFACTURING_PLAN.md](hardware/MANUFACTURING_PLAN.md) |

---

## Roadmap

See [`ROADMAP.md`](ROADMAP.md) for the full roadmap. Current focus:

**v4.0** (current) Ã¢â‚¬â€ Platform architecture, signal processing, multi-tenant cloud, design system  
**v4.1** Ã¢â‚¬â€ First prototype PCB, hardware-in-the-loop, fleet manager, public benchmarks  
**v5.0** Ã¢â‚¬â€ Production hardware certification, multi-region, federated learning

---

## Contributing

We welcome contributions across all components. See [`CONTRIBUTING.md`](CONTRIBUTING.md) for:

- Development setup (one command: `./scripts/dev.sh`)
- Testing guide (`cargo test --workspace`)
- Code style and commit conventions
- How to build custom detector modules
- How to contribute hardware designs
- PR review process

---

## Funding

Resonance is unfunded open-source infrastructure. Sponsorship supports prototype PCBs, calibration equipment, test fixtures, outdoor enclosures, hosting, and dataset development.

<a href="https://github.com/sponsors/theworker02"><img src="https://img.shields.io/badge/sponsor-GitHub_Sponsors-ea4aaa.svg" alt="GitHub Sponsors" /></a>

---

## Citation

If you use Resonance in research, please cite:

```bibtex
@software{resonance2026,
  title     = {Resonance: Spatial Acoustic Intelligence Infrastructure},
  author    = {{Resonance Contributors}},
  year      = {2026},
  url       = {https://github.com/theworker02/resonance},
  version   = {4.0.0},
  license   = {source-available proprietary}
}
```

---

## License

**Source-available proprietary** â€” evaluation under [LICENSE](./LICENSE); commercial / production use via [COMMERCIAL.md](./COMMERCIAL.md). See [LICENSE_TRANSITION_NOTICE.md](./LICENSE_TRANSITION_NOTICE.md) and [NOTICE](./NOTICE).


---

## License & acquisition

This project is **proprietary**. Production use, redistribution, and commercial deployment require a written commercial license or completed acquisition. See [LICENSE](./LICENSE) and [ACQUISITION.md](./ACQUISITION.md). Contact [@theworker02](https://github.com/theworker02).

## Acquisition diligence

Buyer-facing diligence materials live in [docs/acquisition/](./docs/acquisition/). Commercial licensing contact path: [COMMERCIAL.md](./COMMERCIAL.md).
