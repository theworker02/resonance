export type IncidentStatus =
  | 'pending_review'
  | 'confirmed'
  | 'review_rejected'
  | 'auto_rejected'
  | 'escalated';

export type ConfidenceLevel = 'HIGH' | 'NEEDS_VERIFICATION' | 'REJECTED';

export interface SensorObservation {
  observation_id: string;
  sensor_id: string;
  timestamp_utc: string;
  peak_energy_db: number;
  sensor_health_score: number;
  acoustic_fingerprint: string;
  /** SNR in dB */
  snr_db?: number;
  /** Duration of detected impulse in ms */
  duration_ms?: number;
  /** Frequency centroid in Hz */
  frequency_centroid_hz?: number;
}

export interface ConfidenceDimensions {
  /** Raw classifier ensemble score 0-1 */
  classification_confidence: number;
  /** Agreement between participating sensors 0-1 */
  sensor_agreement: number;
  /** Time-of-arrival consistency across nodes 0-1 */
  temporal_consistency: number;
  /** Signal-to-noise quality of observations 0-1 */
  signal_quality: number;
  /** Agreement across multiple detector models 0-1 */
  model_consensus: number;
  /** Baseline deviation — how unusual this event is for the location/time 0-1 */
  environmental_consistency: number;
}

export interface ConfidenceReport {
  dimensions: ConfidenceDimensions;
  overall_confidence: number;
  overall_level: ConfidenceLevel;
  primary_class: string;
  /** Competing classifications and their probability scores */
  alternatives: [string, number][];
  model_version: string;
  requires_human_review: boolean;
  /** Novelty score — 0 means well-known pattern, 1 means very unusual */
  novelty_score?: number;
  computed_at: string;
}

export interface ProvenanceEntry {
  entry_id: string;
  timestamp_utc: string;
  actor: string;
  action_type: string;
  action_data: Record<string, unknown>;
  /** SHA-256 of (prev_hash || entry content) */
  entry_hash: string;
  prev_hash: string | null;
}

export interface HumanReview {
  review_id: string;
  reviewer_role: string;
  original_machine_class: string | null;
  original_machine_confidence: number | null;
  reviewer_classification: string;
  reason: string | null;
  reviewed_at: string;
}

export interface AuditEntry {
  entry_id: string;
  incident_id: string;
  timestamp_utc: string;
  actor: string;
  action: string;
  details: Record<string, unknown>;
}

export interface Incident {
  incident_id: string;
  created_at: string;
  updated_at: string;
  status: IncidentStatus;
  estimated_lat: number | null;
  estimated_lon: number | null;
  location_cep_m: number | null;
  estimated_event_time: string;
  timing_uncertainty_ms: number;
  primary_class: string | null;
  overall_confidence: number | null;
  confidence_level: ConfidenceLevel | null;
  confidence_report: ConfidenceReport | null;
  alternatives: [string, number][] | null;
  observation_count: number;
  backend_version: string;
  model_version: string | null;
  observations?: SensorObservation[];
  provenance?: ProvenanceEntry[];
  human_review?: HumanReview | null;
  audit_log?: AuditEntry[];
}

export interface IncidentListItem {
  incident_id: string;
  created_at: string;
  status: IncidentStatus;
  primary_class: string | null;
  overall_confidence: number | null;
  confidence_level: ConfidenceLevel | null;
  observation_count: number;
  estimated_lat: number | null;
  estimated_lon: number | null;
  requires_human_review: boolean;
}

export interface IncidentListResponse {
  items: IncidentListItem[];
  total: number;
  page: number;
  page_size: number;
}

export interface HumanReviewRequest {
  reviewer_classification: string;
  reason: string;
}
