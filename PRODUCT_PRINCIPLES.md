# Product Principles

## Resonance — Spatial Acoustic Intelligence Infrastructure

Resonance provides: **Measure → Correlate → Interpret → Verify → Operate → Audit**

The platform is composed of:

| Product | Purpose |
|---------|---------|
| Resonance Detect | Real-time acoustic event detection |
| Resonance Mesh | Distributed sensor spatial-inference network |
| Resonance Fleet | Sensor deployment, health, and maintenance |
| Resonance Evidence | Incident reconstruction, provenance, auditing |
| Resonance Lab | Research, simulation, calibration, hardware testing |
| Resonance Edge | Local/regional processing appliance |
| Resonance Cloud | Hosted control plane and multi-tenant platform |
| Resonance SDK | APIs, hardware interfaces, detector development tools |

---

## Engineering Values

### Measurement Before Assumption

Do not claim certainty where only probability exists. Every confidence score must be backed by measurable signal quality. Report uncertainty explicitly.

### Evidence Before Alert

Every high-priority result must be backed by multiple independent observations. Single-sensor events cannot produce high-confidence incidents.

### Edge Before Cloud

Critical detection and safety functionality must continue without internet connectivity. Cloud enhances — it must not be a dependency for core operation.

### Explainability Before Convenience

Operators must understand why Resonance reached an interpretation. Never hide disagreement inside an aggregate score. Expose competing hypotheses.

### Privacy by Architecture

Privacy cannot depend exclusively on policy. The system must be architecturally incapable of continuous surveillance, speech recognition, or speaker identification. These prohibitions are enforced at the type system and protocol level.

### Resilience Before Elegance

Real deployments encounter failed sensors, degraded networks, clock drift, environmental noise, and damaged hardware. Every subsystem must degrade gracefully rather than failing silently.

### Open Interfaces

Protocols, APIs, schemas, and extension mechanisms must be documented and independently implementable. No proprietary lock-in at the protocol layer.

### Human Authority

Automation assists operators. It does not conceal uncertainty or silently make irreversible decisions. Humans review, confirm, and override.
