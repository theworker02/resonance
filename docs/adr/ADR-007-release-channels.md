# ADR-007: Release Channels

**Status:** Accepted  
**Date:** 2026-08-25

## Context

Different environments need different stability guarantees. Production deployments need proven stability. Development needs fast iteration. Research needs access to experimental features.

## Decision

Support four release channels:
- **nightly**: automated builds from main, may break
- **preview**: weekly stabilized builds, feature-complete but not fully tested
- **stable**: monthly releases, full test suite passed, recommended for production
- **LTS**: quarterly releases with 12-month security support, for regulated environments

Firmware, models, and platform components each follow these channels independently.

## Consequences

- Production deployments pin to `stable` or `LTS`
- Development uses `nightly` or `preview`
- Security patches are backported to `stable` and `LTS`
- Channel selection is per-workspace (not per-node)
