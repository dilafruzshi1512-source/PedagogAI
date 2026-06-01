import { useState, useEffect } from 'react'
import { LogIn, UserPlus, LogOut } from 'lucide-react'
import PageHeader from '@/components/ui/PageHeader'
import ErrorAlert from '@/components/ui/ErrorAlert'
import LoadingSpinner from '@/components/ui/LoadingSpinner'
import { useAuth } from '@/context/AuthContext'
import { useAsyncAction } from '@/hooks/useAsyncAction'
import { fetchMyLessons } from '@/api/lessons'

export default function Profile() {
  const { user, isAuthenticated, login, register, logout, token, loading: authLoading } = useAuth()
  const [mode, setMode] = useState('login')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const { loading, error, run, clearError } = useAsyncAction()

  const handleSubmit = async (e) => {
    e.preventDefault()
    clearError()
    await run(async () => {
      if (mode === 'login') {
        await login(email, password)
      } else {
        await register(name, email, password)
      }
    })
  }

  if (authLoading) {
    return (
      <div className="flex justify-center py-20">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  if (isAuthenticated && user) {
    return (
      <div className="animate-fade-in max-w-2xl mx-auto">
        <PageHeader title="Profil" subtitle="Hisob ma'lumotlari" />

        <div className="glass-card p-6 lg:p-7 mb-6">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 rounded-2xl bg-gradient-brand flex items-center justify-center text-2xl font-bold text-white shadow-glow-purple">
              {user.name[0]}
            </div>
            <div>
              <h3 className="font-display font-bold text-lg">{user.name}</h3>
              <p className="text-content-secondary text-sm">{user.email}</p>
              <span className="tag tag-purple mt-2">{user.role}</span>
            </div>
          </div>
          <button type="button" onClick={logout} className="btn-ghost flex items-center gap-2">
            <LogOut className="w-4 h-4" /> Chiqish
          </button>
        </div>

        <div className="glass-card p-6">
          <h3 className="section-title mb-4">Saqlangan darslar</h3>
          <LessonsList token={token} />
        </div>
      </div>
    )
  }

  return (
    <div className="animate-fade-in max-w-md mx-auto">
      <PageHeader title="Kirish" subtitle="Hisobingizga kiring yoki ro'yxatdan o'ting" />
      <ErrorAlert message={error} onDismiss={clearError} />

      <div className="flex gap-2 mb-6">
        <button
          type="button"
          className={mode === 'login' ? 'btn-ai flex-1 justify-center' : 'btn-ghost flex-1'}
          onClick={() => setMode('login')}
        >
          <LogIn className="w-4 h-4" /> Kirish
        </button>
        <button
          type="button"
          className={mode === 'register' ? 'btn-ai flex-1 justify-center' : 'btn-ghost flex-1'}
          onClick={() => setMode('register')}
        >
          <UserPlus className="w-4 h-4" /> Ro&apos;yxat
        </button>
      </div>

      <form onSubmit={handleSubmit} className="glass-card p-6 lg:p-7 space-y-4">
        {mode === 'register' && (
          <div>
            <label className="form-label">Ism</label>
            <input className="form-input" value={name} onChange={(e) => setName(e.target.value)} required />
          </div>
        )}
        <div>
          <label className="form-label">Email</label>
          <input type="email" className="form-input" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </div>
        <div>
          <label className="form-label">Parol</label>
          <input type="password" className="form-input" value={password} onChange={(e) => setPassword(e.target.value)} required />
        </div>
        <button type="submit" className="btn-ai w-full justify-center" disabled={loading}>
          {loading ? <LoadingSpinner size="sm" /> : null}
          {mode === 'login' ? 'Kirish' : "Ro'yxatdan o'tish"}
        </button>
      </form>
    </div>
  )
}

function LessonsList({ token }) {
  const [lessons, setLessons] = useState([])

  useEffect(() => {
    if (!token) return
    fetchMyLessons(token)
      .then((data) => setLessons(data.lessons || []))
      .catch(() => {})
  }, [token])

  if (lessons.length === 0) {
    return <p className="text-content-muted text-sm">Hali saqlangan darslar yo&apos;q</p>
  }

  return (
    <ul className="space-y-3">
      {lessons.map((l) => (
        <li key={l.id} className="surface-item">
          <p className="font-medium text-sm">{l.topic}</p>
          <p className="text-xs text-content-muted">{l.grade}-sinf · {l.created_at}</p>
        </li>
      ))}
    </ul>
  )
}
