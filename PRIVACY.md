# Privacy Guarantees

Resonance edge nodes are deployed in public and semi-public spaces to detect
acoustic incidents (e.g., gunshots, vehicle collisions, glass breaking). This
document explains in plain language what data the system collects, what it does
not collect, and how those guarantees are enforced.

---

## What Resonance Does

- **Detects acoustic events** — The edge node listens continuously for loud
  impulsive sounds that match known incident signatures (gunshots, impacts,
  breaking glass, etc.).
- **Extracts acoustic features** — When a candidate event is detected, a short
  window of audio is analyzed to produce a compact numerical fingerprint:
  frequency content (spectrum, MFCCs), energy envelope, and a few scalar
  statistics. These numbers are not intelligible as speech and cannot be
  inverted to recover the original audio.
- **Transmits event metadata** — The fingerprint, timestamp, sensor ID, and
  health metrics are signed and sent to the Resonance core over NATS. No raw
  audio is transmitted.
- **Maintains a short ring buffer** — Up to 5 seconds of raw PCM is held in
  memory to support feature extraction. This buffer is never written to disk
  (unless the operator explicitly enables encrypted clip capture — see below).
  It is continuously overwritten as new audio arrives.

---

## What Resonance Does Not Do

The following capabilities are **permanently disabled**. They cannot be enabled
through configuration files, environment variables, or remote commands. The
prohibition is enforced at compile time by the `ProhibitedCapability` type in
the privacy kernel — code that would enable these features simply cannot be
constructed.

| Prohibited Capability         | Enforcement               |
|-------------------------------|---------------------------|
| Speech recognition            | Compile-time + runtime    |
| Speaker identification        | Compile-time + runtime    |
| Voiceprint / biometric storage | Compile-time + runtime   |
| Continuous audio upload       | Compile-time + runtime    |
| Long-term audio retention     | Compile-time + runtime    |

---

## Audio Retention

| Item                          | Duration / Policy                               |
|-------------------------------|--------------------------------------------------|
| In-memory ring buffer         | ≤ 5 seconds (rolling, continuously overwritten) |
| Raw PCM on disk               | Never, unless clip capture is enabled            |
| Encrypted clip (if enabled)   | Operator-configured; default is disabled         |
| Acoustic feature vectors      | Not stored on edge; transmitted and stored by core |
| Timestamps and event metadata | Stored in core per retention policy              |

---

## Operator-Configurable Options

Operators (organizations deploying sensors) may configure:

- **Clip capture** (`clip_capture_enabled = false` by default) — If enabled,
  a short encrypted audio clip is captured around detected events. The clip is
  encrypted before any disk write. Operators must document this in their own
  privacy notices where required by law.
- **Location label** — A human-readable name for the sensor location, stored
  only in the sensor's own config.
- **Buffer duration** — Can be reduced below 5 seconds; cannot exceed 5 seconds
  without a source code change and rebuild.

Operators **cannot** enable the prohibited capabilities listed above regardless
of configuration.

---

## Machine-Readable Attestation

Every edge node publishes a signed `PrivacyAttestation` to the NATS subject
`resonance.sensors.attestation` at startup and every 5 minutes. The attestation
lists all installed capabilities and their status, signed with the node's
Ed25519 private key. Downstream systems can verify this attestation to confirm
a sensor is running a privacy-compliant build.

---

## Legal Basis and Operator Responsibilities

Resonance provides a privacy-respecting technical platform. Operators are
responsible for:

- Posting appropriate notices where sensors are deployed
- Complying with local laws governing acoustic monitoring in public spaces
- Handling event metadata (timestamps, locations) in accordance with applicable
  data protection regulations (GDPR, CCPA, etc.)

If you have questions or concerns about a specific deployment, contact the
operator of that deployment.

For concerns about the Resonance platform itself, contact:
**privacy@resonance-project.example**
