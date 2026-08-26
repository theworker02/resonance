# Audio Retention Policy

## Ephemeral Ring Buffer

Audio samples exist only in a volatile memory ring buffer on the edge node. This buffer is the sole location where raw acoustic data exists in the system.

**Parameters:**
- Maximum duration: 5 seconds (hard limit, not configurable upward)
- Storage: Volatile RAM only (lost on power cycle)
- Overwrite behavior: Oldest samples are continuously overwritten by newest
- Erasure: Cryptographic overwrite (random bytes) after feature extraction

The ring buffer serves one purpose: providing a temporal window for the feature extractor when the impulse detector triggers. Between triggers, audio samples flow through the buffer and are overwritten within 5 seconds without any processing or persistence.

## Event-Triggered Feature Extraction

Audio is processed only when the impulse detector identifies a potential event:

1. Impulse detector fires (energy spike exceeds adaptive threshold).
2. Feature extractor reads the relevant segment from the ring buffer (typically 50–500ms).
3. MFCCs, spectral features, and direction of arrival are computed.
4. The buffer segment is cryptographically erased.
5. Only the computed features (numerical vectors) leave the privacy kernel.

No continuous feature extraction occurs. The system does not monitor background sound levels, ambient noise patterns, or non-impulsive acoustic activity.

## Optional Encrypted Clip (Operator Opt-In)

For deployments where post-incident audio review is required by local regulation or operational policy, Resonance supports an optional encrypted clip capability:

- **Disabled by default.** Must be explicitly enabled in the node's policy configuration.
- **Policy-controlled duration:** Maximum clip length is set by operator policy (hard cap: 5 seconds, matching ring buffer).
- **Encrypted at rest:** Clips are encrypted with the cell's public key before storage. Decryption requires operator credentials and produces an audit trail entry.
- **Time-limited retention:** Encrypted clips are automatically deleted after a configurable retention period (default: 72 hours, maximum: 30 days).
- **Audit logged:** Every clip creation, access, and deletion is recorded in the signed audit trail.

This capability exists solely for jurisdictions with mandatory evidence retention requirements. It is never active without explicit operator configuration and produces visible audit entries.

## No Indefinite Storage

Resonance provides no mechanism for indefinite audio storage:

- Ring buffer: 5 seconds maximum, volatile memory, continuously overwritten.
- Encrypted clips (if enabled): Hard maximum retention of 30 days with automatic deletion.
- Features: Numerical vectors only — cannot be reversed to audio.
- Backend: Stores incidents, observations (features), and audit records. Never stores audio.

There is no archive mode, no long-term audio database, and no mechanism to disable automatic deletion of encrypted clips.
