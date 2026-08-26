# RSN-R3 Hardware Engineering Specification

**Document ID:** RSN-R3-HW-SPEC  
**Revision:** 1.0  
**Date:** 2025-01-15  
**Status:** Draft  
**Classification:** Internal Engineering  
**Applies To:** Resonance Reference Node R3 (RN-Edge, RN-Precision variants)

---

## 1. Scope

This specification defines the complete hardware requirements for the Resonance Reference Node R3 (RSN-R3), the primary field-deployed sensing unit of the Resonance Phase IV acoustic mesh platform. The RSN-R3 integrates a multi-channel MEMS microphone array, precision GNSS timing, atmospheric environmental sensing, edge compute, and secure networking into a single weatherproof enclosure designed for unattended outdoor deployment.

This document covers the RN-Edge (production standard) and RN-Precision (research-grade) variants. Requirements that differ between variants are annotated with `[Edge]` or `[Precision]` designators. Unless annotated, requirements apply to both variants.

This specification is normative for hardware design, procurement, manufacturing, and acceptance testing. Software and firmware interfaces are defined only to the extent necessary to constrain hardware behavior.

---

## 2. Definitions

| Term | Definition |
|------|-----------|
| AOP | Acoustic Overload Point — the SPL at which THD+N reaches 10% |
| DOA | Direction of Arrival — angular bearing to an acoustic source |
| GNSS | Global Navigation Satellite System |
| MEMS | Micro-Electro-Mechanical Systems |
| PPS | Pulse Per Second — precision timing signal from GNSS receiver |
| REP | Resonance Event Protocol — the system's event reporting protocol |
| SNR | Signal-to-Noise Ratio |
| SPL | Sound Pressure Level |
| TCXO | Temperature-Compensated Crystal Oscillator |
| THD+N | Total Harmonic Distortion plus Noise |
| TDOA | Time Difference of Arrival |
| WaveGraph | Resonance's spatial-temporal event correlation engine |

---

## 3. Normative Terminology

The key words "MUST", "MUST NOT", "REQUIRED", "SHALL", "SHALL NOT", "SHOULD", "SHOULD NOT", "RECOMMENDED", "MAY", and "OPTIONAL" in this document are to be interpreted as described in RFC 2119.

- **MUST** — Absolute requirement. Non-compliance is a blocking defect.
- **SHOULD** — Recommended. Deviation requires documented justification.
- **MAY** — Truly optional. Implementation at designer's discretion.

---

## 4. Acoustic Requirements

### ACOUSTIC-001: Channel Count

| Field | Value |
|-------|-------|
| **Requirement** | The node MUST provide 8 array microphone channels plus 1 precision reference pressure channel for a total of 9 acoustic input channels. |
| **Target Value** | 9 channels (8 array + 1 reference) |
| **Minimum Acceptable** | 8 channels (reference channel MAY be omitted in RN-Edge) |
| **Measurement Method** | Channel enumeration during board-level test; verify independent signal on each channel using swept sine source |
| **Validation Procedure** | Apply 1 kHz tone at 94 dB SPL to each microphone individually; confirm independent digitized signal appears only on expected channel with ≥60 dB isolation between channels |

### ACOUSTIC-002: Useful Frequency Range

| Field | Value |
|-------|-------|
| **Requirement** | The acoustic front-end MUST capture the frequency range 20 Hz to 40 kHz with ≤3 dB variation from the reference sensitivity at 1 kHz. The system SHOULD extend research capability to 80 kHz with ≤6 dB rolloff. |
| **Target Value** | 20 Hz – 80 kHz (-6 dB points) |
| **Minimum Acceptable** | 20 Hz – 40 kHz (-3 dB points) |
| **Measurement Method** | Swept sine measurement in anechoic chamber using calibrated reference loudspeaker (B&K 4192 or equivalent) at 1 m distance |
| **Validation Procedure** | Record frequency sweep 10 Hz–100 kHz at 94 dB SPL nominal. Compute magnitude response. Verify -3 dB points encompass 20 Hz–40 kHz and -6 dB points encompass 20 Hz–80 kHz |

### ACOUSTIC-003: Acoustic Overload Point

| Field | Value |
|-------|-------|
| **Requirement** | Each microphone channel MUST tolerate acoustic input up to the specified AOP without clipping or permanent damage. THD+N MUST remain below 10% at the AOP. |
| **Target Value** | AOP ≥ 135 dB SPL |
| **Minimum Acceptable** | AOP ≥ 130 dB SPL |
| **Measurement Method** | Apply 1 kHz tone at increasing SPL levels using pistonphone or high-output speaker in pressure chamber. Measure THD+N at ADC output. |
| **Validation Procedure** | Ramp SPL from 100 dB to 140 dB in 1 dB steps. Record THD+N at each level. AOP is the level where THD+N first exceeds 10%. Verify AOP ≥ 130 dB SPL on all channels. |

### ACOUSTIC-004: Signal-to-Noise Ratio

| Field | Value |
|-------|-------|
| **Requirement** | Each microphone channel MUST achieve the specified A-weighted SNR measured at 1 kHz, 94 dB SPL reference, with noise measured over 20 Hz–20 kHz bandwidth. |
| **Target Value** | SNR ≥ 72 dBA |
| **Minimum Acceptable** | SNR ≥ 68 dBA |
| **Measurement Method** | Apply 1 kHz tone at 94 dB SPL. Measure signal level. Remove tone, measure A-weighted noise floor over 20 Hz–20 kHz. Compute ratio. |
| **Validation Procedure** | Test each channel in acoustic isolation chamber. SNR = 20*log10(signal_RMS / noise_RMS_A-weighted). All 9 channels MUST meet minimum. 7 of 9 channels SHOULD meet target. |

### ACOUSTIC-005: Sensitivity Matching

| Field | Value |
|-------|-------|
| **Requirement** | Array microphone channels (1-8) MUST be matched in sensitivity to enable accurate TDOA and beamforming computation. |
| **Target Value** | ≤ ±0.5 dB channel-to-channel variation [Precision] |
| **Minimum Acceptable** | ≤ ±1.0 dB channel-to-channel variation [Edge] |
| **Measurement Method** | Apply identical acoustic stimulus (94 dB SPL, 1 kHz) simultaneously to all array channels via pressure coupler. Measure peak deviation from mean. |
| **Validation Procedure** | Record 10-second tone on all channels simultaneously. Compute RMS level per channel. Maximum deviation from group mean MUST be ≤ specified tolerance. Post-calibration residual MUST be ≤ ±0.25 dB. |

