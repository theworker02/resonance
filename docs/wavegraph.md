# WaveGraph — Learned Propagation Model

## What the WaveGraph Represents

The WaveGraph is a learned model of acoustic propagation between every pair of sensors that can co-detect events. It is represented as an undirected weighted graph where:

- **Nodes** are sensor positions (Resonance Nodes)
- **Edges** connect sensor pairs that have co-detected at least one acoustic event
- **Edge weights** encode the learned propagation characteristics between that pair

The WaveGraph replaces hard-coded propagation assumptions (free-space speed of sound, no reflections) with empirically learned, continuously updated parameters derived from real observations.

## What Each Edge Learns

Every edge in the WaveGraph maintains the following learned parameters:

| Parameter                | Description                                          |
|--------------------------|------------------------------------------------------|
| `expected_tdoa_us`       | Mean observed TDOA between the pair (microseconds)   |
| `tdoa_std_us`            | Standard deviation of observed TDOA                  |
| `geometric_distance_m`   | Known geometric distance from survey                 |
| `expected_energy_diff_db`| Mean energy difference (attenuation asymmetry)       |
| `energy_diff_std_db`     | Standard deviation of energy differences             |
| `spectral_ratio`         | Typical spectral content ratio between the pair      |
| `co_detection_rate`      | Fraction of events detected by both sensors          |
| `observation_count`      | Total co-detected events used for learning           |
| `is_reliable`            | Whether this edge has converged to a stable estimate |

The `expected_tdoa_us` for a given pair encodes not just geometric distance but the dominant propagation path — including reflections, diffraction around buildings, and channeling effects that are stable over time.

## EMA Learning Algorithm

Edge parameters are updated using an Exponential Moving Average (EMA) with a configurable smoothing factor `alpha`:

```
new_value = alpha * observation + (1 - alpha) * previous_value
```

The default `alpha = 0.05` (slow learning, stable convergence). For the standard deviation:

```
new_std = sqrt(alpha * (observation - new_mean)^2 + (1 - alpha) * previous_std^2)
```

This means:
- The WaveGraph adapts to seasonal changes (temperature affects speed of sound) over days to weeks
- Short-term anomalies (a truck parked between sensors) are smoothed out
- Long-term environmental changes (new building constructed) cause gradual convergence to new values

An edge is marked `is_reliable = true` when:
- `observation_count >= 30` (minimum statistical sample)
- `tdoa_std_us < 200.0` (convergence criterion: standard deviation below threshold)
- `co_detection_rate >= 0.3` (the pair regularly co-detects events)

## Outlier Rejection

Before updating an edge, the WaveGraph applies outlier rejection:

1. Compute the z-score: `z = |observed_tdoa - expected_tdoa| / tdoa_std`
2. If `z > 3.0` (three-sigma outlier), the observation is rejected
3. Rejected observations increment an `anomaly_count` but do not update the EMA
4. If the anomaly rate exceeds 20% over a sliding window, the edge is flagged for investigation

This prevents single anomalous events (reflections off a passing vehicle, sensor glitch) from corrupting the learned model while still allowing gradual adaptation.

## Anomaly Detection

The WaveGraph serves as an anomaly detector in two ways:

**Event-level anomaly**: When an acoustic event produces TDOA values inconsistent with the learned model (high z-scores across multiple edges), it may indicate:
- A genuine event from an unusual direction (outside the normal propagation cone)
- A reflection-dominated arrival (multipath without direct path)
- A sensor timing fault (clock drift, synchronization failure)

**Model-level anomaly**: When an edge's parameters shift beyond expected seasonal variation, it may indicate:
- Physical environment change (construction, vegetation growth, new obstacle)
- Sensor displacement (post tilt, mounting failure)
- Hardware degradation (microphone membrane fouling)

Both types of anomaly generate calibration alerts that operators see in the console.

## How WaveGraph Feeds the MCE

The Mesh Consensus Engine uses the WaveGraph during incident computation:

1. For each observation pair, the MCE computes `consistency = 1 - clamp(|observed - expected| / tolerance, 0, 1)` using WaveGraph edges
2. High-consistency pairs support the sector estimate; low-consistency pairs reduce spatial confidence
3. If a pair's WaveGraph edge is marked unreliable, the MCE down-weights that pair's contribution
4. The overall `wavegraph_consistency` score in the MeshIncident reflects how well the observations fit the learned model

This creates a feedback loop: the better calibrated the WaveGraph, the more confident the spatial estimates; and anomalies in the spatial estimates drive WaveGraph recalibration.

## Operational Considerations

- The WaveGraph requires approximately 30 co-detected events per edge to become reliable
- In a typical urban deployment with 10–50 detectable events per day per cell, edges converge within 1–5 days
- Temperature compensation: edges are indexed by ambient temperature band (±5°C) to account for speed-of-sound variation
- The WaveGraph is persisted to the `propagation_edges` table and survives restarts
- Operators can view edge reliability and co-detection rates in the Propagation view of the console
