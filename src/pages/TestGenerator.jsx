import { useState } from 'react'
import { Sparkles, CheckCircle2 } from 'lucide-react'
import PageHeader from '@/components/ui/PageHeader'
import ErrorAlert from '@/components/ui/ErrorAlert'
import AuthGate from '@/components/ui/AuthGate'
import LoadingSpinner from '@/components/ui/LoadingSpinner'
import { useAsyncAction } from '@/hooks/useAsyncAction'
import { generateTest } from '@/api/tests'
import { useAuth } from '@/context/AuthContext'
import { GRADES } from '@/data/constants'

function TestGeneratorContent() {
  const { token } = useAuth()
  const [topic, setTopic] = useState('')
  const [grade, setGrade] = useState('7')
  const [count, setCount] = useState(5)
  const [questions, setQuestions] = useState([])
  const { loading, error, run, clearError } = useAsyncAction()

  const handleGenerate = async (e) => {
    e.preventDefault()
    if (!topic.trim()) return
    clearError()
    setQuestions([])
    await run(async () => {
      const data = await generateTest({ topic, grade, count }, token)
      const list = Array.isArray(data?.questions) ? data.questions : []
      if (list.length === 0) {
        throw new Error("AI test savollarini yaratib bo'lmadi. Qayta urinib ko'ring.")
      }
      setQuestions(list)
    })
  }

  return (
    <div className="animate-fade-in max-w-6xl">
      <PageHeader title="AI Test generator" subtitle="Ko'p tanlovli test savollari" />
      <ErrorAlert message={error} onDismiss={clearError} />

      <div className="grid lg:grid-cols-2 gap-6 lg:gap-8">
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
              <label className="form-label">Savollar soni</label>
              <input
                type="number"
                min={3}
                max={15}
                className="form-input"
                value={count}
                onChange={(e) => setCount(Number(e.target.value))}
              />
            </div>
          </div>
          <button type="submit" className="btn-ai w-full justify-center" disabled={loading}>
            {loading ? <LoadingSpinner size="sm" /> : <Sparkles className="w-4 h-4" />}
            {loading ? 'Yaratilmoqda...' : 'Test yaratish'}
          </button>
        </form>

        <div className="glass-card p-5 lg:p-6 space-y-4 max-h-[640px] overflow-y-auto">
          {questions.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <div className="w-12 h-12 rounded-xl bg-gradient-brand-soft border border-glass-border flex items-center justify-center mb-4">
                <Sparkles className="w-5 h-5 text-brand-purple" />
              </div>
              <p className="text-content-muted text-sm">Test savollari shu yerda ko&apos;rinadi</p>
            </div>
          ) : (
            questions.map((q, i) => (
              <div key={i} className="test-question-card">
                <p className="font-medium text-sm text-content-primary mb-3 leading-relaxed">
                  <span className="text-brand-cyan font-semibold mr-1">{i + 1}.</span>
                  {q.question}
                </p>
                <ul className="space-y-2">
                  {q.options &&
                    Object.entries(q.options).map(([key, val]) => {
                      const isCorrect = key === q.answer
                      return (
                        <li
                          key={key}
                          className={`flex items-start gap-2 text-xs rounded-lg px-2.5 py-2 transition-colors ${
                            isCorrect
                              ? 'answer-correct bg-brand-green/10 border border-brand-green/20'
                              : 'text-content-secondary bg-glass border border-transparent'
                          }`}
                        >
                          <span className="font-semibold shrink-0 w-4">{key})</span>
                          <span className="flex-1">{val}</span>
                          {isCorrect && <CheckCircle2 className="w-3.5 h-3.5 shrink-0 text-brand-green-light" />}
                        </li>
                      )
                    })}
                </ul>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}

export default function TestGenerator() {
  return (
    <AuthGate>
      <TestGeneratorContent />
    </AuthGate>
  )
}
