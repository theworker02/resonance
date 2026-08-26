# Roadmap

## v4.0 — Production Reference Architecture (Current)

The v4.0 release establishes the complete production-grade architecture for Resonance, including hardware specifications, advanced signal processing, and professional documentation.

- Production hardware family (RN-D1 Dense Urban, RN-F1 Field, RN-P1 Perimeter)
- VectorWave 2 direction-of-arrival engine with dual-ring array support
- EchoGraph reflection-aware localization model
- Acoustic Probability Surface (APS) for probabilistic event localization
- Chronos precision timing system (GPS PPS + NTP fallback)
- Atmosphere Engine environmental compensation
- ConflictGuard contradiction detection
- Confidence timeline tracking with deterministic replay
- Scene health assessment
- WavePrint v2 acoustic fingerprinting
- OpenAPI v1 specification
- Complete engineering specification set (REP protocol, hardware specs, JSON schema)
- Professional branding package
- GitHub Pages documentation site
- Security documentation (threat model, secure boot, fleet identity)
- Privacy documentation (architecture, prohibited capabilities, retention)
- Repository consolidation to canonical structure
- Issue templates and governance files

## v4.1 — Hardware Validation

- First prototype PCB fabrication (RN-D1 dual-ring array)
- Anechoic chamber calibration testing
- Hardware-in-the-loop testing framework
- Fleet manager application (multi-node provisioning and monitoring)
- Chaos testing framework (network partition, node failure, clock drift simulation)
- Public benchmark datasets (synthetic + controlled recordings)
- Detector SDK v1 (third-party detector pack development)
- Performance benchmarking suite
- Operational runbooks

## v4.2 — Field Validation

- Outdoor field testing campaign (minimum 3 environments)
- Environmental specification validation (temperature, humidity, precipitation)
- Multi-node correlation accuracy measurement
- False positive rate characterization under real-world noise
- Power consumption optimization for production hardware
- Firmware OTA update mechanism
- Node self-diagnostics and reporting

## v5.0 — Production Deployment

- Production-certified hardware (CE/FCC compliance testing)
- Multi-region deployment architecture
- Federated learning for detector improvement without centralized data
- Third-party detector marketplace
- Commercial deployment profiles (urban, campus, transit, industrial)
- SLA monitoring and alerting
- Capacity planning tools
- Integration SDK for third-party PSIM/CAD systems
- Formal security audit by independent firm
- Accessibility audit of operator console (WCAG 2.1 AA)

## v5.1 — Scale

- Horizontal scaling of backend correlation engine
- Multi-tenant deployment isolation
- Advanced fleet analytics
- Predictive maintenance for hardware nodes
- Acoustic scene classification (beyond impulsive events)
- API v2 with GraphQL option
- Mobile operator application
