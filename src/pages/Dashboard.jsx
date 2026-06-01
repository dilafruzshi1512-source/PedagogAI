import { Link } from 'react-router-dom'
import { BookOpen, ClipboardList, Grid3x3, MessageSquare, ArrowRight } from 'lucide-react'
import PageHeader from '@/components/ui/PageHeader'
import { DEMO_STATS } from '@/data/constants'
import { useAuth } from '@/context/AuthContext'

const QUICK_LINKS = [
  { path: '/lesson', label: 'Dars yaratish', icon: BookOpen, gradient: 'from-brand-indigo to-brand-cyan' },
  { path: '/test', label: 'Test yaratish', icon: ClipboardList, gradient: 'from-brand-cyan to-brand-purple' },
  { path: '/crossword', label: 'Krossvord', icon: Grid3x3, gradient: 'from-brand-purple to-brand-indigo' },
  { path: '/assistant', label: 'AI suhbat', icon: MessageSquare, gradient: 'from-brand-indigo to-brand-cyan-light' },
]

export default function Dashboard() {
  const { user } = useAuth()

  return (
    <div className="animate-fade-in max-w-6xl">
      <PageHeader
        title={`Salom, ${user?.name || "O'qituvchi"}!`}
        subtitle="Bugun qanday ta'lim materiali yaratamiz?"
      />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-5 mb-10">
        {[
          { label: 'Darslar', value: DEMO_STATS.lessons, tag: 'tag-purple' },
          { label: 'Testlar', value: DEMO_STATS.tests, tag: 'tag-cyan' },
          { label: 'Krossvordlar', value: DEMO_STATS.crosswords, tag: 'tag-green' },
          { label: 'Taqdimotlar', value: DEMO_STATS.presentations, tag: 'tag-amber' },
        ].map((s) => (
          <div key={s.label} className="stat-card">
            <span className={`tag ${s.tag} mb-4`}>{s.label}</span>
            <p className="stat-value bg-gradient-text bg-clip-text text-transparent">{s.value}</p>
          </div>
        ))}
      </div>

      <h3 className="section-title mb-5">Tezkor kirish</h3>
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-5">
        {QUICK_LINKS.map(({ path, label, icon: Icon, gradient }) => (
          <Link key={path} to={path} className="quick-link-card">
            <div
              className={`w-11 h-11 rounded-xl bg-gradient-to-br ${gradient} flex items-center justify-center mb-4 shadow-soft`}
            >
              <Icon className="w-5 h-5 text-white" strokeWidth={2} />
            </div>
            <p className="font-semibold text-content-primary mb-2 text-[15px]">{label}</p>
            <span className="text-xs text-brand-cyan flex items-center gap-1.5 group-hover:gap-2.5 transition-all duration-300">
              Boshlash <ArrowRight className="w-3.5 h-3.5" />
            </span>
          </Link>
        ))}
      </div>
    </div>
  )
}
