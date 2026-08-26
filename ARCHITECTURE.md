# Architecture

## System Overview

Resonance is a distributed acoustic sensing platform designed for privacy-preserving incident detection in public spaces. The system detects impulsive acoustic events (gunshots, vehicle impacts, glass breaking) using networked edge nodes with directional microphone arrays.

The platform is organized into four architectural layers, each with clear responsibility boundaries and explicit data contracts.

---

## Layer 1: Acquisition (Edge)

**Crate:** `resonance-edge`

The acquisition layer runs on embedded hardware at each node. It manages:

- **Hardware Abstraction Layer (HAL):** Uniform interface across production hardware and simulator backends. Supports multi-channel audio capture from MEMS microphone arrays.
- **Privacy Kernel:** Enforces compile-time guarantees that raw audio never leaves the device. Manages the ephemeral ring buffer (≤5 seconds) and ensures prohibited capabilities (speech recognition, speaker identification, voiceprint storage) cannot be invoked.
- **DSP Pipeline:** Real-time signal conditioning — normalization, impulse detection, feature extraction.
- **Chronos Timing:** Precision time synchronization across nodes using GPS PPS and NTP fallback, enabling cross-node correlation with sub-millisecond alignment.

Data flow: PCM samples → ring buffer → impulse trigger → feature extraction → observation envelope.

---

## Layer 2: Signal Processing

**Crate:** `resonance-signal`

A pure computational library with no I/O dependencies. Provides:

- **MFCC Extraction:** 13 Mel-frequency cepstral coefficients, 40 mel filters, 20–8000 Hz band.
- **Spectral Features:** Centroid, rolloff, zero-crossing rate, spectral flux.
- **VectorWave 2:** Direction-of-arrival estimation using the dual-ring microphone array geometry. Produces bearing vectors with confidence intervals.
- **WavePrint v2:** Acoustic fingerprinting over normalized feature vectors (SHA-256 hash of canonical feature representation).
- **EchoGraph:** Reflection-aware localization that models acoustic paths including wall reflections, improving position estimates in enclosed spaces.

This crate is a leaf dependency — it depends on no other Resonance crate.

---

## Layer 3: Spatial Intelligence (Core)

**Crate:** `resonance-core`

The core layer runs on backend infrastructure and implements:

- **Spatial Cells:** Geographic regions served by one or more nodes. Each cell maintains calibration state, node membership, and environmental baseline.
- **Cross-Node Correlation:** Fuses observations from multiple nodes using time-of-arrival differences and bearing intersection to produce localization estimates.
- **Acoustic Probability Surface (APS):** A continuous probability field over the cell geometry representing the likelihood of event origin at each point.
- **Atmosphere Engine:** Environmental compensation using temperature, humidity, wind speed, and barometric pressure to correct propagation models.
- **ConflictGuard:** Contradiction detection that identifies when observations are mutually inconsistent, preventing false confidence accumulation.
- **Confidence Timeline:** Tracks how confidence evolves as evidence accumulates, enabling deterministic replay of the reasoning process.
- **Incident Lifecycle:** State machine managing observation → candidate → incident → review → closed progression.

---

## Layer 4: Presentation (Apps)

**Applications:** `apps/console`, `apps/cli`, `apps/docs-site`, `apps/simulator`

- **Operator Console:** React/TypeScript web application with real-time map visualization, incident timeline, human review workflow, and audit trail viewer. Connects via WebSocket for live updates and REST API for historical queries.
- **CLI:** Command-line tool for node management, diagnostics, replay, and batch operations.
- **Simulator (MeshLab):** Multi-node simulation environment for testing detection scenarios without physical hardware.
- **Documentation Site:** Static site serving engineering documentation, API reference, and operational guides.

---

## Canonical Processing Pipeline

