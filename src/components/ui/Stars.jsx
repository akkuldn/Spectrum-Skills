import React from 'react'

export default function Stars({ earned = 0, max = 3, size = 'md', animate = false, className = '' }) {
  const sizes = { sm: 'text-lg', md: 'text-2xl', lg: 'text-4xl', xl: 'text-5xl' }
  const sz = sizes[size] ?? sizes.md

  return (
    <div className={`flex items-center gap-1 ${className}`} aria-label={`${earned} out of ${max} stars`} role="img">
      {Array.from({ length: max }).map((_, i) => (
        <span
          key={i}
          className={[
            sz,
            'transition-all',
            i < earned
              ? animate ? 'star-animate' : 'drop-shadow-[0_0_6px_rgba(245,215,142,0.8)]'
              : 'opacity-30 grayscale',
          ].join(' ')}
          style={animate && i < earned ? { animationDelay: `${i * 0.15}s` } : undefined}
          aria-hidden="true"
        >
          ⭐
        </span>
      ))}
    </div>
  )
}

export function StarBurst({ stars, onDone }) {
  React.useEffect(() => {
    const t = setTimeout(onDone, 2000)
    return () => clearTimeout(t)
  }, [onDone])

  return (
    <div className="flex items-center justify-center gap-4 my-6" aria-live="polite" aria-label={`You earned ${stars} stars!`}>
      {Array.from({ length: 3 }).map((_, i) => (
        <span
          key={i}
          className={`text-5xl transition-all duration-300 ${i < stars ? 'star-animate' : 'opacity-20 grayscale'}`}
          style={{ animationDelay: `${i * 0.2}s` }}
          aria-hidden="true"
        >
          ⭐
        </span>
      ))}
    </div>
  )
}
