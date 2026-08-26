# Calibration — MeshCal System

## Why Calibration Matters

Acoustic localization via TDOA depends on precise knowledge of sensor positions, orientations, timing offsets, and frequency responses. Small errors compound: a 10 µs timing error translates to ~3.4 metres of position uncertainty; a 5° heading error shifts the sector estimate by one octant at range.

MeshCal is the continuous calibration system that monitors, scores, and remediates calibration drift across the entire mesh. Its goal is to keep every cell at a calibration level where its spatial estimates are trustworthy.

## The 7 Calibration Dimensions

MeshCal evaluates each cell across seven independent dimensions:

### 1. Timing Synchronization
- Measures: clock offset between all nodes in a cell via WaveGraph TDOA residuals
- Target: all nodes synchronized to < 10 µs
- How scored: `100 - (max_pair_offset_us / 10.0) * 100`, clamped 0–100
- Remediation: check GNSS fix quality, restart NTP daemon, replace crystal

### 2. Orientation (Heading)
- Measures: deviation between installed heading and current IMU heading
- Target: deviation < 2° for all nodes
- How scored: `100 - (max_deviation_deg / 2.0) * 100`, clamped 0–100
- Remediation: physical remounting, recalibrate magnetometer, update heading reference

### 3. Gain Balance
- Measures: inter-node energy consistency when observing the same event
- Target: maximum inter-node gain difference < 3 dB
- How scored: `100 - (max_gain_diff_db / 3.0) * 100`, clamped 0–100
- Remediation: check microphone membrane, clean acoustic port, recalibrate AGC

### 4. Noise Floor
- Measures: ambient noise floor across all channels
- Target: noise floor < configured threshold (environment-dependent)
- How scored: fraction of channels below threshold × 100
- Remediation: identify noise source, add acoustic shielding, adjust threshold

### 5. Frequency Response
- Measures: spectral flatness of each microphone channel
- Target: ±3 dB from reference curve (20 Hz – 16 kHz)
- How scored: fraction of frequency bins within tolerance × 100
- Remediation: replace membrane, recalibrate DSP filter, update reference curve

### 6. Propagation Model
- Measures: WaveGraph convergence — how stable and consistent the learned TDOA edges are
- Target: all edges reliable (`is_reliable = true`) with `tdoa_std_us < 200`
- How scored: fraction of reliable edges × 100
- Remediation: wait for more observations, investigate environmental changes, check for new obstructions

### 7. Geometric Consistency
- Measures: agreement between surveyed node positions and positions implied by TDOA geometry
- Target: implied positions within 2 metres of survey
- How scored: `100 - (max_position_error_m / 2.0) * 100`, clamped 0–100
- Remediation: re-survey positions, check for physical displacement, update position database

## Composite Scoring Methodology

The composite calibration score for a cell is a weighted mean of all dimension scores:

```
composite = Σ(weight_i × score_i) / Σ(weight_i)
```

Default weights:
- Timing sync: 1.5 (most critical for TDOA)
- Orientation: 1.2
- Gain balance: 1.0
- Noise floor: 0.8
- Frequency response: 0.8
- Propagation model: 1.3
- Geometric consistency: 1.4

A cell with composite score ≥ 80 is considered well-calibrated. Between 60 and 80 it's operational but degraded. Below 60, the cell's spatial estimates should not be trusted for localization.

## Contribution Weight

Each cell's calibration score determines its contribution weight in the Mesh Consensus Engine:

| Composite Score | Contribution Weight | Effect                          |
|-----------------|--------------------|---------------------------------|
| ≥ 80            | 1.0                | Full vote in MCE consensus      |
| 60–79           | 0.7                | Reduced influence on APF        |
| 40–59           | 0.4                | Minimal influence               |
| < 40            | 0.0                | Cell excluded from consensus    |

This ensures that poorly calibrated cells cannot corrupt the spatial estimates of the broader mesh.

## Calibration Actions

When a dimension score drops below threshold, MeshCal generates a calibration action:

```
Action #1247
  Cell:      RC-042
  Sensor:    sensor-0012
  Dimension: timing_sync
  Kind:      investigate
  Priority:  HIGH
  Description: Node sensor-0012 shows 47 µs offset from cell mean.
               Check GNSS antenna visibility and NTP configuration.
```

Actions are:
- Generated automatically by MeshCal during periodic evaluation
- Presented to operators in the Calibration console view
- Resolved manually (human-in-the-loop) or automatically (if the score recovers)
- Tracked with timestamps for auditability

The human-in-the-loop principle means the system never silently degrades: every calibration issue produces a visible, trackable action that a human must acknowledge or resolve.

## Monitoring Calibration Health

The console Calibration page provides:
- Fleet-wide mean calibration score (single number)
- Cell-by-cell calibration table sorted by composite score (worst first)
- Per-dimension breakdown with colour-coded bars (green ≥ 80, amber 60–80, red < 60)
- Pending action queue with priority sorting
- Historical calibration score trends (time-series charts)

Operators should review calibration health daily. Cells that remain below 60 for more than 48 hours should be scheduled for physical inspection.

## Common Calibration Problems

| Symptom                      | Likely Cause                         | Remediation                   |
|------------------------------|--------------------------------------|-------------------------------|
| Timing score dropping slowly | GNSS antenna obscured (bird nest)    | Inspect antenna, clear obstruction |
| Gain imbalance between nodes | Membrane contamination (dust, water) | Clean acoustic port           |
| Orientation drift            | Mounting loosened by wind/vibration   | Re-tighten mount, verify heading |
| Propagation model unstable   | New building or obstacle constructed | Let WaveGraph re-learn (days) |
| Noise floor rising           | New HVAC unit or machinery nearby    | Adjust noise threshold or relocate |
| Geometric inconsistency      | Post/pole shifted by impact          | Re-survey, update position DB |
| Frequency response degraded  | Microphone ageing or moisture ingress| Replace node or membrane      |
