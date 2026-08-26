import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  fetchIncidents,
  fetchIncident,
  fetchIncidentStats,
  submitHumanReview,
  verifyProvenanceChain,
  type IncidentListParams,
} from '../api/incidents'
import type { HumanReviewRequest } from '../types/incident'

export const incidentKeys = {
  all: ['incidents'] as const,
  lists: () => [...incidentKeys.all, 'list'] as const,
  list: (params: IncidentListParams) => [...incidentKeys.lists(), params] as const,
  details: () => [...incidentKeys.all, 'detail'] as const,
  detail: (id: string) => [...incidentKeys.details(), id] as const,
  stats: () => [...incidentKeys.all, 'stats'] as const,
}

export function useIncidents(params: IncidentListParams = {}) {
  return useQuery({
    queryKey: incidentKeys.list(params),
    queryFn: () => fetchIncidents(params),
    staleTime: 15_000,
  })
}

export function useIncident(id: string) {
  return useQuery({
    queryKey: incidentKeys.detail(id),
    queryFn: () => fetchIncident(id),
    staleTime: 30_000,
    enabled: !!id,
  })
}

export function useIncidentStats() {
  return useQuery({
    queryKey: incidentKeys.stats(),
    queryFn: fetchIncidentStats,
    staleTime: 60_000,
    refetchInterval: 60_000,
  })
}

export function useSubmitReview(incidentId: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (req: HumanReviewRequest) => submitHumanReview(incidentId, req),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: incidentKeys.detail(incidentId) })
      queryClient.invalidateQueries({ queryKey: incidentKeys.lists() })
    },
  })
}

export function useVerifyProvenance(incidentId: string) {
  return useMutation({
    mutationFn: () => verifyProvenanceChain(incidentId),
  })
}
