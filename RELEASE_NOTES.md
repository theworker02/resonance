# Resonance v4.0.0 — Spatial Acoustic Intelligence Platform

The first public release of Resonance: an open software platform for distributed acoustic event detection using calibrated sensor arrays, probabilistic spatial inference, and auditable evidence chains.

---

## What Is Resonance?

Resonance replaces traditional "pin on a map" acoustic detection with a measurement pipeline that reports **what happened, how certain it is, and why it reached that conclusion**.

```
Pressure Wave → Multi-channel Acquisition → Direction Estimation → Spatial Cell Correlation
→ Environmental Compensation → Classification → Evidence Fusion → Auditable Incident
```

Every detection includes explicit uncertainty. No single sensor can produce a high-confidence incident.

---

## Highlights

### Signal Processing (`resonance-sdk` on crates.io)

- **VectorWave** — direction-of-arrival estimation using GCC-PHAT cross-correlation + delay-and-sum beamforming with calibrated uncertainty intervals
- **WavePrint** — perceptual acoustic fingerprinting for cross-sensor event correlation
- **EchoGraph** — multi-path decomposition that separates direct arrivals from reflections
- **Acoustic Probability Surface** — continuous spatial probability field replacing point estimates
- **ConflictGuard** — automatic contradiction detection between sensor observations
- **Scene Health** — environmental condition assessment that caps confidence when conditions are poor

### Platform (`resonance-platform` on crates.io)

- **Chronos** — precision timing management with GNSS PPS and holdover quality scoring
- **Atmosphere Engine** — speed-of-sound correction from temperature, wind compensation for DOA
- **NodeCare** — predictive maintenance scoring from health telemetry
- Spatial cells, cross-node correlation, provenance chains, incident lifecycle

### Edge Runtime (`resonance-edge` on crates.io)

- Hardware Abstraction Layer (Linux + Simulator backends)
- DSP pipeline: normalizer → impulse detector → feature extractor
- Privacy kernel with compile-time prohibited capabilities
- Ed25519-signed REP observations with replay protection
- Offline queue with reconnect replay

### Cloud Platform (`apps/cloud/`)

- Multi-tenant architecture (Organizations → Workspaces → Deployments)
- 8-role RBAC with 30+ granular permissions
- JWT authentication with API keys and webhooks
- Event-driven domain architecture with typed errors
- Background job framework with exponential backoff
- Explicit state machines for Node, Incident, Model, and Deployment lifecycles
- Data retention engine (hot → warm → archive → delete)
- Feature flag system with percentage rollout and targeting

### Design System (`packages/surface/`)

- Complete semantic design tokens (colors, spacing, typography, radius, elevation)
- Dark and light theme CSS variables
- Motion specification (5 categories respecting reduced-motion)
- Component interface contracts for 15+ visualization primitives
- Accessibility spec targeting WCAG 2.1 AA

### Hardware Reference

- VectorNode X1 engineering specification with 30+ formal requirements
- Manufacturing plan for contract electronics manufacturers
- Reference BOM, array geometries, and node family definitions
- Published under CERN Open Hardware Licence (permissive)

---

## Screenshots

### Incident Confidence Breakdown

![Incident Detail](brand/screenshot-incident.svg)

Every incident shows dimensional evidence scores: classifier confidence, sensor agreement, TOA consistency, signal quality, and environmental model — not just a single percentage.

### Simulation

![Simulation Output](brand/screenshot-simulation.svg)

The simulator creates virtual sensor networks for development without physical hardware. Run `resonance simulate --nodes 25 --environment suburban --duration 5m` to try it.

---

## Architecture

```
┌─────────────┐     ┌──────────────┐     ┌───────────────┐     ┌──────────────────┐     ┌────────────────┐
│  VectorNode │────▶│ Spatial Cell  │────▶│   WaveGraph   │────▶│ Probability Field │────▶│ Evidence Fusion │
│  (edge DSP) │     │ (4-8 nodes)  │     │ (propagation) │     │   (uncertainty)   │     │  (confidence)   │
└─────────────┘     └──────────────┘     └───────────────┘     └──────────────────┘     └────────────────┘
```

---

## Privacy by Architecture

Resonance is architecturally incapable of:
- Speech recognition
- Speaker identification
- Continuous audio recording
- Keyword monitoring
- Individual tracking

These aren't policy decisions — they're enforced at the type system and protocol level. Raw audio never leaves the sensor node.

---

## crates.io

All three crates are published:
- [`resonance-sdk`](https://crates.io/crates/resonance-sdk) — Signal processing and detector SDK
- [`resonance-platform`](https://crates.io/crates/resonance-platform) — Spatial intelligence engine
- [`resonance-edge`](https://crates.io/crates/resonance-edge) — Edge node runtime

## Quick Start

```bash
# Clone
git clone https://github.com/theworker02/resonance
cd resonance

# Build
cargo build --workspace

# Run simulation
python simulator/src/main.py --nodes 25 --environment suburban --duration 5m

# Start the cloud platform
cd apps/cloud && npm install && npm run dev
```

---

## What's Next (v4.1)

- First prototype PCB fabrication
- Hardware-in-the-loop testing
- Fleet manager application
- Public benchmark datasets
- Detector SDK with third-party marketplace

---

## Contributing

See [CONTRIBUTING.md](https://github.com/theworker02/resonance/blob/main/CONTRIBUTING.md) for development setup and guidelines.

## License

Apache 2.0 (software) · CERN-OHL-P (hardware reference designs)
