# Tests

Integration and end-to-end tests for the Resonance platform.

## Structure

```
tests/
├── integration/     Cross-crate integration tests
├── e2e/            End-to-end scenario tests
├── chaos/          Fault injection and resilience tests
└── benchmarks/     Performance benchmarks
```

## Running

```bash
cargo test --workspace
resonance benchmark run
resonance chaos --drop-sensors 10% --packet-loss 15%
```
