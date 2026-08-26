/**
 * Background Job Framework
 *
 * Queues: critical, operations, model, export, maintenance, low-priority
 * Jobs record: status, attempt, duration, error
 * Failed jobs use exponential backoff with jitter.
 */

export type JobQueue = 'critical' | 'operations' | 'model' | 'export' | 'maintenance' | 'low-priority'

export type JobStatus = 'pending' | 'running' | 'completed' | 'failed' | 'dead-letter'

export interface JobDefinition<T = unknown> {
  id: string
  queue: JobQueue
  type: string
  payload: T
  idempotency_key?: string
  max_attempts: number
  created_at: string
  scheduled_for?: string
}

export interface JobResult {
  job_id: string
  status: JobStatus
  attempts: number
  duration_ms: number
  error?: string
  completed_at?: string
}

export interface RetryConfig {
  max_attempts: number
  base_delay_ms: number
  max_delay_ms: number
  jitter: boolean
}

export const DEFAULT_RETRY: RetryConfig = {
  max_attempts: 5,
  base_delay_ms: 1000,
  max_delay_ms: 60000,
  jitter: true,
}

/**
 * Calculate retry delay with exponential backoff and optional jitter.
 */
export function retryDelay(attempt: number, config: RetryConfig = DEFAULT_RETRY): number {
  const exponential = config.base_delay_ms * Math.pow(2, attempt - 1)
  const clamped = Math.min(exponential, config.max_delay_ms)
  if (config.jitter) {
    return clamped * (0.5 + Math.random() * 0.5)
  }
  return clamped
}

export const JOB_TYPES = {
  EVIDENCE_EXPORT: 'evidence.export',
  MODEL_EVALUATION: 'model.evaluate',
  FIRMWARE_DISTRIBUTE: 'firmware.distribute',
  REPORT_GENERATE: 'report.generate',
  WEBHOOK_DELIVER: 'webhook.deliver',
  RETENTION_CLEANUP: 'retention.cleanup',
  CALIBRATION_CHECK: 'calibration.check',
  HEALTH_AGGREGATE: 'health.aggregate',
} as const
