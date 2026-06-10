'use client'
import { campaignProgress, monthLabel, fmtPct } from '@/lib/utils'

export default function CampaignTimeline({ campaigns = [], selectedMonth }) {
  const active = campaigns.filter(c => c.tipo === 'pagada' && c.fecha_fin)

  if (!active.length) return null

  return (
    <div className="card mb-5 py-4">
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs font-700 uppercase tracking-wider text-slate-400">
          Progreso de campañas activas
        </span>
        <span className="text-xs text-slate-400">{monthLabel(selectedMonth)}</span>
      </div>

      <div className="flex flex-col gap-3">
        {active.map(c => {
          const pct = campaignProgress(c.fecha_inicio, c.fecha_fin, selectedMonth)

          const startLabel = new Date(c.fecha_inicio).toLocaleDateString('es-MX', { month: 'short', day: 'numeric' })
          const endLabel   = new Date(c.fecha_fin).toLocaleDateString('es-MX', { month: 'short', day: 'numeric' })

          return (
            <div key={c.id}>
              <div className="flex items-center justify-between mb-1.5">
                <div className="flex items-center gap-2">
                  <div
                    className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                    style={{ background: c.color_hex }}
                  />
                  <span className="text-sm font-600 text-slate-700">{c.nombre}</span>
                  {pct != null && (
                    <span
                      className="text-xs font-700 px-2 py-0.5 rounded-full"
                      style={{
                        background: c.color_hex + '18',
                        color: c.color_hex
                      }}
                    >
                      {pct.toFixed(0)}% del período
                    </span>
                  )}
                </div>
                <div className="text-xs text-slate-400 font-500">
                  {startLabel} → {endLabel}
                </div>
              </div>

              <div className="progress-track">
                <div
                  className="progress-fill"
                  style={{
                    width: `${pct ?? 0}%`,
                    background: c.color_hex,
                    opacity: 0.8
                  }}
                />
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
