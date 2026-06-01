import { Link } from 'react-router-dom'
import { Lock } from 'lucide-react'
import { useAuth } from '@/context/AuthContext'
import LoadingSpinner from './LoadingSpinner'

export default function AuthGate({ children }) {
  const { isAuthenticated, loading } = useAuth()

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  if (!isAuthenticated) {
    return (
      <div className="glass-card p-10 text-center max-w-md mx-auto">
        <div className="w-14 h-14 rounded-2xl bg-gradient-brand-soft border border-glass-border flex items-center justify-center mx-auto mb-5">
          <Lock className="w-7 h-7 text-brand-purple-light" />
        </div>
        <h3 className="font-display font-semibold text-lg mb-2 text-content-primary">Kirish talab qilinadi</h3>
        <p className="text-content-secondary text-sm mb-8 leading-relaxed">
          Bu funksiyadan foydalanish uchun profilingizga kiring yoki ro&apos;yxatdan o&apos;ting.
        </p>
        <Link to="/profile" className="btn-ai inline-flex">
          Profilga o&apos;tish
        </Link>
      </div>
    )
  }

  return children
}