```
Acoustic Hardware
    │
    ▼
Edge Acquisition (resonance-edge)
    │  PCM capture, ring buffer, impulse detection
    ▼
Signal Processing (resonance-signal)
    │  MFCC, spectral features, VectorWave DOA, WavePrint fingerprint
    ▼
Directional Observation
    │  Bearing vector + feature set + timestamp + confidence
    ▼
Spatial Cell (resonance-core)
    │  Cell membership, node registry
    ▼
Cross-Node Correlation
    │  TDOA, bearing intersection, APS generation
    ▼
Environmental Compensation (Atmosphere Engine)
    │  Temperature, humidity, wind correction
    ▼
Event Classification (intelligence/)
    │  ML detector packs, ensemble voting
    ▼
Confidence Fusion (ConflictGuard)
    │  Contradiction detection, confidence timeline
    ▼
Incident Record
    │  Cryptographically signed, deterministically replayable
    ▼
Operator Console / REST API / Audit Trail
```

---

## Crate Dependency Graph

```
┌─────────────────────┐
│  resonance-signal   │  ← Leaf crate (no internal deps)
│  (signal processing)│
└────────┬────────────┘
         │
         │ depends on
         ▼
┌─────────────────────┐     ┌─────────────────────────┐
│  resonance-edge     │────▶│  resonance-protocol     │
│  (edge runtime)     │     │  (wire format, signing) │
└─────────────────────┘     └────────────┬────────────┘
                                         │
         ┌───────────────────────────────┘
         │ depends on
         ▼
┌─────────────────────┐
│  resonance-core     │
│  (spatial intel)    │
└─────────────────────┘
         │
         │ depends on
         ▼
┌─────────────────────┐
│  resonance-signal   │
│  resonance-protocol │
└─────────────────────┘
```

**Dependency summary:**

| Crate | Depends On |
|-------|-----------|
| `resonance-signal` | (none — leaf) |
| `resonance-protocol` | `resonance-signal` |
| `resonance-edge` | `resonance-signal`, `resonance-protocol` |
| `resonance-core` | `resonance-signal`, `resonance-protocol` |

---

## External System Integration

### Python Intelligence Layer

The `intelligence/` directory contains Python-based ML detector packs that run as a sidecar process. Communication with the Rust core uses:

- **gRPC** (via `rep.proto`) for structured observation submission and classification results.
- **Manifest-based loading** — each detector pack declares its capabilities, input requirements, and confidence semantics in a YAML manifest.
- **ONNX Runtime** for model inference, enabling models trained in any framework to be deployed uniformly.

```
resonance-core ──gRPC──▶ intelligence/
                         ├── base.py (detector interface)
                         ├── manifest_loader.py
                         └── detectors/
                             ├── gunshot/
                             ├── impact/
                             ├── glass/
                             └── explosion/
```

### React Operator Console

The `apps/console/` React application connects to the platform via:

- **REST API** (`/v1/*`) for CRUD operations on nodes, cells, incidents, and audit records.
- **WebSocket** (`/v1/events`) for real-time streaming of observations, incidents, and health updates.
- **MapLibre GL** for spatial visualization of cells, nodes, and Acoustic Probability Surfaces.

```
apps/console (React/TS)
    │
    ├── REST ──▶ /v1/incidents, /v1/nodes, /v1/cells, /v1/audit
    │
    └── WS ───▶ /v1/events (real-time observation + incident stream)
                    │
                    ▼
              resonance-core (Rust backend)
```

---

## Design Principles

1. **Privacy by construction:** Prohibited capabilities are enforced at the type system level. There are no protocol fields capable of carrying raw audio, speech transcripts, or speaker identities.

2. **Deterministic replay:** Every incident can be replayed from its constituent observations to reproduce the exact confidence progression and final classification.

3. **Auditability:** All processing steps produce signed audit records. The transparency endpoint publishes aggregate statistics without authentication.

4. **Graceful degradation:** Nodes operate independently during network partitions. Offline observations are queued and replayed on reconnection without data loss.

5. **Hardware transparency:** All hardware designs, BOMs, and firmware are open. No proprietary sensor black boxes.

6. **Environmental honesty:** The Atmosphere Engine explicitly models and reports environmental uncertainty rather than hiding it in confidence intervals.
