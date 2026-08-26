/**
 * Data Retention Engine
 *
 * Workspace-configurable retention policies.
 * Lifecycle: hot → warm → archive → delete
 */

export type StorageTier = 'hot' | 'warm' | 'archive' | 'deleted'

export interface RetentionPolicy {
  workspace_id: string
  resource_type: 'observations' | 'incidents' | 'audit' | 'diagnostics' | 'exports'
  hot_days: number
  warm_days: number
  archive_days: number
  delete_after_days: number | null  // null = never delete
}

export const DEFAULT_RETENTION: Record<string, RetentionPolicy['hot_days'][]> = {
  // [hot, warm, archive, delete]
  observations: [7, 30, 90, 365],
  incidents: [30, 90, 365, null] as any,
  audit: [90, 365, null, null] as any,
  diagnostics: [7, 30, 90, 180],
  exports: [30, 90, 180, 365],
}

export function determineStorageTier(
  createdAt: Date,
  policy: RetentionPolicy,
): StorageTier {
  const age_days = (Date.now() - createdAt.getTime()) / (1000 * 60 * 60 * 24)

  if (policy.delete_after_days && age_days > policy.delete_after_days) return 'deleted'
  if (age_days > policy.archive_days) return 'archive'
  if (age_days > policy.warm_days) return 'warm'
  return 'hot'
}
