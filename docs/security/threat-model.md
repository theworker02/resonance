# Threat Model

## Overview

This document identifies the attack surface, threat categories, and mitigations for the Resonance acoustic sensing platform. The analysis covers the full system from physical sensors through backend processing to operator interfaces.

## Attack Surface

### Sensor Layer
- Physical microphone arrays exposed in public environments
- Analog-to-digital conversion hardware
- Local compute module running edge firmware
- Debug interfaces (JTAG, UART) on hardware nodes

### Transport Layer
- Wired or wireless network connections between nodes and backend
- NATS message bus carrying REP protocol events
- TLS termination points
- DNS resolution for service discovery

### Backend Layer
- Correlation engine processing observations from multiple nodes
- ML inference pipeline (Python detector packs)
- Database storing incidents, audit records, and configuration
- API gateway serving REST and WebSocket endpoints

### Console Layer
- Web application served to operator browsers
- WebSocket connections carrying real-time events
- Authentication token storage in browser
- Operator review submissions affecting incident disposition

## Threat Categories and Mitigations

### Spoofing (Identity)

**Threat:** An attacker injects fabricated observations appearing to originate from a legitimate node, creating false incidents or masking real ones.

**Mitigations:**
- Every observation carries an Ed25519 signature from the originating node's unique identity key.
- Node enrollment requires physical attestation and operator approval.
- ConflictGuard detects statistically implausible observation patterns.
- Backend validates all signatures before processing; unsigned or invalid observations are rejected and logged.

### Tampering (Integrity)

**Threat:** An attacker modifies observations in transit, alters stored incident records, or tampers with node firmware.

**Mitigations:**
- End-to-end cryptographic signing of all REP events (signature covers full payload including timestamp and nonce).
- Audit trail entries are individually signed and append-only.
- Secure boot chain validates firmware integrity from ROM through application.
- Hardware manifest includes firmware hash verified against signed release artifacts.

### Replay Attacks

**Threat:** An attacker captures valid signed observations and replays them to trigger duplicate incidents or consume system resources.

**Mitigations:**
- Every REP event includes a random 16-byte nonce.
- Backend maintains a nonce deduplication window (configurable, default 10 minutes).
- Chronos timestamp validation rejects observations with timestamps outside acceptable clock skew tolerance.
- Rate limiting per node identity prevents observation flooding.

### Denial of Service

**Threat:** An attacker overwhelms nodes, network transport, or backend with volume to prevent legitimate incident detection.

**Mitigations:**
- Per-node rate limiting at the message bus layer.
- Backend admission control with backpressure signaling.
- Nodes operate autonomously during network partition, buffering observations for later replay.
- Geographic distribution means a localized attack affects only one cell.
- Health monitoring detects and alerts on abnormal observation rates.

### Information Disclosure

**Threat:** An attacker extracts audio data, location patterns, or operational details that could compromise privacy or security.

**Mitigations:**
- Privacy kernel enforces that raw audio never leaves the node (compile-time type safety, no protocol fields for audio payloads).
- Ephemeral ring buffer limited to 5 seconds with cryptographic erasure on overflow.
- TLS 1.3 for all network transport.
- API authentication required for all endpoints except the aggregated transparency report.
- Transparency endpoint publishes only aggregate statistics, never individual incident details.
- Node identity keys are per-device; compromising one key does not compromise the fleet.

### Elevation of Privilege

**Threat:** An attacker gains unauthorized access to administrative functions (node provisioning, model deployment, incident review).

**Mitigations:**
- Role-based access control with principle of least privilege.
- Operator reviews are cryptographically signed with operator identity.
- Node provisioning requires multi-factor authentication.
- API tokens are scoped to specific capabilities with short expiry.
- All privilege escalation events are logged in the audit trail.

## Residual Risks

- Physical destruction of nodes in accessible locations cannot be prevented by software, only detected via health monitoring.
- A sophisticated attacker with access to a node's hardware could potentially extract the private key; mitigated by secure element storage where hardware supports it.
- Environmental noise exceeding system design parameters may degrade detection accuracy; this is an availability concern managed by the Scene Health Assessment.
