import React from 'react'

const colorMap = {
  purple: 'bg-brand-purple',
  blue:   'bg-brand-blue',
  green:  'bg-brand-green',
  peach:  'bg-brand-peach',
  yellow: 'bg-brand-yellow',
  pink:   'bg-brand-pink',
  teal:   'bg-brand-teal',
  coral:  'bg-brand-coral',
  gradient: 'bg-gradient-to-r from-brand-purple to-brand-blue',
}

export default function ProgressBar({
  value = 0,
  max = 100,
  color = 'purple',
  size = 'md',
  label,
  showPercent = false,
  animate = true,
  className = '',
}) {
  const pct = Math.min(100, Math.max(0, (value / max) * 100))

  const heights = { sm: 'h-1.5', md: 'h-2.5', lg: 'h-4', xl: 'h-6' }
  const height = heights[size] ?? heights.md

  return (
    <div className={`w-full ${className}`}>
      {(label || showPercent) && (
        <div className="flex justify-between items-center mb-1.5">
          {label && <span className="text-sm font-medium text-[var(--text-secondary)]">{label}</span>}
          {showPercent && <span className="text-sm font-semibold text-[var(--text-primary)]">{Math.round(pct)}%</span>}
        </div>
      )}
      <div
        role="progressbar"
        aria-valuenow={value}
        aria-valuemin={0}
        aria-valuemax={max}
        aria-label={label}
        className={`w-full ${height} bg-gray-100 dark:bg-white/10 rounded-full overflow-hidden`}
      >
        <div
          className={`${height} ${colorMap[color] ?? colorMap.purple} rounded-full transition-all duration-700 ease-out`}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  )
}

export function XpBar({ xp, level, nextLevelXp, currentLevelXp, className = '' }) {
  const progress = xp - currentLevelXp
  const range = nextLevelXp - currentLevelXp
  const pct = range > 0 ? Math.min(100, (progress / range) * 100) : 100

  return (
    <div className={`w-full ${className}`}>
      <div className="flex justify-between text-xs text-[var(--text-muted)] mb-1">
        <span>Level {level}</span>
        <span>{xp} / {nextLevelXp} XP</span>
      </div>
      <div className="h-3 bg-gray-100 dark:bg-white/10 rounded-full overflow-hidden">
        <div
          className="h-full rounded-full bg-gradient-to-r from-brand-purple to-brand-blue transition-all duration-700"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  )
}
