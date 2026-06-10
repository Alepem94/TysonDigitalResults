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

const MONTHS_ES = [
  '','Ene','Feb','Mar','Abr','May','Jun',
  'Jul','Ago','Sep','Oct','Nov','Dic'
]

function formatShort(iso) {
  if (!iso) return ''
  const [y, m] = iso.split('-')
  return `${MONTHS_ES[parseInt(m)]} ${y}`
}

export default function Sidebar() {
  const pathname = usePathname()
  const { selectedMonth, setMonth, availableMonths } = useMonth()

  return (
    <aside className="fixed left-0 top-0 h-screen w-64 bg-tyson-sidebar flex flex-col z-40 border-r border-white/5">

      {/* Logo */}
      <div className="px-5 py-5 border-b border-white/5">
        <div className="flex items-center gap-3">
          <Image
            src="/logo.png"
            alt="Tyson Foods"
            width={80}
            height={46}
            className="object-contain"
            priority
          />
          <div>
            <div className="text-white text-xs font-700 leading-tight">Dashboard</div>
            <div className="text-slate-500 text-xs font-400">Social Media</div>
          </div>
        </div>
      </div>

      {/* Month selector */}
      <div className="px-4 py-3 border-b border-white/5">
        <div className="text-xs text-slate-500 font-500 mb-1.5 uppercase tracking-wider">Período</div>
        <div className="relative">
          <select
            value={selectedMonth}
            onChange={e => setMonth(e.target.value)}
            className="w-full bg-white/5 text-white text-sm font-600 rounded-xl px-3 py-2 pr-8
                       border border-white/10 appearance-none cursor-pointer
                       focus:outline-none focus:border-tyson-red/50"
          >
            {availableMonths.map(m => (
              <option key={m} value={m} className="bg-slate-800 text-white">
                {monthLabel(m)}
              </option>
            ))}
          </select>
          <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={14} />
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-3 overflow-y-auto">
        <div className="text-xs text-slate-600 font-600 uppercase tracking-wider px-2 mb-2">Secciones</div>
        {NAV.map(({ href, label, icon: Icon }) => {
          const active = pathname === href
          return (
            <Link
              key={href}
              href={href}
              className={`nav-link ${active ? 'active' : ''}`}
            >
              <Icon size={16} className={active ? 'text-tyson-red' : 'text-slate-500'} />
              <span>{label}</span>
            </Link>
          )
        })}
      </nav>

      {/* Footer */}
      <div className="px-4 py-4 border-t border-white/5">
        <div className="text-xs text-slate-600 leading-relaxed">
          República Digital<br />
          <span className="text-slate-700">Tyson Foods México</span>
        </div>
      </div>
    </aside>
  )
}
