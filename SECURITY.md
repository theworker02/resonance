# Security Policy

## Supported Versions

| Version     | Supported          |
|-------------|--------------------|
| 0.5.x-dev   | :white_check_mark: (active development) |
| 0.1.x       | :x: (no longer maintained) |

## Reporting a Vulnerability

**Please do not report security vulnerabilities through public GitHub issues.**

### Preferred Method

Send an encrypted email to the security team:

- **Email:** security@resonance-project.example
- **PGP Key:** Published at `https://resonance-project.example/.well-known/security.asc`
- **Subject line:** `[SECURITY] <brief one-line description>`

### What to Include

Please provide as much of the following as possible:

1. Type of vulnerability (e.g., cryptographic weakness, replay attack bypass, privilege escalation)
2. The component(s) affected (e.g., `edge/src/rep/mod.rs`, NATS publisher, privacy kernel)
3. Steps to reproduce — a minimal proof-of-concept is extremely helpful
4. Potential impact assessment
5. Any suggested mitigations you have identified

### Response Timeline

| Milestone                        | Target      |
|----------------------------------|-------------|
| Acknowledgement of receipt       | 48 hours    |
| Initial severity assessment      | 5 business days |
| Patch availability (critical)    | 14 days     |
| Patch availability (high)        | 30 days     |
| Patch availability (medium/low)  | 90 days     |
| Public disclosure                | Coordinated with reporter |

We follow [Responsible Disclosure](https://en.wikipedia.org/wiki/Coordinated_vulnerability_disclosure).
Reporters who follow this policy will be credited in the release notes unless they prefer anonymity.

### Scope

The following are **in scope**:

- REP protocol cryptographic integrity (Ed25519 signing, replay nonce)
- Privacy kernel bypass (accessing raw PCM or enabling prohibited capabilities)
- Offline queue tampering / encrypted queue decryption
- NATS authentication bypass
- Key material exposure
- Remote code execution on edge nodes

The following are **out of scope**:

- Denial-of-service via acoustic input (physical-layer attacks)
- Issues in third-party dependencies (report to the upstream project)
- Theoretical vulnerabilities without demonstrated impact

### Bug Bounty

There is currently no paid bug bounty program. Significant findings will be acknowledged publicly and may qualify for future recognition if a bounty program is established.
