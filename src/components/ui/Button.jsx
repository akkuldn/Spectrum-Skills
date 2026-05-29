import React from 'react'

const variants = {
  primary:   'bg-brand-purple text-white hover:bg-brand-purple-dark active:scale-95 shadow-sm',
  secondary: 'bg-white text-brand-purple border-2 border-brand-purple hover:bg-violet-50 active:scale-95',
  success:   'bg-brand-green text-white hover:bg-brand-green-dark active:scale-95 shadow-sm',
  warning:   'bg-brand-peach text-white hover:bg-brand-peach-dark active:scale-95 shadow-sm',
  danger:    'bg-brand-coral text-white hover:bg-brand-coral-dark active:scale-95 shadow-sm',
  ghost:     'bg-transparent text-[var(--text-secondary)] hover:bg-gray-100 dark:hover:bg-white/10 active:scale-95',
  outline:   'bg-transparent border-2 border-[var(--border)] text-[var(--text-primary)] hover:bg-gray-50 dark:hover:bg-white/5 active:scale-95',
}

const sizes = {
  sm:  'px-3 py-1.5 text-sm min-h-[36px]',
  md:  'px-5 py-2.5 text-base min-h-[44px]',
  lg:  'px-7 py-3.5 text-lg min-h-[52px]',
  xl:  'px-9 py-4 text-xl min-h-[60px]',
  icon: 'p-2.5 min-h-[44px] min-w-[44px]',
}

export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  fullWidth = false,
  rounded = 'rounded-xl',
  className = '',
  onClick,
  type = 'button',
  'aria-label': ariaLabel,
  ...props
}) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      aria-label={ariaLabel}
      aria-disabled={disabled || loading}
      className={[
        'inline-flex items-center justify-center gap-2 font-semibold',
        'transition-all duration-200 ease-out',
        'focus-visible:outline focus-visible:outline-3 focus-visible:outline-[var(--focus-ring)] focus-visible:outline-offset-2',
        rounded,
        variants[variant] ?? variants.primary,
        sizes[size] ?? sizes.md,
        fullWidth ? 'w-full' : '',
        (disabled || loading) ? 'opacity-50 cursor-not-allowed pointer-events-none' : 'cursor-pointer',
        className,
      ].filter(Boolean).join(' ')}
      {...props}
    >
      {loading && (
        <svg className="animate-spin h-4 w-4 shrink-0" fill="none" viewBox="0 0 24 24" aria-hidden="true">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4l3-3-3-3V4a10 10 0 00-10 10h4z" />
        </svg>
      )}
      {children}
    </button>
  )
}
