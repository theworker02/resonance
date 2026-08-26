# Developer Experience (Item 134)

## First-Time Setup

```bash
git clone https://github.com/resonance-project/resonance
cd resonance
./scripts/dev.sh
```

This starts: Postgres, NATS, Redis, Platform backend, Cloud API, and Console.

## Targets

| Step | Target Time |
|------|-------------|
| Clone | < 30s |
| Install dependencies | < 60s |
| First build | < 120s |
| Working simulation | < 180s from clone |

## Seed Data

```bash
resonance dev seed
```

Creates: sample organization, deployment with 4 nodes, spatial cell, 10 sample incidents, 2 models.

## Demo Mode

```bash
resonance dev demo
```

Launches the console with synthetic live data. Clearly labeled "DEMO — SIMULATED DATA" in the UI header. Suitable for conferences, screenshots, and evaluation.

## Code Organization

| Directory | Language | Build |
|-----------|----------|-------|
| `platform/` | Rust | `cargo build` |
| `edge/` | Rust | `cargo build` |
| `sdk/` | Rust + TypeScript | `cargo build` / `npm run build` |
| `apps/cloud/` | TypeScript | `npm run build` |
| `apps/console/` | TypeScript/React | `npm run build` |
| `apps/website/` | Astro | `npm run build` |
| `intelligence/` | Python | `pip install -e .` |
| `simulator/` | Python/Rust | `cargo build` |
| `packages/surface/` | TypeScript | `npm run build` |

## Testing

```bash
# Rust
cargo test --workspace

# TypeScript
cd apps/cloud && npm test
cd apps/console && npm test

# Python
cd intelligence && pytest

# Integration
cargo test --test integration

# Visual regression
cd apps/console && npm run test:visual
```

## Contributing

See [CONTRIBUTING.md](../CONTRIBUTING.md) for commit conventions, PR process, and code style guides.
