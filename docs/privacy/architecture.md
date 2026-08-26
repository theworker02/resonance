# Privacy Architecture

## Design Philosophy

Resonance implements privacy by construction, not by policy. The system is architecturally incapable of performing surveillance functions regardless of software configuration, operator intent, or post-deployment modification. This is achieved through hardware constraints, type-system enforcement, and protocol design that make prohibited operations structurally impossible.

## What Is Collected

Resonance nodes collect and process:

- **Acoustic features:** Mel-frequency cepstral coefficients (MFCCs), spectral centroid, spectral rolloff, zero-crossing rate, spectral flux, and energy level. These are mathematical summaries of frequency content — they cannot be reversed into intelligible audio.
- **Direction of arrival:** Bearing and elevation angles derived from inter-microphone time delays.
- **Acoustic fingerprint:** A SHA-256 hash of the normalized feature vector, used for deduplication and cross-node correlation.
- **Environmental telemetry:** Temperature, humidity, barometric pressure, wind speed — used for acoustic propagation correction.
- **Timing data:** Precision timestamps synchronized via Chronos (GPS PPS + NTP).

## What Is NOT Collected

Resonance nodes do not and cannot collect:

- Raw audio recordings (no protocol field exists to transmit PCM data)
- Speech content or transcripts
- Speaker identities or voiceprints
- Conversation metadata (who spoke, when, how long)
- Continuous ambient sound levels for non-impulsive events

## Hardware Enforcement vs. Policy Enforcement

| Mechanism | Enforcement Level | Bypass Difficulty |
|-----------|------------------|-------------------|
| No audio output protocol field | Wire format (compile-time) | Requires protocol redesign |
| Privacy kernel type constraints | Rust type system (compile-time) | Requires code modification + review |
| Ephemeral ring buffer | Hardware timer + crypto erasure | Requires firmware modification |
| Feature-only transmission | REP protocol schema | Requires protocol version change |
| Attestation system | Cryptographic (runtime) | Requires key compromise |

Policy enforcement (e.g., "we promise not to record") is insufficient because policies can be changed. Resonance relies on structural enforcement where the prohibited action requires modifying source code, recompiling, re-signing firmware, and passing attestation — a chain of events that is detectable and auditable.

## Ring Buffer Lifecycle

Audio samples exist only in the ephemeral ring buffer on the edge node:

1. **Capture:** PCM samples from the microphone array are written to a fixed-size ring buffer in volatile memory.
2. **Window:** The buffer holds at most 5 seconds of audio (configurable down, never up beyond 5s).
3. **Trigger:** When the impulse detector fires, the current buffer window is made available to the feature extractor.
4. **Extract:** The feature extractor computes MFCCs and spectral features from the relevant segment.
5. **Erase:** After feature extraction completes, the buffer segment is cryptographically erased (overwritten with random bytes).
6. **Overflow:** In normal operation (no trigger), old samples are continuously overwritten by new ones — no action required.

At no point does the ring buffer content leave volatile memory. Power loss results in complete data loss — by design.

## Attestation System

Every node periodically publishes a signed privacy attestation that declares:

- The firmware hash matches a known-good release.
- The prohibited capability list is enforced (compile-time verification passed at build).
- The ring buffer maximum duration has not been modified.
- No audio output paths exist in the running binary.
- The secure boot chain completed successfully.

The backend verifies attestations and will not process observations from nodes with invalid or expired attestations. The transparency endpoint reports fleet-wide attestation compliance to the public.

Attestations are signed with the node's per-device Ed25519 key, making them non-forgeable and attributable to specific hardware.
