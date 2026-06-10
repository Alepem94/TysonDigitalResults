'use client'
import { fmt, fmtCurrency, fmtPct, fmtCompact, deltaVsProy, deltaLabel } from '@/lib/utils'
import clsx from 'clsx'

function StatRow({ label, real, projected, invertido = false, prefix = '', suffix = '', decimals = 0 }) {
  const pct = projected ? deltaVsProy(real, projected) : null
  const dl  = pct != null ? deltaLabel(pct, invertido) : null

  const display = (v) => {
    if (v == null) return '—'
    if (prefix === '$') return fmtCurrency(v, 2)
    if (suffix === '%') return fmtPct(v, 2)
    return fmt(v, decimals)
  }

  return (
    <div className="flex items-center justify-between py-2.5 border-b border-slate-50 last:border-0">
      <span className="text-xs text-slate-500 font-500">{label}</span>
      <div className="flex items-center gap-3">
        {projected != null && (
          <span className="text-xs text-slate-300 font-500">
            Proy: {display(projected)}
          </span>
        )}
        <span className="text-sm font-700 text-slate-700">{display(real)}</span>
        {dl && (
          <span className={clsx('badge text-xs', dl.bg, dl.color)}>
            {dl.sign} {dl.value}
          </span>
        )}
      </div>
    </div>
  )
}

export default function PaidCampaignSection({
  campaign, plataforma, data, accumulated = []
}) {
  if (!data) return null

  const totalAcc = accumulated.reduce((s, d) => s + (d.inversion_real ?? 0), 0)
  const budget   = campaign?.presupuesto_total
  const budgetPct = budget ? (totalAcc / budget) * 100 : null

  const isFB = plataforma === 'facebook'
  const isIG = plataforma === 'instagram'
  const isTT = plataforma === 'tiktok'

  return (
    <div className="mt-4 rounded-2xl border border-slate-100 overflow-hidden">
      {/* Campaign header */}
      <div
        className="px-4 py-3 flex items-center justify-between"
        style={{ background: (campaign?.color_hex ?? '#C8102E') + '10' }}
      >
        <div className="flex items-center gap-2">
          <div
            className="w-3 h-3 rounded-full"
            style={{ background: campaign?.color_hex ?? '#C8102E' }}
          />
          <span className="text-sm font-700 text-slate-700">{campaign?.nombre}</span>
          {campaign?.fecha_inicio && campaign?.fecha_fin && (
            <span className="text-xs text-slate-400">
              {new Date(campaign.fecha_inicio).toLocaleDateString('es-MX', { month: 'short' })} →{' '}
              {new Date(campaign.fecha_fin).toLocaleDateString('es-MX', { month: 'short', year: '2-digit' })}
            </span>
          )}
        </div>
        {budgetPct != null && (
          <span
            className="text-xs font-700 px-2 py-0.5 rounded-full"
            style={{
              background: (campaign?.color_hex ?? '#C8102E') + '18',
              color: campaign?.color_hex ?? '#C8102E'
            }}
          >
            {budgetPct.toFixed(1)}% del presupuesto total
          </span>
        )}
      </div>

      <div className="p-4">
        {/* Budget progress */}
        {budget && (
          <div className="mb-4">
            <div className="flex justify-between text-xs mb-1.5">
              <span className="text-slate-400 font-500">Inversión acumulada</span>
              <span className="font-700 text-slate-700">
                {fmtCurrency(totalAcc)} <span className="text-slate-400 font-400">/ {fmtCurrency(budget)}</span>
              </span>
            </div>
            <div className="progress-track">
              <div
                className="progress-fill"
                style={{
                  width: `${Math.min(100, budgetPct ?? 0)}%`,
                  background: campaign?.color_hex ?? '#C8102E',
                }}
              />
            </div>
          </div>
        )}

        {/* Monthly stats */}
        <div>
          <StatRow
            label="Inversión del mes"
            real={data.inversion_real}
            projected={data.inversion_proyectada}
            prefix="$"
            invertido
          />

          {(isFB || isIG) && (
            <StatRow
              label="Alcance pagado"
              real={data.alcance_pagado}
              projected={data.alcance_proyectado}
            />
          )}
          {(isFB || isIG) && (
            <StatRow label="Frecuencia" real={data.frecuencia} decimals={2} />
          )}
          {isFB && (
            <StatRow
              label="Interacción pagada"
              real={data.interaccion_pagada}
              projected={data.interaccion_proyectada}
            />
          )}
          {(isFB || isIG) && (
            <StatRow label="CPR" real={data.cpr} prefix="$" decimals={2} />
          )}
          {isIG && (
            <StatRow
              label="CPM"
              real={data.cpm}
              prefix="$"
              decimals={2}
              invertido
            />
          )}
          {(isFB || isIG) && (
            <StatRow label="ETR" real={data.etr} suffix="%" />
          )}

          {isTT && (
            <>
              <StatRow label="Views totales" real={data.views_totales} projected={data.views_totales_proyectado} />
              <StatRow label="Views 6 seg" real={data.views_6seg} projected={data.views_6seg_proyectado} />
              {data.views_totales && data.views_6seg && (
                <StatRow
                  label="CVR (Views 6s / Total)"
                  real={(data.views_6seg / data.views_totales) * 100}
                  suffix="%"
                  decimals={2}
                />
              )}
              <StatRow label="CPV 6 seg" real={data.costo_por_view_6seg} prefix="$" decimals={3} invertido />
            </>
          )}
        </div>
      </div>
    </div>
  )
}
