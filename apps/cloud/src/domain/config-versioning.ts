/**
 * Configuration Versioning
 *
 * Every config change receives a version, author, timestamp, diff, and reason.
 * Supports rollback to any previous version.
 */

export interface ConfigVersion {
  version: number
  resource_type: string
  resource_id: string
  config: Record<string, unknown>
  diff?: ConfigDiff
  author: string
  reason: string
  timestamp: string
  rollback_of?: number
}

export interface ConfigDiff {
  added: string[]
  removed: string[]
  changed: Array<{ key: string; from: unknown; to: unknown }>
}

export function computeDiff(
  previous: Record<string, unknown>,
  current: Record<string, unknown>,
): ConfigDiff {
  const added: string[] = []
  const removed: string[] = []
  const changed: Array<{ key: string; from: unknown; to: unknown }> = []

  const allKeys = new Set([...Object.keys(previous), ...Object.keys(current)])
  for (const key of allKeys) {
    if (!(key in previous)) added.push(key)
    else if (!(key in current)) removed.push(key)
    else if (JSON.stringify(previous[key]) !== JSON.stringify(current[key])) {
      changed.push({ key, from: previous[key], to: current[key] })
    }
  }

  return { added, removed, changed }
}
