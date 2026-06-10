// ─── Formatters ────────────────────────────────────────────────
export function fmt(n, decimals = 0) {
  if (n == null) return '—'
  return Number(n).toLocaleString('es-MX', { maximumFractionDigits: decimals })
}

export function fmtCurrency(n, decimals = 2) {
  if (n == null) return '—'
  return '$' + Number(n).toLocaleString('es-MX', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  })
}

export function fmtPct(n, decimals = 2) {
  if (n == null) return '—'
  return Number(n).toFixed(decimals) + '%'
}

export function fmtCompact(n) {
  if (n == null) return '—'
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(1) + 'M'
  if (n >= 1_000)     return (n / 1_000).toFixed(1)     + 'K'
  return String(n)
}

// ─── Delta helpers ─────────────────────────────────────────────
export function delta(current, previous) {
  if (!previous || previous === 0) return null
  return ((current - previous) / Math.abs(previous)) * 100
}

export function deltaVsProy(real, proy) {
  if (!proy || proy === 0) return null
  return ((real - proy) / Math.abs(proy)) * 100
}

export function deltaLabel(pct, invertido = false) {
  if (pct == null) return null
  const good = invertido ? pct < 0 : pct >= 0
  return {
    value: Math.abs(pct).toFixed(1) + '%',
    sign: pct >= 0 ? '▲' : '▼',
    color: good ? 'text-emerald-600' : 'text-red-500',
    bg:    good ? 'bg-emerald-50'    : 'bg-red-50',
  }
}

// ─── Campaign progress ─────────────────────────────────────────
export function campaignProgress(fechaInicio, fechaFin, mesActual) {
  if (!fechaFin) return null   // AON recurrente
  const inicio   = new Date(fechaInicio)
  const fin      = new Date(fechaFin)
  const actual   = new Date(mesActual)
  const total    = fin - inicio
  const elapsed  = actual - inicio
  return Math.min(100, Math.max(0, (elapsed / total) * 100))
}

// ─── Month display ──────────────────────────────────────────────
const MONTHS_ES = [
  '', 'Enero','Febrero','Marzo','Abril','Mayo','Junio',
  'Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre'
]

export function monthLabel(isoDate) {
  if (!isoDate) return ''
  const [year, month] = isoDate.split('-')
  return `${MONTHS_ES[parseInt(month)]} ${year}`
}

// ─── Computed metrics ──────────────────────────────────────────
export function calcCVR(views6s, viewsTotal) {
  if (!views6s || !viewsTotal) return null
  return (views6s / viewsTotal) * 100
}

export function calcETR(interaccion, alcance) {
  if (!interaccion || !alcance) return null
  return (interaccion / alcance) * 100
}

export function calcSOV(tysonComunidad, allComunidades) {
  const total = allComunidades.reduce((a, b) => a + b, 0)
  if (!total) return 0
  return (tysonComunidad / total) * 100
}

// ─── Platform colors ───────────────────────────────────────────
export const PLATFORM_COLORS = {
  facebook:  '#1877F2',
  instagram: '#C8102E',
  tiktok:    '#2D2D2D',
}

export const PLATFORM_LABELS = {
  facebook:  'Facebook',
  instagram: 'Instagram',
  tiktok:    'TikTok',
}

export const TIPO_COLORS = {
  hallazgo:      { bg: 'bg-blue-50',    text: 'text-blue-700',   border: 'border-blue-200',   dot: 'bg-blue-500'   },
  logro:         { bg: 'bg-emerald-50', text: 'text-emerald-700',border: 'border-emerald-200', dot: 'bg-emerald-500'},
  alerta:        { bg: 'bg-amber-50',   text: 'text-amber-700',  border: 'border-amber-200',  dot: 'bg-amber-500'  },
  recomendacion: { bg: 'bg-purple-50',  text: 'text-purple-700', border: 'border-purple-200', dot: 'bg-purple-500' },
}

export const TIPO_LABELS = {
  hallazgo:      'Hallazgo',
  logro:         'Logro',
  alerta:        'Alerta',
  recomendacion: 'Recomendación',
}
