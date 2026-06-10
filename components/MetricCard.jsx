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
        'card card-hover animate-slide-up opacity-0 relative overflow-hidden group',
        accent && 'ring-1 ring-tyson-yellow/40 bg-gradient-to-br from-white to-slate-50'
      )}
      style={{ animationFillMode: 'forwards', animationDelay: `${delay}ms` }}
    >
      {accent && (
        <div className="absolute top-0 left-0 w-1 h-full bg-tyson-burgundy rounded-l-3xl transition-transform group-hover:scale-y-110" />
      )}

      <div className="flex items-start justify-between mb-4">
        <span className="metric-label">{label}</span>
        {Icon && (
          <div className={clsx(
            'w-10 h-10 rounded-2xl flex items-center justify-center transition-colors',
            accent ? 'bg-tyson-yellow/20 text-tyson-burgundy' : 'bg-slate-100 text-slate-400 group-hover:bg-slate-200 group-hover:text-tyson-dark'
          )}>
            <Icon size={18} />
          </div>
        )}
      </div>

      <div className="metric-value tabular-nums">
        {format === 'currency'
          ? display(counted)
          : format === 'percent'
            ? fmtPct(counted / 100)
            : fmt(counted)
        }
        {suffix && <span className="text-[0.55em] text-slate-400 ml-1 font-sans">{suffix}</span>}
      </div>

      {/* Delta vs comparison */}
      {dl && (
        <div className="mt-3 flex items-center gap-2">
          <span className={clsx('badge', dl.bg, dl.color)}>
            {dl.sign} {dl.value}
          </span>
          {compareLabel && (
            <span className="text-[13px] font-medium text-slate-400">{compareLabel}</span>
          )}
        </div>
      )}

      {/* Projected */}
      {projected != null && (
        <div className="mt-4 pt-3 border-t border-slate-100">
          <div className="flex justify-between items-center mb-2">
            <span className="text-[13px] font-semibold text-slate-400">{projectedLabel ?? 'Proyección mensual'}</span>
            <span className="text-[14px] font-bold text-tyson-dark">{display(projected)}</span>
          </div>
          {/* Progress vs projected */}
          {numericValue > 0 && projected > 0 && (
            <div className="progress-track">
              <div
                className={clsx("progress-fill", accent ? "bg-tyson-yellow" : "bg-tyson-burgundy")}
                style={{ width: `${Math.min(100, (numericValue / projected) * 100)}%` }}
              />
            </div>
          )}
        </div>
      )}
    </div>
  )
}