### ACOUSTIC-006: Phase Matching

| Field | Value |
|-------|-------|
| **Requirement** | Array channels MUST exhibit matched phase response to preserve spatial information across the operating frequency range. |
| **Target Value** | ≤ 2° phase deviation at 10 kHz between any two channels |
| **Minimum Acceptable** | ≤ 5° phase deviation at 10 kHz between any two channels |
| **Measurement Method** | Simultaneous excitation of all channels with broadband signal via pressure coupler. Compute inter-channel phase difference vs frequency. |
| **Validation Procedure** | Apply MLS or swept sine simultaneously to all channels. Compute transfer function between each channel pair. Phase deviation at 10 kHz MUST be ≤ specified limit. Phase deviation MUST remain ≤ 10° up to 40 kHz. |

### ACOUSTIC-007: Self-Noise Floor

| Field | Value |
|-------|-------|
| **Requirement** | The equivalent input noise of each channel MUST be low enough to detect quiet environmental sounds in rural deployment contexts. |
| **Target Value** | Self-noise ≤ 22 dBA equivalent SPL |
| **Minimum Acceptable** | Self-noise ≤ 26 dBA equivalent SPL |
| **Measurement Method** | Seal microphone in acoustic isolation cavity (<10 dBA ambient). Measure A-weighted output noise power. Convert to equivalent SPL using channel sensitivity. |
| **Validation Procedure** | Record 60 seconds in isolation cavity. Compute A-weighted RMS noise. Convert to dB SPL using calibrated sensitivity. Result MUST be ≤ specified limit on all channels. |

### ACOUSTIC-008: Dynamic Range

| Field | Value |
|-------|-------|
| **Requirement** | The total dynamic range (ratio of AOP to self-noise floor) MUST be sufficient to capture both quiet ambient and impulsive loud events without reconfiguration. The dual-gain analog path MUST extend usable dynamic range beyond single-path limits. |
| **Target Value** | ≥ 113 dB (combined dual-gain path) |
| **Minimum Acceptable** | ≥ 104 dB (single path) |
| **Measurement Method** | Dynamic range = AOP - Self-noise floor. For dual-gain: compute combined dynamic range by merging high-gain (low-noise) and low-gain (high-AOP) paths. |
| **Validation Procedure** | Measure AOP per ACOUSTIC-003. Measure self-noise per ACOUSTIC-007. Verify difference ≥ specified minimum. For dual-gain, verify seamless crossover region with ≤ 1 dB discontinuity. |

### ACOUSTIC-009: Anti-Aliasing Filter

| Field | Value |
|-------|-------|
| **Requirement** | Each analog channel MUST include an anti-aliasing low-pass filter before the ADC. The filter MUST attenuate signals above the Nyquist frequency sufficiently to prevent aliased components from exceeding the noise floor. |
| **Target Value** | ≥ 80 dB attenuation at 1.2× Nyquist frequency |
| **Minimum Acceptable** | ≥ 60 dB attenuation at Nyquist frequency |
| **Measurement Method** | Inject sine sweep from DC to 2× sample rate. Measure filter output magnitude response at ADC input (before sampling). |
| **Validation Procedure** | At each supported sample rate (48/96/192 kHz), verify filter attenuation at Nyquist and 1.2× Nyquist meet specification. Filter passband ripple MUST be ≤ 0.1 dB. |

### ACOUSTIC-010: Dual-Gain Analog Path

| Field | Value |
|-------|-------|
| **Requirement** | Each array channel MUST provide parallel high-gain and low-gain analog signal paths to extend dynamic range. The gain difference MUST be factory-calibrated and stored in the calibration artifact. |
| **Target Value** | Gain separation: 24 dB ± 0.5 dB |
| **Minimum Acceptable** | Gain separation: 20–28 dB with ≤ 1 dB channel-to-channel variation |
| **Measurement Method** | Apply known SPL. Record both paths simultaneously. Compute gain ratio from measured RMS levels. |
| **Validation Procedure** | Apply 94 dB SPL, 1 kHz tone. Record both paths on all channels. Compute gain separation per channel. Verify within specified tolerance. Verify crossover stitching produces ≤ 1 dB amplitude discontinuity in reconstructed signal. |

### ACOUSTIC-011: Microphone Type

| Field | Value |
|-------|-------|
| **Requirement** | Array microphones MUST be bottom-port MEMS type with analog output suitable for direct connection to the dual-gain preamplifier stage. The reference pressure channel MAY use a different microphone type optimized for measurement accuracy. |
| **Target Value** | MEMS analog output, bottom-port, AOP ≥ 135 dB SPL, SNR ≥ 72 dBA |
| **Minimum Acceptable** | MEMS analog output, bottom-port, AOP ≥ 130 dB SPL, SNR ≥ 68 dBA |
| **Measurement Method** | Vendor datasheet verification plus incoming inspection sample testing per ACOUSTIC-003 and ACOUSTIC-004 procedures |
| **Validation Procedure** | Verify incoming lot sample (AQL 1.0) meets specifications for AOP, SNR, sensitivity, and frequency response against vendor datasheet claims |

### ACOUSTIC-012: Crosstalk Isolation

| Field | Value |
|-------|-------|
| **Requirement** | Electrical crosstalk between any two channels within the acquisition system (excluding acoustic coupling through the array structure) MUST be below the specified level. |
| **Target Value** | ≥ 80 dB isolation at 1 kHz between any two channels |
| **Minimum Acceptable** | ≥ 60 dB isolation at 1 kHz between any two channels |
| **Measurement Method** | Cap all microphones except one. Apply electrical test signal to one channel's preamplifier input. Measure output on all other channels. |
| **Validation Procedure** | For each channel, inject 0 dBFS 1 kHz signal at preamplifier input. Measure level on all other channels with capped microphones. Crosstalk = max observed level on any non-driven channel. MUST meet specified minimum isolation. |

---

## 5. Timing Requirements

### TIMING-001: GNSS Constellation Support

