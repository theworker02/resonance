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

Resonance is an open-source platform for detecting, localizing, and explaining high-energy acoustic events — gunshots, explosions, vehicle impacts, glass breaking — using networks of calibrated sensor arrays.

Unlike conventional systems that output a single coordinate and a binary classification, Resonance produces:

- **Probabilistic spatial regions** — not a deceptively precise pin on a map
- **Multi-dimensional confidence breakdowns** — not a single opaque percentage
- **Competing hypotheses** — always shows what else the sound could have been
- **Cryptographic provenance** — every step is auditable and deterministically replayable
- **Explicit uncertainty** — if the evidence is ambiguous, the system says so

The architecture is designed so that speech recognition, speaker identification, and continuous surveillance are **structurally impossible** — enforced at the type system and protocol level, not merely by policy.

---

## Architecture

```
┌─────────────────┐    ┌────────────────┐    ┌─────────────────┐    ┌────────────────────┐    ┌──────────────────┐
│   VectorNode    │───▶│  Spatial Cell  │───▶│    WaveGraph    │───▶│ Probability Surface │───▶│  Evidence Fusion  │
│   (edge DSP)   │    │  (4-8 nodes)   │    │  (propagation)  │    │   (uncertainty)     │    │   (confidence)    │
└─────────────────┘    └────────────────┘    └─────────────────┘    └────────────────────┘    └──────────────────┘
        │                      │                      │                        │                        │
  VectorWave DOA         Multi-node            Learned acoustic          Spatial probability       Calibrated
  feature extraction     TDOA + overlap        path modeling             density estimates         output + audit
```

The full measurement pipeline:

