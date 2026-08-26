import { apiClient } from './client'
import type {
  Incident,
  IncidentListResponse,
  HumanReviewRequest,
  HumanReview,
  AuditEntry,
} from '../../../../console/src/types/incident'

export interface IncidentListParams {
  status?: string
  min_confidence?: number
  limit?: number
  page?: number
  order?: 'asc' | 'desc'
}

export async function fetchIncidents(params: IncidentListParams = {}): Promise<IncidentListResponse> {
  const { data } = await apiClient.get<IncidentListResponse>('/v1/incidents', { params })
  return data
}

export async function fetchIncident(id: string): Promise<Incident> {
  const { data } = await apiClient.get<Incident>(`/v1/incidents/${id}`)
  return data
}

export async function submitHumanReview(
  incidentId: string,
  review: HumanReviewRequest,
): Promise<HumanReview> {
  const { data } = await apiClient.post<HumanReview>(
    `/v1/incidents/${incidentId}/review`,
    review,
  )
  return data
}

export async function fetchAuditLog(incidentId: string): Promise<AuditEntry[]> {
  const { data } = await apiClient.get<AuditEntry[]>(
    `/v1/incidents/${incidentId}/audit`,
  )
  return data
}

export async function verifyProvenanceChain(incidentId: string): Promise<{ valid: boolean; entry_count: number; message: string }> {
  const { data } = await apiClient.post<{ valid: boolean; entry_count: number; message: string }>(
    `/v1/incidents/${incidentId}/verify-provenance`,
  )
  return data
}

export interface IncidentStats {
  total_24h: number;
  high_confidence_pct: number;
  pending_review: number;
  auto_rejected_24h: number;
  confirmed_24h: number;
  false_positive_rate_trend: Array<{ date: string; rate: number }>;
}

export async function fetchIncidentStats(): Promise<IncidentStats> {
  const { data } = await apiClient.get<IncidentStats>('/v1/incidents/stats')
  return data
}
