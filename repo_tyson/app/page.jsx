'use client'
import { useEffect, useState } from 'react'
import { useMonth } from '@/context/MonthContext'
import { getOverview, getPlatforms, getPaidMedia, getActiveCampaigns, getHighlights } from '@/lib/queries'
import { delta, deltaVsProy, monthLabel, fmtCompact, fmt } from '@/lib/utils'
import MetricCard from '@/components/MetricCard'
import CampaignTimeline from '@/components/CampaignTimeline'
import PlatformBreakdown from '@/components/PlatformBreakdown'
import HighlightBox from '@/components/HighlightBox'
import PageHeader from '@/components/PageHeader'
import {
  Radio, Play, ThumbsUp, UserPlus, Users, TrendingUp
} from 'lucide-react'

const OVERVIEW_METRICS = [
  { key: 'alcance_total',      label: 'Alcance total',         icon: Radio,     format: 'number', proyKey: 'alcance_proyectado'      },
  { key: 'video_views_total',  label: 'Video Views',           icon: Play,      format: 'number', proyKey: 'video_views_proyectado'  },
  { key: 'interaccion_total',  label: 'Interacción total',     icon: ThumbsUp,  format: 'number', proyKey: 'interaccion_proyectada'  },
  { key: 'nuevos_seguidores',  label: 'Nuevos seguidores',     icon: UserPlus,  format: 'number', proyKey: 'nuevos_seguidores_proyectado' },
  { key: 'seguidores_totales', label: 'Seguidores totales',    icon: Users,     format: 'number', proyKey: null                      },
  { key: 'engagement_rate',    label: 'Engagement Rate',       icon: TrendingUp,format: 'percent',proyKey: 'engagement_rate_proyectado', accent: true },
]

export default function OverviewPage() {
  const { selectedMonth, compareMode } = useMonth()
  const [loading, setLoading] = useState(true)
  const [overview, setOverview] = useState({ current: null, previous: null })
  const [platforms, setPlatforms] = useState({ current: [], previous: [] })
  const [paidMedia, setPaidMedia] = useState([])
  const [campaigns, setCampaigns] = useState([])
  const [highlights, setHighlights] = useState([])

  useEffect(() => {
    setLoading(true)
    Promise.all([
      getOverview(selectedMonth),
      getPlatforms(selectedMonth),
      getPaidMedia(selectedMonth),
      getActiveCampaigns(selectedMonth),
      getHighlights(selectedMonth, 'overview'),
    ]).then(([ov, pl, pm, ca, hl]) => {
      setOverview(ov)
      setPlatforms(pl)
      setPaidMedia(pm)
      setCampaigns(ca)
      setHighlights(hl)
      setLoading(false)
    })
  }, [selectedMonth])

  const cur  = overview.current
  const prev = overview.previous

  return (
    <div>
      <PageHeader title="Overview" subtitle="Todas las plataformas · FB + IG + TT" />

      <CampaignTimeline campaigns={campaigns} selectedMonth={selectedMonth} />

      {/* No data state */}
      {!loading && !cur && (
        <div className="card flex flex-col items-center justify-center py-16 text-center">
          <div className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center mb-3">
            <TrendingUp size={20} className="text-slate-300" />
          </div>
          <div className="text-slate-500 font-600 mb-1">Sin datos para {monthLabel(selectedMonth)}</div>
          <div className="text-xs text-slate-400">Agrega registros en Supabase para este mes</div>
        </div>
      )}

      {/* Metric cards */}
      {!loading && cur && (
        <>
          <div className="grid grid-cols-3 gap-4 mb-5 cards-grid">
            {OVERVIEW_METRICS.map((m, i) => {
              const value   = cur[m.key]
              const proy    = m.proyKey ? cur[m.proyKey] : null
              const prevVal = prev?.[m.key]

              const d = compareMode === 'prevMonth' && prevVal
                ? delta(value, prevVal)
                : compareMode === 'presupuesto' && proy
                  ? deltaVsProy(value, proy)
                  : null

              const compareLabel = compareMode === 'prevMonth'
                ? 'vs mes ant.'
                : compareMode === 'presupuesto'
                  ? 'vs presupuesto'
                  : undefined

              return (
                <MetricCard
                  key={m.key}
                  label={m.label}
                  value={m.format === 'percent' ? Math.round((value ?? 0) * 100) : (value ?? 0)}
                  format={m.format}
                  icon={m.icon}
                  delta={d}
                  compareLabel={compareLabel}
                  projected={compareMode === 'presupuesto' ? proy : undefined}
                  accent={m.accent}
                  delay={i * 60}
                />
              )
            })}
          </div>

          {/* Platform breakdown chart */}
          <div className="mb-5">
            <PlatformBreakdown
              platforms={platforms.current}
              paidMedia={paidMedia}
            />
          </div>

          {/* Highlights */}
          <div>
            <div className="section-title">Highlights del mes</div>
            <div className="grid grid-cols-2 gap-4">
              {highlights.length > 0
                ? highlights.map(h => <HighlightBox key={h.id} highlight={h} />)
                : [0, 1].map(i => (
                    <HighlightBox
                      key={i}
                      highlight={{ seccion: 'overview', orden: i + 1, tipo: i === 0 ? 'logro' : 'hallazgo', mes: selectedMonth }}
                    />
                  ))
              }
            </div>
          </div>
        </>
      )}

      {/* Loading skeleton */}
      {loading && (
        <div className="grid grid-cols-3 gap-4 mb-5">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="card h-28 animate-pulse bg-slate-50" />
          ))}
        </div>
      )}
    </div>
  )
}
