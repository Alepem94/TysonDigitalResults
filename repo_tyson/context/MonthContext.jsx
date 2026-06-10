'use client'
import { createContext, useContext, useState, useEffect } from 'react'
import { getAvailableMonths } from '@/lib/queries'

const MonthContext = createContext()

export function MonthProvider({ children }) {
  const [selectedMonth, setSelectedMonth] = useState('2026-05-01')
  const [availableMonths, setAvailableMonths] = useState(['2026-05-01'])
  const [compareMode, setCompareMode] = useState('none') // 'none' | 'prevMonth' | 'presupuesto'

  useEffect(() => {
    const saved = localStorage.getItem('tyson-month')
    if (saved) setSelectedMonth(saved)
    const savedCompare = localStorage.getItem('tyson-compare')
    if (savedCompare) setCompareMode(savedCompare)
    getAvailableMonths().then(months => {
      if (months.length > 0) setAvailableMonths(months)
    })
  }, [])

  const setMonth = (month) => {
    setSelectedMonth(month)
    localStorage.setItem('tyson-month', month)
  }

  const setCompare = (mode) => {
    setCompareMode(mode)
    localStorage.setItem('tyson-compare', mode)
  }

  return (
    <MonthContext.Provider value={{ selectedMonth, setMonth, availableMonths, compareMode, setCompare }}>
      {children}
    </MonthContext.Provider>
  )
}

export const useMonth = () => useContext(MonthContext)
