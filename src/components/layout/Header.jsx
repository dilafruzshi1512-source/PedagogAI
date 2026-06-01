import { useLocation } from 'react-router-dom'
import { Bell } from 'lucide-react'
import { useAuth } from '@/context/AuthContext'
import { NAV_ITEMS } from '@/data/constants'

export default function Header() {
  const { pathname } = useLocation()
  const { user } = useAuth()
  const current = NAV_ITEMS.find((n) => n.path === pathname)

  return (
    <header
      className="h-[60px] shrink-0 flex items-center justify-between px-6 lg:px-8
                 border-b border-glass-border backdrop-blur-header"
      style={{ background: 'rgba(12, 18, 34, 0.6)' }}
    >
      <h2 className="font-display font-semibold text-[15px] text-content-primary tracking-tight">
        {current?.label || 'PedagogAI'}
      </h2>
      <div className="flex items-center gap-3">
        <button
          type="button"
          className="btn-ghost p-2.5 rounded-xl"
          aria-label="Bildirishnomalar"
        >
          <Bell className="w-4 h-4" />
        </button>
        <div
          className="flex items-center gap-2.5 pl-2 pr-3 py-1.5 rounded-xl border border-glass-border
                     bg-glass hover:bg-glass-hover transition-colors duration-200"
        >
          <div className="w-8 h-8 rounded-lg bg-gradient-brand flex items-center justify-center text-xs font-semibold text-white shadow-glow-purple">
            {(user?.name || 'G')[0].toUpperCase()}
          </div>
          <span className="text-sm text-content-secondary hidden sm:block font-medium">
            {user?.name || 'Mehmon'}
          </span>
        </div>
      </div>
    </header>
  )
}
