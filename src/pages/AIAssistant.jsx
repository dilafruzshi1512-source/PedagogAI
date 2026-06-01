import { useState, useRef, useEffect } from 'react'
import { Send, Bot } from 'lucide-react'
import PageHeader from '@/components/ui/PageHeader'
import ErrorAlert from '@/components/ui/ErrorAlert'
import AuthGate from '@/components/ui/AuthGate'
import LoadingSpinner from '@/components/ui/LoadingSpinner'
import { sendChatMessage } from '@/api/chat'
import { useAuth } from '@/context/AuthContext'

const WELCOME = {
  id: 0,
  role: 'ai',
  text: "Salom! Men sizning AI pedagogika yordamchingizman. Dars rejasi, baholash, differensial o'qitish va boshqa savollaringizga javob beraman.",
}

function AIAssistantContent() {
  const { token } = useAuth()
  const [messages, setMessages] = useState([WELCOME])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const scrollRef = useRef(null)

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages, loading])

  const handleSend = async (e) => {
    e.preventDefault()
    const text = input.trim()
    if (!text || loading) return

    setInput('')
    setError(null)
    const userMsg = { id: Date.now(), role: 'user', text }
    setMessages((prev) => [...prev, userMsg])
    setLoading(true)

    try {
      const data = await sendChatMessage(text, token)
      setMessages((prev) => [...prev, { id: Date.now() + 1, role: 'ai', text: data.reply }])
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="animate-fade-in h-full flex flex-col max-h-[calc(100vh-148px)] max-w-4xl">
      <PageHeader title="AI Yordamchi" subtitle="Pedagogika bo'yicha savollaringizga javob" />
      <ErrorAlert message={error} onDismiss={() => setError(null)} />

      <div className="glass-card flex-1 flex flex-col min-h-0 overflow-hidden">
        <div
          ref={scrollRef}
          className="flex-1 overflow-y-auto p-5 lg:p-6 space-y-5"
          style={{ background: 'linear-gradient(180deg, rgba(15,23,42,0.2) 0%, transparent 100%)' }}
        >
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex gap-3 items-end ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
            >
              {msg.role === 'ai' ? (
                <div className="chat-avatar-ai">
                  <Bot className="w-4 h-4 text-brand-purple-light" />
                </div>
              ) : (
                <div className="chat-avatar-user">Siz</div>
              )}
              <div className={msg.role === 'ai' ? 'chat-bubble-ai' : 'chat-bubble-user'}>
                {msg.text}
              </div>
            </div>
          ))}
          {loading && (
            <div className="flex gap-3 items-center text-content-muted text-sm pl-12">
              <LoadingSpinner size="sm" />
              <span>Javob yozilmoqda...</span>
            </div>
          )}
        </div>

        <form
          onSubmit={handleSend}
          className="p-4 lg:p-5 border-t border-glass-border flex gap-3"
          style={{ background: 'rgba(12, 18, 34, 0.5)' }}
        >
          <input
            className="form-input flex-1"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Savolingizni yozing..."
            disabled={loading}
          />
          <button type="submit" className="btn-ai shrink-0 px-5" disabled={loading || !input.trim()}>
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  )
}

export default function AIAssistant() {
  return (
    <AuthGate>
      <AIAssistantContent />
    </AuthGate>
  )
}
