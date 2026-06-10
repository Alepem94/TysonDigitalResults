'use client'
import { useEffect, useState } from 'react'
import { useMonth } from '@/context/MonthContext'
import { getCompetition, getHighlights } from '@/lib/queries'
import { calcSOV, fmtPct, monthLabel, PLATFORM_LABELS, PLATFORM_COLORS } from '@/lib/utils'
import HighlightBox from '@/components/HighlightBox'
import PageHeader from '@/components/PageHeader'
import { ExternalLink, TrendingUp, TrendingDown } from 'lucide-react'

const PLATAFORMAS = ['facebook', 'instagram', 'tiktok']

function CompetitionTable({ data, plataforma }) {
  const rows = data.filter(d => d.plataforma === plataforma)
  if (!rows.length) return (
    <div className="text-xs text-slate-300 italic py-4 text-center">Sin datos</div>
  )

  const comunidades   = rows.map(r => r.comunidad ?? 0)
  const tysonRow      = rows.find(r => r.es_tyson)
  const tysonComunidad = tysonRow?.comunidad ?? 0
  const sov = calcSOV(tysonComunidad, comunidades)

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full" style={{ background: PLATFORM_COLORS[plataforma] }} />
          <span className="text-sm font-700 text-slate-700">{PLATFORM_LABELS[plataforma]}</span>
        </div>
        <div className="flex items-center gap-1.5 bg-tyson-red/10 px-2.5 py-1 rounded-full">
          <span className="text-xs font-700 text-tyson-red">SOV Tyson: {sov.toFixed(1)}%</span>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-xs">
          <thead>
            <tr className="border-b border-slate-100">
              <th className="text-left py-2 pr-3 font-600 text-slate-400">Cuenta</th>
              <th className="text-right py-2 px-2 font-600 text-slate-400">Comunidad</th>
              <th className="text-right py-2 px-2 font-600 text-slate-400">Crecimiento</th>
              <th className="text-right py-2 px-2 font-600 text-slate-400">Posts</th>
              <th className="text-right py-2 pl-2 font-600 text-slate-400">ETR%</th>
            </tr>
          </thead>
          <tbody>
            {rows.map(row => (
              <tr
                key={row.id}
                className={`border-b border-slate-50 last:border-0 ${row.es_tyson ? 'bg-tyson-red/5' : ''}`}
              >
                <td className="py-2.5 pr-3">
                  <span className={`font-${row.es_tyson ? '700' : '500'} ${row.es_tyson ? 'text-tyson-red' : 'text-slate-600'}`}>
                    {row.cuenta}
                  </span>
                </td>
                <td className="text-right py-2.5 px-2 font-600 text-slate-700 tabular-nums">
                  {(row.comunidad ?? 0).toLocaleString('es-MX')}
                </td>
                <td className="text-right py-2.5 px-2">
                  <span className={`inline-flex items-center gap-0.5 font-700 ${
                    (row.tasa_crecimiento ?? 0) >= 0 ? 'text-emerald-600' : 'text-red-500'
                  }`}>
                    {(row.tasa_crecimiento ?? 0) >= 0
                      ? <TrendingUp size={10} />
                      : <TrendingDown size={10} />
                    }
                    {fmtPct(Math.abs(row.tasa_crecimiento ?? 0), 2)}
                  </span>
                </td>
                <td className="text-right py-2.5 px-2 text-slate-600 tabular-nums">{row.num_posts ?? '—'}</td>
                <td className="text-right py-2.5 pl-2 font-600 text-slate-700 tabular-nums">
                  {fmtPct(row.etr ?? 0, 2)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

function CompetitorAction({ row }) {
  if (!row.accion_mundial && !row.percepcion_audiencia) return null
  return (
    <div className="card border border-slate-100 card-hover">
      <div className="flex items-center gap-2 mb-2">
        <div className="w-2 h-2 rounded-full bg-slate-300" />
        <span className="text-sm font-700 text-slate-700">{row.cuenta}</span>
        <span className="text-xs text-slate-400 uppercase tracking-wider">{PLATFORM_LABELS[row.plataforma]}</span>
      </div>
      {row.accion_mundial && (
        <div className="mb-2">
          <div className="text-xs font-600 text-slate-400 uppercase tracking-wider mb-1">Acción Mundial</div>
          <p className="text-sm text-slate-600 leading-relaxed">{row.accion_mundial}</p>
        </div>
      )}
      {row.percepcion_audiencia && (
        <div className="mb-2">
          <div className="text-xs font-600 text-slate-400 uppercase tracking-wider mb-1">Percepción</div>
          <p className="text-sm text-slate-600 leading-relaxed">{row.percepcion_audiencia}</p>
        </div>
      )}
      {row.ejemplo_url && (
        <a href={row.ejemplo_url} target="_blank" rel="noopener noreferrer"
          className="inline-flex items-center gap-1 text-xs text-tyson-red font-600 hover:underline mt-1">
          Ver ejemplo <ExternalLink size={10} />
        </a>
      )}
    </div>
  )
}

export default function CompetenciaPage() {
  const { selectedMonth } = useMonth()
  const [loading, setLoading]     = useState(true)
  const [competition, setCompetition] = useState([])
  const [highlights, setHighlights]   = useState([])

  useEffect(() => {
    setLoading(true)
    Promise.all([
      getCompetition(selectedMonth),
      getHighlights(selectedMonth, 'competencia'),
    ]).then(([c, hl]) => {
      setCompetition(c)
      setHighlights(hl)
      setLoading(false)
    })
  }, [selectedMonth])

  const withActions = competition.filter(c => !c.es_tyson && (c.accion_mundial || c.percepcion_audiencia))

  if (loading) return (
    <div><PageHeader title="Competencia" />
      <div className="card h-64 animate-pulse bg-slate-50" />
    </div>
  )

  return (
    <div className="space-y-6">
      <PageHeader title="Competencia" subtitle="Benchmark mensual" />

      {/* Tables by platform */}
      <section>
        <div className="section-title">Comunidad y engagement</div>
        <div className="grid grid-cols-1 gap-4">
          {PLATAFORMAS.map(p => (
            <CompetitionTable key={p} data={competition} plataforma={p} />
          ))}
        </div>
      </section>

      {/* Competitor actions */}
      {withActions.length > 0 && (
        <section>
          <div className="section-title">Actividad de competidores · Mundial</div>
          <div className="grid grid-cols-2 gap-4">
            {withActions.map(row => <CompetitorAction key={row.id} row={row} />)}
          </div>
        </section>
      )}

      {/* Highlights */}
      <section>
        <div className="section-title">Highlights · Competencia</div>
        <div className="grid grid-cols-2 gap-4">
          {(highlights.length > 0 ? highlights : [
            { seccion: 'competencia', orden: 1, tipo: 'hallazgo', mes: selectedMonth },
            { seccion: 'competencia', orden: 2, tipo: 'alerta',   mes: selectedMonth },
          ]).map((h, i) => <HighlightBox key={h.id ?? i} highlight={h} />)}
        </div>
      </section>
    </div>
  )
}
