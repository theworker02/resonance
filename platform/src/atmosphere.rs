//! Atmosphere Engine — environmental compensation for acoustic propagation.
//!
//! Uses measured temperature, humidity, pressure, and wind to correct
//! speed-of-sound estimates and DOA calculations.

use serde::{Deserialize, Serialize};
use chrono::{DateTime, Utc};
use uuid::Uuid;

/// Environmental context from one node's Atmos sensors.
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct EnvironmentContext {
    pub node_id: Uuid,
    pub timestamp: DateTime<Utc>,
    pub temperature_c: f32,
    pub humidity_pct: f32,
    pub pressure_hpa: f32,
    pub wind_speed_ms: f32,
    pub wind_bearing_deg: f32,
    pub rain_detected: bool,
    pub speed_of_sound_ms: f32,
    pub air_density_kg_m3: f32,
}

/// Atmosphere Engine computes propagation corrections.
pub struct AtmosphereEngine;

impl AtmosphereEngine {
    /// Compute speed of sound from temperature (simplified Cramer model).
    /// c ≈ 331.3 + 0.606 * T(°C)
    pub fn speed_of_sound(temp_c: f32) -> f32 {
        331.3 + 0.606 * temp_c
    }

    /// Compute approximate air density from temperature and pressure.
    /// ρ ≈ P / (R_specific * T_kelvin)
    pub fn air_density(temp_c: f32, pressure_hpa: f32) -> f32 {
        let t_kelvin = temp_c + 273.15;
        let p_pascal = pressure_hpa * 100.0;
        let r_specific = 287.05; // J/(kg·K) for dry air
        p_pascal / (r_specific * t_kelvin)
    }

    /// Compute wind correction angle (degrees) for DOA.
    /// Crosswind shifts apparent direction of arrival.
    pub fn wind_correction_deg(
        wind_speed_ms: f32,
        wind_bearing_deg: f32,
        doa_azimuth_deg: f32,
        speed_of_sound: f32,
    ) -> f32 {
        if wind_speed_ms < 0.5 { return 0.0; }
        let relative_angle_rad = (wind_bearing_deg - doa_azimuth_deg).to_radians();
        let crosswind = wind_speed_ms * relative_angle_rad.sin();
        (crosswind / speed_of_sound).atan().to_degrees()
    }

    /// Build a complete EnvironmentContext from sensor readings.
    pub fn build_context(
        node_id: Uuid,
        temp_c: f32,
        humidity_pct: f32,
        pressure_hpa: f32,
        wind_speed_ms: f32,
        wind_bearing_deg: f32,
        rain_detected: bool,
    ) -> EnvironmentContext {
        EnvironmentContext {
            node_id,
            timestamp: Utc::now(),
            temperature_c: temp_c,
            humidity_pct,
            pressure_hpa,
            wind_speed_ms,
            wind_bearing_deg,
            rain_detected,
            speed_of_sound_ms: Self::speed_of_sound(temp_c),
            air_density_kg_m3: Self::air_density(temp_c, pressure_hpa),
        }
    }
}
