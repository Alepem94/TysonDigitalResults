'use client'
import { useEffect, useState } from 'react'
import { useMonth } from '@/context/MonthContext'
import { getPlatform, getPaidMedia, getCampaignAccumulated, getCampaigns, getBestPosts, getHighlights } from '@/lib/queries'
import { delta, deltaVsProy, fmtCompact, fmt, fmtPct } from '@/lib/utils'
import MetricCard from '@/components/MetricCard'
import PaidCampaignSection from '@/components/PaidCampaignSection'
import BestPostCard from '@/components/BestPostCard'
import HighlightBox from '@/components/HighlightBox'
import PageHeader from '@/components/PageHeader'
import { Users, UserPlus, Radio, ThumbsUp, TrendingUp, FileText, DollarSign } from 'lucide-react'

export default function FacebookPage() {
  const { selectedMonth, compareMode } = useMonth()
  const [loading, setLoading] = useState(true)
  const [platform, setPlatform]     = useState({ current: null, previous: null })
  const [paidMedia, setPaidMedia]   = useState([])
  const [campaigns, setCampaigns]   = useState([])
  const [accumulated, setAccumulated] = useState({})
  const [bestPosts, setBestPosts]   = useState([])
  const [highlights, setHighlights] = useState([])
  const [hlPaid, setHlPaid]         = useState([])

  useEffect(() => {
    setLoading(true)
    Promise.all([
      getPlatform(selectedMonth, 'facebook'),
      getPaidMedia(selectedMonth, 'facebook'),
      getCampaigns(),
      getBestPosts(selectedMonth, 'facebook'),
      getHighlights(selectedMonth, 'facebook'),
    ]).then(async ([pl, pm, ca, bp, hl]) => {
      setPlatform(pl)
      setPaidMedia(pm)
      setCampaigns(ca)
      setBestPosts(bp)
      setHighlights(hl.filter(h => h.subseccion === 'general'))
      setHlPaid(hl.filter(h => h.subseccion === 'paid_media'))

      // Fetch accumulated for each paid campaign
      const accMap = {}
      for (const entry of pm) {
        if (entry.campaign_id) {
          const acc = await getCampaignAccumulated(entry.campaign_id, selectedMonth)
          accMap[entry.campaign_id] = acc.filter(a => a.plataforma === 'facebook')
        }
      }
      setAccumulated(accMap)
      setLoading(false)
    })
  }, [selectedMonth])

  const cur  = platform.current
  const prev = platform.previous

  function d(key, inverted = false) {
    if (compareMode === 'prevMonth') return delta(cur?.[key], prev?.[key])
    if (compareMode === 'presupuesto') return deltaVsProy(cur?.[key], cur?.[key + '_proyectado'])
    return null
  }

  const cmpLabel = compareMode === 'prevMonth' ? 'vs mes ant.' : compareMode === 'presupuesto' ? 'vs proy.' : undefined

  const totalInversion = paidMedia.reduce((s, p) => s + (p.inversion_real ?? 0), 0)
  const totalInteraccion = paidMedia.reduce((s, p) => s + (p.interaccion_pagada ?? 0), 0)
  const totalAlcance = paidMedia.reduce((s, p) => s + (p.alcance_pagado ?? 0), 0)
  const avgCPR = totalInteraccion ? totalInversion / totalInteraccion : null
  const avgETR = totalAlcance ? (totalInteraccion / totalAlcance) * 100 : null

  if (loading) return (
    <div>
      <PageHeader title="Facebook" />
      <div className="grid grid-cols-3 gap-4">
        {[...Array(6)].map((_, i) => <div key={i} className="card h-28 animate-pulse bg-slate-50" />)}
      </div>
    </div>
  )

  return (
    <div className="space-y-6">
      <PageHeader title="Facebook" subtitle="Rendimiento orgánico + pagado" />

      {/* ── General ─────────────────────────────── */}
      <section>
        <div className="section-title">Métricas generales</div>
        <div className="grid grid-cols-3 gap-4 cards-grid">
          <MetricCard label="Seguidores totales"  value={cur?.seguidores_totales ?? 0} icon={Users}     delta={d('seguidores_totales')} compareLabel={cmpLabel} delay={0}   />
          <MetricCard label="Nuevos seguidores"   value={cur?.seguidores_nuevos  ?? 0} icon={UserPlus}  delta={d('seguidores_nuevos')}  compareLabel={cmpLabel} delay={60}  />
          <MetricCard label="Alcance"             value={cur?.alcance            ?? 0} icon={Radio}     delta={d('alcance')}            compareLabel={cmpLabel} delay={120} />
          <MetricCard label="Interacción"         value={cur?.interaccion        ?? 0} icon={ThumbsUp}  delta={d('interaccion')}        compareLabel={cmpLabel} delay={180} />
          <MetricCard label="Video Views"         value={cur?.video_views        ?? 0} icon={FileText}  delta={d('video_views')}        compareLabel={cmpLabel} delay={240} />
          <MetricCard label="Engagement Rate"     value={Math.round((cur?.engagement_rate ?? 0) * 100)} icon={TrendingUp} format="percent" accent delay={300} />
        </div>
      </section>

      {/* ── Paid media total ────────────────────── */}
      {paidMedia.length > 0 && (
        <section>
          <div className="section-title">Paid media · Resumen del mes</div>
          <div className="card">
            <div className="grid grid-cols-4 gap-4 mb-4">
              <div className="text-center">
                <div className="metric-label mb-1">Inversión total</div>
                <div className="text-2xl font-800 text-slate-800">${fmt(totalInversion, 2)}</div>
              </div>
              <div className="text-center">
                <div className="metric-label mb-1">Alcance pagado</div>
                <div className="text-2xl font-800 text-slate-800">{fmtCompact(totalAlcance)}</div>
              </div>
              <div className="text-center">
                <div className="metric-label mb-1">Interacción pagada</div>
                <div className="text-2xl font-800 text-slate-800">{fmtCompact(totalInteraccion)}</div>
              </div>
              <div className="text-center">
                <div className="metric-label mb-1">CPR promedio</div>
                <div className="text-2xl font-800 text-slate-800">{avgCPR ? `$${avgCPR.toFixed(2)}` : '—'}</div>
              </div>
            </div>

            {/* Breakdown por campaña */}
            {paidMedia.map(pm => {
              const camp = campaigns.find(c => c.id === pm.campaign_id)
              return (
                <PaidCampaignSection
                  key={pm.id}
                  campaign={camp}
                  plataforma="facebook"
                  data={pm}
                  accumulated={accumulated[pm.campaign_id] ?? []}
                />
              )
            })}
          </div>

          {/* Paid highlights */}
          <div className="grid grid-cols-2 gap-4 mt-4">
            {(hlPaid.length > 0 ? hlPaid : [
              { subseccion: 'paid_media', seccion: 'facebook', orden: 1, tipo: 'logro',    mes: selectedMonth },
              { subseccion: 'paid_media', seccion: 'facebook', orden: 2, tipo: 'hallazgo', mes: selectedMonth },
            ]).map((h, i) => <HighlightBox key={h.id ?? i} highlight={h} />)}
          </div>
        </section>
      )}

      {/* ── Best post ───────────────────────────── */}
      <section>
        <div className="section-title">Mejor post del mes · Interacción</div>
        <div className="grid grid-cols-3 gap-4">
          {[1, 2, 3].map(pos => {
            const post = bestPosts.find(p => p.posicion === pos && p.criterio === 'interaccion')
            return <BestPostCard key={pos} post={post ?? null} rank={pos} metricLabel="Interacciones" />
          })}
        </div>
      </section>

      {/* ── General highlights ──────────────────── */}
      <section>
        <div className="section-title">Highlights · Facebook</div>
        <div className="grid grid-cols-2 gap-4">
          {(highlights.length > 0 ? highlights : [
            { seccion: 'facebook', subseccion: 'general', orden: 1, tipo: 'logro',    mes: selectedMonth },
            { seccion: 'facebook', subseccion: 'general', orden: 2, tipo: 'hallazgo', mes: selectedMonth },
          ]).map((h, i) => <HighlightBox key={h.id ?? i} highlight={h} />)}
        </div>
      </section>
    </div>
  )
}
