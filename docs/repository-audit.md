# Repository Audit — Phase IV Consolidation

**Date**: 2026-08-25
**Target**: Resonance v3.0 — Unified Spatial Acoustic Intelligence Platform

## Summary

| Directory | Status | Action | Destination |
|-----------|--------|--------|-------------|
| `core/` | Implemented | RENAME | `crates/resonance-core/` |
| `edge/` | Implemented | RENAME | `crates/resonance-edge/` |
| `crates/resonance-signal/` | Implemented (Phase IV) | KEEP | `crates/resonance-signal/` |
| `cli/` | Stub (Cargo.toml + main.rs) | RENAME | `apps/cli/` |
| `console/` | Implemented (React dashboard) | RENAME | `apps/console/` |
| `meshlab/` | Implemented (Python simulator) | RENAME | `apps/simulator/` |
| `intelligence/` | Partial (base.py + 4 stubs) | KEEP | `intelligence/` |
| `db/migrations/` | Implemented (010-014) | RENAME | `tools/db/migrations/` |
| `deploy/` | docker-compose + Dockerfile | RENAME | `tools/deploy/` |
| `docs/` | 6 architecture docs | KEEP | `docs/` |
| `hardware/` | README + BOM + YAML | RENAME | `hardware/reference-node/` |
| `rep/` | REP spec (md, proto, json) | MERGE | `specifications/` |
| `protocol/` | Obsolete Rust crate | REMOVE | (superseded by core types + rep/) |
| `sensor/` | Obsolete Rust crate (Phase I) | REMOVE | (superseded by edge/) |
| `done/` | Empty | REMOVE | — |
| `echo/` | Empty | REMOVE | — |

## Detailed Analysis

### `core/` → `crates/resonance-core/`
**Purpose**: Main Rust backend — correlation, SAM spatial mesh, provenance, incident management, ingestion, security, storage, confidence.
**Files**: Cargo.toml, src/ (config.rs, correlation/, incident/, ingestion/, provenance/, security/, storage/, confidence/, sam/)
**Status**: Fully implemented. SAM module contains geometry, wavegraph, mce, apf, meshcal, optimizer.
**Action**: RENAME to `crates/resonance-core/`

### `edge/` → `crates/resonance-edge/`
**Purpose**: Rust edge sensor node firmware — HAL, DSP, privacy kernel, REP publisher, health monitor, self-test.
**Files**: Cargo.toml, src/ (main.rs, config.rs, hal/, dsp/, privacy/, rep/, health/, publisher/, self_test.rs), sensor.example.toml, privacy-policy.yaml
**Status**: Fully implemented with linux and simulator HAL backends.
**Action**: RENAME to `crates/resonance-edge/`

### `crates/resonance-signal/` (NEW)
**Purpose**: Signal processing — GCC-PHAT cross-correlation, beamforming, VectorWave DOA, FusionCore, feature extraction.
**Files**: Cargo.toml, src/ (lib.rs, cross_correlation.rs, beamforming.rs, doa.rs, fusion.rs, features.rs)
**Status**: Fully implemented in Phase IV with 46 unit tests.
**Action**: KEEP

### `protocol/` → REMOVE
**Purpose**: Phase I shared types crate.
**Status**: Obsolete. All types now live in `core/src/incident/types.rs` and `rep/`.
**Action**: REMOVE (git preserves history)

### `sensor/` → REMOVE
**Purpose**: Phase I edge sensor prototype.
**Status**: Obsolete. Superseded by `edge/` which has complete implementation.
**Action**: REMOVE (git preserves history)

### `done/` → REMOVE
**Status**: Empty directory. No content.
**Action**: REMOVE

### `echo/` → REMOVE
**Status**: Empty directory. No content. Unclear original purpose.
**Action**: REMOVE
