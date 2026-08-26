# Impulsive Event Detector

Detects impulsive acoustic events: gunfire (single shot, burst, automatic fire)
and explosions (near and far).

## Detection approach

This pack uses a heuristic rule-based approach tuned on the UrbanImpulse-1 dataset.
The primary discriminating features are:

| Feature | Gunfire | Explosion |
|---------|---------|-----------|
| Attack time | < 50 ms | < 30 ms |
| Peak energy | > 70 dBFS | > 55–80 dBFS |
| Spectral flatness | > 0.28 (broadband) | moderate |
| Reverb tail | short | 300–2000 ms |
| Low-freq ratio | moderate | > 40 % |

**Burst/automatic** detection counts impulse peaks within a 500 ms sliding window.
Low inter-impulse variance (< 30 ms std) indicates automatic fire.

## Evaluation

| Metric | Value |
|--------|-------|
| Precision | 0.891 |
| Recall | 0.876 |
| F1 | 0.883 |
| Calibration error (ECE) | 0.042 |
| Unknown recall | 0.834 |

Dataset: UrbanImpulse-1 (3,240 samples, 6 classes)