| Field | Value |
|-------|-------|
| **Requirement** | The GNSS receiver MUST support simultaneous multi-constellation reception to maximize fix availability in obstructed environments. |
| **Target Value** | GPS + Galileo + GLONASS + BeiDou (quad-constellation) |
| **Minimum Acceptable** | GPS + Galileo (dual-constellation) |
| **Measurement Method** | Verify constellation tracking via NMEA GxGSV messages; confirm satellites from each required constellation appear in fix computation |
| **Validation Procedure** | Deploy unit in open sky. Verify fix uses satellites from all required constellations within 5 minutes of cold start. Verify hot start TTFF ≤ 2 seconds. |

### TIMING-002: PPS Accuracy

| Field | Value |
|-------|-------|
| **Requirement** | The GNSS-derived PPS signal MUST be accurate to UTC within the specified RMS tolerance when the receiver has a valid position fix with PDOP ≤ 3.0. |
| **Target Value** | PPS accuracy ≤ 10 ns RMS to UTC |
| **Minimum Acceptable** | PPS accuracy ≤ 15 ns RMS to UTC |
| **Measurement Method** | Compare GNSS PPS output against cesium/rubidium reference clock using time interval counter (Keysight 53230A or equivalent). Collect ≥1000 samples over 24 hours. |
| **Validation Procedure** | Connect PPS to reference time interval counter. Record PPS-to-reference offset for 24 hours. Compute RMS. Verify ≤ specified tolerance under clear sky conditions with PDOP ≤ 3.0. |

### TIMING-003: Local Oscillator Stability

| Field | Value |
|-------|-------|
| **Requirement** | The local TCXO providing the sample clock reference MUST maintain frequency stability within the specified tolerance over the operating temperature range. |
| **Target Value** | ±0.1 ppm over -30°C to +60°C [Precision] |
| **Minimum Acceptable** | ±0.5 ppm over -30°C to +60°C [Edge] |
| **Measurement Method** | Measure oscillator frequency vs temperature using frequency counter while cycling unit through thermal chamber at 1°C/min |
| **Validation Procedure** | Thermal sweep -30°C to +60°C. Record frequency at 5°C intervals. Compute maximum deviation from nominal. Verify ≤ specified ppm tolerance. |

### TIMING-004: Hardware Timestamp Capture

| Field | Value |
|-------|-------|
| **Requirement** | The PPS rising edge MUST be captured by a hardware timer/counter physically close to the ADC sample clock domain. Software MUST NOT be in the timestamping critical path. |
| **Target Value** | Timestamp capture latency ≤ 10 ns from PPS edge to timestamp latch |
| **Minimum Acceptable** | Timestamp capture latency ≤ 50 ns from PPS edge to timestamp latch |
| **Measurement Method** | Oscilloscope measurement of PPS input and timestamp-valid output signal on dedicated test points |
| **Validation Procedure** | Apply external PPS signal. Measure hardware timestamp latch delay using oscilloscope on designated test points. Verify ≤ specified latency across 100 consecutive PPS edges. |

### TIMING-005: Sample Clock Disciplining

| Field | Value |
|-------|-------|
| **Requirement** | The ADC sample clock MUST be disciplined to the GNSS PPS signal to maintain long-term frequency accuracy. Clock steering MUST be smooth (no phase jumps) with specified maximum slew rate. |
| **Target Value** | Clock frequency accuracy ≤ 1 ppb when disciplined; slew rate ≤ 1 ns/s |
| **Minimum Acceptable** | Clock frequency accuracy ≤ 10 ppb when disciplined; slew rate ≤ 10 ns/s |
| **Measurement Method** | Monitor PPS-to-sample-clock phase offset over time. Compute frequency offset from phase drift rate. |
| **Validation Procedure** | Allow system to lock to GNSS. Monitor PPS-to-ADC-frame phase alignment for 1 hour. Verify phase error remains within ±50 ns after initial lock. Verify no phase discontinuities > 1 ns between consecutive seconds. |

### TIMING-006: Holdover Performance

| Field | Value |
|-------|-------|
| **Requirement** | When GNSS is unavailable, the local oscillator MUST maintain sufficient accuracy for TDOA correlation between nodes within the same spatial cell. |
| **Target Value** | ≤ 0.5 µs drift per hour of holdover |
| **Minimum Acceptable** | ≤ 1 µs drift per hour of holdover |
| **Measurement Method** | Establish disciplined lock. Remove GNSS antenna. Measure accumulated time error vs reference clock over holdover duration. |
| **Validation Procedure** | Lock to GNSS for ≥ 30 minutes. Disconnect antenna. Monitor time error accumulation for 4 hours. Verify drift rate ≤ specified limit. Verify system reports holdover status and estimated uncertainty. |

---

## 6. Environmental Sensing

### ENV-001: Wind Vector Measurement

| Field | Value |
|-------|-------|
| **Requirement** | The node MUST measure 2D horizontal wind speed and direction using an ultrasonic anemometer with no moving parts. |
| **Target Value** | Range: 0–60 m/s, resolution: 0.01 m/s speed / 0.1° direction, accuracy: ±0.3 m/s or ±2% (whichever greater) |
| **Minimum Acceptable** | Range: 0–45 m/s, resolution: 0.1 m/s speed / 1° direction, accuracy: ±0.5 m/s or ±3% |
| **Measurement Method** | Wind tunnel calibration against certified cup anemometer and wind vane reference |
| **Validation Procedure** | Test in calibrated wind tunnel at 0, 5, 10, 20, 40, 60 m/s from 8 compass directions. Verify accuracy at each point. Verify 10 Hz update rate under all conditions. |

### ENV-002: Temperature Measurement

| Field | Value |
|-------|-------|
| **Requirement** | The node MUST measure ambient air temperature for speed-of-sound computation and environmental context. The sensor MUST be radiation-shielded. |
| **Target Value** | Range: -40°C to +80°C, accuracy: ±0.2°C, resolution: 0.01°C |
| **Minimum Acceptable** | Range: -30°C to +60°C, accuracy: ±0.5°C, resolution: 0.1°C |
| **Measurement Method** | Comparison against NIST-traceable reference thermometer in temperature-controlled chamber |
| **Validation Procedure** | Place in thermal chamber. Step through -40, -20, 0, 20, 40, 60, 80°C. Hold each for 30 min. Compare reading to reference. Verify ≤ specified accuracy at all points. |

### ENV-003: Humidity Measurement

