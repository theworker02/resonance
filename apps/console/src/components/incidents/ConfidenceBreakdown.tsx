import { useState } from 'react'
import clsx from 'clsx'
import { Info } from 'lucide-react'
import type { ConfidenceReport } from '../../types/incident'
import { ConfidenceBadge } from '../shared/ConfidenceBadge'
import {
  DIMENSION_META,
  confidenceBarColor,
  confidenceColor,
  formatClassName,
} from '../../types/confidence'

interface Props {
  report: ConfidenceReport
}

export function ConfidenceBreakdown({ report }: Props) {
  const [tooltip, setTooltip] = useState<string | null>(null)

  const pct = (v: number) => Math.round(v * 100)

  return (
    <section aria-label="Confidence breakdown" className="space-y-5">
      {/* Header */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <p className="text-xs uppercase tracking-widest text-gray-500 mb-1">Classification</p>
          <h2 className="text-xl font-semibold text-gray-100">
            {formatClassName(report.primary_class)}
          </h2>
        </div>
        <ConfidenceBadge
          level={report.overall_level}
          score={report.overall_confidence}
          size="lg"
        />
      </div>

      {/* Overall bar */}
      <div>
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-sm text-gray-400">Overall confidence</span>
          <span className={clsx('text-sm font-mono font-semibold tabular-nums', confidenceColor(report.overall_confidence))}>
            {pct(report.overall_confidence)}%
          </span>
        </div>
        <div className="h-2.5 bg-gray-800 rounded-full overflow-hidden" role="progressbar"
          aria-valuenow={pct(report.overall_confidence)} aria-valuemin={0} aria-valuemax={100}>
          <div
            className={clsx('h-full rounded-full transition-all', confidenceBarColor(report.overall_confidence))}
            style={{ width: `${pct(report.overall_confidence)}%` }}
          />
        </div>
      </div>

      <hr className="border-gray-800" />

      {/* Dimension breakdown */}
      <div>
        <p className="text-xs uppercase tracking-widest text-gray-500 mb-3">Evidence dimensions</p>
        <div className="space-y-3" role="list" aria-label="Confidence dimensions">
          {DIMENSION_META.map((dim) => {
            const score = report.dimensions[dim.key]
            const barPct = pct(score)
            return (
              <div key={dim.key} className="group" role="listitem">
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-1.5">
                    <span className="text-sm text-gray-300">{dim.label}</span>
                    <button
                      type="button"
                      aria-label={`What is ${dim.label}?`}
                      onClick={() => setTooltip(tooltip === dim.key ? null : dim.key)}
                      className="text-gray-600 hover:text-gray-400 transition-colors"
                    >
                      <Info className="w-3.5 h-3.5" aria-hidden="true" />
                    </button>
                  </div>
                  <span className={clsx('text-sm font-mono tabular-nums font-medium', confidenceColor(score))}>
                    {barPct}%
                  </span>
                </div>

                {tooltip === dim.key && (
                  <p className="text-xs text-gray-400 bg-gray-800/60 rounded-md px-3 py-2 mb-2 leading-relaxed">
                    {dim.description}
                  </p>
                )}

                <div className="h-1.5 bg-gray-800 rounded-full overflow-hidden"
                  role="progressbar" aria-valuenow={barPct} aria-valuemin={0} aria-valuemax={100}
                  aria-label={`${dim.label}: ${barPct}%`}>
                  <div
                    className={clsx('h-full rounded-full transition-all', confidenceBarColor(score))}
                    style={{ width: `${barPct}%` }}
                  />
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Alternatives */}
      {report.alternatives.length > 0 && (
        <>
          <hr className="border-gray-800" />
          <div>
            <p className="text-xs uppercase tracking-widest text-gray-500 mb-3">Alternative classifications</p>
            <ul className="space-y-2" aria-label="Alternative classifications">
              {report.alternatives
                .sort(([, a], [, b]) => b - a)
                .map(([cls, score]) => (
                  <li key={cls} className="flex items-center justify-between text-sm">
                    <span className="text-gray-400">{formatClassName(cls)}</span>
                    <div className="flex items-center gap-2">
                      <div className="w-24 h-1 bg-gray-800 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gray-600 rounded-full"
                          style={{ width: `${pct(score)}%` }}
                          aria-hidden="true"
                        />
                      </div>
                      <span className="text-gray-500 font-mono tabular-nums w-8 text-right">{pct(score)}%</span>
                    </div>
                  </li>
                ))}
            </ul>
          </div>
        </>
      )}

      {/* Model info */}
      <div className="flex items-center justify-between pt-1 border-t border-gray-800/60">
        <span className="text-xs text-gray-600">Model</span>
        <span className="text-xs font-mono text-gray-500">{report.model_version}</span>
      </div>
    </section>
  )
}
