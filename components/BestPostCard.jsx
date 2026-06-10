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
    <div className="rounded-2xl border border-dashed border-slate-200 p-4 flex flex-col items-center justify-center min-h-[120px] text-slate-400 bg-slate-50/50">
      <div className="text-[13px] font-semibold">Sin datos de post</div>
    </div>
  )

  return (
    <div className={`rounded-2xl overflow-hidden border transition-all hover:shadow-card-hover ${rank === 1 ? 'border-tyson-yellow/50 ring-2 ring-tyson-yellow/10' : 'border-slate-100 hover:border-slate-200'}`}>
      {rank === 1 && (
        <div className="bg-gradient-to-r from-tyson-yellow to-[#FFF0B3] px-3 py-1.5 flex items-center gap-2 border-b border-tyson-yellow/30">
          <Award size={13} className="text-tyson-burgundy" />
          <span className="text-[11px] font-bold text-tyson-burgundy uppercase tracking-wider">Mejor post del mes</span>
        </div>
      )}
      <div className="p-4 bg-white">
        <div className="flex gap-4">
          {post.thumbnail_url ? (
            <img
              src={post.thumbnail_url}
              alt={post.titulo}
              className="w-20 h-20 rounded-xl object-cover flex-shrink-0 shadow-sm border border-slate-100"
            />
          ) : (
            <div className="w-20 h-20 rounded-xl bg-slate-50 border border-slate-100 flex-shrink-0 flex items-center justify-center text-slate-400 text-xs font-semibold uppercase tracking-widest shadow-sm">
              {FORMAT_LABELS[post.formato] ?? 'Post'}
            </div>
          )}
          <div className="flex-1 min-w-0">
            <div className="text-[14px] font-bold text-tyson-dark line-clamp-2 leading-snug">{post.titulo || 'Post sin título'}</div>
            {post.fecha_publicacion && (
              <div className="text-[12px] text-slate-500 font-medium mt-1">
                {new Date(post.fecha_publicacion).toLocaleDateString('es-MX', { day: 'numeric', month: 'short' })}
                {post.formato && <span className="ml-1 px-1.5 py-0.5 bg-slate-100 rounded text-[10px] uppercase font-bold text-slate-500">{FORMAT_LABELS[post.formato] ?? post.formato}</span>}
              </div>
            )}
            <div className="flex items-center gap-2 mt-2 pt-2 border-t border-slate-50">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">{metricLabel}</span>
              <span className="text-[15px] font-extrabold text-tyson-burgundy">{fmtCompact(post.valor_metrica)}</span>
            </div>
          </div>
        </div>
        {post.descripcion && (
          <div className="mt-3 text-[13px] text-slate-500 leading-relaxed max-h-12 overflow-hidden opacity-80 relative">
            {post.descripcion}
            <div className="absolute bottom-0 left-0 w-full h-6 bg-gradient-to-t from-white to-transparent" />
          </div>
        )}
        {post.url && (
          <a
            href={post.url}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-3 inline-flex items-center justify-center w-full py-2 gap-1.5 text-[12px] text-tyson-burgundy font-bold rounded-xl border border-tyson-burgundy/20 hover:bg-tyson-burgundy hover:text-white transition-colors"
          >
            Ver publicación <ExternalLink size={12} />
          </a>
        )}
      </div>
    </div>
  )
}
