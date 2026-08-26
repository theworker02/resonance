# Competitive Architecture Analysis

## Overview

This document provides an honest architectural comparison between Resonance and conventional acoustic detection systems (e.g., ShotSpotter/SoundThinking, SENTRI, and similar proprietary platforms). The comparison focuses on architectural decisions and their implications — not marketing positioning.

## Comparison Matrix

| Dimension | Resonance | Conventional Systems |
|-----------|-----------|---------------------|
| Sensing Topology | Distributed mesh, multi-node per cell | Hub-and-spoke, sparse sensor placement |
| Directional Arrays | Per-node dual-ring array with DOA | Typically omnidirectional or limited directional |
| Environmental Compensation | Active atmospheric modeling (temperature, humidity, wind, pressure) | Limited or static sound speed assumptions |
| Localization Method | Acoustic Probability Surface (continuous field) | Point estimate from TDOA triangulation |
| Auditability | Deterministic replay, signed audit trail | Proprietary, limited external audit |
| Hardware Transparency | Open schematics, BOM, firmware | Proprietary hardware, no public specs |
| Privacy Architecture | Structural impossibility (type system + protocol) | Policy-based (configuration, contractual) |
| Offline Operation | Full autonomous operation, queued replay | Typically requires continuous connectivity |
| Model Transparency | Open detector packs, published accuracy metrics | Proprietary models, limited accuracy disclosure |
| Open Specifications | REP protocol, hardware specs, API spec all public | Proprietary protocols, NDA-protected interfaces |

## Detailed Analysis

### Distributed Sensing

**Resonance:** Deploys multiple nodes within each spatial cell, providing redundant coverage and enabling cross-node correlation. Loss of a single node degrades but does not eliminate coverage. The mesh topology means nodes can validate each other's observations.

**Conventional:** Typically uses fewer, more expensive sensors with wider spacing. This optimizes hardware cost but creates coverage gaps and single points of failure. Localization accuracy degrades significantly when a sensor is offline.

**Honest assessment:** Resonance's approach requires more hardware units per deployment area, increasing initial cost and installation complexity. The benefit is resilience and localization precision. For large open areas with line-of-sight between sensors, conventional sparse placement may be sufficient.

### Directional Arrays

**Resonance:** Each node produces a bearing vector with confidence interval, enabling single-node direction estimation. Combined with cross-node correlation, this provides localization even when geometric diversity is limited.

**Conventional:** Most systems rely on time-difference-of-arrival between multiple sensors. Individual sensors typically cannot determine direction. This means minimum 3 sensors with adequate geometric spread are required for any localization.

**Honest assessment:** Directional arrays add hardware complexity and cost per node. They provide a meaningful advantage in constrained geometries (narrow streets, corridors) where conventional TDOA geometry is poor. In open areas with good sensor placement, the advantage is less significant.

### Environmental Compensation

**Resonance:** The Atmosphere Engine continuously models propagation conditions using temperature, humidity, pressure, and wind measurements. Corrections are applied to TDOA calculations and confidence estimates. Environmental uncertainty is explicitly reported.

**Conventional:** Many systems assume constant sound speed (343 m/s at 20°C). Some apply static corrections based on seasonal averages. Few model real-time atmospheric effects on propagation.

**Honest assessment:** Environmental compensation provides meaningful accuracy improvement in variable conditions (temperature gradients, wind). In stable indoor or controlled environments, the benefit is minimal. The additional environmental sensors add cost and maintenance requirements.

### Probabilistic Localization

**Resonance:** Produces an Acoustic Probability Surface — a continuous probability field showing where the event likely originated. This communicates uncertainty honestly and allows operators to assess location confidence visually.

**Conventional:** Typically produces a point estimate (latitude, longitude) with a circular error radius. This can overstate certainty when the true uncertainty is asymmetric or multi-modal.

**Honest assessment:** APS provides more informative output for operators who understand probability. It requires more sophisticated visualization and may be harder for untrained operators to interpret quickly. Point estimates are simpler but potentially misleading.

### Auditability

**Resonance:** Every processing step is signed and stored in an append-only audit trail. Incidents can be deterministically replayed from raw observations to reproduce the exact reasoning process. The transparency endpoint provides public accountability without revealing sensitive details.

**Conventional:** Audit capabilities vary. Some systems provide detection logs but not full processing provenance. External audit is typically limited by proprietary algorithms and NDA-protected documentation.

**Honest assessment:** Resonance's auditability is a genuine architectural differentiator, particularly for deployments subject to legal scrutiny or civil liberties oversight. The cost is storage and complexity. For deployments where auditability is not a requirement, it adds overhead without operational benefit.

### Privacy Architecture

**Resonance:** Privacy constraints are structural — enforced by the type system, protocol schema, and hardware design. Prohibited capabilities cannot be enabled by configuration changes, software updates, or operator decisions without detectable modification of the system.

**Conventional:** Privacy is typically enforced by policy — contractual agreements, configuration settings, and organizational procedures. The underlying system may be technically capable of recording or processing speech, with policy preventing activation.

**Honest assessment:** Structural privacy provides stronger guarantees against scope creep, unauthorized expansion of capabilities, and post-deployment policy changes. However, it also limits flexibility. If a deployment later requires capabilities that Resonance structurally prohibits, the system cannot be adapted — a different solution would be needed.

### Offline Operation

**Resonance:** Nodes operate autonomously during network outages. Observations are buffered locally and replayed on reconnection. Detection continues without degradation. Only cross-node correlation and backend classification are delayed.

**Conventional:** Varies significantly. Some systems require continuous connectivity for all detection. Others can detect locally but cannot localize without multi-sensor coordination.

**Honest assessment:** Offline operation is genuinely important for reliability. Resonance's design here is architecturally sound. The tradeoff is that offline incidents are only partially classified until connectivity is restored — cross-node correlation and ML classification are delayed.

## Where Conventional Systems Have Advantages

- **Deployment maturity:** Conventional systems have years of field deployment data and validated detection statistics across hundreds of installations.
- **Regulatory acceptance:** Established systems have existing relationships with law enforcement and court precedent for evidentiary use.
- **Single-vendor simplicity:** Proprietary systems offer turnkey deployment without requiring operator hardware expertise.
- **Proven detection rates:** Published detection and localization statistics from real-world deployments over multiple years.

Resonance is a new platform without equivalent field validation history. Claims about detection accuracy are based on simulation and controlled testing, not multi-year operational deployment. This is a meaningful gap that only time and real-world deployment can address.
