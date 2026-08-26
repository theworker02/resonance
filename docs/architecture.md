# Phase III Architecture

## System Architecture Diagram

```
┌──────────────────────────────────────────────────────────────────────────────────┐
│                              RESONANCE PLATFORM — Phase III                        │
├──────────────────────────────────────────────────────────────────────────────────┤
│                                                                                    │
│  ┌─────────────┐    REP     ┌─────────────┐    Events    ┌──────────────────┐    │
│  │  RN-Edge    │ ────────── │  Ingestion   │ ──────────── │   Correlation    │    │
│  │  RN-Mini    │  (TLS/     │  Gateway     │  (internal   │   Engine         │    │
│  │  RN-Prec.   │   mTLS)    │              │   queue)     │                  │    │
│  └─────────────┘            └─────────────┘              └────────┬─────────┘    │
│       │ Sensor                     │                               │               │
│       │ Layer                      │ Storage                       │               │
│       │                            ▼                               ▼               │
│       │                    ┌─────────────┐              ┌──────────────────┐      │
│       │                    │ TimescaleDB  │              │  SAM Engine      │      │
│       │                    │ (persistent) │◄─────────────│                  │      │
│       │                    └─────────────┘              │  ┌────────────┐  │      │
│       │                                                  │  │ Geometry   │  │      │
│       │                                                  │  │ Engine     │  │      │
│       │                                                  │  ├────────────┤  │      │
│       │                                                  │  │ WaveGraph  │  │      │
│       │                                                  │  ├────────────┤  │      │
│       │                                                  │  │ MeshCal    │  │      │
│       │                                                  │  ├────────────┤  │      │
│       │                                                  │  │ MCE        │  │      │
│       │                                                  │  ├────────────┤  │      │
│       │                                                  │  │ APF        │  │      │
│       │                                                  │  └────────────┘  │      │
│       │                                                  └────────┬─────────┘      │
│       │                                                           │                │
│       │                                                           ▼                │
│       │                                                  ┌──────────────────┐      │
│       │                                                  │  Intelligence    │      │
│       │                                                  │  Layer           │      │
│       │                                                  │  (ML classif.)   │      │
│       │                                                  └────────┬─────────┘      │
│       │                                                           │                │
│       │                                                           ▼                │
│       │           ┌──────────────┐               ┌──────────────────────┐          │
│       │           │  Provenance  │◄──────────────│  Incident Manager    │          │
│       │           │  Chain       │               │                      │          │
│       │           └──────────────┘               └──────────┬───────────┘          │
│       │                                                      │                     │
│       │                                                      ▼                     │
│       │                                          ┌──────────────────────┐          │
│       │                                          │  REST API + WebSocket │          │
│       │                                          └──────────┬───────────┘          │
│       │                                                      │                     │
└───────┼──────────────────────────────────────────────────────┼─────────────────────┘
        │                                                      │
        │  Hardware boundary                                   │  Network boundary
        ▼                                                      ▼
┌─────────────┐                                    ┌──────────────────┐
│  Physical   │                                    │  Console (React) │
│  Sensors    │                                    │  Operator UI     │
└─────────────┘                                    └──────────────────┘
```

## How SAM Sits Above the Correlation Layer

The platform processes data in distinct layers:

1. **Sensor Layer** — Physical RN-Edge/Mini/Precision nodes detect acoustic events, extract features, and publish observations via REP.

2. **Ingestion Layer** — The gateway validates, authenticates, and queues incoming observations.

3. **Correlation Layer** — Groups observations from multiple sensors that represent the same physical event. Produces incident candidates with correlated observation sets.

4. **SAM Layer** — Takes correlated observation sets and produces spatial characterizations: sector estimates, probability fields, confidence scores. This is where Phase III adds value.

5. **Intelligence Layer** — Classifies events using ML models. Operates on both raw acoustic features and SAM's spatial context.

6. **Incident Layer** — Combines spatial and classification outputs into a final incident record with provenance, confidence, and audit trail.

## Data Flow

```
Sensor → REP → Ingestion → Correlation → SAM → MCE → APF → Intelligence → Incident
```

Detailed path for a single acoustic event:

1. **Sensor**: RN-Edge detects impulsive sound. Extracts peak energy, spectral fingerprint, timestamp (GNSS-referenced), DOA estimate.

2. **REP**: Observation published as a signed REP message over mTLS to the ingestion gateway.

3. **Ingestion**: Validates signature, checks sensor enrollment, writes raw observation to TimescaleDB, forwards to correlation queue.

4. **Correlation**: Finds other observations within a configurable time window (typically 500 ms). Groups by fingerprint similarity and temporal proximity. Produces an incident candidate.

