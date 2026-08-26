# VectorNode X1 Engineering Specification

**Document:** RES-HW-001  
**Revision:** 1.0  
**Date:** 2026-08-25  
**Status:** Draft  
**Classification:** Open

---

## 1. Scope

This specification defines the engineering requirements for the Resonance VectorNode X1, the primary production acoustic sensing instrument for the Resonance spatial acoustic intelligence platform.

The VectorNode X1 is not a microphone. It is a calibrated spatial acoustic instrument that measures pressure, direction, time, phase, frequency, and environment simultaneously while reporting measurement uncertainty for every observation.

---

## 2. Definitions

| Term | Definition |
|------|-----------|
| VectorNode | A Resonance network sensor instrument |
| AOP | Acoustic Overload Point — maximum SPL before >1% THD |
| DOA | Direction of Arrival |
| PPS | Pulse Per Second (GNSS timing reference) |
| TDOA | Time Difference of Arrival |
| APS | Acoustic Probability Surface |
| REP | Resonance Event Protocol |

---

## 3. Normative Terminology

The key words "MUST", "MUST NOT", "SHOULD", "SHOULD NOT", and "MAY" are interpreted per RFC 2119.

---

## 4. Acoustic Front End

### RES-ACOUSTIC-001: Array Channel Count

| Field | Value |
|-------|-------|
| Requirement | Simultaneous synchronized acoustic channels for spatial sensing |
| Target | 12 channels |
| Minimum | 8 channels |
| Measurement | Channel count verification during self-test |
| Validation | All channels active and phase-coherent |

### RES-ACOUSTIC-002: Precision Reference Channel

| Field | Value |
|-------|-------|
| Requirement | Dedicated high-fidelity pressure measurement channel |
| Target | 1 precision condenser/electret reference |
| Minimum | 1 reference channel |
| Measurement | THD+N measurement at 94 dB SPL, 1 kHz |
| Validation | THD+N < -80 dB |

### RES-ACOUSTIC-003: Frequency Range

| Field | Value |
|-------|-------|
| Requirement | Useful acoustic bandwidth |
| Target | 20 Hz – 40 kHz |
| Extended | Up to 80 kHz for research configurations |
| Minimum | 50 Hz – 20 kHz |
| Measurement | Frequency sweep with calibrated source |
| Validation | ±3 dB from 50 Hz to 20 kHz per channel |

### RES-ACOUSTIC-004: Acoustic Overload Point

| Field | Value |
|-------|-------|
| Requirement | Maximum SPL before clipping |
| Target | 135 dB SPL |
| Minimum | 130 dB SPL |
| Measurement | Calibrated high-SPL source, monitor THD |
| Validation | THD < 1% at rated AOP |

### RES-ACOUSTIC-005: Signal-to-Noise Ratio

| Field | Value |
|-------|-------|
| Requirement | Electrical SNR, A-weighted |
| Target | 72 dBA |
| Minimum | 68 dBA |
| Measurement | Quiet chamber, A-weighted noise floor vs ref level |
| Validation | Per-channel measurement |

### RES-ACOUSTIC-006: Channel Matching

| Field | Value |
|-------|-------|
| Requirement | Gain matching between array channels |
| Target | ≤ ±0.5 dB |
| Minimum | ≤ ±1.0 dB |
| Measurement | Identical stimulus, compare per-channel RMS |
| Validation | Post-calibration verification |

### RES-ACOUSTIC-007: ADC Resolution

| Field | Value |
|-------|-------|
| Requirement | Analog-to-digital conversion depth |
| Target | 24-bit |
| Minimum | 24-bit |
| Measurement | SINAD measurement |
| Validation | Effective bits ≥ 18 (ENOB) |

### RES-ACOUSTIC-008: Sample Rate

| Field | Value |
|-------|-------|
| Requirement | Supported acquisition rates |
| Target | 48 / 96 / 192 kHz selectable |
| Minimum | 48 kHz |
| Measurement | Clock accuracy verification |
| Validation | Sample rate within ±5 ppm of nominal |

### RES-ACOUSTIC-009: Simultaneous Sampling

| Field | Value |
|-------|-------|
| Requirement | All channels sampled at the same instant |
| Target | Zero inter-channel skew (shared ADC clock) |
| Minimum | < 100 ns inter-channel skew |
| Measurement | Simultaneous impulse, compare arrival sample |
| Validation | Cross-correlation peak at sample 0 ±1 |

### RES-ACOUSTIC-010: Dual-Gain Path

| Field | Value |
|-------|-------|
| Requirement | Extended dynamic range via parallel gain paths |
| Target | High-gain path (low noise) + Low-gain path (high headroom) |
| Minimum | Single path with AOP ≥ 130 dB SPL |
| Measurement | Measure usable dynamic range across both paths |
| Validation | Combined dynamic range > 120 dB |

### RES-ACOUSTIC-011: Anti-Alias Filtering

