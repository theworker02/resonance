# ADR-006: Plugin Architecture

**Status:** Accepted  
**Date:** 2026-08-25

## Context

Resonance needs extensibility for detector modules, integrations (SIEM, CAD), custom analytics, and visualization plugins. Third-party developers should contribute without modifying the core platform.

## Decision

Implement a sandboxed plugin system with explicit capability permissions. Plugins declare capabilities in a manifest. The runtime validates and restricts access to declared capabilities only. Plugins cannot access raw audio, the filesystem outside their sandbox, or network without explicit permission.

Plugin classes: `detector`, `integration`, `exporter`, `analytics`, `visualization`.

## Consequences

- Third-party detectors can be developed against the SDK
- Plugins are isolated — a crashing plugin cannot affect the platform
- Security: plugins must be signed for production environments
- Capability model prevents privilege escalation
- Marketplace possible in future (discovery, rating, verified publishers)
