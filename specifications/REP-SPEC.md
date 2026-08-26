# Resonance Event Protocol (REP) v1

## Table of Contents

1. [Purpose and Design Principles](#purpose-and-design-principles)
2. [Message Types](#message-types)
3. [Version Negotiation](#version-negotiation)
4. [Integrity and Signature Verification](#integrity-and-signature-verification)
5. [Replay Protection](#replay-protection)
6. [Offline Buffering and Signed Replay](#offline-buffering-and-signed-replay)
7. [Forward Compatibility Rules](#forward-compatibility-rules)
8. [NATS Subject Naming](#nats-subject-naming)
9. [Rate Limiting](#rate-limiting)
10. [Privacy Constraints](#privacy-constraints)
11. [Error Handling](#error-handling)

---

## Purpose and Design Principles

The Resonance Event Protocol (REP) is the wire protocol used by Resonance edge
sensor nodes to transmit acoustic incident events to the Resonance core
infrastructure.

**Design goals:**

- **Integrity first** — every event is Ed25519-signed by the originating sensor.
  The core MUST reject unsigned or invalidly signed events.
- **Replay resistance** — every event includes a random nonce. The core
  maintains a nonce cache (TTL 24 hours) and MUST reject duplicate nonces.
- **Privacy by design** — no raw PCM audio, speech data, or speaker-identifying
  information is ever included in a REP message. The protocol only carries
  acoustic feature vectors.
- **Resilience** — edge nodes operate in low-connectivity environments. Offline
  buffering and signed replay are first-class features.
- **Forward compatibility** — the protocol is versioned. New optional fields may
  be added without breaking existing receivers.
- **Auditability** — every transmitted event includes sensor health metadata,
  making it possible to weight evidence by sensor reliability.

---

## Message Types

| Type            | Direction     | Description                                          |
|-----------------|---------------|------------------------------------------------------|
| `REPEvent`      | Edge → Core   | A single detected acoustic incident event            |
| `REPBatch`      | Edge → Core   | A signed batch of events (offline replay)            |
| `REPAck`        | Core → Edge   | Acknowledgement for an event or batch                |
| `REPNegotiate`  | Edge ↔ Core   | Version negotiation handshake                        |

The canonical schema is defined in `rep.proto` (Protobuf3) and `rep_schema.json`
(JSON Schema). JSON encoding is used for debugging and human inspection.
Bincode encoding is used for efficient transport over NATS.

---

## Version Negotiation

REP uses semver. The current protocol version is **1.0.0**.

### Handshake Flow

```
Edge                                Core
 │                                    │
 │── REPNegotiate (offered_versions) ─►│
 │                                    │  core picks highest mutually
 │                                    │  supported version
 │◄── REPNegotiate (accepted_version) ─│
 │                                    │
 │  [proceed with accepted_version]   │
```

1. On connection, the edge sends `REPNegotiate` with an ordered list of
   supported versions (newest first).
2. The core selects the highest version in the offered list that it supports
   and responds with `accepted_version` and `status = OK`.
3. If no common version is found, the core responds with
   `status = VERSION_MISMATCH` and the edge MUST NOT send events.
4. Version negotiation is re-run after any reconnection.

### Subject

Negotiation messages are published to `resonance.rep.negotiate`.

---

## Integrity and Signature Verification

Each `REPEvent` carries an Ed25519 signature in the `signature` field.

### Signing Procedure (Edge)

1. Collect all event fields **except** `signature`.
2. Serialize to canonical JSON: keys sorted lexicographically, no extra
   whitespace, UTF-8 encoded.
3. Sign the UTF-8 byte string with the sensor's Ed25519 private key.
4. Base64-encode the 64-byte signature and store in `signature`.

### Verification Procedure (Core)

1. Extract `signature` and remove the field from the received document.
2. Re-serialize the remaining fields as canonical JSON (same rules as above).
3. Decode the base64 signature.
4. Verify using the sensor's registered Ed25519 public key.
5. Reject the event with `ACK_STATUS_INVALID_SIGNATURE` if verification fails.

### Key Management

- Each sensor generates an Ed25519 keypair on first boot.
- The public key is registered with the core during sensor provisioning.
- Private keys are stored in `/etc/resonance/node_key.pem` (mode 0600).
- Key rotation is performed by re-provisioning the sensor.

---

## Replay Protection

Each `REPEvent` includes a `replay_nonce`: a randomly generated 16-byte value
encoded as a 32-character hex string.

### Rules

- The edge MUST generate a fresh cryptographically random nonce for every event.
- The core MUST maintain a nonce store with a 24-hour TTL.
- On receiving an event, the core checks the nonce store:
  - If the nonce is **not present**: accept the event, add nonce to store.
  - If the nonce is **already present**: reject with `ACK_STATUS_REPLAY_DETECTED`.
- The nonce store MUST be persisted across core restarts to prevent replay
  attacks during restart windows.

### Nonce Store Implementation Note

A Redis `SET NX EX 86400` operation satisfies the above requirements.
Alternatively, a Bloom filter may be used with appropriate false-positive rate
tuning (recommended FPR < 1e-6).

---

## Offline Buffering and Signed Replay

Edge nodes are deployed in environments where network connectivity may be
intermittent. REP supports offline buffering with cryptographic integrity.

### Offline Buffering

When the NATS connection is unavailable:

1. `REPEvent` messages are serialized (bincode) and appended to the encrypted
   local queue file: `/var/lib/resonance/offline_queue.bin`.
2. The queue file is encrypted with a symmetric key derived from the sensor's
   Ed25519 private key (using HKDF-SHA256 with a fixed info string
   `"resonance-offline-queue-v1"`).
3. The queue is bounded by a configurable maximum size. Oldest events are
   evicted if the limit is exceeded.
4. Each queued event retains its original `timestamp_utc`, `replay_nonce`, and
   `signature` — these are never modified.

### Signed Replay

On reconnection:

1. The edge reads the offline queue in chronological order.
2. Events are wrapped in a `REPBatch` and the batch is signed.
3. The batch is published to `resonance.rep.batch`.
4. The `received_late = true` flag is set on each event.
5. The original `timestamp_utc` is preserved; `received_time` is set by the
   core to the actual receipt time.
6. The core verifies each event's individual signature **and** the batch
   signature before ingesting.

### Distinguishing Event Time from Received Time

| Field            | Set by  | Meaning                                          |
|------------------|---------|--------------------------------------------------|
| `timestamp_utc`  | Edge    | When the acoustic event occurred                 |
| `received_time`  | Core    | When the core infrastructure received the event  |
| `received_late`  | Edge    | True if event was buffered; false or absent otherwise |

Downstream analytics MUST use `timestamp_utc` for event ordering and
`received_time` only for pipeline latency measurement.

---

## Forward Compatibility Rules

REP follows a **field-addition-only** policy for minor version increments.

| Change Type                        | Version Bump | Compatible? |
|------------------------------------|-------------|-------------|
| Add new optional field             | Minor       | Yes — old receivers ignore unknown fields |
| Add new required field             | Major       | No — requires negotiation |
| Remove or rename existing field    | Major       | No — breaking change |
| Change field type                  | Major       | No — breaking change |
| Add new enum value                 | Minor       | Yes — treat unknown as `UNSPECIFIED` |
| Remove enum value                  | Major       | No — breaking change |

Receivers MUST silently ignore unknown fields to maintain forward compatibility
(default behavior for JSON and Protobuf3).

---

## NATS Subject Naming

All NATS subjects use the prefix `resonance.rep`.

| Subject                                 | Direction     | Message Type   |
|-----------------------------------------|---------------|----------------|
| `resonance.rep.events.<sensor_id>`      | Edge → Core   | `REPEvent`     |
| `resonance.rep.batch`                   | Edge → Core   | `REPBatch`     |
| `resonance.rep.ack.<sensor_id>`         | Core → Edge   | `REPAck`       |
| `resonance.rep.negotiate`               | Edge ↔ Core   | `REPNegotiate` |
| `resonance.sensors.health`              | Edge → Core   | `SensorHealth` |
| `resonance.sensors.attestation`         | Edge → Core   | `PrivacyAttestation` |

### Subject Wildcards

- `resonance.rep.events.*` — subscribe to all sensor events
- `resonance.rep.ack.*` — subscribe to all acks
- `resonance.>` — subscribe to all Resonance traffic (monitoring only)

### Sensor ID in Subjects

`<sensor_id>` is the UUID of the sensor with hyphens replaced by underscores,
e.g., `resonance.rep.events.00000000_0000_0000_0000_000000000001`.

---

## Rate Limiting

To protect the core from misbehaving or compromised sensors:

- Maximum **100 events per minute** per sensor (enforced by the edge publisher
  and independently by the core ingestion gateway).
- Events exceeding the rate limit are queued locally, not dropped, and
  replayed in the next minute window.
- The core responds with `ACK_STATUS_RATE_LIMITED` if the edge exceeds the
  limit at the transport layer.

---

## Privacy Constraints

REP is designed so that it is **architecturally impossible** to transmit
privacy-violating data through the protocol:

- There is no field for raw PCM audio.
- There is no field for speech transcripts, speaker identity, or voiceprints.
- The feature vector fields (`mfcc`, `spectrum_magnitude`, etc.) carry only
  numerical statistics — they cannot be inverted to recover intelligible speech
  for typical environmental audio.
- The `PrivacyAttestation` message (published separately to
  `resonance.sensors.attestation`) allows downstream consumers to verify the
  capability constraints enforced by the edge node's firmware.

---

## Error Handling

| Error Condition           | Core Action              | Edge Action                     |
|---------------------------|-------------------------|---------------------------------|
| Invalid signature         | Reject, send NACK       | Log, do not retry same event    |
| Replay nonce collision    | Reject, send NACK       | Log, discard (not retried)      |
| Schema validation failure | Reject, send NACK       | Log, do not retry               |
| Rate limit exceeded       | Reject, send NACK       | Buffer, retry next window       |
| Core unreachable          | N/A                     | Buffer to offline queue         |
| Batch signature invalid   | Reject entire batch     | Log error, do not retry batch   |
| Version mismatch          | Reject, refuse conn     | Alert operator, halt publishing |
