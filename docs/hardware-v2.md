# Hardware v2 — Resonance Node Families

## Node Family Overview

Phase III introduces three hardware product families optimised for different deployment scenarios:

| Family         | Mics | NPU | GNSS/PPS | Secure Element | Primary Use                        |
|----------------|------|-----|----------|----------------|------------------------------------|
| **RN-Mini**    | 4    | No  | No       | No             | Development, low-cost pilots       |
| **RN-Edge**    | 8    | Yes | Yes      | Yes            | Primary production deployment      |
| **RN-Precision** | 12 | Yes | Yes      | Yes            | Research, infrastructure monitoring |

All families share the same software stack (Resonance Edge runtime), differ only in hardware capabilities, and are interoperable within the same mesh.

## RN-Edge — The Flagship Node

The RN-Edge is the primary production sensor designed for outdoor acoustic monitoring at scale. It balances cost, capability, and deployment simplicity.

### Core Specifications

- **Processor**: Quad-core ARM Cortex-A55, 1.8 GHz
- **NPU**: 4 TOPS neural processing unit for on-device inference
- **Memory**: 4 GB LPDDR4X
- **Storage**: 32 GB eMMC + microSD slot (optional extended logging)
- **Connectivity**: Gigabit Ethernet (PoE), LTE Cat-M1/NB-IoT, WiFi 6
- **GNSS**: Multi-constellation (GPS, GLONASS, Galileo, BeiDou) with PPS output
- **Power**: PoE (IEEE 802.3af), 12 V DC input, or solar with battery backup
- **Operating range**: -30°C to +60°C
- **Enclosure**: IP67, UV-stable polycarbonate, tamper-evident

## Microphone Array Layout and Rationale

The RN-Edge carries an 8-microphone MEMS array in a circular planar arrangement:

```
        M1
     M8    M2
    M7  ●   M3     ● = centre reference point
     M6    M4
        M5

Spacing: 40 mm radius circle
Frequency range: 20 Hz – 20 kHz (±3 dB)
Self-noise: < 30 dB(A)
Max SPL: 135 dB (1% THD)
```

The circular layout provides:
- Omnidirectional coverage (no blind spots)
- Phase-based direction-of-arrival (DOA) estimation
- Redundancy: any single microphone failure leaves 7 valid channels
- Beamforming capability for SNR enhancement
- Inter-channel delay-based bearing estimation (resolution ~15° at 1 kHz)

The 40 mm radius was chosen as the optimal trade-off between spatial aliasing frequency (aliasing begins above ~4.3 kHz for adjacent pairs) and the physical constraint of the enclosure diameter.

## Timing Architecture

Acoustic TDOA requires microsecond-level clock synchronization. The RN-Edge achieves this through a dual-source timing architecture:

**Primary: GNSS PPS**
- The PPS (pulse-per-second) signal from the GNSS module provides a UTC-synchronized hardware interrupt with < 30 ns jitter
- A hardware timestamping unit captures each acoustic detection event relative to the most recent PPS edge
- Resulting timing accuracy: < 1 µs under clear-sky conditions

**Fallback: NTP + Crystal Holdover**
- When GNSS is unavailable (indoor, dense urban canyon), the node falls back to NTP synchronization with a temperature-compensated crystal oscillator (TCXO) holdover
- TCXO drift: < 0.5 ppm (< 1.8 µs/hour)
- The platform reports `timing_uncertainty_us` for each observation, and the geometry engine degrades confidence accordingly

The `precision_timing_log` table records ongoing timing health for each node, enabling the calibration system to detect drift before it impacts localization accuracy.

## Security Architecture

Every RN-Edge includes a hardware secure element (ATECC608B or equivalent):

- **Device identity**: Each node holds a unique Ed25519 key pair generated at manufacture, stored in the secure element's protected key slot
- **Firmware signing**: Only firmware images signed by the Resonance release key are accepted by the bootloader
- **Manifest signing**: Hardware manifests (published at startup) are signed with the device key, enabling the platform to verify hardware authenticity
- **Observation signing**: Critical observations can be signed to provide tamper-evidence in the provenance chain
- **Secure boot chain**: ROM → Bootloader (verified) → Kernel (verified) → Resonance runtime

The secure element never exposes private keys to software; cryptographic operations happen within the element.

## Power Options

The RN-Edge supports three power configurations:

1. **PoE (Power over Ethernet)**: Preferred for permanent installations. Single cable carries both power and data. 12 W typical consumption.
2. **12 V DC input**: For locations with existing DC infrastructure (traffic poles, building risers).
3. **Solar + battery**: For remote deployments. 20 W panel + 50 Wh LiFePO4 battery provides autonomous operation in temperate climates with > 4 hours average daily insolation.

The power subsystem reports state-of-charge, consumption, and estimated runtime through the health heartbeat system.

## Enclosure and Outdoor Deployment

The enclosure is designed for multi-year outdoor deployment:

- **IP67 rated**: Survives temporary submersion; resistant to dust, rain, snow, and hail
- **Acoustic membrane**: Gore-Tex membrane protects microphones while maintaining acoustic transparency (< 1 dB insertion loss below 10 kHz)
- **UV resistance**: Polycarbonate shell with UV-stable coating; rated for 10+ years outdoor exposure
- **Mounting**: Universal bracket compatible with poles (60–90 mm diameter), flat surfaces, and VESA mounts
- **Tamper detection**: Reed switch detects enclosure opening; reported immediately via health channel
- **Thermal management**: Passive cooling with aluminium heat spreader; no fans (no acoustic contamination)

## Self-Test Procedure

Each RN-Edge performs a comprehensive self-test at startup and on-demand:

```
resonance edge self-test

[PASS] Microphone Array        8/8 channels responsive, SNR > 60 dB
[PASS] GNSS Module             Fix acquired (8 satellites), PPS active
[PASS] Clock Synchronization   Error < 0.8 µs
[PASS] Storage                 28.4 GB available
[PASS] Secure Element          Key pair verified, attestation signed
[PASS] Network                 Ethernet: 1000 Mbps, LTE: -78 dBm (good)
[PASS] Orientation             Heading 135°, tilt 0.2°, within tolerance
[PASS] Environment Sensors     Temp 18.4°C, Humidity 62%, Pressure 1013 hPa
[PASS] Power                   PoE active, 11.8 W consumption
[PASS] Internal Temperature    CPU 42°C, ambient 19°C

Overall: PASS
```

Failures are reported to the platform and generate calibration actions.

## Hardware Abstraction Layer

The Resonance Edge runtime uses a Hardware Abstraction Layer (HAL) to decouple software from hardware specifics:

```
Application Layer (detector packs, REP, health)
     │
     ▼
HAL Interface (trait AudioHal, trait TimingHal, trait NetworkHal)
     │
     ├─── Linux HAL (production: ALSA audio, GPIO PPS, systemd-networkd)
     └─── Simulator HAL (MeshLab: synthetic audio, virtual timing)
```

This means:
- The same application code runs on RN-Mini, RN-Edge, and RN-Precision with no changes
- MeshLab's simulator HAL produces bit-identical protocol output to real hardware
- Future hardware revisions require only HAL driver updates, not application changes
- Third-party hardware could be integrated by implementing the HAL traits