| Field | Value |
|-------|-------|
| **Requirement** | The node MUST measure relative humidity for acoustic propagation correction and condensation risk assessment. |
| **Target Value** | Range: 0–100% RH, accuracy: ±1.5% RH (20–80% range), resolution: 0.1% |
| **Minimum Acceptable** | Range: 0–100% RH, accuracy: ±2% RH (10–90% range), resolution: 1% |
| **Measurement Method** | Comparison against chilled-mirror hygrometer reference in humidity chamber |
| **Validation Procedure** | Humidity chamber sweep: 10%, 25%, 50%, 75%, 90% RH at 25°C. Hold each for 20 min. Compare to reference. Verify ≤ specified accuracy. |

### ENV-004: Barometric Pressure Measurement

| Field | Value |
|-------|-------|
| **Requirement** | The node MUST measure atmospheric pressure for altitude estimation and acoustic propagation modeling. |
| **Target Value** | Range: 300–1100 hPa, accuracy: ±0.3 hPa, resolution: 0.01 hPa |
| **Minimum Acceptable** | Range: 300–1100 hPa, accuracy: ±0.5 hPa, resolution: 0.1 hPa |
| **Measurement Method** | Comparison against NIST-traceable barometric reference at multiple altitudes (pressure chamber) |
| **Validation Procedure** | Pressure chamber sweep: 300, 500, 700, 900, 1013, 1100 hPa. Compare to reference. Verify ≤ specified accuracy at each point. Verify stable reading (σ ≤ 0.05 hPa over 60 s). |

### ENV-005: Precipitation Detection

| Field | Value |
|-------|-------|
| **Requirement** | The node SHOULD include optional precipitation detection to flag periods of degraded acoustic measurement quality. |
| **Target Value** | Binary rain/no-rain detection with onset latency ≤ 30 seconds; optional intensity estimation (light/moderate/heavy) |
| **Minimum Acceptable** | Binary rain detection with onset latency ≤ 60 seconds |
| **Measurement Method** | Controlled spray test at calibrated precipitation rates (2, 10, 50 mm/hr) |
| **Validation Procedure** | Apply controlled spray at specified rates. Verify detection within onset latency. Verify no false positives during 1-hour dry period. Verify intensity classification if implemented. |

---

## 7. Compute Requirements

### COMPUTE-001: Processor

| Field | Value |
|-------|-------|
| **Requirement** | The node MUST provide sufficient compute for real-time acoustic feature extraction, DOA computation, event classification, and network services. |
| **Target Value** | ARM64 8-core, 2.0+ GHz, 16 GB LPDDR4X RAM |
| **Minimum Acceptable** | ARM64 4-core, 1.5+ GHz, 8 GB LPDDR4 RAM |
| **Measurement Method** | Benchmark: simultaneous 8-channel feature extraction at 192 kHz + DOA + classification with ≤ 50% CPU utilization |
| **Validation Procedure** | Run full detection pipeline on 8 channels at max sample rate. Monitor CPU utilization over 1 hour. Verify ≤ 50% sustained, ≤ 80% peak. Verify no frame drops. |

### COMPUTE-002: Storage

| Field | Value |
|-------|-------|
| **Requirement** | The node MUST provide local storage for firmware, models, configuration, calibration artifacts, and offline event cache. |
| **Target Value** | 128 GB NVMe/eMMC, industrial temperature grade, with wear leveling |
| **Minimum Acceptable** | 64 GB eMMC, industrial temperature grade |
| **Measurement Method** | Storage capacity verification; sequential and random I/O benchmarks |
| **Validation Procedure** | Verify usable capacity ≥ specified minimum. Verify sequential write ≥ 200 MB/s. Verify random 4K write ≥ 20 MB/s. Verify rated endurance ≥ 600 TBW (128 GB) or ≥ 300 TBW (64 GB). |

### COMPUTE-003: Neural Processing Unit

| Field | Value |
|-------|-------|
| **Requirement** | The node SHOULD include a hardware neural accelerator for inference workloads (event classification, source separation). |
| **Target Value** | NPU ≥ 6 TOPS INT8, supporting ONNX and TFLite models |
| **Minimum Acceptable** | NPU ≥ 2 TOPS INT8 or GPU compute equivalent |
| **Measurement Method** | Standard inference benchmark using reference classification model (ResNet-50 equivalent complexity) |
| **Validation Procedure** | Deploy reference model. Measure inference latency and throughput. Verify ≥ specified TOPS rating on standard INT8 workload. Verify inference latency ≤ 10 ms for classification model. |

### COMPUTE-004: Real-Time Acquisition Subsystem

| Field | Value |
|-------|-------|
| **Requirement** | The node MAY include a dedicated FPGA or MCU for deterministic, real-time audio acquisition independent of the main application processor's operating system scheduling. |
| **Target Value** | Dedicated acquisition MCU (Cortex-M7 or FPGA) handling ADC control, DMA, hardware timestamping, and PPS capture |
| **Minimum Acceptable** | Acquisition managed by main processor with RT-priority kernel thread and hardware DMA |
| **Measurement Method** | Measure worst-case jitter between ADC sample clock edges and between PPS capture events over 24-hour period |
| **Validation Procedure** | Monitor acquisition timing jitter for 24 hours under full system load. Verify worst-case inter-sample jitter ≤ 100 ns. Verify no missed samples or DMA underruns. |

---

## 8. Power Requirements

### POWER-001: PoE+ Input

| Field | Value |
|-------|-------|
| **Requirement** | The node MUST accept Power over Ethernet per IEEE 802.3at (PoE+) as the primary power source for infrastructure deployments. |
| **Target Value** | IEEE 802.3at Type 2 (25.5W available), Class 4 |
| **Minimum Acceptable** | IEEE 802.3at Type 2 (25.5W available) |
| **Measurement Method** | Verify correct PD handshake with compliant PSE. Measure power draw under load. |
| **Validation Procedure** | Connect to certified 802.3at PSE. Verify handshake completes. Verify stable operation at full load (12W). Verify no brownout under peak load (15W). Verify graceful behavior if PSE power-cycles. |

### POWER-002: DC Input

| Field | Value |
|-------|-------|
| **Requirement** | The node MUST accept an external DC power input for solar/battery and bench-power applications. |
| **Target Value** | 9–36 VDC input range, reverse polarity protected, transient protected to IEC 61000-4-5 |
| **Minimum Acceptable** | 12–28 VDC input range, reverse polarity protected |
| **Measurement Method** | Apply DC at range extremes. Verify regulation and operation. Apply reverse polarity; verify no damage. |
| **Validation Procedure** | Operate at 9V, 12V, 24V, 36V. Verify stable operation at each voltage. Apply -36V for 60 seconds; verify no damage and normal operation on correct polarity. Apply 1 kV surge per IEC 61000-4-5; verify survival. |

