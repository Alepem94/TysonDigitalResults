'use client'
import { useCountUp } from '@/hooks/useCountUp'
import { fmt, fmtCompact, fmtCurrency, fmtPct, deltaLabel } from '@/lib/utils'
import clsx from 'clsx'

export default function MetricCard({
  label, value, format = 'number', icon: Icon,
  delta, deltaInverted = false, compareLabel,
  projected, projectedLabel,
  accent = false, delay = 0, suffix = ''
}) {
  const numericValue = typeof value === 'number' ? value : 0
  const counted = useCountUp(numericValue, 1200)

  function display(n) {
    if (n == null) return '—'
    if (format === 'currency')  return fmtCurrency(n, 2)
    if (format === 'percent')   return fmtPct(n, 2)
    if (format === 'compact')   return fmtCompact(n)
    return fmt(n)
  }

  const dl = delta != null ? deltaLabel(delta, deltaInverted) : null

  return (
    <div
      className={clsx(
        'card card-hover animate-slide-up opacity-0 relative overflow-hidden',
        accent && 'ring-1 ring-tyson-red/20'
      )}
      style={{ animationFillMode: 'forwards', animationDelay: `${delay}ms` }}
    >
      {accent && (
        <div className="absolute top-0 left-0 w-1 h-full bg-tyson-red rounded-l-2xl" />
      )}

      <div className="flex items-start justify-between mb-3">
        <span className="metric-label">{label}</span>
        {Icon && (
          <div className={clsx(
            'w-8 h-8 rounded-xl flex items-center justify-center',
            accent ? 'bg-tyson-red/10' : 'bg-slate-50'
          )}>
            <Icon size={15} className={accent ? 'text-tyson-red' : 'text-slate-400'} />
          </div>
        )}
      </div>

      <div className="metric-value tabular-nums">
        {format === 'currency'
          ? display(counted)
          : format === 'percent'
            ? fmtPct(counted / 100)
            : fmt(counted)
        }{suffix}
      </div>

      {/* Delta vs comparison */}
      {dl && (
        <div className={clsx('mt-2 flex items-center gap-1.5')}>
          <span className={clsx('badge', dl.bg, dl.color)}>
            {dl.sign} {dl.value}
          </span>
          {compareLabel && (
            <span className="text-xs text-slate-400">{compareLabel}</span>
          )}
        </div>
      )}

      {/* Projected */}
      {projected != null && (
        <div className="mt-2 pt-2 border-t border-slate-50">
          <div className="flex justify-between items-center">
            <span className="text-xs text-slate-400">{projectedLabel ?? 'Proyectado'}</span>
            <span className="text-xs font-600 text-slate-500">{display(projected)}</span>
          </div>
          {/* Progress vs projected */}
          {numericValue > 0 && projected > 0 && (
            <div className="progress-track mt-1.5">
              <div
                className="progress-fill bg-tyson-red/60"
                style={{ width: `${Math.min(100, (numericValue / projected) * 100)}%` }}
              />
            </div>
          )}
        </div>
      )}
    </div>
  )
}
