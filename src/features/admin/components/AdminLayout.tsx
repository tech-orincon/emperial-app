import type { ReactNode } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Gamepad2, FolderTree, Package, Globe, ArrowLeft } from 'lucide-react'

const NAV = [
  { to: '/admin/games', label: 'Juegos', icon: Gamepad2 },
  { to: '/admin/categories', label: 'Categorías', icon: FolderTree },
  { to: '/admin/services', label: 'Servicios', icon: Package },
  { to: '/admin/reference', label: 'Referencia', icon: Globe },
]

interface Props {
  title: string
  description?: string
  actions?: ReactNode
  children: ReactNode
}

export function AdminLayout({ title, description, actions, children }: Props) {
  const location = useLocation()

  return (
    <div className="min-h-screen bg-slate-900 text-slate-50 flex">
      <aside className="hidden md:flex w-60 shrink-0 flex-col border-r border-white/10 bg-slate-950/50">
        <div className="p-5 border-b border-white/10">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center text-white font-bold text-sm">
              E
            </div>
            <div>
              <p className="font-bold text-white leading-tight">Backoffice</p>
              <p className="text-xs text-amber-400">Catálogo</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 p-3 space-y-1">
          {NAV.map((item) => {
            const active = location.pathname.startsWith(item.to)
            return (
              <Link
                key={item.to}
                to={item.to}
                className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  active
                    ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                    : 'text-slate-400 hover:text-white hover:bg-white/5 border border-transparent'
                }`}
              >
                <item.icon className="w-4 h-4" />
                {item.label}
              </Link>
            )
          })}
        </nav>

        <div className="p-3 border-t border-white/10">
          <Link
            to="/"
            className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-slate-400 hover:text-white hover:bg-white/5 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Volver al sitio
          </Link>
        </div>
      </aside>

      <main className="flex-1 min-w-0">
        <div className="border-b border-white/10 bg-slate-900/80 backdrop-blur px-6 py-5">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-white">{title}</h1>
              {description && <p className="text-sm text-slate-400 mt-1">{description}</p>}
            </div>
            {actions}
          </div>

          {/* Nav móvil: la barra lateral se oculta bajo md */}
          <nav className="flex md:hidden gap-2 mt-4">
            {NAV.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium ${
                  location.pathname.startsWith(item.to)
                    ? 'bg-amber-500/10 text-amber-400'
                    : 'text-slate-400 bg-white/5'
                }`}
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>

        <div className="p-6">{children}</div>
      </main>
    </div>
  )
}
