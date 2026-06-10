'use client'
import { useEffect, useState } from 'react'
import { useMonth } from '@/context/MonthContext'
import { getPlatform, getPaidMedia, getCampaignAccumulated, getCampaigns, getBestPosts, getHighlights } from '@/lib/queries'
import { delta, deltaVsProy } from '@/lib/utils'
import MetricCard from '@/components/MetricCard'
import PaidCampaignSection from '@/components/PaidCampaignSection'
import BestPostCard from '@/components/BestPostCard'
import HighlightBox from '@/components/HighlightBox'
import PageHeader from '@/components/PageHeader'
import { Users, UserPlus, Radio, ThumbsUp, TrendingUp, DollarSign } from 'lucide-react'

export default function InstagramPage() {
  const { selectedMonth, compareMode } = useMonth()
  const [loading, setLoading]       = useState(true)
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
      getPlatform(selectedMonth, 'instagram'),
      getPaidMedia(selectedMonth, 'instagram'),
      getCampaigns(),
      getBestPosts(selectedMonth, 'instagram'),
      getHighlights(selectedMonth, 'instagram'),
    ]).then(async ([pl, pm, ca, bp, hl]) => {
      setPlatform(pl)
      setPaidMedia(pm)
      setCampaigns(ca)
      setBestPosts(bp)
      setHighlights(hl.filter(h => h.subseccion === 'general'))
      setHlPaid(hl.filter(h => h.subseccion === 'paid_media'))
      const accMap = {}
      for (const entry of pm) {
        if (entry.campaign_id) {
          const acc = await getCampaignAccumulated(entry.campaign_id, selectedMonth)
          accMap[entry.campaign_id] = acc.filter(a => a.plataforma === 'instagram')
        }
      }
      setAccumulated(accMap)
      setLoading(false)
    })
  }, [selectedMonth])

  const cur  = platform.current
  const prev = platform.previous

  function d(key) {
    if (compareMode === 'prevMonth')    return delta(cur?.[key], prev?.[key])
    if (compareMode === 'presupuesto')  return deltaVsProy(cur?.[key], cur?.[key + '_proyectado'])
    return null
  }
  const cmpLabel = compareMode === 'prevMonth' ? 'vs mes ant.' : compareMode === 'presupuesto' ? 'vs proy.' : undefined

  const totalInversion = paidMedia.reduce((s, p) => s + (p.inversion_real ?? 0), 0)
  const totalAlcance   = paidMedia.reduce((s, p) => s + (p.alcance_pagado ?? 0), 0)
  const avgCPM = paidMedia.length ? paidMedia.reduce((s, p) => s + (p.cpm ?? 0), 0) / paidMedia.filter(p => p.cpm).length : null

  if (loading) return (
    <div>
      <PageHeader title="Instagram" />
      <div className="grid grid-cols-3 gap-4">
        {[...Array(6)].map((_, i) => <div key={i} className="card h-28 animate-pulse bg-slate-50" />)}
      </div>
    </div>
  )

  return (
    <div className="space-y-6">
      <PageHeader title="Instagram" subtitle="Rendimiento orgánico + pagado" />

      {/* ── General ─────────────────────────────── */}
      <section>
        <div className="section-title">Métricas generales</div>
        <div className="grid grid-cols-3 gap-4 cards-grid">
          <MetricCard label="Seguidores totales" value={cur?.seguidores_totales ?? 0} icon={Users}     delta={d('seguidores_totales')} compareLabel={cmpLabel} delay={0}   />
          <MetricCard label="Nuevos seguidores"  value={cur?.seguidores_nuevos  ?? 0} icon={UserPlus}  delta={d('seguidores_nuevos')}  compareLabel={cmpLabel} delay={60}  />
          <MetricCard label="Alcance"            value={cur?.alcance            ?? 0} icon={Radio}     delta={d('alcance')}            compareLabel={cmpLabel} delay={120} />
          <MetricCard label="Interacción"        value={cur?.interaccion        ?? 0} icon={ThumbsUp}  delta={d('interaccion')}        compareLabel={cmpLabel} delay={180} />
          <MetricCard label="Num. Posts"         value={cur?.num_posts          ?? 0} icon={TrendingUp} delay={240} />
          <MetricCard label="Engagement Rate"    value={Math.round((cur?.engagement_rate ?? 0) * 100)} icon={TrendingUp} format="percent" accent delay={300} />
        </div>
      </section>

      {/* ── Paid media ─────────────────────────── */}
      {paidMedia.length > 0 && (
        <section>
          <div className="section-title">Paid media · Resumen del mes</div>
          <div className="card">
            <div className="grid grid-cols-3 gap-4 mb-4">
              <div className="text-center">
                <div className="metric-label mb-1">Inversión total</div>
                <div className="text-2xl font-800 text-slate-800">${totalInversion.toFixed(2)}</div>
              </div>
              <div className="text-center">
                <div className="metric-label mb-1">Alcance pagado</div>
                <div className="text-2xl font-800 text-slate-800">{totalAlcance.toLocaleString('es-MX')}</div>
              </div>
              <div className="text-center">
                <div className="metric-label mb-1">CPM promedio</div>
                <div className="text-2xl font-800 text-slate-800">{avgCPM ? `$${avgCPM.toFixed(2)}` : '—'}</div>
              </div>
            </div>
            {paidMedia.map(pm => {
              const camp = campaigns.find(c => c.id === pm.campaign_id)
              return (
                <PaidCampaignSection
                  key={pm.id}
                  campaign={camp}
                  plataforma="instagram"
                  data={pm}
                  accumulated={accumulated[pm.campaign_id] ?? []}
                />
              )
            })}
          </div>
          <div className="grid grid-cols-2 gap-4 mt-4">
            {(hlPaid.length > 0 ? hlPaid : [
              { subseccion: 'paid_media', seccion: 'instagram', orden: 1, tipo: 'logro',    mes: selectedMonth },
              { subseccion: 'paid_media', seccion: 'instagram', orden: 2, tipo: 'hallazgo', mes: selectedMonth },
            ]).map((h, i) => <HighlightBox key={h.id ?? i} highlight={h} />)}
          </div>
        </section>
      )}

      {/* ── Best post ───────────────────────────── */}
      <section>
        <div className="section-title">Mejor post del mes · Alcance</div>
        <div className="grid grid-cols-3 gap-4">
          {[1, 2, 3].map(pos => {
            const post = bestPosts.find(p => p.posicion === pos && p.criterio === 'alcance')
            return <BestPostCard key={pos} post={post ?? null} rank={pos} metricLabel="Alcance" />
          })}
        </div>
      </section>

      {/* ── Highlights ──────────────────────────── */}
      <section>
        <div className="section-title">Highlights · Instagram</div>
        <div className="grid grid-cols-2 gap-4">
          {(highlights.length > 0 ? highlights : [
            { seccion: 'instagram', subseccion: 'general', orden: 1, tipo: 'logro',    mes: selectedMonth },
            { seccion: 'instagram', subseccion: 'general', orden: 2, tipo: 'hallazgo', mes: selectedMonth },
          ]).map((h, i) => <HighlightBox key={h.id ?? i} highlight={h} />)}
        </div>
      </section>
    </div>
  )
}
