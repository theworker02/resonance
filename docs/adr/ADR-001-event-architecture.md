# ADR-001: Event-Driven Architecture

**Status:** Accepted  
**Date:** 2026-08-25

## Context

Resonance components need to communicate state changes without tight coupling. The platform must support real-time updates (WebSocket to console), async processing (model inference), and audit logging without blocking the critical path.

## Decision

Adopt an event-driven architecture using NATS JetStream as the message backbone. Domain events are published by the component that owns the state transition. Consumers subscribe to event streams relevant to their function.

Key domain events:
- `node.registered`, `node.health_changed`, `node.offline`
- `observation.received`, `observation.correlated`
- `incident.created`, `incident.reviewed`, `incident.closed`
- `model.promoted`, `model.deprecated`
- `deployment.created`, `deployment.degraded`

## Consequences

- Components can be deployed independently
- New consumers can be added without modifying publishers
- Event replay enables deterministic incident reconstruction
- Requires careful schema evolution (events are contracts)
- Requires idempotent consumers (at-least-once delivery)
