import { supabase } from './supabase'

// ─── Helpers ───────────────────────────────────────────────────
function prevMonth(mes) {
  const d = new Date(mes)
  d.setMonth(d.getMonth() - 1)
  return d.toISOString().slice(0, 10)
}

// ─── Campañas ──────────────────────────────────────────────────
export async function getCampaigns() {
  const { data } = await supabase
    .from('campaigns')
    .select('*')
    .order('fecha_inicio')
  return data ?? []
}

export async function getActiveCampaigns(mes) {
  const { data } = await supabase
    .from('campaigns')
    .select('*')
    .lte('fecha_inicio', mes)
    .or(`fecha_fin.gte.${mes},fecha_fin.is.null`)
  return data ?? []
}

// ─── Overview ──────────────────────────────────────────────────
export async function getOverview(mes) {
  const [current, previous] = await Promise.all([
    supabase.from('monthly_overview').select('*').eq('mes', mes).single(),
    supabase.from('monthly_overview').select('*').eq('mes', prevMonth(mes)).single(),
  ])
  return {
    current: current.data ?? null,
    previous: previous.data ?? null,
  }
}

// ─── Plataformas ───────────────────────────────────────────────
export async function getPlatforms(mes) {
  const [current, previous] = await Promise.all([
    supabase.from('platform_monthly').select('*').eq('mes', mes),
    supabase.from('platform_monthly').select('*').eq('mes', prevMonth(mes)),
  ])
  return {
    current: current.data ?? [],
    previous: previous.data ?? [],
  }
}

export async function getPlatform(mes, plataforma) {
  const [current, previous] = await Promise.all([
    supabase.from('platform_monthly').select('*').eq('mes', mes).eq('plataforma', plataforma).single(),
    supabase.from('platform_monthly').select('*').eq('mes', prevMonth(mes)).eq('plataforma', plataforma).single(),
  ])
  return {
    current: current.data ?? null,
    previous: previous.data ?? null,
  }
}

// ─── Paid Media ────────────────────────────────────────────────
export async function getPaidMedia(mes, plataforma = null) {
  let q = supabase
    .from('paid_media_monthly')
    .select('*, campaigns(nombre, color_hex)')
    .eq('mes', mes)
  if (plataforma) q = q.eq('plataforma', plataforma)
  const { data } = await q
  return data ?? []
}

export async function getPaidMediaByCampaign(mes, campaignId, plataforma) {
  const { data } = await supabase
    .from('paid_media_monthly')
    .select('*')
    .eq('mes', mes)
    .eq('campaign_id', campaignId)
    .eq('plataforma', plataforma)
    .single()
  return data ?? null
}

// Acumulado de una campaña (todos los meses hasta la fecha)
export async function getCampaignAccumulated(campaignId, hastaElMes) {
  const { data } = await supabase
    .from('paid_media_monthly')
    .select('*, campaigns(nombre, fecha_inicio, fecha_fin, presupuesto_total)')
    .eq('campaign_id', campaignId)
    .lte('mes', hastaElMes)
  return data ?? []
}

// ─── Mejores posts ─────────────────────────────────────────────
export async function getBestPosts(mes, plataforma = null, campaignId = null) {
  let q = supabase
    .from('best_posts')
    .select('*, campaigns(nombre)')
    .eq('mes', mes)
    .order('posicion')
  if (plataforma)  q = q.eq('plataforma', plataforma)
  if (campaignId)  q = q.eq('campaign_id', campaignId)
  const { data } = await q
  return data ?? []
}

// ─── Sentiment ─────────────────────────────────────────────────
export async function getSentiment(mes, campaignId = null) {
  let q = supabase.from('sentiment_monthly').select('*').eq('mes', mes)
  if (campaignId) q = q.eq('campaign_id', campaignId)
  const { data } = await q
  const items = data ?? []
  // Get comments for each sentiment record
  const withComments = await Promise.all(
    items.map(async (s) => {
      const { data: comments } = await supabase
        .from('sentiment_comments')
        .select('*')
        .eq('sentiment_id', s.id)
        .order('orden')
      return { ...s, comments: comments ?? [] }
    })
  )
  return withComments
}

// ─── Competencia ───────────────────────────────────────────────
export async function getCompetition(mes) {
  const { data } = await supabase
    .from('competition_monthly')
    .select('*')
    .eq('mes', mes)
    .order('plataforma')
    .order('comunidad', { ascending: false })
  return data ?? []
}

// ─── Highlights ────────────────────────────────────────────────
export async function getHighlights(mes, seccion = null) {
  let q = supabase
    .from('highlights')
    .select('*, campaigns(nombre)')
    .eq('mes', mes)
    .order('orden')
  if (seccion) q = q.eq('seccion', seccion)
  const { data } = await q
  return data ?? []
}

export async function upsertHighlight(highlight) {
  const { data, error } = await supabase
    .from('highlights')
    .upsert(highlight, { onConflict: 'id' })
    .select()
    .single()
  return { data, error }
}

// ─── Hallazgos y Recomendaciones ───────────────────────────────
export async function getFindings(mes, campaignId = null) {
  let q = supabase
    .from('findings_recommendations')
    .select('*, campaigns(nombre)')
    .eq('mes', mes)
    .order('prioridad')
    .order('orden')
  if (campaignId) q = q.eq('campaign_id', campaignId)
  const { data } = await q
  return data ?? []
}

// ─── Meses disponibles ─────────────────────────────────────────
export async function getAvailableMonths() {
  const { data } = await supabase
    .from('monthly_overview')
    .select('mes')
    .order('mes', { ascending: false })
  return (data ?? []).map(r => r.mes)
}
