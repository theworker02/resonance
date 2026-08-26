# Spatial Acoustic Mesh (SAM)

## Overview

The Spatial Acoustic Mesh is the geometric reasoning layer introduced in Phase III of the Resonance platform. It replaces the Phase II point-triangulation approach — which produced misleadingly precise latitude/longitude estimates — with a probabilistic, region-based model of acoustic source localization.

SAM recognizes a fundamental truth about outdoor acoustics: sound reflects, refracts, diffracts, and attenuates in ways that make sub-metre coordinate claims dishonest. Instead of a coordinate, the platform now produces a *probability field* describing which spatial regions most likely contain the source, and how confident the system is in that assessment.

## Why SAM Replaces Point Triangulation

Classical TDOA triangulation assumes:
- Line-of-sight between source and all receivers
- Homogeneous propagation environment
- No multipath reflections
- Sub-microsecond clock synchronization

In real deployments (urban canyons, industrial yards, campuses), none of these hold consistently. Point triangulation produces coordinates with spurious precision, misleading operators and creating false confidence.

SAM takes a different approach: group sensors into geometric cells, reason about sectors and probability regions, and report honest uncertainty. A SAM output might say "64% probability the source is in the northeast sector of cell RC-042, within a region roughly 40 metres across" — which is far more operationally useful than a coordinate with hidden 200-metre error.

## The Rectangular Cell

The fundamental spatial unit is the rectangular cell: four sensor nodes placed at approximate compass corners (NW, NE, SE, SW), forming a rectangular bounding area typically 200–500 metres on a side.

```
         NW ─────────────────────── NE
          │                          │
          │      Cell RC-042         │
          │                          │
          │         ★ centroid       │
          │                          │
          │                          │
         SW ─────────────────────── SE

Each corner hosts a Resonance Node (RN-Edge or RN-Precision)
with 8-channel microphone array, GNSS timing, and LTE uplink.
```

The rectangle was chosen over triangles (too few baselines), hexagons (complex coordination), and arbitrary polygons (unpredictable geometry) because it provides:
- Six unique sensor pairs (4 choose 2) for TDOA analysis
- Natural sector division into 8 octants
- Predictable geometric properties for calibration
- Simple deployment: just place four sensors at corners

## Sector-Based Localization

Rather than attempting to pinpoint a coordinate, SAM divides each cell into 8 angular sectors (N, NE, E, SE, S, SW, W, NW) radiating from the centroid. The geometry engine estimates which sector the acoustic event most likely originated from by:

1. Computing observed TDOA between all node pairs
2. Comparing to expected TDOA for a hypothetical source in each sector
3. Weighting by direct-path probability (rejecting likely reflections)
4. Scoring cross-sensor spectral similarity to verify co-detection
5. Producing a sector estimate with a confidence score

The result is a dominant sector (e.g. "NE") with an angular interval (e.g. 22.5°–67.5°) and a confidence score (0–1).

## Overlapping Cells and Multi-Cell Consensus

Cells overlap by design. Adjacent cells share boundary sensors, and events near edges are observed by multiple cells simultaneously. The Mesh Consensus Engine (MCE) collects independent sector estimates from every participating cell and votes:

- If 3 of 4 cells agree the event is in their "NE" sector, and those sectors point toward the same geographic region, the MCE gives high confidence.
- If cells disagree, the MCE reports a lower spatial tier and the Acoustic Probability Field becomes diffuse.

This multi-cell voting eliminates single-cell reflection artefacts and provides redundancy against node failures.

## Hierarchical Mesh Layers

SAM organizes the sensor network into five hierarchical layers:

```
Network  ─  the entire Resonance deployment
  │
  └─ Region  ─  a geographic area (city district, facility)
       │
       └─ Cluster  ─  a tight group of related cells
            │
            └─ Cell  ─  4 nodes forming a rectangle
                 │
                 └─ Node  ─  a single sensor (RN-Mini/Edge/Precision)
```

Each layer provides context and consensus at its scale:
- **Node**: raw acoustic observations, health, timing
- **Cell**: sector estimation, local TDOA geometry, calibration
- **Cluster**: multi-cell consensus voting, contradiction detection
- **Region**: aggregate statistics, fleet calibration, policy
- **Network**: global health, capacity planning, audit

## Graceful Degradation

A key design principle is that cells degrade gracefully when nodes go offline:

| Healthy Nodes | Mode             | Capability                                    |
|---------------|------------------|-----------------------------------------------|
| 4+            | Nominal          | Full sector localization, all 6 TDOA pairs    |
| 3             | Degraded         | Reduced localization, 3 TDOA pairs, wider angular interval |
| 2             | Observation Only | Can detect events but not localize            |
| 1             | Unverified       | Single-sensor observations, no correlation    |
| 0             | Offline          | Cell contributes nothing                      |

The mode transitions are automatic and the system adjusts confidence scores accordingly. Operators see degradation in the console and can schedule maintenance before a cell drops below the localization threshold.

## The Acoustic Probability Field (APF)

Instead of a coordinate, SAM produces an Acoustic Probability Field: an ordered list of candidate source regions, each with a polygon boundary, a centroid, and a probability weight. The probabilities sum to at most 1.0; the remainder represents the probability that the source is outside all modeled cells ("outside probability").

A typical APF output:

```
Region                   Probability
─────────────────────────────────────
RC-042 / NE sector       0.64
RC-042 / NW sector       0.21
RC-041 / SE sector       0.09
Outside modeled area     0.06
```

The APF is the platform's final spatial answer. It can be displayed as a heat map, a ranked list, or a dominant region with diameter. It is intentionally honest about uncertainty.

## What SAM Does Not Do

SAM is designed exclusively for acoustic event localization. It does not:
- Track individuals or movement patterns
- Record or retain audio content
- Identify speakers or voices
- Correlate with video or other surveillance feeds
- Produce coordinates precise enough for individual identification

The privacy architecture ensures that SAM's spatial resolution is bounded: the smallest reportable region is the sector (typically 30–100 metres across), and the system cannot resolve source positions finer than this by design.