| Field | Value |
|-------|-------|
| Requirement | Prevent spectral aliasing |
| Target | -80 dB rejection at Nyquist |
| Minimum | -60 dB rejection |
| Measurement | Sweep above Nyquist, measure aliased energy |
| Validation | No audible aliasing artifacts |

### RES-ACOUSTIC-012: Hardware Timestamping

| Field | Value |
|-------|-------|
| Requirement | Timestamp acquired at ADC, not application layer |
| Target | Hardware counter mapped to GNSS-disciplined clock |
| Minimum | Timestamp latency < 10 µs from true acquisition |
| Measurement | PPS pulse capture timing verification |
| Validation | Timestamp jitter < 1 µs RMS |

---

## 5. Timing Architecture (Chronos)

### RES-TIMING-001: GNSS Constellation Support

| Field | Value |
|-------|-------|
| Requirement | Multi-constellation GNSS for timing and position |
| Target | GPS + Galileo + GLONASS + BeiDou |
| Minimum | GPS + one additional constellation |
| Measurement | Lock and PPS verification |
| Validation | Position fix and PPS stable within 60 seconds |

### RES-TIMING-002: PPS Accuracy

| Field | Value |
|-------|-------|
| Requirement | Pulse-per-second timing accuracy |
| Target | ≤ 15 ns RMS to UTC |
| Minimum | ≤ 100 ns RMS |
| Measurement | Compare against reference clock |
| Validation | 24-hour measurement campaign |

### RES-TIMING-003: Local Oscillator

| Field | Value |
|-------|-------|
| Requirement | Local frequency reference stability |
| Target | TCXO ±0.1 ppm |
| Minimum | TCXO ±0.5 ppm |
| Measurement | Frequency counter measurement |
| Validation | Stability over temperature range |

### RES-TIMING-004: Holdover Performance

| Field | Value |
|-------|-------|
| Requirement | Timing accuracy after GNSS loss |
| Target | ≤ 1 µs drift per hour |
| Minimum | ≤ 10 µs drift per hour |
| Measurement | Remove GNSS antenna, measure drift |
| Validation | 4-hour holdover test |

---

## 6. Environmental Instrumentation (Atmos)

### RES-ATMOS-001: Wind Vector

| Field | Value |
|-------|-------|
| Requirement | 2D wind speed and direction measurement |
| Target | Ultrasonic anemometer, 0–60 m/s, ±0.1 m/s, 360° |
| Minimum | ±0.5 m/s accuracy, 0–40 m/s |
| Measurement | Calibrated wind tunnel comparison |
| Validation | Accuracy across full range |

### RES-ATMOS-002: Temperature

| Field | Value |
|-------|-------|
| Requirement | Ambient air temperature |
| Target | ±0.2°C accuracy, -40 to +60°C range |
| Minimum | ±0.5°C accuracy |
| Measurement | Comparison with reference thermometer |
| Validation | 5-point calibration across range |

### RES-ATMOS-003: Humidity

| Field | Value |
|-------|-------|
| Requirement | Relative humidity measurement |
| Target | ±2% RH accuracy, 0–100% range |
| Minimum | ±5% RH |
| Measurement | Salt solution calibration |
| Validation | 3-point calibration |

### RES-ATMOS-004: Barometric Pressure

| Field | Value |
|-------|-------|
| Requirement | Atmospheric pressure |
| Target | ±0.5 hPa accuracy, 300–1100 hPa |
| Minimum | ±1.0 hPa |
| Measurement | Comparison with reference barometer |
| Validation | Multi-point calibration |

### RES-ATMOS-005: Update Rate

| Field | Value |
|-------|-------|
| Requirement | Environmental measurement refresh |
| Target | Wind: 10 Hz, Temp/RH/Pressure: 1 Hz |
| Minimum | Wind: 4 Hz, Others: 0.5 Hz |
| Measurement | Data rate verification |
| Validation | Consistent reporting at rated frequency |

---

## 7. Compute

### RES-COMPUTE-001: Application Processor

| Field | Value |
|-------|-------|
| Requirement | Main processing unit |
| Target | ARM64, 8-core, 16 GB RAM |
| Minimum | ARM64, 4-core, 8 GB RAM |
| Measurement | Performance benchmarks |
| Validation | Real-time DSP + ML inference without frame drops |

### RES-COMPUTE-002: Neural Processing Unit

| Field | Value |
|-------|-------|
| Requirement | ML inference accelerator |
| Target | ≥ 6 TOPS integrated NPU |
| Minimum | CPU-only inference (degraded) |
| Measurement | ONNX inference benchmark |
| Validation | Classification latency < 50 ms |

### RES-COMPUTE-003: Real-Time Acquisition

| Field | Value |
|-------|-------|
| Requirement | Deterministic audio acquisition separate from application |
| Target | Dedicated MCU or FPGA for sample-accurate capture |
| Minimum | DMA-based acquisition on main CPU with RT priority |
| Measurement | Sample dropout rate under load |
| Validation | Zero dropped samples over 24 hours |

---

## 8. Security

### RES-SEC-001: Hardware Root of Trust