```
Pressure Wave
     ↓
Multi-channel synchronized acquisition
     ↓
Wavefront reconstruction (VectorWave)
     ↓
Direction-of-arrival ensemble
     ↓
Atmospheric correction (Chronos + Atmos)
     ↓
Direct/reflected path decomposition (EchoGraph)
     ↓
Cross-node temporal correlation
     ↓
Acoustic Probability Surface calculation
     ↓
Acoustic fingerprint comparison (WavePrint)
     ↓
Classification ensemble
     ↓
Evidence fusion (ConflictGuard + Scene Health)
     ↓
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
| Privacy | Policy-based | Architecturally enforced — no raw audio protocol fields exist |
| Hardware | Proprietary black box | Open specification, any manufacturer can build |
| Auditability | Vendor report | Cryptographic provenance chain, deterministic replay |
| Environmental compensation | Not core | Native — wind, temperature, humidity correct every estimate |
| Reflection handling | Ignored or confused | EchoGraph explicitly models multi-path propagation |
| Contradiction detection | Hidden in averaging | ConflictGuard surfaces disagreements, caps confidence |
| Offline operation | Cloud-dependent | Edge-first — full detection continues without connectivity |
| Detector development | Vendor-only | Open SDK — third parties can build detector modules |
| Mixed hardware | Fleet replacement required | Protocol-based — different node generations interoperate |

---

## Platform Components

### Signal Processing — `resonance-sdk`

The signal intelligence layer operates on multi-channel acoustic data to produce directional observations with explicit uncertainty.

- **VectorWave** — direction-of-arrival estimation combining GCC-PHAT cross-correlation with delay-and-sum beamforming. Produces bearing vectors with 95% confidence intervals. Never claims precision the physics doesn't support.
- **WavePrint** — perceptual acoustic fingerprinting that captures envelope shape, spectral distribution, impulse width, spectral decay, and temporal profile. Survives propagation differences between sensors.
- **EchoGraph** — multi-path decomposition that separates direct arrivals from reflections. Learns reflection surfaces over time. Late arrivals are analyzed, not discarded.
- **Acoustic Probability Surface (APS)** — continuous spatial probability field over a geographic grid. Replaces point estimates with probabilistic regions showing containment areas.
- **ConflictGuard** — automatic contradiction detection. If sensors disagree on direction, timing, or classification, confidence is capped proportionally rather than hidden in an average.
- **Scene Health** — assesses whether environmental conditions (wind, rain, noise floor, sensor availability) support reliable analysis. Poor conditions automatically cap achievable confidence.
- **Confidence Timeline** — tracks how confidence evolves as evidence arrives. Shows whether the final score was stable or dependent on one late observation.
- **Feature Extraction** — FFT spectrum, 13 MFCCs, spectral centroid/rolloff, zero-crossing rate, envelope analysis, SHA-256 acoustic fingerprint.

### Spatial Intelligence — `resonance-platform`

The backend brain that correlates observations from multiple nodes into incidents.

- **Chronos** — precision timing management. Tracks GNSS PPS quality, oscillator holdover, clock drift. Weights observations by timing reliability.
- **Atmosphere Engine** — computes speed of sound from measured temperature. Applies wind correction to DOA estimates. Never hardcodes 343 m/s.
- **NodeCare** — predictive maintenance scoring. Analyzes microphone health, clock drift, calibration age, thermal state, enclosure humidity. Generates maintenance predictions before failure.
- **Spatial Cells** — geographic regions served by sensor groups. Support 4-node nominal, 3-node degraded, 2-node observation modes.
- **Provenance Chain** — cryptographic hash chain of every processing step. Enables deterministic replay and independent verification.
- **Incident Lifecycle** — explicit state machine: candidate → active → reviewing → confirmed/rejected → closed.

### Edge Runtime — `resonance-edge`

The firmware running on each sensor node.

- **Hardware Abstraction Layer** — traits for AudioDevice, ClockSource, LocationProvider, HardwareHealth. Linux and Simulator backends included.
- **DSP Pipeline** — normalizer (calibration + noise floor estimation) → impulse detector (hysteresis state machine) → feature extractor.
- **Privacy Kernel** — compile-time prohibited capabilities. Raw audio stays in a 5-second ring buffer and never crosses the privacy boundary. Only extracted features are transmitted.
- **REP Publisher** — Ed25519-signed observations with replay-nonce protection. Offline queue with automatic reconnect replay.
- **Health Monitor** — composite health scoring with automatic degradation detection.

### Cloud Platform — `apps/cloud/`

Multi-tenant SaaS control plane built with Fastify + TypeScript.

- **Multi-tenancy** — Organization → Workspace → Deployment hierarchy with enforced tenant isolation
- **RBAC** — 8 roles (Owner, Administrator, Engineer, Operator, Reviewer, Technician, Researcher, Viewer) with 30+ granular permissions
- **Authentication** — JWT with refresh tokens, API keys with scopes, webhook signing
- **Event-Driven** — typed domain events bus enabling real-time UI, audit logging, and webhook delivery
- **Background Jobs** — BullMQ queues with exponential backoff, jitter, and dead-letter handling
- **State Machines** — explicit lifecycle states for nodes, incidents, models, and deployments with validated transitions
- **Alerting** — policy-based alert engine with conditions, routing (email/Slack/Teams/webhook), and cooldown
- **Configuration Versioning** — every config change gets a version, diff, author, and reason. Supports rollback.
- **Feature Flags** — centralized flag system with boolean, percentage rollout, and org/workspace targeting
- **Data Retention** — configurable lifecycle tiers (hot → warm → archive → delete) per resource type

### Design System — `packages/surface/`

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
- 8–12 synchronized acoustic channels + precision pressure reference
- Ultrasonic 2D wind vector sensor
- Temperature, humidity, barometric pressure
- Multi-constellation GNSS with PPS (≤100ns accuracy)
- ARM64 compute with optional NPU
- Secure element for device identity
- IP67 enclosure rated -30°C to +60°C

All hardware designs are published under **CERN Open Hardware Licence v2 — Permissive**.

→ [Full VectorNode X1 specification](specifications/RES-HW-VECTORNODE-X1.md)  
→ [Manufacturing plan for contract manufacturers](hardware/MANUFACTURING_PLAN.md)  
→ [Reference BOM and node family definitions](hardware/reference-node/)

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
# → http://localhost:3000
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

The system processes only acoustic features extracted on-device — raw audio never traverses the network. The hardware and software are co-designed to make surveillance physically impossible, not merely policy-prohibited.

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

- **Per-device Ed25519 identity** — every sensor has a unique keypair generated at first boot
- **Signed observations** — every REP message carries an Ed25519 signature; backends reject unsigned data
- **Replay protection** — random 16-byte nonce per event prevents replay attacks
- **Secure boot chain** — ROM → signed bootloader → signed firmware → verified services
- **Hardware root of trust** — TPM/secure element for key storage and attestation
- **Tenant isolation** — multi-tenant data access enforced at the query layer, not just the frontend
- **Audit trail** — append-only cryptographic chain for every significant action

→ [Threat model](docs/security/threat-model.md)  
→ [Secure boot specification](docs/security/secure-boot.md)  
→ [Fleet identity management](docs/security/fleet-identity.md)

---

## Specifications

| Document | Description |
|----------|-------------|
| [VectorNode X1 Hardware Spec](specifications/RES-HW-VECTORNODE-X1.md) | 30+ formal requirements with measurement methods and validation procedures |
| [REP Protocol Specification](specifications/REP-SPEC.md) | Wire protocol for sensor → platform communication |
| [OpenAPI v1](specifications/api-v1.yaml) | Complete REST + WebSocket API specification |
| [rep.proto](specifications/rep.proto) | Protobuf3 schema for REP messages |
| [rep_schema.json](specifications/rep_schema.json) | JSON Schema for REP event validation |

---

## Project Structure

```
resonance/
├── platform/         Rust — spatial intelligence, correlation, incidents, API
├── edge/             Rust — sensor node runtime, DSP, privacy kernel
├── sdk/              Rust — signal processing library and detector SDK
├── intelligence/     Python — ML detector packs and ensemble
├── apps/
│   ├── cloud/        TypeScript — multi-tenant SaaS control plane
│   ├── console/      React — operator dashboard
│   └── website/      Astro — GitHub Pages product site
├── packages/
│   └── surface/      TypeScript — design system tokens and component contracts
├── hardware/         Reference designs, BOMs, manufacturing plan
├── specifications/   Engineering specs, OpenAPI, protocol definitions
├── simulator/        Python — virtual acoustic mesh
├── docs/             Architecture, security, privacy, ADRs, design specs
└── .github/          CI workflows, issue templates, CODEOWNERS
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

**v4.0** (current) — Platform architecture, signal processing, multi-tenant cloud, design system  
**v4.1** — First prototype PCB, hardware-in-the-loop, fleet manager, public benchmarks  
**v5.0** — Production hardware certification, multi-region, federated learning

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
  license   = {Apache-2.0}
}
```

---

## License

- **Software**: [Apache License 2.0](LICENSE)
- **Hardware reference designs**: [CERN Open Hardware Licence v2 — Permissive](https://ohwr.org/cern_ohl_p_v2.txt)
- **Documentation**: [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/)

---

<p align="center">
  <sub>Resonance does not manufacture hardware, operate sensor networks, or provide surveillance services.<br/>
  It is a software framework that enables transparent, auditable acoustic event detection.</sub>
</p>
