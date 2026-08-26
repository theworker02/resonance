# MeshLab — Acoustic Mesh Simulator

## Purpose

MeshLab is a simulation environment that allows the entire Resonance platform to be developed, tested, and validated without physical sensor hardware. It generates synthetic acoustic observations, propagation characteristics, and fault conditions that exercise the full pipeline from ingestion through SAM to incident production.

MeshLab is not a toy: it models realistic propagation physics, timing errors, environmental variation, and hardware failure modes. Code that works against MeshLab will work against real hardware, because MeshLab's output is indistinguishable from real sensor data at the protocol level.

## What MeshLab Simulates

### Nodes and Cells
MeshLab instantiates virtual sensor nodes at configurable geographic positions, grouped into rectangular cells. Each virtual node behaves identically to a real Resonance Node: it publishes health heartbeats, responds to configuration commands, and produces observation events through the standard REP (Resonance Event Protocol) channel.

### Acoustic Events
MeshLab generates synthetic acoustic events at specified positions with configurable:
- Source energy (dB SPL)
- Spectral profile (broadband, narrowband, impulsive, harmonic)
- Duration and temporal envelope
- Source classification (for testing the intelligence layer)

### Propagation Physics
For each generated event, MeshLab computes realistic arrival times at each virtual sensor using:
- Geometric distance (haversine)
- Speed of sound adjusted for temperature and humidity
- Attenuation model (geometric spreading + atmospheric absorption)
- Optional multipath: one or two reflection paths with configurable excess delay
- Random timing jitter modelling clock uncertainty

### Fault Injection
MeshLab supports injecting failures to test graceful degradation:

| Fault Type         | Description                                                |
|--------------------|------------------------------------------------------------|
| `node_offline`     | Take a node offline entirely (no heartbeats, no events)    |
| `clock_drift`      | Add progressive timing error to a node's timestamps        |
| `gain_shift`       | Change a node's reported energy by a fixed offset          |
| `mic_failure`      | Mark one or more microphone channels as clipping/dead      |
| `network_partition`| Isolate a subset of nodes (simulate connectivity loss)     |
| `environment_shift`| Change temperature/wind to model weather transitions       |
| `position_drift`   | Slowly change a node's reported position (IMU drift)       |
| `reflection_add`   | Add a persistent reflection path between two nodes         |

### Environment Types
MeshLab models different acoustic environments:

| Environment  | Characteristics                                          |
|--------------|----------------------------------------------------------|
| `open_field` | Minimal reflections, predictable propagation             |
| `urban`      | Multiple reflections, canyon effects, variable noise      |
| `industrial` | High background noise, metallic reflections, machinery   |
| `campus`     | Mixed open/enclosed areas, pedestrian noise               |
| `forest`     | Scattering, absorption by vegetation, wind noise          |

## CLI Usage

MeshLab is invoked through the `resonance meshlab` CLI:

```bash
# Start a 4-cell mesh simulation in urban environment
resonance meshlab start --cells 4 --environment urban --duration 1h

# Generate 100 random acoustic events
resonance meshlab generate --events 100 --class gunshot --energy 140

# Inject a node failure after 10 minutes
resonance meshlab fault --type node_offline --target sensor-0003 --after 10m

# Run a complete test scenario from a YAML file
resonance meshlab scenario --file scenarios/degradation_test.yaml

# Export generated observations for offline analysis
resonance meshlab export --format jsonl --output observations.jsonl
```

## Scenario Files

Complex test scenarios are defined in YAML:

```yaml
name: four_cell_degradation
environment: urban
temperature_c: 18.0
cells: 4
cell_size_m: 300

events:
  - time: 0s
    count: 5
    class: impulsive
    position: [51.499, -0.140]
    energy_db: 130

faults:
  - time: 5m
    type: node_offline
    target: sensor-0002
  - time: 10m
    type: clock_drift
    target: sensor-0007
    drift_rate_us_per_sec: 0.5

assertions:
  - after: 12m
    check: cell_mode
    cell: RC-001
    expected: degraded
  - after: 12m
    check: wavegraph_anomaly
    edge: [sensor-0007, sensor-0008]
    expected: true
```

## How to Use MeshLab Output to Validate the Platform

MeshLab produces ground-truth labels alongside its simulated observations. This enables:

1. **Spatial accuracy validation**: Compare the APF's dominant region against the known source position. The source should fall within the dominant region's polygon at a rate consistent with the reported probability.

2. **Degradation testing**: Inject faults and verify that cell modes transition correctly, that the MCE reduces spatial confidence appropriately, and that calibration actions are generated.

3. **WaveGraph convergence**: Run MeshLab for extended durations and verify that propagation edges converge to values consistent with the simulated geometry and environment.

4. **End-to-end pipeline testing**: Feed MeshLab's REP output into the real ingestion pipeline and verify that incidents emerge with correct classifications, spatial tiers, and confidence scores.

5. **Performance benchmarking**: Measure pipeline latency and throughput under varying event rates and cell counts.

MeshLab is integrated into the CI pipeline: every merge to main runs a standard scenario and asserts that key metrics remain within bounds.
