import React from 'react'
import { useNavigate } from 'react-router-dom'
import { Clock, Lock, ChevronRight } from 'lucide-react'
import { DIFFICULTY_LABELS } from '../../data/activities'
import Stars from './Stars'

export default function ActivityCard({ activity, completions = [], category }) {
  const navigate = useNavigate()
  const bestEntry = completions
    .filter(c => c.activityId === activity.id)
    .sort((a, b) => b.stars - a.stars)[0]
  const bestStars = bestEntry?.stars ?? 0
  const timesPlayed = completions.filter(c => c.activityId === activity.id).length

  const catGradient = category?.gradient ?? 'from-gray-100 to-gray-200'
  const catText = category?.text ?? 'text-gray-600'

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={() => navigate(`/activities/${activity.id}`)}
      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') navigate(`/activities/${activity.id}`) }}
      aria-label={`${activity.title} — ${activity.implemented ? 'Play now' : 'Coming soon'}`}
      className={[
        'card group cursor-pointer relative overflow-hidden',
        'transition-all duration-200 hover:-translate-y-1 hover:shadow-card-hover',
        'focus-visible:outline focus-visible:outline-3 focus-visible:outline-[var(--focus-ring)] focus-visible:outline-offset-2',
        !activity.implemented ? 'opacity-75' : '',
      ].join(' ')}
    >
      {/* Top gradient band */}
      <div className={`h-2 w-full bg-gradient-to-r ${catGradient} -mt-5 -mx-5 mb-4 sm:-mt-6 sm:-mx-6`} style={{ marginTop: '-1.25rem', marginLeft: '-1.25rem', marginRight: '-1.25rem', marginBottom: '1rem' }} />

      {/* Coming soon badge */}
      {!activity.implemented && (
        <div className="absolute top-3 right-3 flex items-center gap-1 bg-gray-100 dark:bg-white/10 text-gray-500 text-xs font-semibold px-2.5 py-1 rounded-full">
          <Lock size={11} aria-hidden="true" />
          Coming soon
        </div>
      )}

      {/* Times played badge */}
      {timesPlayed > 0 && activity.implemented && (
        <div className="absolute top-3 right-3 bg-green-100 text-green-700 text-xs font-bold px-2.5 py-1 rounded-full">
          ✓ Played {timesPlayed}×
        </div>
      )}

      {/* Emoji */}
      <div className="text-4xl mb-3 group-hover:scale-110 transition-transform duration-200" aria-hidden="true">
        {activity.emoji}
      </div>

      {/* Title & description */}
      <h3 className="font-bold text-lg text-[var(--text-primary)] mb-1 leading-tight">{activity.title}</h3>
      <p className="text-sm text-[var(--text-secondary)] line-clamp-2 mb-3">{activity.description}</p>

      {/* Footer */}
      <div className="flex items-center justify-between mt-auto pt-2">
        <div className="flex items-center gap-3">
          {/* Difficulty */}
          {activity.difficulties?.[0] && (
            <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${DIFFICULTY_LABELS[activity.difficulties[0]]?.bg} ${DIFFICULTY_LABELS[activity.difficulties[0]]?.color}`}>
              {DIFFICULTY_LABELS[activity.difficulties[0]]?.label}
            </span>
          )}
          {/* Time */}
          <span className="flex items-center gap-1 text-xs text-[var(--text-muted)]">
            <Clock size={12} aria-hidden="true" />
            {activity.time}
          </span>
        </div>

        {/* Stars or arrow */}
        {bestStars > 0
          ? <Stars earned={bestStars} max={activity.maxStars} size="sm" />
          : <ChevronRight size={18} className="text-[var(--text-muted)] group-hover:text-brand-purple transition-colors" aria-hidden="true" />
        }
      </div>
    </div>
  )
}
