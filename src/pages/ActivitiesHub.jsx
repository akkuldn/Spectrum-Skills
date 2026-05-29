import React, { useState, useMemo } from 'react'
import { useLocation } from 'react-router-dom'
import { Search, X, Filter } from 'lucide-react'
import { useApp } from '../context/AppContext'
import { CATEGORIES, ACTIVITIES, getActivitiesByCategory, DIFFICULTY_LABELS } from '../data/activities'
import ActivityCard from '../components/ui/ActivityCard'

export default function ActivitiesHub() {
  const { currentProgress } = useApp()
  const location = useLocation()
  const defaultCategory = location.state?.category ?? 'all'

  const [activeCategory, setActiveCategory] = useState(defaultCategory)
  const [search, setSearch] = useState('')
  const [difficultyFilter, setDifficultyFilter] = useState('all')
  const [showImplementedOnly, setShowImplementedOnly] = useState(false)

  const filtered = useMemo(() => {
    let list = Object.values(ACTIVITIES)

    if (activeCategory !== 'all') {
      list = list.filter(a => a.category === activeCategory)
    }
    if (search.trim()) {
      const q = search.toLowerCase()
      list = list.filter(a =>
        a.title.toLowerCase().includes(q) ||
        a.description.toLowerCase().includes(q) ||
        a.skills?.some(s => s.toLowerCase().includes(q))
      )
    }
    if (difficultyFilter !== 'all') {
      list = list.filter(a => a.difficulties.includes(difficultyFilter))
    }
    if (showImplementedOnly) {
      list = list.filter(a => a.implemented)
    }

    return list
  }, [activeCategory, search, difficultyFilter, showImplementedOnly])

  const currentCat = CATEGORIES.find(c => c.id === activeCategory)
  const completions = currentProgress.completedActivities

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div>
        <h1 className="text-3xl font-black text-[var(--text-primary)]">Activities 🎮</h1>
        <p className="text-[var(--text-secondary)] mt-1">Choose an activity and start learning!</p>
      </div>

      {/* Search + filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" aria-hidden="true" />
          <input
            type="search"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search activities…"
            aria-label="Search activities"
            className="w-full pl-10 pr-10 py-3 rounded-2xl border border-[var(--border)] bg-[var(--bg-card)] text-[var(--text-primary)] placeholder:text-[var(--text-muted)] text-sm font-medium focus:outline-none focus:ring-2 focus:ring-brand-purple/40 focus:border-brand-purple transition-colors"
          />
          {search && (
            <button
              onClick={() => setSearch('')}
              aria-label="Clear search"
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-[var(--focus-ring)] rounded"
            >
              <X size={16} aria-hidden="true" />
            </button>
          )}
        </div>

        {/* Difficulty filter */}
        <div className="flex items-center gap-2 flex-wrap">
          {['all', 'easy', 'medium', 'hard'].map(d => (
            <button
              key={d}
              onClick={() => setDifficultyFilter(d)}
              aria-pressed={difficultyFilter === d}
              className={`px-3 py-2 rounded-xl text-sm font-semibold transition-colors min-h-[44px] ${
                difficultyFilter === d
                  ? 'bg-brand-purple text-white'
                  : 'bg-[var(--bg-card)] border border-[var(--border)] text-[var(--text-secondary)] hover:border-brand-purple/50'
              }`}
            >
              {d === 'all' ? 'All levels' : DIFFICULTY_LABELS[d]?.emoji + ' ' + DIFFICULTY_LABELS[d]?.label}
            </button>
          ))}
          <label className="flex items-center gap-2 px-3 py-2 rounded-xl bg-[var(--bg-card)] border border-[var(--border)] cursor-pointer text-sm font-semibold text-[var(--text-secondary)] min-h-[44px]">
            <input
              type="checkbox"
              checked={showImplementedOnly}
              onChange={e => setShowImplementedOnly(e.target.checked)}
              className="rounded accent-brand-purple"
              aria-label="Show available activities only"
            />
            Available only
          </label>
        </div>
      </div>

      {/* Category tabs */}
      <div className="overflow-x-auto -mx-4 px-4 sm:mx-0 sm:px-0" role="tablist" aria-label="Activity categories">
        <div className="flex gap-2 min-w-max sm:flex-wrap sm:min-w-0">
          <button
            role="tab"
            aria-selected={activeCategory === 'all'}
            onClick={() => setActiveCategory('all')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-sm font-bold whitespace-nowrap transition-all min-h-[44px] ${
              activeCategory === 'all'
                ? 'bg-brand-purple text-white shadow-sm'
                : 'bg-[var(--bg-card)] border border-[var(--border)] text-[var(--text-secondary)] hover:border-brand-purple/50'
            }`}
          >
            <span aria-hidden="true">🎮</span>
            All Activities
            <span className="bg-white/20 text-inherit px-1.5 py-0.5 rounded-lg text-xs">
              {Object.keys(ACTIVITIES).length}
            </span>
          </button>

          {CATEGORIES.map(cat => {
            const count = getActivitiesByCategory(cat.id).length
            const isActive = activeCategory === cat.id
            return (
              <button
                key={cat.id}
                role="tab"
                aria-selected={isActive}
                onClick={() => setActiveCategory(cat.id)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-sm font-bold whitespace-nowrap transition-all min-h-[44px] ${
                  isActive
                    ? `bg-gradient-to-r ${cat.gradient} ${cat.text} shadow-sm border ${cat.border}`
                    : 'bg-[var(--bg-card)] border border-[var(--border)] text-[var(--text-secondary)] hover:border-brand-purple/30'
                }`}
              >
                <span aria-hidden="true">{cat.emoji}</span>
                {cat.title}
                <span className={`px-1.5 py-0.5 rounded-lg text-xs ${isActive ? 'bg-black/10' : 'bg-gray-100 dark:bg-white/10 text-[var(--text-muted)]'}`}>
                  {count}
                </span>
              </button>
            )
          })}
        </div>
      </div>

      {/* Category description */}
      {currentCat && (
        <div className={`flex items-center gap-3 p-4 rounded-2xl bg-gradient-to-r ${currentCat.gradient} ${currentCat.darkBg} border ${currentCat.border}`}>
          <span className="text-3xl" aria-hidden="true">{currentCat.emoji}</span>
          <div>
            <p className={`font-bold ${currentCat.text}`}>{currentCat.title}</p>
            <p className="text-sm text-[var(--text-secondary)]">{currentCat.description}</p>
          </div>
        </div>
      )}

      {/* Activity grid */}
      {filtered.length > 0 ? (
        <div>
          <p className="text-sm text-[var(--text-muted)] mb-4" aria-live="polite">
            {filtered.length} {filtered.length === 1 ? 'activity' : 'activities'} found
          </p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
            {filtered.map(activity => {
              const cat = CATEGORIES.find(c => c.id === activity.category)
              return (
                <ActivityCard
                  key={activity.id}
                  activity={activity}
                  completions={completions}
                  category={cat}
                />
              )
            })}
          </div>
        </div>
      ) : (
        <div className="text-center py-16">
          <div className="text-5xl mb-4" aria-hidden="true">🔍</div>
          <h3 className="text-xl font-bold text-[var(--text-primary)] mb-2">No activities found</h3>
          <p className="text-[var(--text-muted)] mb-4">Try adjusting your search or filters.</p>
          <button
            onClick={() => { setSearch(''); setActiveCategory('all'); setDifficultyFilter('all'); setShowImplementedOnly(false) }}
            className="text-brand-purple font-semibold hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-[var(--focus-ring)] rounded"
          >
            Clear all filters
          </button>
        </div>
      )}
    </div>
  )
}
