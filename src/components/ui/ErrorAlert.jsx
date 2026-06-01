import { AlertCircle, X } from 'lucide-react'

export default function ErrorAlert({ message, onDismiss }) {
  if (!message) return null
  return (
    <div
      className="flex items-start gap-3 p-4 rounded-xl border text-sm animate-fade-in mb-6
                 border-brand-red/25 text-brand-red-light shadow-soft"
      style={{ background: 'rgba(251, 113, 133, 0.08)' }}
    >
      <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
      <p className="flex-1 leading-relaxed">{message}</p>
      {onDismiss && (
        <button
          type="button"
          onClick={onDismiss}
          className="opacity-60 hover:opacity-100 transition-opacity p-1 rounded-lg hover:bg-white/5"
          aria-label="Yopish"
        >
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  )
}
