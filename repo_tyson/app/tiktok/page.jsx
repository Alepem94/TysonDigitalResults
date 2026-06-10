'use client'
import { useEffect, useState } from 'react'
import { useMonth } from '@/context/MonthContext'
import { getPlatform, getPaidMedia, getCampaignAccumulated, getCampaigns, getBestPosts, getHighlights } from '@/lib/queries'
import { delta, deltaVsProy, fmt, fmtCompact, fmtPct } from '@/lib/utils'
import MetricCard from '@/components/MetricCard'
import PaidCampaignSection from '@/components/PaidCampaignSection'
import BestPostCard from '@/components/BestPostCard'
import HighlightBox from '@/components/HighlightBox'
import PageHeader from '@/components/PageHeader'
import { Users, UserPlus, Play, TrendingUp } from 'lucide-react'

export default function TikTokPage() {
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
      getPlatform(selectedMonth, 'tiktok'),
      getPaidMedia(selectedMonth, 'tiktok'),
      getCampaigns(),
      getBestPosts(selectedMonth, 'tiktok'),
      getHighlights(selectedMonth, 'tiktok'),
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
          accMap[entry.campaign_id] = acc.filter(a => a.plataforma === 'tiktok')
        }
      }
      setAccumulated(accMap)
      setLoading(false)
    })
  }, [selectedMonth])

  const cur  = platform.current
  const prev = platform.previous

  function d(key) {
    if (compareMode === 'prevMonth')   return delta(cur?.[key], prev?.[key])
    if (compareMode === 'presupuesto') return deltaVsProy(cur?.[key], cur?.[key + '_proyectado'])
    return null
  }
  const cmpLabel = compareMode === 'prevMonth' ? 'vs mes ant.' : compareMode === 'presupuesto' ? 'vs proy.' : undefined

  const totalInversion = paidMedia.reduce((s, p) => s + (p.inversion_real ?? 0), 0)
  const totalViews     = paidMedia.reduce((s, p) => s + (p.views_totales  ?? 0), 0)
  const totalViews6s   = paidMedia.reduce((s, p) => s + (p.views_6seg     ?? 0), 0)
  const globalCVR      = totalViews ? (totalViews6s / totalViews) * 100 : null
  const globalCPV      = totalViews6s ? totalInversion / totalViews6s : null

  if (loading) return (
    <div>
      <PageHeader title="TikTok" />
      <div className="grid grid-cols-3 gap-4">
        {[...Array(6)].map((_, i) => <div key={i} className="card h-28 animate-pulse bg-slate-50" />)}
      </div>
    </div>
  )

  return (
    <div className="space-y-6">
      <PageHeader title="TikTok" subtitle="Rendimiento orgánico + pagado" />

      {/* ── General ─────────────────────────────── */}
      <section>
        <div className="section-title">Métricas generales</div>
        <div className="grid grid-cols-3 gap-4 cards-grid">
          <MetricCard label="Seguidores totales" value={cur?.seguidores_totales ?? 0} icon={Users}     delta={d('seguidores_totales')} compareLabel={cmpLabel} delay={0}  />
          <MetricCard label="Nuevos seguidores"  value={cur?.seguidores_nuevos  ?? 0} icon={UserPlus}  delta={d('seguidores_nuevos')}  compareLabel={cmpLabel} delay={60} />
          <MetricCard label="Video Views"        value={cur?.video_views        ?? 0} icon={Play}      delta={d('video_views')}        compareLabel={cmpLabel} delay={120} accent />
        </div>
      </section>

      {/* ── Paid media ─────────────────────────── */}
      {paidMedia.length > 0 && (
        <section>
          <div className="section-title">Paid media · Resumen del mes</div>
          <div className="card">
            <div className="grid grid-cols-4 gap-4 mb-4">
              <div className="text-center">
                <div className="metric-label mb-1">Inversión</div>
                <div className="text-2xl font-800 text-slate-800">${fmt(totalInversion, 2)}</div>
              </div>
              <div className="text-center">
                <div className="metric-label mb-1">Views totales</div>
                <div className="text-2xl font-800 text-slate-800">{fmtCompact(totalViews)}</div>
              </div>
              <div className="text-center">
                <div className="metric-label mb-1">Views 6 seg</div>
                <div className="text-2xl font-800 text-slate-800">{fmtCompact(totalViews6s)}</div>
              </div>
              <div className="text-center">
                <div className="metric-label mb-1">CVR</div>
                <div className="text-2xl font-800 text-tyson-red">
                  {globalCVR ? fmtPct(globalCVR, 1) : '—'}
                </div>
              </div>
            </div>

            {paidMedia.map(pm => {
              const camp = campaigns.find(c => c.id === pm.campaign_id)
              return (
                <PaidCampaignSection
                  key={pm.id}
                  campaign={camp}
                  plataforma="tiktok"
                  data={pm}
                  accumulated={accumulated[pm.campaign_id] ?? []}
                />
              )
            })}
          </div>
          <div className="grid grid-cols-2 gap-4 mt-4">
            {(hlPaid.length > 0 ? hlPaid : [
              { subseccion: 'paid_media', seccion: 'tiktok', orden: 1, tipo: 'logro',    mes: selectedMonth },
              { subseccion: 'paid_media', seccion: 'tiktok', orden: 2, tipo: 'hallazgo', mes: selectedMonth },
            ]).map((h, i) => <HighlightBox key={h.id ?? i} highlight={h} />)}
          </div>
        </section>
      )}

      {/* ── Best video ───────────────────────────── */}
      <section>
        <div className="section-title">Mejor video del mes · Views 6 seg</div>
        <div className="grid grid-cols-3 gap-4">
          {[1, 2, 3].map(pos => {
            const post = bestPosts.find(p => p.posicion === pos && p.criterio === 'views_6seg')
            return <BestPostCard key={pos} post={post ?? null} rank={pos} metricLabel="Views 6 seg" />
          })}
        </div>
      </section>

      {/* ── Highlights ──────────────────────────── */}
      <section>
        <div className="section-title">Highlights · TikTok</div>
        <div className="grid grid-cols-2 gap-4">
          {(highlights.length > 0 ? highlights : [
            { seccion: 'tiktok', subseccion: 'general', orden: 1, tipo: 'logro',    mes: selectedMonth },
            { seccion: 'tiktok', subseccion: 'general', orden: 2, tipo: 'hallazgo', mes: selectedMonth },
          ]).map((h, i) => <HighlightBox key={h.id ?? i} highlight={h} />)}
        </div>
      </section>
    </div>
  )
}
