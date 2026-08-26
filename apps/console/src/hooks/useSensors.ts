import { useQuery } from '@tanstack/react-query'
import {
  fetchSensors,
  fetchSensor,
  fetchSensorHealthHistory,
  fetchSensorSummary,
  type SensorListParams,
} from '../api/sensors'

export const sensorKeys = {
  all: ['sensors'] as const,
  lists: () => [...sensorKeys.all, 'list'] as const,
  list: (params: SensorListParams) => [...sensorKeys.lists(), params] as const,
  details: () => [...sensorKeys.all, 'detail'] as const,
  detail: (id: string) => [...sensorKeys.details(), id] as const,
  health: (id: string, hours: number) => [...sensorKeys.all, 'health', id, hours] as const,
  summary: () => [...sensorKeys.all, 'summary'] as const,
}

export function useSensors(params: SensorListParams = {}) {
  return useQuery({
    queryKey: sensorKeys.list(params),
    queryFn: () => fetchSensors(params),
    staleTime: 30_000,
    refetchInterval: 30_000,
  })
}

export function useSensor(id: string) {
  return useQuery({
    queryKey: sensorKeys.detail(id),
    queryFn: () => fetchSensor(id),
    staleTime: 30_000,
    enabled: !!id,
  })
}

export function useSensorHealthHistory(id: string, hours = 24) {
  return useQuery({
    queryKey: sensorKeys.health(id, hours),
    queryFn: () => fetchSensorHealthHistory(id, hours),
    staleTime: 60_000,
    enabled: !!id,
  })
}

export function useSensorSummary() {
  return useQuery({
    queryKey: sensorKeys.summary(),
    queryFn: fetchSensorSummary,
    staleTime: 30_000,
    refetchInterval: 30_000,
  })
}
