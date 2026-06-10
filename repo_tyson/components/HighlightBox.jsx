'use client'
import { useState } from 'react'
import { TIPO_COLORS, TIPO_LABELS } from '@/lib/utils'
import { upsertHighlight } from '@/lib/queries'
import { Edit3, Check, X } from 'lucide-react'
import clsx from 'clsx'

export default function HighlightBox({ highlight, onSave }) {
  const [editing, setEditing] = useState(false)
  const [titulo, setTitulo]   = useState(highlight?.titulo   ?? '')
  const [contenido, setContenido] = useState(highlight?.contenido ?? '')
  const [saving, setSaving]   = useState(false)

  const tipo = highlight?.tipo ?? 'hallazgo'
  const colors = TIPO_COLORS[tipo]
  const isEmpty = !titulo && !contenido

  async function handleSave() {
    setSaving(true)
    const { data, error } = await upsertHighlight({ ...highlight, titulo, contenido })
    setSaving(false)
    if (!error) {
      setEditing(false)
      onSave?.(data)
    }
  }

  function handleCancel() {
    setTitulo(highlight?.titulo ?? '')
    setContenido(highlight?.contenido ?? '')
    setEditing(false)
  }

  return (
    <div className={clsx(
      'rounded-2xl border p-4 relative transition-all duration-200',
      colors.bg, colors.border
    )}>
      {/* Type badge */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <div className={clsx('w-2 h-2 rounded-full', colors.dot)} />
          <span className={clsx('text-xs font-700 uppercase tracking-wider', colors.text)}>
            {TIPO_LABELS[tipo]}
          </span>
        </div>
        {!editing ? (
          <button
            onClick={() => setEditing(true)}
            className="p-1 rounded-lg hover:bg-black/5 transition-colors"
          >
            <Edit3 size={12} className="text-slate-400" />
          </button>
        ) : (
          <div className="flex gap-1">
            <button
              onClick={handleSave}
              disabled={saving}
              className="p-1 rounded-lg bg-emerald-500 text-white hover:bg-emerald-600 transition-colors"
            >
              <Check size={12} />
            </button>
            <button
              onClick={handleCancel}
              className="p-1 rounded-lg bg-slate-200 text-slate-600 hover:bg-slate-300 transition-colors"
            >
              <X size={12} />
            </button>
          </div>
        )}
      </div>

      {editing ? (
        <div className="space-y-2">
          <input
            value={titulo}
            onChange={e => setTitulo(e.target.value)}
            placeholder="Título del hallazgo..."
            className="w-full text-sm font-600 bg-white/60 rounded-lg px-3 py-1.5 border border-current/20 outline-none placeholder:text-slate-300"
          />
          <textarea
            value={contenido}
            onChange={e => setContenido(e.target.value)}
            placeholder="Describe el hallazgo o insight..."
            rows={3}
            className="w-full text-sm bg-white/60 rounded-lg px-3 py-1.5 border border-current/20 outline-none resize-none placeholder:text-slate-300"
          />
        </div>
      ) : isEmpty ? (
        <button
          onClick={() => setEditing(true)}
          className="text-sm text-slate-400 italic hover:text-slate-500 transition-colors w-full text-left"
        >
          + Agregar {TIPO_LABELS[tipo].toLowerCase()}...
        </button>
      ) : (
        <>
          {titulo && (
            <div className={clsx('text-sm font-700 mb-1', colors.text)}>{titulo}</div>
          )}
          {contenido && (
            <div className="text-sm text-slate-600 leading-relaxed">{contenido}</div>
          )}
        </>
      )}
    </div>
  )
}
