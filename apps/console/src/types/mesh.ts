export type CellMode = 'nominal' | 'degraded' | 'observation_only' | 'unverified' | 'offline';
export type CellStatus = 'active' | 'degraded' | 'calibration_required' | 'inactive';
export type MeshSpatialTier = 'high' | 'moderate' | 'low' | 'unresolved';
export type HardwareFamily = 'rn_mini' | 'rn_edge' | 'rn_precision';
export type NodeRole = 'north_west' | 'north_east' | 'south_east' | 'south_west' | 'interior' | 'coordinator';
export type NodeFamily = 'healthy' | 'degraded' | 'offline' | 'maintenance';

export interface CellNode {
  sensor_id: string;
  role: NodeRole;
  family: NodeFamily;
  hardware_family: HardwareFamily;
  lat: number;
  lon: number;
  heading_deg: number;
  calibration_score: number;
  health_score: number;
  last_seen: string | null;
  firmware_version: string;
}

export interface SectorMap {
  cell_id: string;
  sectors: Array<{
    label: string;
    bearing_start_deg: number;
    bearing_end_deg: number;
    usable: boolean;
  }>;
}

export interface SpatialCell {
  cell_id: string;
  label: string;
  overlapping_cells: string[];
  cluster_id: string | null;
  geometry: {
    boundary: [number, number][];
    centroid: [number, number];
    width_m: number;
    height_m: number;
  };
  sector_map: SectorMap;
  nodes: CellNode[];
  status: CellStatus;
  mode: CellMode;
  calibration_score: number;
  created_at: string;
  updated_at: string;
}

export interface ApfRegion {
  label: string;
  polygon: [number, number][];
  centroid: [number, number];
  probability: number;
  merged_count: number;
  contributing_cell_ids: string[];
}

export interface AcousticProbabilityField {
  field_id: string;
  regions: ApfRegion[];
  outside_probability: number;
  has_dominant_region: boolean;
  dominant_region_diameter_m: number | null;
  summary: string;
}

export interface SpatialConfidence {
  spatial_region: number;
  temporal: number;
  sensor_health: number;
  environmental_model: number;
  direct_path_probability: number;
  cross_sensor_similarity: number;
  overall: number;
}

export interface MeshIncident {
  mesh_incident_id: string;
  incident_candidate_id: string;
  computed_at: string;
  probability_field: AcousticProbabilityField;
  spatial_tier: MeshSpatialTier;
  spatial_confidence: SpatialConfidence;
  supporting_cell_count: number;
  conflicting_cell_count: number;
  inter_cell_agreement: number;
  wavegraph_consistency: number;
  dominant_sector: string | null;
  sector_vote_fraction: number;
  possible_reflections_detected: boolean;
  mean_direct_path_probability: number;
  geometry_notes: string[];
}

export interface CalibrationDimension {
  dimension: string;
  score: number;
  status_message: string;
  needs_attention: boolean;
  last_evaluated: string;
}

export interface CellCalibrationState {
  cell_id: string;
  cell_label: string;
  evaluated_at: string;
  dimension_scores: Record<string, CalibrationDimension>;
  composite_score: number;
  requires_attention: boolean;
  attention_dimensions: string[];
  contribution_weight: number;
}

export interface HardwareManifest {
  sensor_id: string;
  device_family: HardwareFamily;
  hardware_revision: string;
  microphone_count: number;
  has_npu: boolean;
  has_gnss: boolean;
  has_precision_pps: boolean;
  has_environment_sensors: boolean;
  has_secure_element: boolean;
  has_orientation_sensors: boolean;
  firmware_version: string;
  generated_at: string;
}

export interface PropagationEdge {
  sensor_a: string;
  sensor_b: string;
  expected_tdoa_us: number;
  tdoa_std_us: number;
  co_detection_rate: number;
  observation_count: number;
  is_reliable: boolean;
}