### POWER-003: Battery Backup

| Field | Value |
|-------|-------|
| **Requirement** | The node MUST support internal or external battery backup to maintain operation during power interruptions and for off-grid deployments. |
| **Target Value** | LiFePO4 cells, 12-hour runtime at typical load (8W), integrated BMS with cell balancing |
| **Minimum Acceptable** | LiFePO4 cells, 4-hour runtime at typical load (8W), basic BMS with over-discharge protection |
| **Measurement Method** | Fully charge battery. Run node at typical load until graceful shutdown. Measure runtime. |
| **Validation Procedure** | Charge to 100%. Run standard workload. Verify runtime ≥ specified minimum. Verify graceful shutdown initiates at ≤ 10% remaining. Verify no data loss during shutdown sequence. Verify battery health reporting accuracy ±5%. |

### POWER-004: Power Budget

| Field | Value |
|-------|-------|
| **Requirement** | The total system power consumption MUST remain within the PoE+ budget under all operating conditions. |
| **Target Value** | Typical: 8W, Peak: 12W, Sleep: 2W |
| **Minimum Acceptable** | Typical: ≤ 12W, Peak: ≤ 20W, Sleep: ≤ 4W |
| **Measurement Method** | High-resolution power analyzer (Keysight N6705C or equivalent) measuring input power during defined workload scenarios |
| **Validation Procedure** | Measure power during: idle (no events), typical (10 events/min), peak (continuous acquisition + classification + transmission), and sleep modes. Verify all ≤ specified limits. |

### POWER-005: Power Domain Isolation

| Field | Value |
|-------|-------|
| **Requirement** | The power subsystem MUST provide isolated power domains for analog (microphone bias, preamplifiers), digital (processor, memory, storage), RF (GNSS, Wi-Fi, cellular), and acoustic front-end to minimize noise coupling. |
| **Target Value** | ≥ 60 dB isolation between analog and digital power rails at frequencies 20 Hz–200 kHz |
| **Minimum Acceptable** | ≥ 40 dB isolation between analog and digital power rails at 1 kHz |
| **Measurement Method** | Inject test signal on digital power rail. Measure coupling to analog power rail using spectrum analyzer. |
| **Validation Procedure** | Inject broadband noise (white, -20 dBm) on digital power rail. Measure coupled signal on analog rail across 20 Hz–200 kHz. Verify isolation ≥ specified limit at all frequencies. |

---

## 9. Security Requirements

### SEC-001: Trusted Platform Module

| Field | Value |
|-------|-------|
| **Requirement** | The node MUST include a hardware root of trust for secure key storage, attestation, and measured boot. |
| **Target Value** | TPM 2.0 discrete IC (Infineon SLB9670 or equivalent), SPI interface |
| **Minimum Acceptable** | Secure Element (ATECC608B or equivalent) with hardware key storage and ECDSA signing |
| **Measurement Method** | Verify TPM presence via TCG-defined discovery. Verify key generation and attestation operations. |
| **Validation Procedure** | Generate EK and AK. Perform platform attestation. Verify PCR extension during boot. Verify sealed data cannot be unsealed after firmware modification. Verify key operations complete within 500 ms. |

### SEC-002: Secure Boot Chain

| Field | Value |
|-------|-------|
| **Requirement** | The node MUST implement a complete secure boot chain from hardware root of trust through bootloader, kernel, and application firmware. |
| **Target Value** | Full measured boot with PCR extension at each stage; boot halts on any verification failure |
| **Minimum Acceptable** | Verified boot: signed bootloader verifies signed kernel; kernel verifies signed root filesystem |
| **Measurement Method** | Attempt boot with modified firmware images. Verify boot halts or reports tamper. |
| **Validation Procedure** | Flash unmodified firmware: verify normal boot. Modify bootloader: verify boot halt. Modify kernel: verify boot halt. Modify rootfs: verify boot halt or tamper alert. Verify PCR values match expected measurements. |

### SEC-003: Secure Storage

| Field | Value |
|-------|-------|
| **Requirement** | All persistent storage MUST be encrypted at rest using keys bound to the hardware identity. |
| **Target Value** | AES-256-XTS full disk encryption with TPM-sealed key |
| **Minimum Acceptable** | AES-128-XTS encryption with hardware-bound key |
| **Measurement Method** | Remove storage media. Attempt offline data extraction. Verify data is unreadable without TPM. |
| **Validation Procedure** | Extract eMMC/NVMe module. Connect to external reader. Verify all user-data partitions are encrypted and unreadable. Re-insert in original board; verify normal operation. Insert in different board; verify data remains inaccessible. |

### SEC-004: Hardware Tamper Detection

| Field | Value |
|-------|-------|
| **Requirement** | The node MUST detect physical enclosure intrusion and report tamper events. |
| **Target Value** | Reed switch on lid + accelerometer tamper detection; tamper event logged with timestamp and reported within 1 second of connectivity |
| **Minimum Acceptable** | Reed switch on lid; tamper event logged with timestamp |
| **Measurement Method** | Open enclosure. Verify tamper event generated and logged with correct timestamp. |
| **Validation Procedure** | With system running: open lid. Verify tamper event generated within 100 ms. Verify event includes timestamp, event type, and is cryptographically signed. Verify event persists across reboot. Verify event transmitted to management plane on next connection. |

### SEC-005: Debug Port Protection

| Field | Value |
|-------|-------|
| **Requirement** | Hardware debug interfaces (JTAG, UART console, SWD) MUST be disabled or access-controlled in production firmware. |
| **Target Value** | JTAG fused closed in production; UART requires authenticated session; SWD disabled |
| **Minimum Acceptable** | UART requires physical presence (internal connector only) and authentication |
| **Measurement Method** | Attempt JTAG/SWD connection with standard debug probe. Attempt UART access without credentials. |
| **Validation Procedure** | Connect JTAG probe: verify no response. Connect SWD: verify no response. Connect UART: verify authentication prompt. Attempt default credentials: verify rejection. Verify authorized access still functional for field service. |

### SEC-006: Firmware Update Authentication

