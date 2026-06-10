import './globals.css'
import { MonthProvider } from '@/context/MonthContext'
import Sidebar from '@/components/Sidebar'
import { AlertCircle } from 'lucide-react'

export const metadata = {
  title: 'Tyson Foods · Dashboard',
  description: 'Panel de seguimiento de campañas digitales',
}

export default function RootLayout({ children }) {
  const isMissingDb = !process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  return (
    <html lang="es">
      <body className="antialiased selection:bg-tyson-burgundy selection:text-white">
        <MonthProvider>
          <div className="flex min-h-screen">
            <Sidebar />
            <main className="flex-1 ml-64 min-h-screen bg-tyson-bg flex flex-col">
              {isMissingDb && (
                <div className="bg-tyson-yellow text-tyson-dark px-4 py-3 text-[13px] font-bold flex items-center justify-center gap-2 border-b border-tyson-dark/5 shadow-sm relative z-50">
                  <AlertCircle size={16} />
                  <span>
                    Faltan las variables de entorno de Supabase (NEXT_PUBLIC_SUPABASE_URL y NEXT_PUBLIC_SUPABASE_ANON_KEY). El dashboard funciona con datos locales simulados temporales.
                  </span>
                </div>
              )}
              <div className="max-w-screen-xl mx-auto px-6 py-10 flex-1 w-full">
                {children}
              </div>
            </main>
          </div>
        </MonthProvider>
      </body>
    </html>
  )
}
