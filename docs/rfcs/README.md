# Resonance RFC Process

## Overview

Resonance RFCs (Request for Comments) are design documents that propose significant changes to the platform architecture, hardware design, protocol specification, or operational model. The RFC process ensures that substantial changes are reviewed, discussed, and documented before implementation.

## When to Write an RFC

An RFC is required for:

- New hardware node families or significant changes to existing designs
- Protocol version changes or new message types
- New architectural components or subsystems
- Changes to privacy constraints or security boundaries
- New detector SDK interfaces
- Removal of existing capabilities
- Cross-cutting concerns affecting multiple crates

An RFC is NOT required for:

- Bug fixes
- Performance optimizations that don't change interfaces
- Documentation improvements
- Dependency updates
- Internal refactoring that preserves external behavior

## RFC Lifecycle

1. **Draft:** Author creates a new RFC document in the appropriate subdirectory.
2. **Discussion:** The RFC is submitted as a pull request. Reviewers provide feedback via PR comments.
3. **Revision:** Author incorporates feedback and updates the RFC.
4. **Accepted:** After sufficient review and consensus, the RFC is merged.
5. **Implemented:** The RFC is implemented. Implementation PRs reference the RFC.
6. **Superseded:** If a later RFC replaces this one, it is marked as superseded with a link.

## Directory Structure

```
docs/rfcs/
├── README.md           (this file)
├── hardware/           Hardware design RFCs
│   └── RFC-XXXX-*.md
├── protocol/           Protocol specification RFCs
│   └── RFC-XXXX-*.md
├── architecture/       System architecture RFCs
│   └── RFC-XXXX-*.md
└── privacy/            Privacy and security RFCs
    └── RFC-XXXX-*.md
```

## RFC Format

Each RFC MUST include the following sections:

```markdown
# RFC-XXXX: Title

- **Status:** Draft | Discussion | Accepted | Implemented | Superseded
- **Author:** Name
- **Date:** YYYY-MM-DD
- **Supersedes:** (if applicable)
- **Superseded by:** (if applicable)

## Summary

One paragraph describing the proposal.

## Motivation

Why is this change needed? What problem does it solve?

## Design

Detailed technical design. Include diagrams where helpful.

## Alternatives Considered

What other approaches were evaluated and why were they rejected?

## Impact

- What existing systems are affected?
- What are the migration requirements?
- Are there backward compatibility concerns?

## Open Questions

Unresolved design decisions requiring input.
```

## Numbering

RFCs are numbered sequentially within each subdirectory starting from 0001. Numbers are never reused, even if an RFC is withdrawn.

## Review Requirements

- Hardware RFCs require sign-off from Hardware Engineering and Architecture.
- Protocol RFCs require sign-off from Protocol Team and Security.
- Architecture RFCs require sign-off from Architecture Lead.
- Privacy RFCs require sign-off from Privacy Team and Legal.
