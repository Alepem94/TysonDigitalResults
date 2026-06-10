'use client'
import { useState } from 'react'
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend
} from 'recharts'
import { fmtCompact, PLATFORM_COLORS, PLATFORM_LABELS } from '@/lib/utils'

const STRATEGY_COLORS = ['#E31837', '#FFC220', '#7A1020', '#111111']

const CustomTooltipBar = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null
  return (
    <div className="bg-tyson-dark text-white px-4 py-3 rounded-2xl text-[13px] shadow-card border border-white/10 font-sans">
      <div className="font-bold mb-2 uppercase tracking-wider text-[11px] text-white/50">{PLATFORM_LABELS[label] ?? label}</div>
      {payload.map(p => (
        <div key={p.dataKey} className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full" style={{ background: p.fill }} />
          <span className="text-white/80">{p.name}:</span>
          <span className="font-bold">{fmtCompact(p.value)}</span>
        </div>
      ))}
    </div>
  )
}

export default function PlatformBreakdown({ platforms = [], paidMedia = [] }) {
  const [selected, setSelected] = useState(null)
  const [metric, setMetric] = useState('alcance')

  const METRIC_OPTIONS = [
    { key: 'alcance',     label: 'Alcance'       },
    { key: 'interaccion', label: 'Interacción'   },
    { key: 'video_views', label: 'Video Views'   },
  ]

  const barData = platforms.map(p => ({
    plataforma: p.plataforma,
    value: p[metric] ?? 0,
    fill: PLATFORM_COLORS[p.plataforma],
  }))

  // Drill-down: strategy participation for selected platform
  const strategyData = (() => {
    if (!selected) return []
    const entries = paidMedia.filter(pm => pm.plataforma === selected)
    const total = entries.reduce((s, e) => s + (e.alcance_pagado ?? e.interaccion_pagada ?? 0), 0)
    return entries.map((e, i) => ({
      name: e.campaigns?.nombre ?? `Campaña ${i + 1}`,
      value: e.alcance_pagado ?? e.interaccion_pagada ?? 0,
      pct: total ? ((e.alcance_pagado ?? e.interaccion_pagada ?? 0) / total) * 100 : 0,
    })).filter(d => d.value > 0)
  })()

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-4">
        <div>
          <div className="section-title mb-0">Rendimiento por plataforma</div>
          <div className="text-xs text-slate-400 mt-0.5">
            {selected
              ? `Mostrando participación por estrategia · ${PLATFORM_LABELS[selected]}`
              : 'Haz clic en una barra para ver el mix por estrategia'}
          </div>
        </div>
        <div className="flex gap-1.5 p-1 bg-slate-50/50 rounded-xl border border-slate-100">
          {METRIC_OPTIONS.map(m => (
            <button
              key={m.key}
              onClick={() => setMetric(m.key)}
              className={`px-3 py-1.5 text-[12px] font-bold rounded-lg transition-all ${
                metric === m.key
                  ? 'bg-tyson-burgundy text-white shadow-sm'
                  : 'bg-transparent text-slate-500 hover:text-slate-700 hover:bg-black/5'
              }`}
            >
              {m.label}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-6">
        {/* Bar chart */}
        <div>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart
              data={barData}
              onClick={(e) => e?.activePayload && setSelected(
                selected === e.activePayload[0]?.payload?.plataforma
                  ? null
                  : e.activePayload[0]?.payload?.plataforma
              )}
              style={{ cursor: 'pointer' }}
            >
              <XAxis
                dataKey="plataforma"
                tickFormatter={p => PLATFORM_LABELS[p] ?? p}
                tick={{ fontSize: 11, fill: '#94a3b8', fontWeight: 600 }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tickFormatter={fmtCompact}
                tick={{ fontSize: 10, fill: '#94a3b8' }}
                axisLine={false}
                tickLine={false}
                width={40}
              />
              <Tooltip content={<CustomTooltipBar />} cursor={{ fill: 'rgba(0,0,0,0.04)' }} />
              <Bar dataKey="value" radius={[6, 6, 0, 0]} maxBarSize={56}>
                {barData.map((d, i) => (
                  <Cell
                    key={i}
                    fill={d.fill}
                    opacity={selected && selected !== d.plataforma ? 0.3 : 1}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
          <div className="flex gap-3 mt-2 justify-center">
            {barData.map(d => (
              <button
                key={d.plataforma}
                onClick={() => setSelected(selected === d.plataforma ? null : d.plataforma)}
                className="flex items-center gap-1.5 text-xs font-500 text-slate-500 hover:text-slate-700 transition-colors"
              >
                <div className="w-2.5 h-2.5 rounded-full" style={{ background: d.fill, opacity: selected && selected !== d.plataforma ? 0.3 : 1 }} />
                {PLATFORM_LABELS[d.plataforma]}
              </button>
            ))}
          </div>
        </div>

        {/* Pie drill-down */}
        <div className="flex items-center justify-center">
          {selected && strategyData.length > 0 ? (
            <div className="w-full">
              <div className="text-xs font-600 text-slate-500 text-center mb-2">
                Mix de estrategia · {PLATFORM_LABELS[selected]}
              </div>
              <ResponsiveContainer width="100%" height={180}>
                <PieChart>
                  <Pie
                    data={strategyData}
                    cx="50%"
                    cy="50%"
                    innerRadius={45}
                    outerRadius={70}
                    dataKey="value"
                    paddingAngle={3}
                    animationBegin={0}
                    animationDuration={600}
                  >
                    {strategyData.map((_, i) => (
                      <Cell key={i} fill={STRATEGY_COLORS[i % STRATEGY_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(v, _, props) => [`${props.payload.pct.toFixed(1)}%`, props.payload.name]}
                    contentStyle={{ fontSize: 11, borderRadius: 10, border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                  />
                  <Legend
                    iconType="circle"
                    iconSize={8}
                    formatter={(v) => <span style={{ fontSize: 11, color: '#64748b', fontWeight: 600 }}>{v}</span>}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="text-center text-slate-300">
              <div className="w-16 h-16 rounded-full border-2 border-dashed border-slate-200 mx-auto mb-3 flex items-center justify-center">
                <div className="w-8 h-8 rounded-full border-2 border-dashed border-slate-200" />
              </div>
              <div className="text-xs text-slate-400 font-500">
                {selected ? 'Sin datos de paid media' : 'Selecciona una plataforma'}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
