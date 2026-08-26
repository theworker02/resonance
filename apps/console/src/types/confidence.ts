import type { ConfidenceDimensions, ConfidenceLevel } from './incident'

export type { ConfidenceLevel, ConfidenceDimensions, ConfidenceReport } from './incident'

export interface DimensionMeta {
  key: keyof ConfidenceDimensions
  label: string
  description: string
  unit: 'score'
}

export const DIMENSION_META: DimensionMeta[] = [
  {
    key: 'classification_confidence',
    label: 'Classifier Ensemble',
    description:
      'Agreement across multiple acoustic classification models. High values mean all models agree on the event class.',
    unit: 'score',
  },
  {
    key: 'sensor_agreement',
    label: 'Sensor Agreement',
    description:
      'How consistently independent sensor nodes describe the same event. Requires a minimum of three independent nodes.',
    unit: 'score',
  },
  {
    key: 'signal_quality',
    label: 'Signal Quality',
    description:
      'Signal-to-noise ratio and acoustic fingerprint quality across participating sensors.',
    unit: 'score',
  },
  {
    key: 'temporal_consistency',
    label: 'TOA Consistency',
    description:
      'Time-of-arrival differences between sensors match the predicted values given their physical separation and the speed of sound.',
    unit: 'score',
  },
  {
    key: 'model_consensus',
    label: 'Model Consensus',
    description:
      'Agreement between different detector models (e.g., impulsive, vehicle, weather). Low consensus suggests ambiguity between event types.',
    unit: 'score',
  },
  {
    key: 'environmental_consistency',
    label: 'Environmental Baseline',
    description:
      'How unusual this event is relative to the historical acoustic baseline for this location and time of day.',
    unit: 'score',
  },
]

export const CONFIDENCE_THRESHOLDS = {
  HIGH: 0.85,
  NEEDS_VERIFICATION: 0.60,
} as const

export function confidenceColor(score: number): string {
  if (score >= CONFIDENCE_THRESHOLDS.HIGH) return 'text-green-400'
  if (score >= CONFIDENCE_THRESHOLDS.NEEDS_VERIFICATION) return 'text-amber-400'
  return 'text-red-400'
}

export function confidenceBarColor(score: number): string {
  if (score >= CONFIDENCE_THRESHOLDS.HIGH) return 'bg-green-500'
  if (score >= CONFIDENCE_THRESHOLDS.NEEDS_VERIFICATION) return 'bg-amber-500'
  return 'bg-red-500'
}

export function confidenceLevelLabel(level: ConfidenceLevel): string {
  switch (level) {
    case 'HIGH': return 'High Confidence'
    case 'NEEDS_VERIFICATION': return 'Needs Verification'
    case 'REJECTED': return 'Rejected'
  }
}

export function formatClassName(cls: string): string {
  return cls
    .replace(/_/g, ' ')
    .replace(/\b\w/g, (c) => c.toUpperCase())
}
