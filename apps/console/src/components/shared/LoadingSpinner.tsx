import clsx from 'clsx'

interface Props {
  size?: 'sm' | 'md' | 'lg'
  label?: string
  className?: string
}

export function LoadingSpinner({ size = 'md', label = 'Loading…', className }: Props) {
  const sizes = {
    sm: 'w-4 h-4 border-2',
    md: 'w-6 h-6 border-2',
    lg: 'w-10 h-10 border-[3px]',
  }

  return (
    <div className={clsx('flex items-center justify-center gap-2', className)} role="status" aria-label={label}>
      <div
        className={clsx(
          'rounded-full border-gray-700 border-t-resonance-500 animate-spin',
          sizes[size],
        )}
        aria-hidden="true"
      />
      {size === 'lg' && (
        <span className="text-gray-400 text-sm">{label}</span>
      )}
    </div>
  )
}

export function PageLoader() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[40vh] gap-4">
      <LoadingSpinner size="lg" />
    </div>
  )
}
