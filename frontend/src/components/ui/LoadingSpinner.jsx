import clsx from 'clsx'

export default function LoadingSpinner({ size = 'md', className }) {
  const sizes = { sm: 'w-4 h-4', md: 'w-8 h-8', lg: 'w-10 h-10' }
  return (
    <div
      className={clsx(
        'border-2 border-brand-indigo/25 border-t-brand-cyan rounded-full animate-spin',
        sizes[size],
        className
      )}
      role="status"
      aria-label="Yuklanmoqda"
    />
  )
}
