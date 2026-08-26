# Manufacturing Plan

## What Resonance Is — and What It Is Not

**Resonance is a software platform and open reference architecture.**

We do not manufacture hardware. We design, specify, validate, and publish reference sensor designs so that **hardware partners, contract manufacturers, research labs, and integrators** can build compliant nodes that interoperate with the Resonance platform.

The relationship is analogous to:

| Resonance provides | A manufacturer provides |
|---|---|
| Firmware (Rust edge runtime) | Physical PCB fabrication |
| Signal processing algorithms | Component procurement |
| Protocol specification (REP) | Assembly and soldering |
| Reference hardware design files | Supply chain management |
| Calibration software and procedures | Factory test execution |
| Validation test definitions | Enclosure tooling and injection |
| Acoustic array geometry specs | Regulatory certification (FCC/CE) |
| SDK and driver interfaces | Warranty and field service |

This document is written for a contract electronics manufacturer (CEM), a hardware startup, or a university lab that wants to produce Resonance-compatible sensor nodes.

---

## Reference Designs

Resonance publishes three reference node designs at increasing complexity:

### RN-D1 — Development Node

**Purpose**: Software development, algorithm validation, education, lab testing.

**Complexity**: Low. Can be assembled from off-the-shelf dev boards.

**Suggested approach**: Buy a Raspberry Pi CM4 carrier board, attach 4 MEMS microphone breakouts via I2S, add a GPS module. Flash the Resonance Edge firmware. Total BOM under $150.

**Who would build this**: Individual developers, university labs, hackathon teams.

### RN-F1 — Field Node (VectorNode X1)

**Purpose**: Primary production sensor for outdoor acoustic deployments.

**Complexity**: Medium-high. Requires custom PCB, environmental sealing, and factory calibration.

**Suggested approach**: A contract manufacturer with experience in IoT/environmental sensing. Requires 4-layer PCB, SMD assembly, conformal coating, IP67 enclosure sourcing, and per-unit acoustic calibration.

**Who would build this**: A hardware company partnering with Resonance, a defence/infrastructure integrator, or a well-funded research program.

### RN-P1 — Precision Node

**Purpose**: Research-grade timing, extended frequency range, FPGA-based acquisition.

**Complexity**: High. Requires precision analog design, FPGA firmware, and laboratory-grade calibration fixtures.

**Suggested approach**: Specialist instrumentation manufacturer or in-house R&D team.

**Who would build this**: Acoustic research institutions, national labs, critical infrastructure operators.

---

## Manufacturing Process — RN-F1 (VectorNode X1)

This is the most likely node to be manufactured at scale. Below is a complete manufacturing plan suitable for a contract electronics manufacturer.

### Phase 1: Prototype (Qty: 5–20 units)

| Step | Activity | Deliverable |
|------|----------|-------------|
| 1.1 | Schematic review | Reviewed schematic PDF |
| 1.2 | PCB layout (4-layer, controlled impedance for audio) | Gerber files |
| 1.3 | BOM finalisation and component sourcing | Approved BOM with alternates |
| 1.4 | PCB fabrication (prototype house) | Bare boards |
| 1.5 | SMD assembly (pick-and-place) | Populated boards |
| 1.6 | Manual rework / through-hole components | Completed PCBA |
| 1.7 | Bring-up and functional test | Test report per unit |
| 1.8 | Firmware flash (Resonance Edge binary) | Bootable system |
| 1.9 | Acoustic characterisation (anechoic chamber) | Per-channel frequency response |
| 1.10 | Enclosure prototype (CNC aluminium or 3D print) | Mechanical sample |
| 1.11 | Environmental soak test (temperature, humidity) | Pass/fail |
| 1.12 | Design review and ECO | Revision B design |

**Duration**: 8–12 weeks  
**Cost estimate**: $15,000–$30,000 (NRE + prototype units)

### Phase 2: Pilot Production (Qty: 50–200 units)

| Step | Activity | Deliverable |
|------|----------|-------------|
| 2.1 | Final PCB revision (incorporate prototype learnings) | Production Gerbers |
| 2.2 | Enclosure tooling (aluminium extrusion die or sheet metal tooling) | Enclosure samples |
| 2.3 | Acoustic membrane sourcing (PTFE/ePTFE) | Membrane samples + insertion loss test |
| 2.4 | Production assembly line setup | First articles |
| 2.5 | Automated test fixture (ICT + functional test) | Test fixture + software |
| 2.6 | Factory calibration station | Per-unit calibration JSON |
| 2.7 | Firmware provisioning station | Unique device identity + keys |
| 2.8 | Final assembly (PCBA + enclosure + membrane + cables) | Finished units |
| 2.9 | Burn-in test (48h powered soak) | Burn-in report |
| 2.10 | QC sample testing (acoustic + timing + environmental) | QC batch report |
| 2.11 | Packaging and labelling | Shipped units |

