# ADR-005: Evidence Storage

**Status:** Accepted  
**Date:** 2026-08-25

## Context

Incident evidence (observations, model outputs, provenance chains, environmental context) must be stored durably, exported as self-contained bundles, and verified independently. The storage format affects auditability, legal admissibility, and long-term reproducibility.

## Decision

Evidence is stored as individual records in PostgreSQL with cryptographic hashes. Evidence bundles are exported as ZIP archives containing JSON files with verification checksums. The format is:

```
evidence-bundle/
├── incident.json
├── observations.json
├── models.json
├── environment.json
├── hardware.json
├── audit.json
└── checksums.sha256
```

Each file is independently verifiable. The bundle is signed by the platform's signing key.

## Consequences

- Evidence is portable (no database required to read it)
- Independent verification is possible with only the public key
- Storage costs scale with incident volume
- Retention policies must be enforced at the storage layer
