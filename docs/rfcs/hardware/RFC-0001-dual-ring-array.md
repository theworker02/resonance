# RFC-0001: Dual-Ring Acoustic Array

- **Status:** Accepted
- **Author:** Resonance Hardware Team
- **Date:** 2025-06-15
- **Supersedes:** None

## Summary

This RFC proposes a dual-ring microphone array geometry for the RN-D1 (Dense Urban) node family. The design uses two concentric rings of MEMS microphones at different heights to provide both azimuth and elevation direction-of-arrival estimation, improving localization accuracy in urban canyon environments.

## Motivation

Single-ring planar arrays provide azimuth estimation but have poor elevation resolution. In dense urban environments, acoustic events may originate at various heights (street level, upper floors, rooftops), and elevation ambiguity leads to localization error when the Acoustic Probability Surface is projected onto 3D geometry.

Additionally, single-ring arrays suffer from front-back ambiguity in certain configurations. A second ring at a different radius and height resolves these ambiguities without requiring node rotation or multi-node triangulation for elevation.

## Design

### Array Geometry

**Upper Ring:**
- 8 MEMS microphones
- Radius: 45mm from center
- Height: 0mm (reference plane)
- Angular spacing: 45° uniform

**Lower Ring:**
- 8 MEMS microphones
- Radius: 30mm from center
- Height: -25mm (below reference plane)
- Angular spacing: 45° uniform, rotated 22.5° from upper ring

**Total:** 16 microphones per node

### Microphone Selection

- Type: MEMS digital (PDM output)
- SNR: ≥65 dB(A)
- Sensitivity: -26 dBFS ±1 dB
- Frequency response: 20 Hz – 20 kHz (±3 dB)
- AOP (Acoustic Overload Point): ≥120 dB SPL

### Direction-of-Arrival Processing

The VectorWave 2 algorithm processes both rings simultaneously:

1. **Intra-ring TDOA:** Time delays between microphones within each ring provide azimuth candidates.
2. **Inter-ring TDOA:** Time delays between corresponding microphones across rings provide elevation.
3. **Ambiguity resolution:** The offset rotation (22.5°) between rings eliminates spatial aliasing below 8 kHz.
4. **Confidence fusion:** Azimuth and elevation estimates are fused with per-axis confidence intervals.

### Spatial Aliasing

The maximum unambiguous frequency for each ring:

- Upper ring (45mm radius): ~3.8 kHz (for 45° spacing)
- Lower ring (30mm radius): ~5.7 kHz
- Combined with rotation offset: ~8 kHz effective unambiguous bandwidth

Gunshot impulses have significant energy below 4 kHz, well within the unambiguous range.

### PCB Layout

Both rings are implemented on a single circular PCB (100mm diameter). The upper ring microphones are on the top layer; the lower ring is on the bottom layer with acoustic ports through a standoff structure. This maintains the 25mm vertical separation.

## Alternatives Considered

### Single Large Ring (32 microphones)
- Provides excellent azimuth resolution but no elevation.
- Higher cost and power consumption.
- Rejected: does not solve the elevation ambiguity problem.

### Spherical Array
- Provides full 3D DOA estimation.
- Requires complex 3D enclosure design.
- Rejected: manufacturing complexity, environmental sealing difficulty, higher cost.

### Stacked Planar Arrays (3+ rings)
- Provides redundancy and potentially better elevation.
- Requires more microphones (24+) and a taller enclosure.
- Rejected: diminishing returns beyond 2 rings for the target frequency range.

### L-shaped Array
- Simple geometry with 3D capability.
- Rejected: asymmetric performance, directional bias, difficult to seal in cylindrical enclosure.

## Impact

- **resonance-edge:** HAL must support 16-channel simultaneous capture. VectorWave 2 replaces VectorWave 1.
- **resonance-signal:** DOA algorithm updated for dual-ring geometry. New inter-ring correlation module.
- **Hardware BOM:** Microphone count increases from 8 to 16. PDM multiplexing requires additional I2S interfaces or TDM.
- **Power budget:** Estimated 15% increase in audio subsystem power. Acceptable within RN-D1 power envelope.
- **Enclosure:** Redesign required for dual acoustic port planes. Cylindrical form factor retained.

## Validation Plan

1. Simulation of array response using synthetic impulse sources at known positions.
2. Prototype PCB fabrication and anechoic chamber testing.
3. Field testing in urban canyon environment (minimum 3 positions, 10 trials each).
4. Comparison against single-ring baseline (azimuth-only) for localization accuracy.

## Open Questions

None remaining — resolved during review.
