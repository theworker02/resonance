import { apiClient } from './client'
import type {
  SensorDetail,
  SensorListResponse,
  SensorHealthHistory,
} from '../../../../console/src/types/sensor'

export interface SensorListParams {
  status?: string
  limit?: number
  page?: number
}

export async function fetchSensors(params: SensorListParams = {}): Promise<SensorListResponse> {
  const { data } = await apiClient.get<SensorListResponse>('/v1/sensors', { params })
  return data
}

export async function fetchSensor(id: string): Promise<SensorDetail> {
  const { data } = await apiClient.get<SensorDetail>(`/v1/sensors/${id}`)
  return data
}

export async function fetchSensorHealthHistory(
  id: string,
  hours = 24,
): Promise<SensorHealthHistory> {
  const { data } = await apiClient.get<SensorHealthHistory>(
    `/v1/sensors/${id}/health`,
    { params: { hours } },
  )
  return data
}

export async function fetchSensorAttestation(id: string) {
  const { data } = await apiClient.get(`/v1/sensors/${id}/attestation`)
  return data
}

export interface SensorSummary {
  total: number;
  healthy: number;
  degraded: number;
  offline: number;
  maintenance: number;
  avg_health_score: number;
}

export async function fetchSensorSummary(): Promise<SensorSummary> {
  const { data } = await apiClient.get<SensorSummary>('/v1/sensors/summary')
  return data
}
