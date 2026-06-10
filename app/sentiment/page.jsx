'use client'
import { useEffect, useState } from 'react'
import { useMonth } from '@/context/MonthContext'
import { getSentiment, getHighlights } from '@/lib/queries'
import { monthLabel } from '@/lib/utils'
import HighlightBox from '@/components/HighlightBox'
import PageHeader from '@/components/PageHeader'
import { ChevronLeft, ChevronRight, Smile, Meh, Frown } from 'lucide-react'

function SentimentGauge({ positive = 0, neutral = 0, negative = 0 }) {
  return (
    <div className="flex flex-col items-center py-6">
      <div className="relative w-40 h-20 mb-4">
        {/* Semi-circle track */}
        <svg viewBox="0 0 160 80" className="w-full">
          <path d="M10,80 A70,70 0 0,1 150,80" fill="none" stroke="#f1f5f9" strokeWidth="14" strokeLinecap="round" />
          {/* Colored arcs */}
          {negative > 0 && (
            <path d="M10,80 A70,70 0 0,1 150,80" fill="none" stroke="#ef4444"
              strokeWidth="14" strokeLinecap="round"
              strokeDasharray={`${(negative / 100) * 220} 220`}
            />
          )}
          <path d="M10,80 A70,70 0 0,1 150,80" fill="none" stroke="#10b981"
            strokeWidth="14" strokeLinecap="round"
            strokeDasharray={`${(positive / 100) * 220} 220`}
            strokeDashoffset={`${-((negative + neutral) / 100) * 220}`}
          />
        </svg>
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 text-center">
          <div className="text-3xl font-900 text-slate-800">{positive.toFixed(0)}%</div>
          <div className="text-xs text-emerald-600 font-700">Positivo</div>
        </div>
      </div>

      <div className="flex gap-6">
        <div className="flex items-center gap-1.5">
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
          <span className="text-xs text-slate-500 font-500">Positivo <strong className="text-slate-700">{positive.toFixed(1)}%</strong></span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-2.5 h-2.5 rounded-full bg-slate-300" />
          <span className="text-xs text-slate-500 font-500">Neutro <strong className="text-slate-700">{neutral.toFixed(1)}%</strong></span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-2.5 h-2.5 rounded-full bg-red-400" />
          <span className="text-xs text-slate-500 font-500">Negativo <strong className="text-slate-700">{negative.toFixed(1)}%</strong></span>
        </div>
      </div>
    </div>
  )
}

function CommentCarousel({ comments = [] }) {
  const [idx, setIdx] = useState(0)
  if (!comments.length) return (
    <div className="rounded-xl border-2 border-dashed border-slate-100 h-40 flex items-center justify-center text-slate-300 text-sm">
      Sin capturas de comentarios
    </div>
  )
  const comment = comments[idx]
  return (
    <div>
      <div className="rounded-xl overflow-hidden border border-slate-100 bg-slate-50 min-h-[160px] flex items-center justify-center">
        {comment.screenshot_url
          ? <img src={comment.screenshot_url} alt="Comentario" className="max-h-48 object-contain rounded-xl" />
          : <div className="text-slate-300 text-sm">Captura #{idx + 1}</div>
        }
      </div>
      <div className="flex items-center justify-between mt-2">
        <button
          onClick={() => setIdx(i => Math.max(0, i - 1))}
          disabled={idx === 0}
          className="p-1.5 rounded-lg hover:bg-slate-100 disabled:opacity-30 transition-colors"
        >
          <ChevronLeft size={16} className="text-slate-500" />
        </button>
        <div className="flex gap-1.5">
          {comments.map((_, i) => (
            <button
              key={i}
              onClick={() => setIdx(i)}
              className={`w-1.5 h-1.5 rounded-full transition-colors ${i === idx ? 'bg-tyson-burgundy' : 'bg-slate-200'}`}
            />
          ))}
        </div>
        <button
          onClick={() => setIdx(i => Math.min(comments.length - 1, i + 1))}
          disabled={idx === comments.length - 1}
          className="p-1.5 rounded-lg hover:bg-slate-100 disabled:opacity-30 transition-colors"
        >
          <ChevronRight size={16} className="text-slate-500" />
        </button>
      </div>
    </div>
  )
}

export default function SentimentPage() {
  const { selectedMonth } = useMonth()
  const [loading, setLoading]     = useState(true)
  const [sentiments, setSentiments] = useState([])
  const [highlights, setHighlights] = useState([])

  useEffect(() => {
    setLoading(true)
    Promise.all([
      getSentiment(selectedMonth),
      getHighlights(selectedMonth, 'sentiment'),
    ]).then(([s, hl]) => {
      setSentiments(s)
      setHighlights(hl)
      setLoading(false)
    })
  }, [selectedMonth])

  if (loading) return (
    <div><PageHeader title="Sentiment" />
      <div className="card h-64 animate-pulse bg-slate-50" />
    </div>
  )

  return (
    <div className="space-y-6">
      <PageHeader title="Sentiment" subtitle="Percepción de la audiencia" />

      {sentiments.length === 0 ? (
        <div className="card py-16 text-center">
          <Smile size={32} className="text-slate-200 mx-auto mb-3" />
          <div className="text-slate-400 font-500">Sin datos de sentiment para {monthLabel(selectedMonth)}</div>
        </div>
      ) : sentiments.map(s => (
        <div key={s.id} className="card">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-2 h-2 rounded-full bg-tyson-burgundy" />
            <div className="text-sm font-700 text-slate-700">{s.campaigns?.nombre ?? 'General'}</div>
          </div>

          <div className="grid grid-cols-3 gap-6">
            {/* Gauge */}
            <div>
              <div className="section-title">Distribución de sentiment</div>
              <SentimentGauge
                positive={s.porcentaje_positivo ?? 0}
                neutral={s.porcentaje_neutro ?? 0}
                negative={s.porcentaje_negativo ?? 0}
              />
            </div>

            {/* Carousel */}
            <div>
              <div className="section-title">Comentarios destacados</div>
              <CommentCarousel comments={s.comments} />
            </div>

            {/* Description */}
            <div>
              <div className="section-title">Análisis narrativo</div>
              {s.descripcion ? (
                <p className="text-sm text-slate-600 leading-relaxed">{s.descripcion}</p>
              ) : (
                <div className="text-sm text-slate-300 italic">Sin descripción narrativa</div>
              )}
            </div>
          </div>
        </div>
      ))}

      {/* Highlights */}
      <section>
        <div className="section-title">Highlights · Sentiment</div>
        <div className="grid grid-cols-2 gap-4">
          {(highlights.length > 0 ? highlights : [
            { seccion: 'sentiment', orden: 1, tipo: 'hallazgo', mes: selectedMonth },
            { seccion: 'sentiment', orden: 2, tipo: 'hallazgo', mes: selectedMonth },
          ]).map((h, i) => <HighlightBox key={h.id ?? i} highlight={h} />)}
        </div>
      </section>
    </div>
  )
}
