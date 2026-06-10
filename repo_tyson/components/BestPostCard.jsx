'use client'
import { fmtCompact } from '@/lib/utils'
import { ExternalLink, Award } from 'lucide-react'

const FORMAT_LABELS = {
  video:    'Video',
  imagen:   'Imagen',
  carrusel: 'Carrusel',
  reel:     'Reel',
}

export default function BestPostCard({ post, rank = 1, metricLabel = 'Resultado' }) {
  if (!post) return (
    <div className="rounded-xl border-2 border-dashed border-slate-100 p-4 flex flex-col items-center justify-center min-h-[120px] text-slate-300">
      <div className="text-xs font-500">Sin datos de post</div>
    </div>
  )

  return (
    <div className={`rounded-xl overflow-hidden border ${rank === 1 ? 'border-tyson-gold/40 ring-1 ring-tyson-gold/20' : 'border-slate-100'}`}>
      {rank === 1 && (
        <div className="bg-gradient-to-r from-tyson-gold/20 to-tyson-gold/5 px-3 py-1.5 flex items-center gap-1.5 border-b border-tyson-gold/20">
          <Award size={11} className="text-tyson-gold" />
          <span className="text-xs font-700 text-amber-700">Mejor post del mes</span>
        </div>
      )}
      <div className="p-3 bg-white">
        <div className="flex gap-3">
          {post.thumbnail_url ? (
            <img
              src={post.thumbnail_url}
              alt={post.titulo}
              className="w-16 h-16 rounded-lg object-cover flex-shrink-0"
            />
          ) : (
            <div className="w-16 h-16 rounded-lg bg-slate-100 flex-shrink-0 flex items-center justify-center text-slate-300 text-xs">
              {FORMAT_LABELS[post.formato] ?? 'Post'}
            </div>
          )}
          <div className="flex-1 min-w-0">
            <div className="text-sm font-600 text-slate-700 truncate">{post.titulo || 'Post sin título'}</div>
            {post.fecha_publicacion && (
              <div className="text-xs text-slate-400 mt-0.5">
                {new Date(post.fecha_publicacion).toLocaleDateString('es-MX', { day: 'numeric', month: 'long' })}
                {post.formato && ` · ${FORMAT_LABELS[post.formato] ?? post.formato}`}
              </div>
            )}
            <div className="flex items-center gap-2 mt-2">
              <span className="text-xs font-500 text-slate-400">{metricLabel}</span>
              <span className="text-sm font-800 text-tyson-red">{fmtCompact(post.valor_metrica)}</span>
            </div>
          </div>
        </div>
        {post.descripcion && (
          <div className="mt-2 text-xs text-slate-500 leading-relaxed line-clamp-2">
            {post.descripcion}
          </div>
        )}
        {post.url && (
          <a
            href={post.url}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-2 inline-flex items-center gap-1 text-xs text-tyson-red font-600 hover:underline"
          >
            Ver post <ExternalLink size={10} />
          </a>
        )}
      </div>
    </div>
  )
}
