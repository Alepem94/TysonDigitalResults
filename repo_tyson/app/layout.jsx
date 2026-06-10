import './globals.css'
import { MonthProvider } from '@/context/MonthContext'
import Sidebar from '@/components/Sidebar'

export const metadata = {
  title: 'Tyson Foods · Dashboard',
  description: 'Panel de seguimiento de campañas digitales',
}

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body>
        <MonthProvider>
          <div className="flex min-h-screen">
            <Sidebar />
            <main className="flex-1 ml-64 min-h-screen bg-slate-100">
              <div className="max-w-screen-xl mx-auto px-6 py-6">
                {children}
              </div>
            </main>
          </div>
        </MonthProvider>
      </body>
    </html>
  )
}
