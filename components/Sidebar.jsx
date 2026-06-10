'use client'
import { usePathname } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { useMonth } from '@/context/MonthContext'
import { monthLabel } from '@/lib/utils'
import {
  LayoutDashboard, Facebook, Instagram, Music2,
  Heart, Users, Lightbulb, ChevronDown
} from 'lucide-react'

const NAV = [
  { href: '/',             label: 'Overview',     icon: LayoutDashboard },
  { href: '/facebook',     label: 'Facebook',     icon: Facebook        },
  { href: '/instagram',    label: 'Instagram',    icon: Instagram       },
  { href: '/tiktok',       label: 'TikTok',       icon: Music2          },
  { href: '/sentiment',    label: 'Sentiment',    icon: Heart           },
  { href: '/competencia',  label: 'Competencia',  icon: Users           },
  { href: '/hallazgos',    label: 'Hallazgos',    icon: Lightbulb       },
]

export default function Sidebar() {
  const pathname = usePathname()
  const { selectedMonth, setMonth, availableMonths } = useMonth()

  return (
    <aside className="fixed left-0 top-0 h-screen w-64 bg-tyson-red flex flex-col z-40 border-r border-tyson-burgundy/20 shadow-xl">

      {/* Logo */}
      <div className="px-6 py-8 border-b border-black/10 relative overflow-hidden flex flex-col items-center justify-center">
        <div className="flex flex-col items-center gap-3 relative z-10 w-full mt-2">
          <div className="w-[72px] h-[72px] rounded-full shadow-lg overflow-hidden flex items-center justify-center border-4 border-tyson-yellow/30 bg-tyson-red">
           <img
              src="/tyson-logo.jpg"
              alt="Tyson"
              className="w-full h-full object-contain rounded-full scale-110"
            />
          </div>
          <div className="text-white text-[11px] font-extrabold uppercase tracking-[0.2em] mt-2 text-center pb-2 px-2 opacity-90 drop-shadow-sm">
            Resultados Digitales
          </div>
        </div>
      </div>

      {/* Month selector */}
      <div className="px-6 py-6 border-b border-black/10 relative">
        <div className="text-[10px] text-white/70 font-extrabold mb-3 uppercase tracking-[0.25em] ml-1">Análisis mensual</div>
        <div className="relative">
          <select
            value={selectedMonth}
            onChange={e => setMonth(e.target.value)}
            className="w-full bg-white/10 text-white text-[14px] font-extrabold rounded-xl px-4 py-3 pr-8
                       border border-white/20 hover:border-tyson-yellow/50 transition-all appearance-none cursor-pointer
                       focus:outline-none focus:border-tyson-yellow focus:ring-2 focus:ring-tyson-yellow/20 focus:bg-white/20 shadow-sm"
          >
            {availableMonths.map(m => (
              <option key={m} value={m} className="text-tyson-dark font-medium bg-white">
                {monthLabel(m)}
              </option>
            ))}
          </select>
          <ChevronDown className="absolute right-3.5 top-1/2 -translate-y-1/2 text-tyson-yellow pointer-events-none" size={16} />
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-6 overflow-y-auto space-y-1.5 bg-tyson-red relative">
        <div className="text-[10px] text-white/70 font-extrabold uppercase tracking-[0.25em] px-3 mb-5">Plataformas</div>
        {NAV.map(({ href, label, icon: Icon }) => {
          const active = pathname === href
          return (
             <Link
              key={href}
              href={href}
              className={`flex items-center gap-4 px-4 py-3.5 rounded-2xl text-[14px] font-extrabold transition-all duration-300 ${active ? 'bg-tyson-burgundy text-tyson-yellow shadow-lg shadow-tyson-dark/20' : 'text-white hover:text-tyson-yellow hover:bg-white/10'}`}
             >
              <Icon size={18} className={active ? 'text-tyson-yellow' : 'text-white/70'} />
              <span>{label}</span>
            </Link>
          )
        })}
      </nav>

      {/* Footer */}
      <div className="px-6 py-8 border-t border-black/10 bg-black/10 flex flex-col items-start gap-3">
        <div className="text-[10px] text-white/50 font-bold uppercase tracking-widest">
          Powered by
        </div>
        <img 
          src="/logo-light-repu.png" 
          alt="República Digital" 
          className="h-5 w-auto opacity-90"
        />
      </div>
    </aside>
  )
}
