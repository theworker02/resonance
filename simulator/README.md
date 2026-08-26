# Resonance Simulator

Virtual acoustic mesh deployment for development and testing.

## Quick Start

```bash
resonance simulate --nodes 25 --environment suburban --duration 15m
```

## Features

- Grid-based virtual sensor deployment
- Realistic acoustic propagation (inverse square, atmospheric attenuation)
- Configurable network faults (packet loss, latency, partitions)
- Clock drift and jitter simulation
- Node failure injection
- Hardware-in-the-loop mode (mix real + simulated nodes)
- Digital twin for deployment planning