| Field | Value |
|-------|-------|
| **Requirement** | Firmware updates MUST be cryptographically signed and verified before installation. Rollback protection MUST prevent installation of older vulnerable firmware. |
| **Target Value** | Ed25519 signature verification; monotonic anti-rollback counter in OTP/TPM; A/B partition scheme for atomic updates |
| **Minimum Acceptable** | RSA-2048 or ECDSA-P256 signature verification; version-based rollback prevention |
| **Measurement Method** | Attempt to install unsigned firmware. Attempt to install older signed firmware. |
| **Validation Procedure** | Push unsigned update: verify rejection. Push correctly signed update: verify installation and normal boot. Push older signed version: verify rollback rejection. Verify A/B failover: interrupt update mid-write, verify boot to previous good partition. |

---

## 10. Mechanical Requirements

### MECH-001: Ingress Protection

| Field | Value |
|-------|-------|
| **Requirement** | The enclosure MUST achieve IP67 rating per IEC 60529 to survive outdoor deployment including driving rain, snow, and temporary submersion. |
| **Target Value** | IP67 (dust-tight, 1m submersion for 30 min) |
| **Minimum Acceptable** | IP67 |
| **Measurement Method** | IEC 60529 test procedures: dust test (8 hours, 2 kPa underpressure) and immersion test (1 m depth, 30 min) |
| **Validation Procedure** | Submit 3 units to accredited test lab. Perform IEC 60529 dust and immersion tests. Verify no water ingress. Verify continued normal operation post-test. |

### MECH-002: Material

| Field | Value |
|-------|-------|
| **Requirement** | The primary enclosure body MUST be machined or cast from corrosion-resistant aluminum alloy with anodized surface treatment for durability and thermal conductivity. |
| **Target Value** | 6061-T6 aluminum, Type III hard anodize (50 µm), RAL 7016 anthracite gray color |
| **Minimum Acceptable** | 6061-T6 aluminum, Type II anodize (25 µm), gray or black |
| **Measurement Method** | Material certification (mill cert). Anodize thickness measurement (eddy current). Salt spray test (ASTM B117, 500 hours). |
| **Validation Procedure** | Verify material cert matches 6061-T6. Measure anodize thickness at 5 points: verify ≥ specified minimum. Salt spray test: verify no base metal corrosion after 500 hours. |

### MECH-003: Operating Temperature

| Field | Value |
|-------|-------|
| **Requirement** | The node MUST operate continuously within specification over the stated temperature range without derating or thermal shutdown. |
| **Target Value** | -30°C to +60°C continuous operation |
| **Minimum Acceptable** | -20°C to +50°C continuous operation |
| **Measurement Method** | Thermal chamber testing at range extremes under full electrical load for 72 hours |
| **Validation Procedure** | Operate at -30°C for 72 hours under full load: verify all specifications met. Operate at +60°C for 72 hours under full load: verify no thermal shutdown and all specifications met. Verify startup from -40°C cold soak. |

### MECH-004: Dimensions

| Field | Value |
|-------|-------|
| **Requirement** | The enclosure dimensions MUST accommodate all internal assemblies while remaining compact for unobtrusive mounting. |
| **Target Value** | 220 × 170 × 90 mm (L × W × H), excluding mounting hardware and cable glands |
| **Minimum Acceptable** | 250 × 200 × 110 mm maximum outer dimensions |
| **Measurement Method** | Caliper/CMM measurement of production unit |
| **Validation Procedure** | Measure 5 production units. Verify all within ±1 mm of specified dimensions. Verify internal assembly clearance ≥ 2 mm on all sides. |

### MECH-005: Weight

| Field | Value |
|-------|-------|
| **Requirement** | The assembled node weight MUST be compatible with single-person installation on poles and walls without special lifting equipment. |
| **Target Value** | ≤ 2.0 kg (without battery); ≤ 2.5 kg (with internal battery) |
| **Minimum Acceptable** | ≤ 2.5 kg (without battery); ≤ 3.5 kg (with internal battery) |
| **Measurement Method** | Calibrated scale measurement of fully assembled production unit |
| **Validation Procedure** | Weigh 5 production units in each configuration (with/without battery). Verify mean ≤ target and maximum ≤ minimum acceptable. |

### MECH-006: Mounting

| Field | Value |
|-------|-------|
| **Requirement** | The enclosure MUST support multiple mounting configurations without modification to the enclosure body. |
| **Target Value** | Pole mount (Ø50–100mm), wall mount, DIN rail mount, tripod mount (1/4"-20 and 3/8"-16) |
| **Minimum Acceptable** | Pole mount (Ø50–80mm) and wall mount |
| **Measurement Method** | Fit-check with each mount type. Load test at 5× unit weight for 24 hours. |
| **Validation Procedure** | Install on each mount type. Apply 5× weight (12.5 kg) vertical and 2× weight horizontal for 24 hours. Verify no slip, deformation, or loosening. Verify mount hardware survives 50 install/remove cycles without thread damage. |

### MECH-007: Acoustic Membrane

| Field | Value |
|-------|-------|
| **Requirement** | Microphone ports MUST be protected by a hydrophobic acoustic membrane that prevents water and dust ingress while maintaining acoustic transparency. |
| **Target Value** | PTFE membrane (Gore-Tex equivalent), insertion loss ≤ 1 dB at 10 kHz, ≤ 3 dB at 40 kHz, IP67 waterproof |
| **Minimum Acceptable** | PTFE membrane, insertion loss ≤ 2 dB at 10 kHz, ≤ 6 dB at 40 kHz, IP67 waterproof |
| **Measurement Method** | Measure frequency response with and without membrane installed using calibrated source. Difference = insertion loss. |
| **Validation Procedure** | Install membrane. Measure insertion loss at 1, 5, 10, 20, 40 kHz. Verify ≤ specified limits. Perform water spray test at each port for 5 minutes at 100 L/m²·h: verify no water reaches microphone. |

### MECH-008: Wind Noise Reduction

| Field | Value |
|-------|-------|
| **Requirement** | The enclosure design MUST incorporate wind noise reduction features to maintain acoustic measurement quality in outdoor environments. |
| **Target Value** | Wind noise reduction ≥ 15 dB at 10 m/s wind speed relative to unprotected microphone |
| **Minimum Acceptable** | Wind noise reduction ≥ 10 dB at 10 m/s wind speed relative to unprotected microphone |
| **Measurement Method** | Wind tunnel measurement: compare noise floor with and without wind hood at specified wind speeds |
| **Validation Procedure** | Wind tunnel test at 5, 10, 20, 30 m/s. Measure A-weighted noise floor with reference microphone (with and without wind hood). Verify noise reduction ≥ specified limit at 10 m/s. Verify acoustic signal attenuation from wind hood ≤ 2 dB at 1 kHz. |

