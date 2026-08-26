# Resonance Hardware Prototype Specification

This document defines the three hardware node families in the Resonance sensor mesh, covering compute, audio capture, positioning, connectivity, and physical packaging.

---

## RN-Mini (Development / Low-cost Pilot)

| Parameter | Value |
|-----------|-------|
| Compute | Raspberry Pi CM4 (4× Cortex-A72, 2 GB RAM) |
| Microphones | 4× ICS-43434 MEMS (I2S, SNR 65 dBFS, AOP 116 dB SPL) |
| Connectivity | Wi-Fi 802.11ac, Gigabit Ethernet |
| GNSS | u-blox NEO-M9N (concurrent GPS/GLONASS) |
| Storage | 16 GB eMMC |
| Power | USB-C 5 V or Micro PoE |
| Enclosure | IP54 plastic, 120×80×50 mm |
| Cost target | ~$120 |

Intended for indoor lab testing, classroom demonstrations, and early-stage pilot deployments where ruggedness is not critical.

---

## RN-Edge (Primary Production Node)

| Parameter | Value |
|-----------|-------|
| Compute | RK3588S ARM64 (4× Cortex-A76 + 4× Cortex-A55), 8 GB LPDDR5 |
| NPU | 6 TOPS integrated (RKNN) |
| Microphones | 8× ICS-43434 MEMS in cross pattern (N/NE/E/SE/S/SW/W/NW), individually calibrated |
| Connectivity | Wi-Fi 6, Gigabit Ethernet, LTE Cat-4 modem (nano-SIM), optional LoRaWAN |
| GNSS | u-blox ZED-F9P (RTK-capable, PPS output, <1 cm accuracy with corrections) |
| Secure element | ATECC608B hardware security module |
| Storage | 64 GB eMMC + microSD slot |
| Power | PoE+ (802.3at), 9–30 V DC input, 6 W typical |
| Enclosure | IP67 aluminium, 200×150×80 mm, UV-resistant, replaceable acoustic membrane |
| IMU | ICM-42688-P (accelerometer + gyroscope), QMC5883L magnetometer |
| Environmental | BME280 (temperature, humidity, pressure) |
| Cost target | ~$380 |

The primary production node for city-scale deployments.  Designed for pole-mount or wall-mount installations with continuous outdoor exposure.

---

## RN-Precision (Research / Infrastructure)

| Parameter | Value |
|-----------|-------|
| Compute | Rockchip RK3588 (full version), 16 GB LPDDR5 |
| Microphones | 12× AKM AK5720 (24-bit, SNR 110 dBFS, THD+N −105 dB) |
| High-stability clock | TCXO ±0.1 ppm + external 10 MHz reference input |
| GNSS | u-blox ZED-F9T (timing receiver, 2 ns RMS accuracy, PPS) |
| Storage | 128 GB NVMe |
| Environmental | Vaisala HMP110 humidity + PT1000 temperature |
| Power | Dual PoE+, UPS-capable, solar input |
| Enclosure | IP67 stainless steel, 280×200×100 mm, pressurised |
| Cost target | ~$1,200 |

Intended for research institutions, critical infrastructure monitoring, and calibration reference deployments where sub-microsecond timing and measurement-grade audio fidelity are required.

---

## Microphone Array Layout (RN-Edge, top view)

```
              Mic N (0°)
              │
    Mic NW    │    Mic NE
   (315°)\   │   /(45°)
          \   │   /
           \  │  /
Mic W ──── Center ──── Mic E
(270°)    /   │   \    (90°)
         /    │    \
        /     │     \
    Mic SW    │    Mic SE
   (225°)     │    (135°)
              │
              Mic S (180°)
```

Each microphone is spaced 40 mm from centre, providing a 80 mm aperture for direction-of-arrival estimation in the 1–16 kHz band.

---

## Wiring Notes

- **MEMS microphones**: All ICS-43434 use I2S interface with individual chip-select lines.  Each mic has a dedicated data line; clock (SCK) and word-select (WS) are shared per bus group (4 mics per I2S peripheral).
- **GPS PPS**: The PPS output from the u-blox module is routed to a hardware interrupt pin on the SoC for sub-microsecond timestamping.  The rising edge triggers a kernel timestamp capture.
- **Secure element**: ATECC608B connected via dedicated I2C bus (400 kHz) with a hardware interrupt line for crypto-complete notification.
- **IMU**: ICM-42688-P connected via SPI at 1 kHz sampling rate.  FIFO-mode captures accelerometer + gyroscope readings at 1 kHz, emptied on interrupt.
- **Environmental sensors**: BME280 and QMC5883L magnetometer share an I2C bus (100 kHz).  Polled at 1 Hz and 10 Hz respectively.
- **LTE modem**: Connected via USB 2.0 to the SoC.  AT command interface + QMI data path.

---

## Power Budget (RN-Edge)

| Subsystem | Typical (W) | Peak (W) |
|-----------|-------------|----------|
| Compute (RK3588S) | 3.5 | 5.0 |
| 8× MEMS microphones | 0.2 | 0.2 |
| LTE modem (active / idle) | 1.5 / 0.05 | 2.5 |
| GNSS (ZED-F9P) | 0.15 | 0.2 |
| NPU inference | 1.0 | 2.0 |
| Secure element | 0.01 | 0.01 |
| IMU + sensors | 0.05 | 0.05 |
| Misc (regulators, LEDs) | 0.1 | 0.1 |
| **Total** | **6.0** | **9.0** |

The node operates well within a standard PoE+ (25.5 W) power envelope, leaving headroom for future expansion (e.g. additional sensors or heated enclosure).

---

## Thermal Design

- Aluminium enclosure acts as a passive heatsink.
- Thermal pad between SoC and enclosure floor provides 2 W/mK conductive path.
- Operating range: −30°C to +60°C ambient.
- NPU burst duration limited by thermal governor (85°C throttle, 95°C shutdown).

---

## Certification Targets

- FCC Part 15 (unintentional radiator + Wi-Fi/LTE modules)
- CE RED (radio equipment directive)
- IP67 (IEC 60529)
- RoHS compliant
- UL 62368-1 (safety)
