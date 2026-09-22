# Asset inventory â€” Add to your Cargo.toml

## Repository surfaces

| Asset | Location / notes |
|-------|------------------|
| Source tree | Repository root / language packages |
| Tests | `test/`, `tests/`, CI workflows if present |
| Docs | `README.md`, `docs/` |
| Diligence room | `docs/acquisition/` |
| License / notices | `LICENSE`, transition notices if present |
| Funding | `.github/FUNDING.yml` |
| CI | `.github/workflows/` if present |
| Branding | logos/assets folders if present |

## Capability highlights

- **Probabilistic spatial regions** Ã¢â‚¬â€ not a deceptively precise pin on a map
- **Multi-dimensional confidence breakdowns** Ã¢â‚¬â€ not a single opaque percentage
- **Competing hypotheses** Ã¢â‚¬â€ always shows what else the sound could have been
- **Cryptographic provenance** Ã¢â‚¬â€ every step is auditable and deterministically replayable
- **Explicit uncertainty** Ã¢â‚¬â€ if the evidence is ambiguous, the system says so
- **VectorWave** Ã¢â‚¬â€ direction-of-arrival estimation combining GCC-PHAT cross-correlation with delay-and-sum beamforming. Produces bearing vectors with 95% confidence intervals. Never claims precision the physics doesn't support.
- **WavePrint** Ã¢â‚¬â€ perceptual acoustic fingerprinting that captures envelope shape, spectral distribution, impulse width, spectral decay, and temporal profile. Survives propagation differences between sensors.
- **EchoGraph** Ã¢â‚¬â€ multi-path decomposition that separates direct arrivals from reflections. Learns reflection surfaces over time. Late arrivals are analyzed, not discarded.
- **Acoustic Probability Surface (APS)** Ã¢â‚¬â€ continuous spatial probability field over a geographic grid. Replaces point estimates with probabilistic regions showing containment areas.
- **ConflictGuard** Ã¢â‚¬â€ automatic contradiction detection. If sensors disagree on direction, timing, or classification, confidence is capped proportionally rather than hidden in an average.
- **Scene Health** Ã¢â‚¬â€ assesses whether environmental conditions (wind, rain, noise floor, sensor availability) support reliable analysis. Poor conditions automatically cap achievable confidence.
- **Confidence Timeline** Ã¢â‚¬â€ tracks how confidence evolves as evidence arrives. Shows whether the final score was stable or dependent on one late observation.

## Usually excluded

Seller personal accounts, unrelated repos, and unreissued registry tokens â€” unless listed in the definitive agreement.

*Updated: 2026-09-22*
