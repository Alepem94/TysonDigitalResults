'use client'
import { useEffect, useState } from 'react'
import { useMonth } from '@/context/MonthContext'
import { getFindings, getCampaigns } from '@/lib/queries'
import { monthLabel, TIPO_COLORS, TIPO_LABELS } from '@/lib/utils'
import PageHeader from '@/components/PageHeader'
import { supabase } from '@/lib/supabase'
import { Plus, Trash2, Save } from 'lucide-react'
import clsx from 'clsx'

const PRIORIDAD_STYLES = {
  alta:  'bg-red-50 text-red-700 border border-red-200',
  media: 'bg-amber-50 text-amber-700 border border-amber-200',
  baja:  'bg-slate-50 text-slate-600 border border-slate-200',
}

function FindingCard({ finding, onDelete }) {
  const colors = TIPO_COLORS[finding.tipo] ?? TIPO_COLORS.hallazgo
  const aplica = finding.aplica_a ?? []

  return (
    <div className={clsx('rounded-2xl border p-4', colors.bg, colors.border)}>
      <div className="flex items-start justify-between mb-2">
        <div className="flex items-center gap-2 flex-wrap">
          <div className="flex items-center gap-1.5">
            <div className={clsx('w-2 h-2 rounded-full', colors.dot)} />
            <span className={clsx('text-xs font-700 uppercase tracking-wider', colors.text)}>
              {TIPO_LABELS[finding.tipo]}
            </span>
          </div>
          <span className={clsx('text-xs font-600 px-2 py-0.5 rounded-full', PRIORIDAD_STYLES[finding.prioridad])}>
            {finding.prioridad}
          </span>
          {finding.campaigns?.nombre && (
            <span className="text-xs font-500 text-slate-400 bg-white/60 px-2 py-0.5 rounded-full border border-slate-100">
              {finding.campaigns.nombre}
            </span>
          )}
        </div>
        <button
          onClick={() => onDelete(finding.id)}
          className="p-1 rounded-lg hover:bg-black/5 transition-colors text-slate-300 hover:text-red-400"
        >
          <Trash2 size={12} />
        </button>
      </div>
      <div className={clsx('text-sm font-700 mb-1.5', colors.text)}>{finding.titulo}</div>
      <div className="text-sm text-slate-600 leading-relaxed">{finding.descripcion}</div>
      {aplica.length > 0 && (
        <div className="flex gap-1.5 mt-2">
          {aplica.map(a => (
            <span key={a} className="text-xs bg-white/60 text-slate-500 px-2 py-0.5 rounded-full border border-slate-100 font-500">
              {a}
            </span>
          ))}
        </div>
      )}
    </div>
  )
}

