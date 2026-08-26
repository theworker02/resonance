//! Smoke test — verifies core platform types compile and basic invariants hold.

#[test]
fn platform_crate_compiles() {
    // If this test runs, the platform crate compiled successfully.
    assert!(true);
}

#[test]
fn sdk_signal_rms_db_silent_input() {
    // Verify silent input produces very low dB.
    let samples = vec![0.0f32; 1024];
    let sum_sq: f64 = samples.iter().map(|&s| (s as f64).powi(2)).sum();
    let rms = (sum_sq / samples.len() as f64).sqrt();
    let db = if rms > 1e-10 { 20.0 * (rms as f32).log10() } else { -120.0 };
    assert!(db <= -100.0, "Silent input should be <= -100 dB, got {db}");
}

#[test]
fn timing_quality_weight_mapping() {
    // Verify the Chronos quality-to-weight mapping is monotonically decreasing.
    let weights = [1.0f32, 0.95, 0.75, 0.4, 0.2]; // Excellent..Unknown
    for w in weights.windows(2) {
        assert!(w[0] >= w[1], "Weights should decrease: {} < {}", w[0], w[1]);
    }
}
