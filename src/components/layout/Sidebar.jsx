import { NavLink } from 'react-router-dom'
import {
  LayoutDashboard, BookOpen, ClipboardList, Grid3x3,
  MessageSquare, Presentation, BarChart3, User, Sparkles,
} from 'lucide-react'
import { NAV_ITEMS } from '@/data/constants'
import clsx from 'clsx'

const ICONS = {
  LayoutDashboard, BookOpen, ClipboardList, Grid3x3,
  MessageSquare, Presentation, BarChart3, User,
}

export default function Sidebar() {
  return (
    <aside
      className="fixed left-0 top-0 h-full w-[var(--sidebar-width)] z-40 flex flex-col
                 border-r border-glass-border backdrop-blur-sidebar shadow-soft-lg"
      style={{
        background: 'linear-gradient(180deg, rgba(17, 27, 46, 0.85) 0%, rgba(12, 18, 34, 0.9) 100%)',
      }}
    >
      <div className="px-5 py-6 border-b border-glass-border">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-brand flex items-center justify-center shadow-glow-purple">
            <Sparkles className="w-5 h-5 text-white" strokeWidth={2} />
          </div>
          <div>
            <span className="font-display font-bold text-[15px] text-content-primary tracking-tight">
              PedagogAI
            </span>
            <p className="text-[11px] text-content-muted mt-0.5">AI ta&apos;lim platformasi</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 px-3 py-5 space-y-1 overflow-y-auto">
        {NAV_ITEMS.map(({ path, label, icon }) => {
          const Icon = ICONS[icon]
          return (
            <NavLink
              key={path}
              to={path}
              className={({ isActive }) =>
                clsx(
                  'relative flex items-center gap-3 px-3 py-2.5 rounded-xl text-[13px] font-medium transition-all duration-200',
                  isActive
                    ? 'text-content-primary shadow-soft'
                    : 'text-content-secondary hover:text-content-primary hover:bg-glass-hover'
                )
              }
              style={({ isActive }) =>
                isActive
                  ? {
                      background: 'linear-gradient(135deg, rgba(99,102,241,0.14), rgba(34,211,238,0.08))',
                      border: '1px solid rgba(148, 163, 184, 0.12)',
                    }
                  : { border: '1px solid transparent' }
              }
            >
              {({ isActive }) => (
                <>
                  {isActive && <span className="nav-active-indicator" />}
                  <Icon
                    className={clsx(
                      'w-[18px] h-[18px] shrink-0 transition-colors',
                      isActive ? 'text-brand-cyan' : 'text-content-muted'
                    )}
                    strokeWidth={isActive ? 2.25 : 2}
                  />
                  <span>{label}</span>
                </>
              )}
            </NavLink>
          )
        })}
      </nav>

      <div className="p-4 border-t border-glass-border">
        <div className="ai-pulse w-full justify-center">
          <span className="w-1.5 h-1.5 rounded-full bg-brand-cyan animate-pulse-dot shadow-glow-cyan" />
          AI faol
        </div>
      </div>
    </aside>
  )
}