function AddFindingForm({ campaigns, selectedMonth, onAdd }) {
  const [open, setOpen] = useState(false)
  const [form, setForm] = useState({
    tipo: 'hallazgo', prioridad: 'alta',
    titulo: '', descripcion: '',
    campaign_id: '', aplica_a: []
  })
  const [saving, setSaving] = useState(false)

  const platforms = ['general', 'facebook', 'instagram', 'tiktok']

  async function handleAdd() {
    if (!form.titulo) return
    setSaving(true)
    const { data, error } = await supabase
      .from('findings_recommendations')
      .insert({
        mes: selectedMonth,
        campaign_id: form.campaign_id || null,
        tipo: form.tipo,
        prioridad: form.prioridad,
        titulo: form.titulo,
        descripcion: form.descripcion,
        aplica_a: form.aplica_a,
        orden: Date.now(),
      })
      .select('*, campaigns(nombre)')
      .single()
    setSaving(false)
    if (!error) {
      onAdd(data)
      setForm({ tipo: 'hallazgo', prioridad: 'alta', titulo: '', descripcion: '', campaign_id: '', aplica_a: [] })
      setOpen(false)
    }
  }

  if (!open) return (
    <button
      onClick={() => setOpen(true)}
      className="flex items-center justify-center gap-2 px-6 py-4 rounded-2xl border-2 border-dashed border-slate-200 text-[14px] font-bold text-slate-400 hover:border-tyson-burgundy hover:bg-tyson-yellow/10 hover:text-tyson-burgundy transition-all w-full"
    >
      <Plus size={18} /> Agregar hallazgo o recomendación
    </button>
  )

  return (
    <div className="card space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="metric-label block mb-2">Tipo</label>
          <select
            value={form.tipo}
            onChange={e => setForm(f => ({ ...f, tipo: e.target.value }))}
            className="w-full text-[14px] font-medium border border-slate-200 rounded-xl px-4 py-3 outline-none focus:border-tyson-burgundy focus:ring-2 focus:ring-tyson-yellow/40 transition-all bg-slate-50 focus:bg-white"
          >
            {Object.entries(TIPO_LABELS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
          </select>
        </div>
        <div>
          <label className="metric-label block mb-2">Prioridad</label>
          <select
            value={form.prioridad}
            onChange={e => setForm(f => ({ ...f, prioridad: e.target.value }))}
            className="w-full text-[14px] font-medium border border-slate-200 rounded-xl px-4 py-3 outline-none focus:border-tyson-burgundy focus:ring-2 focus:ring-tyson-burgundy/10 transition-all bg-slate-50 focus:bg-white"
          >
            <option value="alta">Alta</option>
            <option value="media">Media</option>
            <option value="baja">Baja</option>
          </select>
        </div>
      </div>
      <div>
        <label className="metric-label block mb-2">Campaña (opcional)</label>
        <select
          value={form.campaign_id}
          onChange={e => setForm(f => ({ ...f, campaign_id: e.target.value }))}
          className="w-full text-[14px] font-medium border border-slate-200 rounded-xl px-4 py-3 outline-none focus:border-tyson-burgundy focus:ring-2 focus:ring-tyson-burgundy/10 transition-all bg-slate-50 focus:bg-white"
        >
          <option value="">General</option>
          {campaigns.map(c => <option key={c.id} value={c.id}>{c.nombre}</option>)}
        </select>
      </div>
      <div>
        <label className="metric-label block mb-2">Título</label>
        <input
          value={form.titulo}
          onChange={e => setForm(f => ({ ...f, titulo: e.target.value }))}
          placeholder="Título del hallazgo..."
          className="w-full text-[14px] font-medium border border-slate-200 rounded-xl px-4 py-3 outline-none focus:border-tyson-burgundy focus:ring-2 focus:ring-tyson-burgundy/10 transition-all bg-slate-50 focus:bg-white"
        />
      </div>
      <div>
        <label className="metric-label block mb-2">Descripción</label>
        <textarea
          value={form.descripcion}
          onChange={e => setForm(f => ({ ...f, descripcion: e.target.value }))}
          placeholder="Describe el hallazgo o recomendación..."
          rows={3}
          className="w-full text-[14px] font-medium border border-slate-200 rounded-xl px-4 py-3 outline-none focus:border-tyson-burgundy focus:ring-2 focus:ring-tyson-burgundy/10 transition-all bg-slate-50 focus:bg-white resize-none"
        />
      </div>
      <div>
        <label className="metric-label block mb-2">Aplica a</label>
        <div className="flex gap-2 flex-wrap">
          {platforms.map(p => (
            <button
              key={p}
              onClick={() => setForm(f => ({
                ...f,
                aplica_a: f.aplica_a.includes(p) ? f.aplica_a.filter(x => x !== p) : [...f.aplica_a, p]
              }))}
              className={`px-4 py-2 text-[12px] font-bold uppercase tracking-wider rounded-xl border transition-all ${
                form.aplica_a.includes(p)
                  ? 'bg-tyson-burgundy text-white border-tyson-burgundy shadow-sm'
                  : 'bg-white text-slate-500 border-slate-200 hover:border-slate-300 hover:text-slate-800'
              }`}
            >
              {p}
            </button>
          ))}
        </div>
      </div>
      <div className="flex gap-3 justify-end pt-4 border-t border-slate-100 mt-2">
        <button onClick={() => setOpen(false)} className="px-5 py-2.5 text-[14px] font-bold text-slate-500 hover:text-slate-700 bg-slate-50 hover:bg-slate-100 rounded-xl transition-colors">
          Cancelar
        </button>
        <button
          onClick={handleAdd}
          disabled={saving || !form.titulo}
          className="flex items-center gap-2 px-5 py-2.5 bg-tyson-burgundy text-white text-[14px] font-bold rounded-xl hover:bg-tyson-dark disabled:opacity-50 transition-all shadow-md"
        >
          <Save size={16} /> {saving ? 'Guardando...' : 'Guardar'}
        </button>
      </div>
    </div>
  )
}

export default function HallazgosPage() {
  const { selectedMonth } = useMonth()
  const [loading, setLoading]   = useState(true)
  const [findings, setFindings] = useState([])
  const [campaigns, setCampaigns] = useState([])

  useEffect(() => {
    setLoading(true)
    Promise.all([getFindings(selectedMonth), getCampaigns()]).then(([f, c]) => {
      setFindings(f)
      setCampaigns(c)
      setLoading(false)
    })
  }, [selectedMonth])

  async function handleDelete(id) {
    await supabase.from('findings_recommendations').delete().eq('id', id)
    setFindings(f => f.filter(x => x.id !== id))
  }

  const hallazgos      = findings.filter(f => f.tipo === 'hallazgo')
  const recomendaciones = findings.filter(f => f.tipo === 'recomendacion')

  if (loading) return (
    <div><PageHeader title="Hallazgos y Recomendaciones" />
      <div className="card h-64 animate-pulse bg-slate-50" />
    </div>
  )

  return (
    <div className="space-y-6">
      <PageHeader title="Hallazgos y Recomendaciones" subtitle={monthLabel(selectedMonth)} />

      {/* Add form */}
      <AddFindingForm campaigns={campaigns} selectedMonth={selectedMonth} onAdd={f => setFindings(prev => [...prev, f])} />

      <div className="grid grid-cols-2 gap-6">
        {/* Hallazgos */}
        <section>
          <div className="section-title">Hallazgos ({hallazgos.length})</div>
          <div className="space-y-3">
            {hallazgos.length === 0
              ? <div className="text-sm text-slate-300 italic">Sin hallazgos aún</div>
              : hallazgos.map(f => <FindingCard key={f.id} finding={f} onDelete={handleDelete} />)
            }
          </div>
        </section>

        {/* Recomendaciones */}
        <section>
          <div className="section-title">Recomendaciones ({recomendaciones.length})</div>
          <div className="space-y-3">
            {recomendaciones.length === 0
              ? <div className="text-sm text-slate-300 italic">Sin recomendaciones aún</div>
              : recomendaciones.map(f => <FindingCard key={f.id} finding={f} onDelete={handleDelete} />)
            }
          </div>
        </section>
      </div>
    </div>
  )
}
