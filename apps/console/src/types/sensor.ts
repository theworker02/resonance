export type SensorStatus = 'healthy' | 'degraded' | 'offline' | 'maintenance';

export interface HealthScore {
  overall: number;
  audio_quality: number;
  clock_drift_ms: number;
  network_latency_ms: number;
  battery_pct: number | null;
  uptime_hours: number;
  last_event_seen: string | null;
  observation_rate_per_hour: number;
}

export interface InstalledDetector {
  pack_id: string;
  version: string;
  installed_at: string;
  last_triggered: string | null;
}

export interface PrivacyAttestation {
  attestation_id: string;
  sensor_id: string;
  firmware_version: string;
  privacy_kernel_enabled: boolean;
  continuous_recording_enabled: boolean;
  speech_recognition_available: boolean;
  audio_retention_policy: string;
  clip_capture_enabled: boolean;
  installed_detectors: InstalledDetector[];
  signed_at: string;
  signature: string;
  public_key_fingerprint: string;
  verified: boolean;
}

export interface SensorLocation {
  lat: number;
  lon: number;
  altitude_m: number | null;
  accuracy_m: number | null;
  source: 'gps' | 'manual' | 'estimated';
}

export interface SensorDetail {
  sensor_id: string;
  display_name: string;
  status: SensorStatus;
  location: SensorLocation | null;
  firmware_version: string;
  hardware_revision: string | null;
  enrolled_at: string;
  last_seen: string | null;
  health: HealthScore;
  attestation: PrivacyAttestation | null;
  installed_detectors: InstalledDetector[];
  observation_count_24h: number;
  incident_contribution_count_24h: number;
}

export interface SensorListItem {
  sensor_id: string;
  display_name: string;
  status: SensorStatus;
  health_overall: number;
  last_seen: string | null;
  location: SensorLocation | null;
  firmware_version: string;
}

export interface SensorListResponse {
  items: SensorListItem[];
  total: number;
  healthy_count: number;
  degraded_count: number;
  offline_count: number;
}

export interface SensorHealthHistory {
  sensor_id: string;
  samples: Array<{
    timestamp: string;
    overall: number;
    audio_quality: number;
    clock_drift_ms: number;
    network_latency_ms: number;
  }>;
}
