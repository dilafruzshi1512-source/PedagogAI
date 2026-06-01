import { useState } from 'react'
import { Sparkles } from 'lucide-react'
import PageHeader from '@/components/ui/PageHeader'
import ErrorAlert from '@/components/ui/ErrorAlert'
import LoadingSpinner from '@/components/ui/LoadingSpinner'
import { useAsyncAction } from '@/hooks/useAsyncAction'
import { generateCrossword, parseCrosswordData } from '@/api/crossword'

export default function InteractiveTasks() {
  const [topic, setTopic] = useState('')
  const [count, setCount] = useState(5)
  const [items, setItems] = useState([])
  const { loading, error, run, clearError } = useAsyncAction()

  const handleGenerate = async (e) => {
    e.preventDefault()
    if (!topic.trim()) return
    clearError()
    setItems([])
    await run(async () => {
      const data = await generateCrossword({ topic, count })
      setItems(parseCrosswordData(data.data))
    })
  }

  return (
    <div className="animate-fade-in max-w-6xl">
      <PageHeader title="Krossvord generator" subtitle="Mavzu bo'yicha so'zlar va savollar" />
      <ErrorAlert message={error} onDismiss={clearError} />

      <div className="grid lg:grid-cols-2 gap-6 lg:gap-8">
        <form onSubmit={handleGenerate} className="glass-card p-6 lg:p-7 space-y-5">
          <div>
            <label className="form-label">Mavzu</label>
            <input
              className="form-input"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="Informatika"
              required
            />
          </div>
          <div>
            <label className="form-label">So&apos;zlar soni</label>
            <input
              type="number"
              min={3}
              max={12}
              className="form-input"
              value={count}
              onChange={(e) => setCount(Number(e.target.value))}
            />
          </div>
          <button type="submit" className="btn-ai w-full justify-center" disabled={loading}>
            {loading ? <LoadingSpinner size="sm" /> : <Sparkles className="w-4 h-4" />}
            {loading ? 'Yaratilmoqda...' : 'Krossvord yaratish'}
          </button>
        </form>

        <div className="glass-card overflow-hidden flex flex-col">
          <div className="px-5 py-4 border-b border-glass-border bg-gradient-brand-soft">
            <h3 className="section-title">So&apos;zlar ro&apos;yxati</h3>
          </div>
          <div className="p-5 lg:p-6 space-y-3 max-h-[520px] overflow-y-auto flex-1">
            {items.length === 0 ? (
              <p className="text-content-muted text-sm text-center py-16">Krossvord elementlari shu yerda</p>
            ) : (
              items.map((item, i) => (
                <div key={i} className="surface-item flex gap-4 items-start">
                  <span className="font-display font-bold text-brand-cyan text-sm w-24 shrink-0">
                    {item.word}
                  </span>
                  <span className="text-sm text-content-secondary leading-relaxed">{item.clue}</span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
