export default function ResultPanel({ title, content, emptyMessage = "Natija shu yerda ko'rinadi" }) {
  return (
    <div className="glass-card flex flex-col h-full min-h-[320px] overflow-hidden">
      <div className="px-5 py-4 border-b border-glass-border bg-gradient-brand-soft">
        <h3 className="section-title">{title}</h3>
      </div>
      <div className="flex-1 overflow-y-auto p-5 lg:p-6">
        {content ? (
          <pre className="whitespace-pre-wrap font-sans text-sm text-content-primary leading-relaxed">
            {content}
          </pre>
        ) : (
          <p className="text-content-muted text-sm text-center py-16">{emptyMessage}</p>
        )}
      </div>
    </div>
  )
}
