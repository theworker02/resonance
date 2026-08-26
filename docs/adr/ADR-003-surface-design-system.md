# ADR-003: Surface Design System

**Status:** Accepted  
**Date:** 2026-08-25

## Context

The Resonance console must present a coherent, accessible, and visually precise interface across many different views (fleet, incidents, models, deployments). Without a shared design system, visual inconsistencies accumulate and the product feels fragmented.

## Decision

Create "Surface" — a dedicated design system package at `packages/surface/`. Surface defines semantic design tokens, component contracts, motion language, and theme specifications. All console components must use Surface tokens rather than hard-coding visual values.

## Consequences

- Consistent visual language across all views
- Theme switching (light/dark) becomes a token swap, not a rewrite
- New views adopt the existing language by default
- Requires initial investment in token definition before component development
- Component library must be maintained alongside the console