**Duration**: 12–16 weeks  
**Cost estimate per unit**: $280–$450 (at 100-unit scale)

### Phase 3: Volume Production (Qty: 500+)

At volume, unit costs decrease through:
- Component volume pricing
- Amortised tooling
- Automated test efficiency
- Reduced manual labour per unit

**Target unit cost at 1000 units**: $180–$280 (electronics + enclosure + calibration)

---

## What Resonance Provides to the Manufacturer

### Design Package

| File | Description |
|------|-------------|
| `specifications/RES-HW-VECTORNODE-X1.md` | Full engineering specification with measurable requirements |
| `hardware/reference-node/schematic.pdf` | Reference schematic (when released) |
| `hardware/reference-node/bom.csv` | Bill of materials with MPN and alternates |
| `hardware/reference-node/gerbers/` | PCB fabrication files (when released) |
| `hardware/reference-node/mechanical/` | Enclosure drawings (STEP/DXF) |
| `hardware/acoustic-array/` | Microphone array geometry and placement |
| `hardware/reference-node/node-families.yaml` | Machine-readable capability definitions |

### Firmware

| Artefact | Description |
|----------|-------------|
| `edge/` source code | Complete Rust firmware, open source |
| Pre-built binary images | ARM64 release builds for supported SoMs |
| Hardware Abstraction Layer | Documented HAL traits for porting to new hardware |
| Self-test binary | `resonance-edge self-test` validates all subsystems |

### Calibration Tools

| Tool | Description |
|------|-------------|
| Calibration procedure | Step-by-step per-channel gain/phase/frequency calibration |
| Calibration software | CLI tool that drives the calibration sequence |
| `calibration-manifest.json` schema | Output format signed and stored on device |
| Validation criteria | Pass/fail thresholds for each measurement |

### Test Definitions

| Test | Measures | Pass Criteria |
|------|----------|---------------|
| Acoustic frequency response | Per-channel ±dB across 50 Hz–20 kHz | Within ±3 dB |
| Channel matching | Gain difference between channels | ≤ ±1 dB |
| Noise floor | A-weighted noise with no stimulus | ≤ -68 dBA (equiv. ≥68 dB SNR) |
| AOP (clipping) | Max SPL before 1% THD | ≥ 130 dB SPL |
| Timing (PPS) | PPS accuracy vs reference | ≤ 100 ns RMS |
| Self-test pass | All subsystems functional | All green |
| Environmental soak | 72h at -20°C and +55°C | No failures |
| IP67 | Immersion test per IEC 60529 | No ingress |

---

## Regulatory Considerations

The manufacturer is responsible for obtaining regulatory certification. The reference design is intended to comply with:

| Standard | Scope |
|----------|-------|
| FCC Part 15 | Unintentional radiator (digital device) + intentional radiator (Wi-Fi/LTE modules) |
| CE RED | Radio Equipment Directive (EU market) |
| RoHS | Restriction of hazardous substances |
| IEC 60529 | IP67 ingress protection verification |
| IEC 62368-1 | Safety (audio/video/ICT equipment) |
| UL/CSA | Optional for North American market |

Resonance provides EMC design guidelines (ground planes, decoupling, shielding) but does not guarantee compliance — that depends on the manufacturer's specific layout, enclosure, and cabling.

---

## Intellectual Property

- All Resonance software is licensed under **Apache 2.0**
- Hardware reference designs are published under **CERN Open Hardware Licence v2 — Permissive (CERN-OHL-P)**
- Manufacturers may produce and sell Resonance-compatible hardware commercially
- Use of the "Resonance" and "VectorNode" names for commercial products requires a trademark licence agreement (to ensure quality and interoperability standards are met)
- A "Resonance Compatible" certification program will validate that manufactured hardware passes the required test suite

---

## How to Get Started

If you are a manufacturer interested in producing Resonance-compatible nodes:

1. **Read the specification**: `specifications/RES-HW-VECTORNODE-X1.md`
2. **Review the reference BOM**: `hardware/reference-node/`
3. **Build a prototype**: Start with an RN-D1 (dev board approach) to validate firmware integration
4. **Contact the project**: Open a GitHub Discussion or email for partnership enquiries
5. **Validate**: Run the full test suite against your prototype
6. **Certify**: Submit test results for "Resonance Compatible" designation

---

## Summary

Resonance is a **software platform that defines what a spatial acoustic sensor should do**. We publish everything a manufacturer needs — specifications, firmware, calibration tools, test procedures, and reference designs — but we do not operate a factory.

The hardware ecosystem succeeds when multiple manufacturers can independently produce interoperable nodes at different price points and for different deployment environments, all speaking the same REP protocol and running the same open firmware.
