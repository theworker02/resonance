# Quality Gates (Items 130-133)

## Repository Completion Gate (Item 130)

No folder may be considered complete when it contains only:
- Stub files with no implementation
- TODO comments with no code
- Empty functions
- Placeholder tests

**Automated check**: CI scans for files < 10 lines in implementation directories.

## Implementation Depth Gate (Item 131)

For each major subsystem, verify:
- [ ] Validates inputs (Zod schemas, type guards)
- [ ] Handles errors (typed errors, not `throw new Error`)
- [ ] Persists state correctly (transactions, idempotency)
- [ ] Exposes metrics (duration, count, error rate)
- [ ] Has tests (unit + integration)
- [ ] Documents behavior (JSDoc/rustdoc)
- [ ] Recovers from failure (retry, fallback, graceful degradation)

## Code Quality Standard (Item 133)

Production components require:
- Clear interfaces (typed inputs/outputs)
- Typed errors (ResonanceError hierarchy)
- Structured logging (pino with correlation IDs)
- Tests (≥80% coverage for domain logic)
- Documentation (public API documented)
- Metrics (Prometheus-compatible)
- Configuration (environment-driven, validated at startup)

## Avoid Artificial Complexity (Item 132)

Do NOT:
- Add classes to increase apparent code volume
- Split simple functions unnecessarily
- Create abstractions with exactly one implementation
- Duplicate validation across layers
- Invent unnecessary services or microservices

Architecture is sophisticated because the **problem** is sophisticated, not because the code looks impressive.
