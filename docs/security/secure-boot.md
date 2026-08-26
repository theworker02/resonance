# Secure Boot

## Boot Chain

Resonance hardware nodes implement a verified boot chain that ensures only authenticated firmware executes on production hardware. Each stage verifies the integrity of the next before transferring control.

### Stage 1: ROM Bootloader

The immutable ROM bootloader is burned into the SoC at manufacturing. It contains the root of trust — a public key used to verify the second-stage bootloader. This code cannot be updated and MUST NOT contain any vulnerabilities.

**Verification failure:** Node halts. No further boot progress. Hardware LED indicates ROM-level failure (solid red). The node is non-functional until physically serviced.

### Stage 2: Signed Bootloader (U-Boot)

The second-stage bootloader is stored in flash and signed with the platform release key. The ROM verifies its signature before execution.

**Verification failure:** Node halts at bootloader stage. Network stack is not initialized. Hardware LED indicates bootloader failure (blinking red). Recovery requires physical access with signed recovery image via USB.

### Stage 3: Signed OS Kernel

The bootloader verifies the Linux kernel image signature before loading. The kernel image includes an embedded initramfs with dm-verity root hash.

**Verification failure:** Bootloader refuses to load kernel. Node remains in bootloader recovery mode. Alerts via hardware LED (double-blink red). Operator MUST deploy a signed kernel update or perform physical recovery.

### Stage 4: Verified Root Filesystem

dm-verity provides block-level integrity verification of the read-only root filesystem. Any modification to filesystem blocks is detected at read time.

**Verification failure:** Affected block reads return I/O errors. System logs the violation, reports via health channel (if network is available), and initiates graceful shutdown. Node enters recovery mode.

### Stage 5: Application Services

The resonance-edge binary and supporting services are verified against signed manifests before execution. The privacy kernel initialization is the first application-level step, establishing the prohibited capability constraints before any audio processing begins.

**Verification failure:** Service refuses to start. Node reports firmware integrity failure via health attestation. Privacy attestation is withheld — the backend will not accept observations from a node that cannot attest its integrity.

## Key Management

- ROM root key: Burned at manufacturing, no rotation possible.
- Platform release key: Held offline by release engineering. Signs bootloader and kernel images.
- Firmware signing key: Per-release key derived from platform key. Signs application binaries.
- All keys use Ed25519 with 256-bit security level.

## Anti-Rollback

Each signed stage includes a monotonic version counter stored in one-time-programmable (OTP) fuses. The ROM and bootloader reject any image with a version counter lower than the current fuse value, preventing rollback to vulnerable firmware versions.
