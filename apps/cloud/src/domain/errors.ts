/**
 * Resonance Typed Error System
 *
 * Every error has: code, message, cause, retriable, context.
 * No naked `throw new Error("something")` in production code.
 */

export abstract class ResonanceError extends Error {
  abstract readonly code: string
  abstract readonly httpStatus: number
  abstract readonly retriable: boolean
  readonly context: Record<string, unknown>

  constructor(message: string, context: Record<string, unknown> = {}) {
    super(message)
    this.name = this.constructor.name
    this.context = context
  }

  toJSON() {
    return {
      code: this.code,
      message: this.message,
      retriable: this.retriable,
      context: this.context,
    }
  }
}

export class NotFoundError extends ResonanceError {
  readonly code = 'NOT_FOUND'
  readonly httpStatus = 404
  readonly retriable = false
}

export class ValidationError extends ResonanceError {
  readonly code = 'VALIDATION_ERROR'
  readonly httpStatus = 400
  readonly retriable = false
}

export class ConflictError extends ResonanceError {
  readonly code = 'CONFLICT'
  readonly httpStatus = 409
  readonly retriable = false
}

export class RateLimitError extends ResonanceError {
  readonly code = 'RATE_LIMITED'
  readonly httpStatus = 429
  readonly retriable = true
}

export class ServiceUnavailableError extends ResonanceError {
  readonly code = 'SERVICE_UNAVAILABLE'
  readonly httpStatus = 503
  readonly retriable = true
}

export class NodeUnavailableError extends ResonanceError {
  readonly code = 'NODE_UNAVAILABLE'
  readonly httpStatus = 503
  readonly retriable = true
}

export class CalibrationExpiredError extends ResonanceError {
  readonly code = 'CALIBRATION_EXPIRED'
  readonly httpStatus = 422
  readonly retriable = false
}

export class ClockUnsynchronizedError extends ResonanceError {
  readonly code = 'CLOCK_UNSYNCHRONIZED'
  readonly httpStatus = 422
  readonly retriable = true
}

export class EvidenceCorruptedError extends ResonanceError {
  readonly code = 'EVIDENCE_CORRUPTED'
  readonly httpStatus = 500
  readonly retriable = false
}

export class IdempotencyConflictError extends ResonanceError {
  readonly code = 'IDEMPOTENCY_CONFLICT'
  readonly httpStatus = 409
  readonly retriable = false
}
