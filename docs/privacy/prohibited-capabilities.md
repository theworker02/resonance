# Prohibited Capabilities

## Absolute Prohibitions

The following capabilities are permanently prohibited in the Resonance platform. These are not configuration options — they are structural impossibilities enforced at multiple levels.

### Speech Recognition — FORBIDDEN

Resonance MUST NOT perform speech-to-text conversion, phoneme detection, language identification, or any form of linguistic content analysis. The DSP pipeline operates exclusively on spectral features (MFCCs, centroid, rolloff) which are mathematical transforms that discard temporal fine structure required for speech intelligibility.

### Speaker Identification — FORBIDDEN

Resonance MUST NOT identify, distinguish, or track individual speakers. No speaker embedding models, voice activity detection targeting specific voices, or speaker diarization algorithms are permitted in any component.

### Voiceprint Storage — FORBIDDEN

Resonance MUST NOT store, compute, or transmit voiceprints, speaker embeddings, i-vectors, x-vectors, or any biometric audio signature that could identify a person. The REP protocol schema contains no fields capable of carrying such data.

### Keyword Monitoring — FORBIDDEN

Resonance MUST NOT detect specific spoken words, phrases, wake words, or trigger phrases. No keyword spotting, command recognition, or utterance detection of any kind is permitted.

### Continuous Recording — FORBIDDEN

Resonance MUST NOT record, store, or transmit continuous audio streams. The ephemeral ring buffer (≤5 seconds, volatile memory only) exists solely to provide a window for feature extraction upon impulse detection. No mechanism exists to persist or exfiltrate buffer contents.

## Enforcement Mechanisms

### Compile-Time Types (Primary)

The Rust type system enforces that functions processing audio data cannot produce outputs compatible with the network transmission layer. The `PrivacyKernel` type wraps all audio access and provides only feature extraction methods — no raw sample access is exposed outside the kernel boundary.

### Protocol Schema (Secondary)

The REP protocol definition (protobuf and JSON schema) contains no message type or field capable of carrying raw PCM samples, audio segments, transcripts, or speaker identifiers. Adding such a field requires a protocol version change, which requires review and re-signing.

### Attestation (Runtime Verification)

Each node's periodic attestation includes a declaration that its binary was compiled from source with the prohibited capability constraints active. The backend rejects observations from nodes that cannot attest.

### Code Review (Process)

Any contribution that adds audio output paths, speech processing dependencies, or speaker modeling capabilities MUST be rejected at code review. CODEOWNERS requires privacy team sign-off on changes to the privacy kernel, DSP pipeline, or protocol definitions.
