import { useState } from 'react'
import { Sparkles } from 'lucide-react'
import PageHeader from '@/components/ui/PageHeader'
import ErrorAlert from '@/components/ui/ErrorAlert'
import ResultPanel from '@/components/ui/ResultPanel'
import LoadingSpinner from '@/components/ui/LoadingSpinner'
import { useAsyncAction } from '@/hooks/useAsyncAction'
import { generateLesson, createLessonWithAuth } from '@/api/lessons'
import { useAuth } from '@/context/AuthContext'
import { GRADES, LANGUAGES } from '@/data/constants'

export default function LessonGenerator() {
  const { token, isAuthenticated } = useAuth()
  const [topic, setTopic] = useState('')
  const [grade, setGrade] = useState('7')
  const [language, setLanguage] = useState('uz')
  const [result, setResult] = useState('')
  const { loading, error, run, clearError } = useAsyncAction()

  const handleGenerate = async (e) => {
    e.preventDefault()
    if (!topic.trim()) return
    clearError()
    setResult('')
    await run(async () => {
      const data = isAuthenticated && token
        ? await createLessonWithAuth({ topic, grade, language }, token)
        : await generateLesson({ topic, grade, language })
      setResult(data.lesson || '')
    })
  }

  return (
    <div className="animate-fade-in h-full flex flex-col max-w-6xl">
      <PageHeader
        title="AI Dars rejasi"
        subtitle="Mavzu va sinf bo'yicha to'liq dars rejasi yarating"
      />
      <ErrorAlert message={error} onDismiss={clearError} />

      <div className="grid lg:grid-cols-2 gap-6 lg:gap-8 flex-1 min-h-0">
        <form onSubmit={handleGenerate} className="glass-card p-6 lg:p-7 space-y-5">
          <div>
            <label className="form-label">Mavzu</label>
            <input
              className="form-input"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="Masalan: Fotosintez"
              required
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="form-label">Sinf</label>
              <select className="form-input" value={grade} onChange={(e) => setGrade(e.target.value)}>
                {GRADES.map((g) => (
                  <option key={g} value={g}>{g}-sinf</option>
                ))}
              </select>
            </div>
            <div>
              <label className="form-label">Til</label>
              <select className="form-input" value={language} onChange={(e) => setLanguage(e.target.value)}>
                {LANGUAGES.map((l) => (
                  <option key={l.value} value={l.value}>{l.label}</option>
                ))}
              </select>
            </div>
          </div>
          <button type="submit" className="btn-ai w-full justify-center" disabled={loading}>
            {loading ? <LoadingSpinner size="sm" /> : <Sparkles className="w-4 h-4" />}
            {loading ? 'Yaratilmoqda...' : 'Dars yaratish'}
          </button>
          {isAuthenticated && (
            <p className="text-xs text-content-muted text-center">Dars avtomatik saqlanadi</p>
          )}
        </form>

        <ResultPanel title="Natija" content={result} />
      </div>
    </div>
  )
}
