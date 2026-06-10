'use client'
import { useMonth } from '@/context/MonthContext'
import { monthLabel } from '@/lib/utils'

export default function PageHeader({ title, subtitle, children }) {
  const { selectedMonth, compareMode, setCompare } = useMonth()

  return (
    <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
      <div>
        <div className="flex items-center gap-3">
          <span className="text-[11px] font-bold text-tyson-burgundy uppercase tracking-[0.2em] bg-tyson-yellow/20 px-3 py-1 rounded-full">
            {monthLabel(selectedMonth)}
          </span>
          {subtitle && (
            <span className="text-sm font-medium text-slate-500">{subtitle}</span>
          )}
        </div>
        <h1 className="text-3xl md:text-4xl font-extrabold text-tyson-dark leading-none tracking-tight font-display mt-3">
          {title}
        </h1>
      </div>

      <div className="flex items-center gap-3">
        {children}
        <div className="flex gap-1 bg-white rounded-2xl p-1 shadow-sm border border-slate-200">
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
