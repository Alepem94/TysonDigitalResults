'use client'
import { useMonth } from '@/context/MonthContext'
import { monthLabel } from '@/lib/utils'

export default function PageHeader({ title, subtitle, children }) {
  const { selectedMonth, compareMode, setCompare } = useMonth()

  return (
    <div className="flex items-start justify-between mb-5">
      <div>
        <h1 className="text-xl font-800 text-slate-800 leading-tight">{title}</h1>
        <div className="flex items-center gap-2 mt-1">
          <span className="text-xs font-600 text-tyson-red uppercase tracking-wider">
            {monthLabel(selectedMonth)}
          </span>
          {subtitle && (
            <>
              <span className="text-slate-300">·</span>
              <span className="text-xs text-slate-400">{subtitle}</span>
            </>
          )}
        </div>
      </div>

      <div className="flex items-center gap-2">
        {children}
        <div className="flex gap-1.5 bg-white rounded-xl p-1 shadow-card border border-slate-100">
          <button
            onClick={() => setCompare('none')}
            className={`compare-btn ${compareMode === 'none' ? 'active' : ''}`}
          >
            Solo real
          </button>
          <button
            onClick={() => setCompare('presupuesto')}
            className={`compare-btn ${compareMode === 'presupuesto' ? 'active' : ''}`}
          >
            vs Presupuesto
          </button>
          <button
            onClick={() => setCompare('prevMonth')}
            className={`compare-btn ${compareMode === 'prevMonth' ? 'active' : ''}`}
          >
            vs Mes anterior
          </button>
        </div>
      </div>
    </div>
  )
}
