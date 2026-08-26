# Resonance Intelligence Service

Phase II of the Resonance acoustic incident detection platform. This service
consumes pre-processed acoustic feature vectors from the core signal processing
pipeline and produces calibrated, multi-dimensional confidence scores.

## Architecture

```
NATS Bus
  └─ resonance.rep.events.>          ← receive REP events from core
  └─ resonance.core.correlation_request ← multi-sensor correlation events
  └─ resonance.intelligence.results  → publish scored results

ConfidenceEngine
  ├── ConsensusEngine
  │     ├── ImpulsiveDetector
  │     ├── FireworksDetector
  │     ├── VehicleDetector
  │     ├── GlassDetector
  │     ├── ExplosionDetector
  │     ├── InfrastructureDetector
  │     ├── ConstructionDetector
  │     └── WeatherDetector
  └── UnknownDetector (Mahalanobis)
```

## Components

| Package | Purpose |
|---------|---------|
| `detectors/` | 8 independent detector packs + base interface |
| `ensemble/` | Consensus engine, calibration, unknown detection |
| `confidence/` | Multi-dimensional confidence scoring (v2) |
| `embeddings/` | 128-d acoustic embedding + fingerprinting |
| `registry/` | Model version registry with approval workflow |
| `evaluation/` | Benchmark suite + false-positive observatory |
| `service/` | NATS subscriber + HTTP health endpoint |
| `research/` | Offline dataset evaluation tooling |

## Detector Packs

- **impulsive** — gunfire (single/burst/automatic), near/far explosions
- **fireworks** — aerial bursts, ground-level, sustained displays
- **vehicle** — crash, horn, skid, engine, siren
- **glass** — breaking (residential, commercial, vehicle)
- **explosion** — large-scale detonations, industrial
- **infrastructure** — transformers, alarms, HVAC, structural
- **construction** — demolition, heavy equipment, impact tools
- **weather** — thunder, hail, wind gusts, heavy rain

## Running

```bash
# Development
pip install -e .
python -m intelligence.service.main

# Docker
docker build -t resonance-intelligence .
docker run -e NATS_URL=nats://localhost:4222 resonance-intelligence

# Benchmarks
resonance-bench --dataset /data/urbanimpulse-1 --output results.json

# Research mode
resonance-research --dataset /data/test --format table
```

## Confidence Levels

| Level | Overall Score | Meaning |
|-------|--------------|---------|
| HIGH | ≥ 0.85 | Automated dispatch eligible |
| NEEDS_VERIFICATION | 0.60–0.84 | Human review recommended |
| REJECTED | < 0.60 | Discard / log only |

## Privacy

This service processes only acoustic features — no audio recordings are retained.
Prohibited capabilities (speech recognition, speaker identification, voiceprint
storage) are enforced at the manifest level and will cause a hard startup failure
if any detector pack requests them.
