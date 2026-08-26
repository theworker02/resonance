//! Detector SDK interface — the contract for third-party acoustic detectors.

use serde::{Deserialize, Serialize};

/// Feature input provided to detectors by the platform.
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct DetectorInput {
    pub mfcc: Vec<f32>,
    pub spectral_centroid_hz: f32,
    pub spectral_rolloff_hz: f32,
    pub zero_crossing_rate: f32,
    pub peak_energy_db: f32,
    pub snr_db: f32,
    pub envelope: Vec<f32>,
    pub waveprint_hash: String,
    pub duration_ms: f32,
}

/// Output from a detector module.
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct DetectorOutput {
    pub classification: String,
    pub confidence: f32,
    pub alternatives: Vec<(String, f32)>,
    pub model_version: String,
    pub latency_ms: f32,
}

/// The interface every detector module must implement.
pub trait DetectorInterface: Send + Sync {
    fn name(&self) -> &str;
    fn version(&self) -> &str;
    fn supported_classes(&self) -> &[&str];
    fn analyze(&self, input: &DetectorInput) -> DetectorOutput;
    fn health(&self) -> bool;
}
