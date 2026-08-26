# Hardware Reference Designs

## Important: Resonance Does Not Manufacture Hardware

Resonance is a **software platform and open specification project**. This directory contains reference designs, specifications, and validation procedures — not production-ready manufacturing files.

The purpose of these designs is to enable **third-party manufacturers, integrators, research labs, and hardware companies** to build sensors that are compatible with the Resonance platform.

### What we provide

- Engineering specifications with measurable requirements
- Reference schematics and BOMs (component-level guidance)
- Acoustic array geometry definitions
- Firmware (open-source Rust edge runtime)
- Calibration software and procedures
- Hardware validation test definitions
- Interoperability protocol (REP)

### What a manufacturer provides

- PCB layout and fabrication
- Component sourcing and supply chain
- Assembly (SMD, through-hole, mechanical)
- Enclosure tooling and production
- Regulatory certification (FCC, CE, etc.)
- Factory test execution
- Quality control and warranty
- Sales and distribution

### See also

- [`MANUFACTURING_PLAN.md`](./MANUFACTURING_PLAN.md) — Complete guide for contract manufacturers
- [`reference-node/`](./reference-node/) — VectorNode X1 reference design files
- [`../specifications/RES-HW-VECTORNODE-X1.md`](../specifications/RES-HW-VECTORNODE-X1.md) — Full engineering specification

---

## Node Family Overview

| Node | Purpose | Complexity | Who builds it |
|------|---------|-----------|---------------|
| **RN-D1** | Development, education, lab testing | Low — off-the-shelf modules | Individual developers, universities |
| **RN-F1** (VectorNode X1) | Production field deployment | Medium-high — custom PCB + enclosure | Hardware partners, contract manufacturers |
| **RN-P1** | Research, precision timing, extended bandwidth | High — precision analog + FPGA | Instrumentation companies, national labs |

## Licensing

- **Firmware**: Apache 2.0
- **Hardware designs**: CERN Open Hardware Licence v2 — Permissive (CERN-OHL-P)
- **Trademarks**: "Resonance" and "VectorNode" names require licence for commercial use
- **Certification**: "Resonance Compatible" programme validates interoperability
