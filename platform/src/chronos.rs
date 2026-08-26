//! Chronos — precision timing subsystem.
//!
//! Manages GNSS time, PPS, local oscillator, clock drift, sample counters,
//! and network time. Every node reports timing quality so that cross-node
//! correlation can weight observations accordingly.

use chrono::{DateTime, Utc};
use serde::{Deserialize, Serialize};
use uuid::Uuid;

/// Timing state reported by a node.
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct TimingState {
    pub node_id: Uuid,
    pub timestamp: DateTime<Utc>,
    pub gnss_time: Option<DateTime<Utc>>,
    pub pps_age_ms: f64,
    pub clock_error_us: f32,
    pub clock_drift_us_per_s: f32,
    pub oscillator_status: OscillatorStatus,
    pub sync_source: SyncSource,
    pub quality: TimingQuality,
}

#[derive(Debug, Clone, Copy, PartialEq, Eq, Serialize, Deserialize)]
#[serde(rename_all = "snake_case")]
pub enum OscillatorStatus { Locked, Holdover, FreeRunning, Degraded }

#[derive(Debug, Clone, Copy, PartialEq, Eq, Serialize, Deserialize)]
#[serde(rename_all = "snake_case")]
pub enum SyncSource { GnssPps, Ntp, Ptp, FreeRun }

#[derive(Debug, Clone, Copy, PartialEq, Eq, Serialize, Deserialize)]
#[serde(rename_all = "snake_case")]
pub enum TimingQuality { Excellent, Good, Acceptable, Poor, Unknown }

impl TimingQuality {
    pub fn from_error(error_us: f32) -> Self {
        match error_us.abs() {
            e if e < 1.0 => Self::Excellent,
            e if e < 10.0 => Self::Good,
            e if e < 100.0 => Self::Acceptable,
            _ => Self::Poor,
        }
    }

    /// Weight factor for correlation (0–1).
    pub fn weight(&self) -> f32 {
        match self {
            Self::Excellent => 1.0,
            Self::Good => 0.95,
            Self::Acceptable => 0.75,
            Self::Poor => 0.4,
            Self::Unknown => 0.2,
        }
    }
}

/// Chronos timing manager.
pub struct Chronos;

impl Chronos {
    /// Evaluate timing quality and compute correlation weight.
    pub fn evaluate(state: &TimingState) -> f32 {
        let base = state.quality.weight();
        let pps_penalty = if state.pps_age_ms > 5000.0 { 0.8 } else { 1.0 };
        let osc_penalty = match state.oscillator_status {
            OscillatorStatus::Locked => 1.0,
            OscillatorStatus::Holdover => 0.9,
            OscillatorStatus::FreeRunning => 0.6,
            OscillatorStatus::Degraded => 0.3,
        };
        (base * pps_penalty * osc_penalty).clamp(0.0, 1.0)
    }
}