---

## 11. Network Requirements

### NET-001: Primary Ethernet

| Field | Value |
|-------|-------|
| **Requirement** | The node MUST provide Gigabit Ethernet as the primary network interface for data and power (PoE+) delivery. |
| **Target Value** | IEEE 802.3ab Gigabit Ethernet, auto-MDIX, industrial temperature rated RJ45 with IP67 cable gland |
| **Minimum Acceptable** | IEEE 802.3ab Gigabit Ethernet with IP67 cable gland |
| **Measurement Method** | iperf3 throughput test; verify line rate. BER test: verify ≤ 10⁻¹² over 24 hours. |
| **Validation Procedure** | Connect to Gigabit switch. Run iperf3: verify ≥ 940 Mbps TCP throughput. Run overnight BER test: verify zero frame errors. Verify PoE+ negotiation concurrent with data. |

### NET-002: Wi-Fi

| Field | Value |
|-------|-------|
| **Requirement** | The node MUST provide Wi-Fi connectivity as a secondary network path and for initial configuration/commissioning. |
| **Target Value** | Wi-Fi 6 (802.11ax), 2.4 GHz and 5 GHz bands, internal antenna, WPA3 |
| **Minimum Acceptable** | Wi-Fi 5 (802.11ac), 5 GHz, internal antenna, WPA2 |
| **Measurement Method** | Throughput and range test in controlled RF environment |
| **Validation Procedure** | Associate with WPA3 AP. Verify throughput ≥ 100 Mbps at 5 m. Verify connectivity maintained at 30 m line-of-sight. Verify roaming between APs with ≤ 100 ms disruption. |

### NET-003: Cellular

| Field | Value |
|-------|-------|
| **Requirement** | The node SHOULD provide cellular connectivity for deployments without wired infrastructure. |
| **Target Value** | LTE Cat-6 / 5G NR (sub-6 GHz), embedded SIM (eSIM) support, external antenna port |
| **Minimum Acceptable** | LTE Cat-4, nano-SIM, external antenna port |
| **Measurement Method** | Carrier certification testing; field throughput measurement |
| **Validation Procedure** | Insert SIM. Verify registration and data connectivity. Verify throughput ≥ 10 Mbps downlink. Verify automatic fallback from 5G to LTE. Verify operation continues during cell handover. |

### NET-004: Network Failover

| Field | Value |
|-------|-------|
| **Requirement** | The node MUST automatically failover between available network interfaces upon primary link failure without data loss. |
| **Target Value** | Failover time ≤ 5 seconds; zero event data loss during failover (buffered) |
| **Minimum Acceptable** | Failover time ≤ 30 seconds; event buffer retains data during transition |
| **Measurement Method** | Disconnect primary interface under load. Measure time to restore connectivity on secondary. Verify no events lost. |
| **Validation Procedure** | Establish primary (Ethernet) connection. Begin event stream. Disconnect Ethernet. Verify Wi-Fi connectivity within specified time. Verify all events buffered during transition are delivered after failover. Reconnect Ethernet: verify automatic failback within 30 seconds. |

---

## 12. Interfaces

### 12.1 External Physical Interfaces

| Interface | Connector | Protocol | Notes |
|-----------|-----------|----------|-------|
| Ethernet + PoE | IP67 RJ45 | 802.3ab + 802.3at | Primary data + power |
| DC Power | IP67 2-pin circular | 9-36 VDC | Solar/battery input |
| Cellular Antenna | SMA female | 50Ω coaxial | External LTE/5G antenna |
| GNSS Antenna | SMA female | 50Ω coaxial | Active antenna, 3.3V bias |
| Service Port | IP67 USB-C | USB 3.0 | Field service, firmware recovery |
| Ground Lug | M6 stud | Protective earth | Chassis ground bonding |

### 12.2 Internal Interfaces

| Interface | Bus | Speed | Purpose |
|-----------|-----|-------|---------|
| ADC ↔ SoC | TDM/I2S over PCIe or SPI | 192 kHz × 9ch × 24-bit × 2-gain | Audio data |
| GNSS ↔ SoC | UART + PPS GPIO | 115200 baud + 1 PPS | Time and position |
| TPM ↔ SoC | SPI | 24 MHz | Security operations |
| Atmos ↔ SoC | UART or I2C | 115200 / 400 kHz | Environmental data |
| Storage ↔ SoC | PCIe Gen3 ×2 or eMMC HS400 | 2 GB/s or 400 MB/s | Persistent storage |
| Tamper ↔ SoC | GPIO interrupt | N/A | Enclosure intrusion |

### 12.3 Software/Firmware Interfaces

| Interface | Format | Update Rate | Description |
|-----------|--------|-------------|-------------|
| Audio Stream | PCM frames, 24-bit signed | Per sample rate | Raw audio data to processing pipeline |
| Timing Data | `{system_time, gnss_time, clock_error, clock_drift, pps_age}` | 1 Hz | Clock state to all subsystems |
| Atmos Data | `{wind_speed, wind_dir, temperature, humidity, pressure, speed_of_sound}` | 10 Hz wind, 1 Hz others | Environmental to WaveGraph |
| Event Reports | REP protocol messages | On detection | Outbound events |
| Telemetry | `{battery_pct, health, remaining_runtime, charge_state, temperatures, ...}` | 0.1 Hz | System health |

---

## 13. Tolerances

### 13.1 Manufacturing Tolerances

| Parameter | Tolerance | Notes |
|-----------|-----------|-------|
| Microphone position (array) | ±0.25 mm | Critical for DOA accuracy |
| Enclosure machining | ±0.1 mm | Standard CNC tolerance |
| PCB fabrication | IPC Class 2 | Per IPC-6012 |
| Component placement | IPC Class 2 | Per IPC-A-610 |
| Impedance control (analog) | ±10% | Controlled impedance traces |
| Impedance control (RF) | ±5% | 50Ω transmission lines |

### 13.2 Electrical Tolerances