| Field | Value |
|-------|-------|
| Requirement | Secure identity and key storage |
| Target | TPM 2.0 or dedicated secure element |
| Minimum | Software-backed key storage |
| Measurement | Key extraction resistance test |
| Validation | Keys cannot be read via debug interfaces |

### RES-SEC-002: Secure Boot

| Field | Value |
|-------|-------|
| Requirement | Verified boot chain |
| Target | ROM → signed bootloader → signed OS → verified services |
| Minimum | Signed firmware verification |
| Measurement | Attempt boot with modified firmware |
| Validation | Modified firmware is rejected |

### RES-SEC-003: Observation Signing

| Field | Value |
|-------|-------|
| Requirement | Cryptographic attribution of every observation |
| Target | Ed25519 signature on every REP message |
| Minimum | Ed25519 signing |
| Measurement | Verify signature of captured observation |
| Validation | Invalid signatures are rejected by platform |

---

## 9. Power

### RES-POWER-001: Primary Input

| Field | Value |
|-------|-------|
| Requirement | Main power source |
| Target | PoE+ (802.3at, 25.5 W) |
| Minimum | 12-48 VDC input |
| Measurement | Power consumption measurement |
| Validation | Full operation within PoE+ budget |

### RES-POWER-002: Consumption

| Field | Value |
|-------|-------|
| Requirement | Steady-state power draw |
| Target | < 10 W typical |
| Minimum | < 15 W peak |
| Measurement | Power meter at input |
| Validation | 24-hour average < 10 W |

### RES-POWER-003: Battery Backup

| Field | Value |
|-------|-------|
| Requirement | Continued operation during power loss |
| Target | 4–12 hours runtime |
| Minimum | 1 hour runtime |
| Measurement | Discharge test from full |
| Validation | Graceful shutdown before battery depletion |

---

## 10. Mechanical / Enclosure

### RES-MECH-001: Ingress Protection

| Field | Value |
|-------|-------|
| Requirement | Environmental sealing |
| Target | IP67 |
| Minimum | IP66 |
| Measurement | IEC 60529 testing |
| Validation | Certified test report |

### RES-MECH-002: Operating Temperature

| Field | Value |
|-------|-------|
| Requirement | Ambient temperature range |
| Target | -30°C to +60°C |
| Minimum | -20°C to +50°C |
| Measurement | Thermal chamber testing |
| Validation | Full operation across range |

### RES-MECH-003: Acoustic Membrane

| Field | Value |
|-------|-------|
| Requirement | Hydrophobic acoustic-transparent membrane |
| Target | PTFE/ePTFE membrane, replaceable |
| Minimum | Hydrophobic membrane |
| Measurement | Frequency response through membrane |
| Validation | < 1 dB insertion loss 50 Hz–20 kHz |

### RES-MECH-004: Tamper Detection

| Field | Value |
|-------|-------|
| Requirement | Detect enclosure opening |
| Target | Reed switch + accelerometer trigger |
| Minimum | Reed switch on lid |
| Measurement | Open enclosure, verify alert |
| Validation | Alert generated within 1 second |

---

## 11. Network

### RES-NET-001: Primary Connectivity

| Field | Value |
|-------|-------|
| Requirement | Wired network interface |
| Target | Gigabit Ethernet with PoE+ |
| Minimum | 100 Mbps Ethernet |
| Measurement | iperf throughput test |
| Validation | Sustained 500 Mbps+ throughput |

### RES-NET-002: Wireless Backup

| Field | Value |
|-------|-------|
| Requirement | Wireless failover connectivity |
| Target | Wi-Fi 6 + LTE Cat-4 |
| Minimum | Wi-Fi 5 OR LTE |
| Measurement | Failover time measurement |
| Validation | < 5 second failover |

### RES-NET-003: Offline Operation

| Field | Value |
|-------|-------|
| Requirement | Continue detection without connectivity |
| Target | Full local detection + DOA + storage for 72 hours |
| Minimum | Detection + storage for 4 hours |
| Measurement | Remove network, verify local operation |
| Validation | Events queued and replayed on reconnection |

---

## 12. Calibration

### RES-CAL-001: Factory Calibration

| Field | Value |
|-------|-------|
| Requirement | Per-unit calibration before deployment |
| Target | Gain, phase, frequency response, orientation per channel |
| Minimum | Gain calibration per channel |
| Measurement | Controlled acoustic source + reference mic |
| Validation | Calibration manifest signed and stored on device |

### RES-CAL-002: Field Recalibration

| Field | Value |
|-------|-------|
| Requirement | Recalibration without returning to lab |
| Target | Automated ambient-noise self-calibration |
| Minimum | Guided field recalibration procedure |
| Measurement | Pre/post calibration DOA accuracy comparison |
| Validation | DOA accuracy improvement after recalibration |

---

## 13. Revision History

| Rev | Date | Author | Description |
|-----|------|--------|-------------|
| 1.0 | 2026-08-25 | Architecture Team | Initial release |
