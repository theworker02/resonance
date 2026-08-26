//! Signal processing primitives for detector developers.

/// Compute RMS energy of a buffer in dB.
pub fn rms_db(samples: &[f32]) -> f32 {
    if samples.is_empty() { return -120.0; }
    let sum_sq: f64 = samples.iter().map(|&s| (s as f64).powi(2)).sum();
    let rms = (sum_sq / samples.len() as f64).sqrt();
    if rms > 1e-10 { 20.0 * (rms as f32).log10() } else { -120.0 }
}

/// Compute zero-crossing rate (crossings per sample).
pub fn zero_crossing_rate(samples: &[f32]) -> f32 {
    if samples.len() < 2 { return 0.0; }
    let crossings = samples.windows(2)
        .filter(|w| (w[0] >= 0.0) != (w[1] >= 0.0))
        .count();
    crossings as f32 / (samples.len() - 1) as f32
}
