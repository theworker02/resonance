# Contributing to Resonance

Thank you for your interest in contributing to Resonance. This guide covers everything you need to get started.

## Development Setup

### Prerequisites

- **Rust** 1.75+ (install via [rustup](https://rustup.rs))
- **Python** 3.11+ (for intelligence and simulator modules)
- **Node.js** 20+ (for the console dashboard)
- **PostgreSQL** 15+ (for the core backend)
- **NATS** 2.10+ (message bus between edge and core)
- **Docker** (optional, for integration testing)

### Getting Started

```bash
# Clone the repository
git clone https://github.com/resonance-project/resonance.git
cd resonance

# Build all Rust crates
cargo build --workspace

# Run tests
cargo test --workspace

# Set up the console
cd apps/console
npm install
npm run dev

# Set up the simulator
cd apps/simulator
pip install -r requirements.txt
python meshlab.py --help
```

### Environment Configuration

Copy the example configuration:
```bash
cp crates/resonance-edge/sensor.example.toml sensor.toml
```

Set required environment variables for the core:
```bash
export RESONANCE_DATABASE_URL="postgres://localhost/resonance"
export RESONANCE_NATS_URL="nats://localhost:4222"
export RESONANCE_JWT_SECRET="development-only-secret"
export RESONANCE_ML_SERVICE_URL="http://localhost:8000"
```

## Project Structure

```
crates/              Rust library and binary crates
  resonance-core/    Backend: correlation, SAM, provenance, storage
  resonance-edge/    Edge sensor node firmware
  resonance-signal/  DSP, beamforming, cross-correlation, VectorWave
  resonance-protocol/ REP types, serialization, device identity
apps/
  cli/               Command-line interface
  console/           React dashboard
  simulator/         MeshLab network simulator (Python)
  docs-site/         VitePress documentation site
hardware/            Hardware specifications and BOM
intelligence/        Python ML detectors
specifications/      Formal protocol specifications
tools/               Deployment configs, database migrations
```

## Testing

### Rust

```bash
# Run all tests
cargo test --workspace

# Run tests for a specific crate
cargo test -p resonance-core

# Run with logging
RUST_LOG=debug cargo test --workspace -- --nocapture
```

### Python

```bash
# Intelligence tests
python -m pytest intelligence/ --tb=short

# Simulator tests
python -m pytest apps/simulator/ --tb=short
```

### Frontend

```bash
cd apps/console
npm test
npm run lint
```

## Pull Request Guidelines

1. **Branch naming**: Use `feat/`, `fix/`, `docs/`, or `hw/` prefixes.
2. **One concern per PR**: Keep changes focused and reviewable.
3. **Tests required**: All new code must include tests.
4. **CI must pass**: Clippy warnings are treated as errors.
5. **Squash merge**: PRs are squash-merged to keep history clean.

## Commit Conventions

Use conventional commits:

```
feat(signal): add GCC-PHAT cross-correlation
fix(core): handle NULL sensor_health_score in ingestion
docs(hardware): update R3 BOM with new microphone
test(protocol): add version negotiation edge cases
```

## Code Style

### Rust

- Follow standard Rust formatting (`cargo fmt`)
- No Clippy warnings (`cargo clippy -- -D warnings`)
- Use `thiserror` for library errors, `anyhow` for application errors
- Document all public items with `///` doc comments
- Prefer explicit types over complex inference chains

### Python

- Format with `black` (line length 100)
- Type hints on all function signatures
- Docstrings on all public functions (Google style)

### TypeScript

- ESLint + Prettier (config in apps/console)
- Strict TypeScript (no `any` types)
- React functional components only

## Adding a New Detector

Detectors live in `intelligence/detectors/`. To add one:

1. Create a new file in `intelligence/detectors/`
2. Subclass `BaseDetector` from `intelligence/detectors/base.py`
3. Implement `detect(features: dict) -> DetectionResult`
4. Register it in `intelligence/manifest_loader.py`
5. Add tests in `intelligence/tests/`

## Hardware Contributions

Hardware changes follow a stricter process:

1. All BOM changes must include cost impact
2. PCB changes require review from Hardware + Signal groups
3. Enclosure changes must maintain IP65 rating
4. Validation test plans must be updated alongside hardware changes

## Questions?

Open a Discussion on GitHub or reach out in the project channels.
