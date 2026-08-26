# Fleet Identity

## Per-Device Identity

Every Resonance node possesses a unique cryptographic identity based on Ed25519 key pairs. There are no shared fleet keys, group keys, or symmetric secrets distributed across nodes. Compromising one node's identity does not affect any other node in the deployment.

## Key Generation

Each node generates its Ed25519 key pair during initial provisioning:

1. The secure random number generator (hardware RNG where available, with entropy health monitoring) produces 32 bytes of seed material.
2. The Ed25519 private key is derived from the seed.
3. The private key is stored in the node's secure storage (secure element on production hardware, encrypted file on development boards).
4. The public key is exported for enrollment.

The private key MUST NEVER leave the node. There is no key export, backup, or escrow mechanism. If a node's key is lost, the node is re-provisioned with a new identity.

## Enrollment Flow

1. **Manufacturing/Provisioning:** The node generates its key pair and enters enrollment mode. It broadcasts its public key and hardware serial number on the local network.

2. **Operator Approval:** An authorized operator reviews the enrollment request via the CLI or console. The operator verifies the node's physical identity (serial number matches hardware label) and approves enrollment.

3. **Certificate Issuance:** The backend issues a signed enrollment certificate binding the node's public key to its identity (UUID), hardware family, cell assignment, and enrollment timestamp.

4. **Attestation Begin:** The node publishes its first privacy attestation, signed with its new identity. The backend begins accepting observations from this node.

5. **Ongoing Attestation:** Every 5 minutes (configurable), the node publishes a signed attestation confirming its privacy constraints, firmware integrity, and operational status.

## Revocation

Node identities can be revoked through the following mechanisms:

- **Operator Revocation:** An authorized operator marks a node as revoked via the API or CLI. The backend immediately stops accepting observations from the revoked identity.

- **Automatic Revocation:** If a node fails to publish a valid attestation within the configured timeout (default: 30 minutes), its identity is automatically suspended. Observations are held in a quarantine queue pending investigation.

- **Compromise Response:** If a node identity is suspected compromised, the operator issues an emergency revocation. All observations from that identity within a configurable lookback window are flagged for review.

Revocation is propagated to all backend instances within one NATS heartbeat interval (typically < 1 second). Revoked identities cannot be re-enrolled; the physical node must be re-provisioned with a fresh key pair.

## Why No Shared Fleet Keys

Shared keys create single points of compromise. If a fleet-wide key is extracted from any node, an attacker can impersonate any node in the deployment. Per-device keys ensure:

- Blast radius of a compromise is limited to one node.
- Revocation is granular — one node can be revoked without affecting others.
- Audit trails are attributable to specific hardware.
- Key rotation (via re-provisioning) affects only the target node.

## Key Rotation

Routine key rotation is performed by re-provisioning the node:

1. Operator initiates rotation via CLI.
2. Node generates a new key pair.
3. Node signs a rotation request with both old and new keys.
4. Backend verifies both signatures, issues new enrollment certificate, and revokes the old identity.
5. Transition is atomic — no observation gap during rotation.
