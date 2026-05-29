import React from 'react'

export default function Card({
  children,
  className = '',
  padding = true,
  hover = false,
  onClick,
  as: Tag = 'div',
  role,
  'aria-label': ariaLabel,
  ...props
}) {
  return (
    <Tag
      onClick={onClick}
      role={role ?? (onClick ? 'button' : undefined)}
      aria-label={ariaLabel}
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={onClick ? (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onClick(e) } } : undefined}
      className={[
        'card',
        padding ? 'p-5 sm:p-6' : '',
        hover
          ? 'transition-all duration-200 hover:-translate-y-1 hover:shadow-card-hover cursor-pointer focus-visible:outline focus-visible:outline-3 focus-visible:outline-[var(--focus-ring)] focus-visible:outline-offset-2'
          : '',
        className,
      ].filter(Boolean).join(' ')}
      {...props}
    >
      {children}
    </Tag>
  )
}

export function CardHeader({ children, className = '' }) {
  return (
    <div className={`mb-4 ${className}`}>
      {children}
    </div>
  )
}

export function CardTitle({ children, className = '' }) {
  return (
    <h2 className={`text-xl font-bold text-[var(--text-primary)] ${className}`}>
      {children}
    </h2>
  )
}

export function CardBody({ children, className = '' }) {
  return <div className={className}>{children}</div>
}

export function CardFooter({ children, className = '' }) {
  return (
    <div className={`mt-4 pt-4 border-t border-[var(--border)] ${className}`}>
      {children}
    </div>
  )
}
