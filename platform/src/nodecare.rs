//! NodeCare — predictive maintenance for sensor nodes.
//!
//! Analyzes health telemetry, component age, error rates, calibration trends,
//! power events, and environment exposure to predict maintenance requirements
//! before full failure occurs.

use chrono::{DateTime, Utc};
use serde::{Deserialize, Serialize};
use uuid::Uuid;

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct NodeHealthTelemetry {
    pub node_id: Uuid,
    pub timestamp: DateTime<Utc>,
    pub cpu_temp_c: f32,
    pub microphone_channels_healthy: u8,
    pub microphone_channels_total: u8,
    pub clock_drift_us: f32,
    pub calibration_age_hours: f32,
    pub power_cycles: u32,
    pub error_rate_per_hour: f32,
    pub uptime_hours: f32,
    pub battery_health_pct: Option<f32>,
    pub enclosure_humidity_pct: Option<f32>,
}

#[derive(Debug, Clone, Copy, PartialEq, Eq, Serialize, Deserialize)]
#[serde(rename_all = "snake_case")]
pub enum MaintenanceUrgency { None, Scheduled, Soon, Immediate }

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct MaintenancePrediction {
    pub node_id: Uuid,
    pub urgency: MaintenanceUrgency,
    pub predicted_issues: Vec<PredictedIssue>,
    pub overall_health_score: f32,
    pub estimated_days_to_degradation: Option<f32>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct PredictedIssue {
    pub component: String,
    pub description: String,
    pub severity: f32,
    pub action: String,
}

pub struct NodeCare;

impl NodeCare {
    pub fn evaluate(telemetry: &NodeHealthTelemetry) -> MaintenancePrediction {
        let mut issues = Vec::new();
        let mut health = 100.0f32;

        // Microphone health
        let mic_ratio = telemetry.microphone_channels_healthy as f32
            / telemetry.microphone_channels_total.max(1) as f32;
        if mic_ratio < 1.0 {
            let lost = telemetry.microphone_channels_total - telemetry.microphone_channels_healthy;
            health -= (1.0 - mic_ratio) * 30.0;
            issues.push(PredictedIssue {
                component: "microphones".into(),
                description: format!("{lost} channel(s) degraded or offline"),
                severity: 1.0 - mic_ratio,
                action: "Inspect acoustic array. Replace cartridge if channels unrecoverable.".into(),
            });
        }

        // Clock drift
        if telemetry.clock_drift_us.abs() > 50.0 {
            health -= 15.0;
            issues.push(PredictedIssue {
                component: "timing".into(),
                description: format!("Clock drift {:.0}\u{00B5}s exceeds threshold", telemetry.clock_drift_us),
                severity: (telemetry.clock_drift_us.abs() / 200.0).clamp(0.0, 1.0),
                action: "Check GNSS antenna. Verify PPS connection.".into(),
            });
        }

        // Calibration age
        if telemetry.calibration_age_hours > 8760.0 { // > 1 year
            health -= 10.0;
            issues.push(PredictedIssue {
                component: "calibration".into(),
                description: "Calibration older than 12 months".into(),
                severity: 0.5,
                action: "Schedule recalibration.".into(),
            });
        }

        // Thermal
        if telemetry.cpu_temp_c > 75.0 {
            health -= 10.0;
            issues.push(PredictedIssue {
                component: "thermal".into(),
                description: format!("CPU temperature {:.0}\u{00B0}C is elevated", telemetry.cpu_temp_c),
                severity: ((telemetry.cpu_temp_c - 75.0) / 20.0).clamp(0.0, 1.0),
                action: "Inspect enclosure ventilation. Check for obstruction.".into(),
            });
        }

        // Enclosure moisture
        if let Some(humidity) = telemetry.enclosure_humidity_pct {
            if humidity > 80.0 {
                health -= 20.0;
                issues.push(PredictedIssue {
                    component: "enclosure".into(),
                    description: format!("Internal humidity {humidity:.0}% \u{2014} possible seal failure"),
                    severity: ((humidity - 80.0) / 20.0).clamp(0.0, 1.0),
                    action: "URGENT: Inspect enclosure seals. Check for water ingress.".into(),
                });
            }
        }

        // Error rate
        if telemetry.error_rate_per_hour > 5.0 {
            health -= 10.0;
            issues.push(PredictedIssue {
                component: "system".into(),
                description: format!("Error rate {:.1}/hour is elevated", telemetry.error_rate_per_hour),
                severity: (telemetry.error_rate_per_hour / 20.0).clamp(0.0, 1.0),
                action: "Review system logs. Check firmware version.".into(),
            });
        }

        let urgency = match health {
            h if h >= 90.0 => MaintenanceUrgency::None,
            h if h >= 70.0 => MaintenanceUrgency::Scheduled,
            h if h >= 50.0 => MaintenanceUrgency::Soon,
            _ => MaintenanceUrgency::Immediate,
        };

        let days_to_degradation = if health >= 90.0 {
            None
        } else {
            Some(((health - 50.0).max(0.0) / 0.5).max(1.0)) // rough estimate
        };

        MaintenancePrediction {
            node_id: telemetry.node_id,
            urgency,
            predicted_issues: issues,
            overall_health_score: health.clamp(0.0, 100.0),
            estimated_days_to_degradation: days_to_degradation,
        }
    }
}
