import { useState } from 'react'
import { Sparkles, ChevronLeft, ChevronRight } from 'lucide-react'
import PageHeader from '@/components/ui/PageHeader'
import ErrorAlert from '@/components/ui/ErrorAlert'
import LoadingSpinner from '@/components/ui/LoadingSpinner'
import { useAsyncAction } from '@/hooks/useAsyncAction'
import { generateLesson } from '@/api/lessons'
import { GRADES } from '@/data/constants'

function buildSlides(topic, grade, lessonText) {
  const sections = lessonText.split(/\n{2,}/).filter(Boolean).slice(0, 8)
  const slides = [
    { title: topic, body: `${grade}-sinf — PedagogAI taqdimoti`, type: 'title' },
  ]
  sections.forEach((section, i) => {
    const lines = section.split('\n')
    slides.push({
      title: lines[0].replace(/^[\d.]+\s*/, '').slice(0, 80) || `Slayd ${i + 1}`,
      body: lines.slice(1).join('\n').slice(0, 400) || section.slice(0, 400),
      type: 'content',
    })
  })
  if (slides.length < 3) {
    slides.push({ title: 'Xulosa', body: `${topic} mavzusi bo'yicha asosiy fikrlar va uy vazifasi.`, type: 'content' })
  }
  return slides
}

export default function Presentations() {
  const [topic, setTopic] = useState('')
  const [grade, setGrade] = useState('7')
  const [slides, setSlides] = useState([])
  const [index, setIndex] = useState(0)
  const { loading, error, run, clearError } = useAsyncAction()

  const handleGenerate = async (e) => {
    e.preventDefault()
    if (!topic.trim()) return
    clearError()
    setSlides([])
    setIndex(0)
    await run(async () => {
      const data = await generateLesson({ topic, grade, language: 'uz' })
      setSlides(buildSlides(topic, grade, data.lesson || ''))
    })
  }

  const current = slides[index]

  return (
    <div className="animate-fade-in max-w-6xl">
      <PageHeader
        title="Taqdimot generator"
        subtitle="Dars asosida slaydlar (lesson API orqali)"
      />
      <ErrorAlert message={error} onDismiss={clearError} />

      <div className="grid lg:grid-cols-2 gap-6 lg:gap-8">
        <form onSubmit={handleGenerate} className="glass-card p-6 lg:p-7 space-y-5">
          <div>
            <label className="form-label">Mavzu</label>
            <input className="form-input" value={topic} onChange={(e) => setTopic(e.target.value)} required />
          </div>
          <div>
            <label className="form-label">Sinf</label>
            <select className="form-input" value={grade} onChange={(e) => setGrade(e.target.value)}>
              {GRADES.map((g) => <option key={g} value={g}>{g}-sinf</option>)}
            </select>
          </div>
          <button type="submit" className="btn-ai w-full justify-center" disabled={loading}>
            {loading ? <LoadingSpinner size="sm" /> : <Sparkles className="w-4 h-4" />}
            {loading ? 'Taqdimot yaratilmoqda...' : 'Taqdimot yaratish'}
          </button>
        </form>

        <div className="glass-card flex flex-col min-h-[420px] overflow-hidden">
          {current ? (
            <>
              <div className="flex-1 p-8 lg:p-10 flex flex-col justify-center bg-gradient-card-purple m-4 lg:m-5 rounded-2xl border border-glass-border shadow-soft">
                <span className="tag tag-purple mb-4 w-fit">
                  {current.type === 'title' ? 'Sarlavha' : `Slayd ${index + 1}/${slides.length}`}
                </span>
                <h2 className="font-display text-2xl font-bold mb-4">{current.title}</h2>
                <p className="text-content-secondary text-sm whitespace-pre-wrap leading-relaxed">{current.body}</p>
              </div>
              <div className="flex items-center justify-between p-4 border-t border-glass-border">
                <button
                  type="button"
                  className="btn-ghost"
                  disabled={index === 0}
                  onClick={() => setIndex((i) => i - 1)}
                >
                  <ChevronLeft className="w-4 h-4" /> Oldingi
                </button>
                <button
                  type="button"
                  className="btn-ghost"
                  disabled={index >= slides.length - 1}
                  onClick={() => setIndex((i) => i + 1)}
                >
                  Keyingi <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </>
          ) : (
            <p className="text-content-muted text-sm text-center m-auto py-20">Slaydlar shu yerda ko&apos;rinadi</p>
          )}
        </div>
      </div>
    </div>
  )
}