| Parameter | Tolerance | Notes |
|-----------|-----------|-------|
| Power supply voltage regulation | ±2% | All internal rails |
| Reference voltage (ADC) | ±0.1% | Critical for accuracy |
| Clock frequency (TCXO) | Per TIMING-003 | Temperature-dependent |
| Analog gain matching | Per ACOUSTIC-010 | Factory calibrated |

---

## 14. Calibration

### 14.1 Factory Calibration

Every unit MUST undergo factory calibration before shipment. The factory calibration procedure MUST measure and record:

1. Per-channel absolute sensitivity (dBV/Pa) at 1 kHz, 94 dB SPL
2. Per-channel frequency response (20 Hz – 40 kHz, 1/3-octave resolution)
3. Per-channel noise floor (A-weighted)
4. Inter-channel gain matching
5. Inter-channel phase matching (100 Hz – 20 kHz)
6. Dual-gain path gain separation per channel
7. ADC offset and gain error per channel
8. TCXO frequency at 25°C
9. Temperature sensor offset calibration
10. Pressure sensor offset calibration

### 14.2 Calibration Artifact

Factory calibration results MUST be stored in a `calibration.json` artifact that is:
- Cryptographically signed by the factory calibration system
- Bound to the device hardware identity (serial number + TPM EK hash)
- Stored both on-device (in secure partition) and in the Resonance calibration database
- Machine-readable with schema version for forward compatibility

### 14.3 Field Recalibration

Field recalibration MUST be triggered when:
- Calibration validity period (12 months) expires
- Temperature coefficient check shows ≥ 1 dB deviation from expected
- Self-test detects channel anomaly
- Maintenance personnel explicitly request recalibration
- Acoustic membrane replacement occurs

---

## 15. Failure Behavior

### 15.1 Failure Modes and Responses

| Failure Mode | Detection | Response | Recovery |
|--------------|-----------|----------|----------|
| Single channel failure | Self-test, noise floor check | Exclude channel from array processing; report degraded | Automatic retry on next self-test cycle |
| GNSS loss | PPS timeout > 5 s | Enter holdover; report timing uncertainty | Automatic reacquisition |
| Network loss (all interfaces) | Link monitoring | Continue detection; buffer events locally | Auto-reconnect with exponential backoff |
| Over-temperature | Thermal sensor > 65°C | Reduce sample rate; disable NPU | Resume normal operation when T < 60°C |
| Under-voltage | Battery monitor < 10% | Initiate graceful shutdown | Resume on power restoration |
| Storage failure | I/O errors, SMART | Switch to RAM-only operation; alert | Requires service intervention |
| Tamper detected | Reed switch, accelerometer | Log event; optionally zeroize keys | Requires authorized re-commissioning |
| Calibration expired | Clock comparison to cal date | Continue operation with warning flag | Field recalibration or waiver |

### 15.2 Graceful Degradation

The node MUST continue to provide useful functionality under partial hardware failure:
- Loss of 1-2 array channels: DOA still possible with reduced accuracy (report uncertainty increase)
- Loss of GNSS: local timing holdover maintains TDOA capability for hours
- Loss of network: local detection and caching continues indefinitely (limited by storage)
- Loss of environmental sensors: revert to default propagation model with wider uncertainty bounds
- Loss of NPU: fall back to CPU-based inference with reduced throughput

---

## 16. Test Methodology

### 16.1 Test Levels

| Level | Scope | When | Equipment |
|-------|-------|------|-----------|
| Component | Individual IC/sensor | Incoming inspection | Bench instruments |
| Board | Assembled PCB | Post-SMT, pre-enclosure | Bed-of-nails, functional test jig |
| Unit | Complete node in enclosure | Post-assembly | Acoustic test chamber, calibration fixture |
| Integration | Node in spatial cell | Post-deployment | Reference nodes, calibrated sources |
| Environmental | Unit under stress | Design validation (DVT) | Thermal chamber, vibration table, IP test |

### 16.2 Test Equipment Requirements

- Anechoic chamber (free-field above 200 Hz, hemi-anechoic acceptable)
- Calibrated reference microphone (B&K 4192 or equivalent, Class 1)
- Pistonphone (94 dB SPL, 250 Hz) for sensitivity calibration
- High-output speaker capable of 130+ dB SPL at 1 m
- Function generator with frequency sweep capability (10 Hz – 100 kHz)
- Time interval counter (resolution ≤ 1 ns)
- Cesium or rubidium frequency reference
- Thermal chamber (-40°C to +85°C)
- Wind tunnel (0–60 m/s, laminar flow section ≥ 0.5 m²)
- Calibrated power analyzer (resolution ≤ 1 mW)
- Network analyzer / iperf test infrastructure

### 16.3 Sample Sizes

| Test Type | Sample Size | Criteria |
|-----------|-------------|----------|
| Design Validation (DVT) | 10 units | 100% pass all requirements |
| Production Validation (PVT) | 30 units | 100% pass all requirements |
| Production (ongoing) | 100% functional test | Per acceptance criteria |
| Environmental qualification | 5 units | 100% pass, post-stress functional |

---

## 17. Acceptance Criteria

### 17.1 Unit Acceptance (Production)

A unit MUST pass all of the following before shipment:

1. All 9 acoustic channels respond to stimulus with correct sensitivity (±3 dB of nominal)
2. SNR ≥ 68 dBA on all channels
3. Channel matching ≤ ±1 dB (≤ ±0.5 dB for Precision variant)
4. GNSS acquires fix within 60 seconds (cold start, open sky)
5. PPS present and stable (jitter ≤ 100 ns over 10 consecutive pulses)
6. All environmental sensors report within specified accuracy
7. Network interfaces (Ethernet, Wi-Fi) functional
8. Secure boot chain verified
9. TPM attestation successful
10. Enclosure IP67 spot-check (1 per production lot, min 1 per week)
11. Calibration artifact generated and signed
12. Self-test passes with zero faults reported

### 17.2 Lot Acceptance

Each production lot (≤ 50 units) MUST include:
- 100% functional test per 17.1
- 2% (minimum 1) units subjected to full environmental qualification verification
- 5% (minimum 2) units subjected to extended 72-hour burn-in at elevated temperature

---

## 18. Revision History

| Rev | Date | Author | Changes |
|-----|------|--------|---------|
| 1.0 | 2025-01-15 | Hardware Engineering | Initial release |
| — | — | — | — |