5. **SAM — Geometry Engine**: For each participating cell, computes TDOA residuals, assesses direct-path probability, estimates dominant sector.

6. **SAM — WaveGraph**: Validates observations against learned propagation model. Flags anomalies.

7. **SAM — MCE**: Collects cell-level sector estimates. Votes across overlapping cells. Produces inter-cell agreement score and spatial tier.

8. **SAM — APF**: Builds the Acoustic Probability Field from MCE output. Ranks candidate regions by probability.

9. **Intelligence**: Runs classification models on acoustic features. Incorporates spatial context (e.g., "this sector has had 3 similar events this week").

10. **Incident Manager**: Produces final incident record. Attaches confidence report, spatial confidence, APF, provenance entry. Pushes to REST API and WebSocket.

## Component Responsibilities

| Component              | Responsibility                                                        |
|------------------------|-----------------------------------------------------------------------|
| Ingestion Gateway      | Authentication, validation, rate limiting, observation persistence     |
| Correlation Engine     | Temporal/spectral grouping, multi-sensor association                   |
| Cell Geometry Engine   | TDOA analysis, sector estimation, direct-path assessment              |
| WaveGraph              | Learned propagation model, anomaly detection, edge reliability        |
| MeshCal                | Calibration scoring across 7 dimensions, action generation            |
| Mesh Consensus Engine  | Multi-cell voting, spatial tier assignment, conflict detection          |
| Acoustic Probability Field | Region ranking, probability normalization, spatial summary        |
| Intelligence Layer     | ML classification, confidence scoring, novelty detection              |
| Incident Manager       | Final incident assembly, status management, review queue              |
| Provenance Chain       | Tamper-evident audit trail, hash chaining, actor attribution          |
| Console                | Operator UI, visualization, review workflow, fleet management         |
| Deployment Optimizer   | Pre-deployment coverage analysis, cost estimation, recommendations    |

## Privacy Enforcement Points

Privacy is enforced at multiple layers — not as an afterthought but as a structural property:

| Layer             | Enforcement                                                          |
|-------------------|----------------------------------------------------------------------|
| Sensor (edge)     | Privacy kernel prevents raw audio retention; only features extracted  |
| REP transport     | No audio content in protocol; only spectral/temporal features         |
| Ingestion         | Validates privacy attestation; rejects sensors without valid attestation |
| SAM               | Spatial resolution bounded by sector size (~30–100 m); cannot resolve individuals |
| Intelligence      | Classifiers trained on event types, not voices or speech content      |
| Incident          | No coordinate precise enough for individual identification           |
| Console           | Role-based access; audit trail for all data access                   |
| Storage           | Retention policies; automatic purge of observations beyond window     |

The platform cannot, by design:
- Record or transmit raw audio
- Identify individuals by voice
- Track movement of specific people
- Produce coordinates precise enough for individual surveillance
- Operate without a valid privacy attestation from each sensor

## Security Boundaries

```
┌───────────────────────────────────────────────┐
│  TRUST BOUNDARY 1: Sensor ←→ Platform         │
│  - mTLS with device certificates              │
│  - Signed observations (secure element)       │
│  - Hardware attestation (firmware signing)     │
└───────────────────────────────────────────────┘

┌───────────────────────────────────────────────┐
│  TRUST BOUNDARY 2: Platform ←→ Console        │
│  - JWT authentication                         │
│  - Role-based access control                  │
│  - Audit logging of all API access            │
└───────────────────────────────────────────────┘

┌───────────────────────────────────────────────┐
│  TRUST BOUNDARY 3: Platform ←→ Storage        │
│  - Encrypted at rest (AES-256)                │
│  - Row-level security in PostgreSQL           │
│  - Automated retention/purge policies         │
└───────────────────────────────────────────────┘
```

Security principles:
- **Zero trust**: Every message is authenticated and validated regardless of network position
- **Defence in depth**: Multiple independent security controls at each boundary
- **Least privilege**: Components have only the access they need (database roles, API scopes)
- **Tamper evidence**: Provenance chain provides cryptographic evidence of data lineage
- **Incident response**: Security events generate alerts separate from acoustic incidents

## Deployment Architecture

The platform supports three deployment models:

1. **Cloud-hosted**: All platform components run in a Kubernetes cluster; sensors connect over public internet via mTLS.

2. **On-premises**: Platform runs on local hardware; sensors connect over private network. Suitable for high-security or air-gapped environments.

3. **Hybrid**: Sensors connect to a local edge server for ingestion and correlation; spatial analysis and intelligence run in the cloud. Balances latency with compute requirements.

In all models, the sensor layer is independent: nodes operate autonomously if platform connectivity is lost, buffering observations locally until connection is restored.
