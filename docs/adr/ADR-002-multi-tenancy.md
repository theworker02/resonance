# ADR-002: Multi-Tenancy Model

**Status:** Accepted  
**Date:** 2026-08-25

## Context

Resonance Cloud must support multiple organizations safely. Data isolation, authorization, and resource limits must be enforced at the platform level, not merely trusted from the frontend.

## Decision

Implement a hierarchical tenant model: Organization → Workspace → Deployment → Region → Cell → Node. Every database query is scoped by `organization_id` at minimum. Authorization is enforced in middleware before route handlers execute.

RBAC uses 8 predefined roles with granular permissions. The permission engine is centralized — no scattered authorization checks in business logic.

## Consequences

- All queries must include tenant scope (enforced via query builder middleware)
- Cross-tenant data access is impossible without explicit system-level override
- Role changes take effect immediately (no cached permissions beyond token TTL)
- Testing requires tenant fixtures
