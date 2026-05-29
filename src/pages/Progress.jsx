import React, { useMemo, useState } from 'react'
import { useApp } from '../context/AppContext'
import { ACTIVITIES, CATEGORIES, getLevelInfo, getNextLevelInfo } from '../data/activities'
import Card from '../components/ui/Card'
import ProgressBar from '../components/ui/ProgressBar'
import Stars from '../components/ui/Stars'

function MiniBarChart({ data, color = '#9B89C4', label }) {
  const max = Math.max(...data.map(d => d.value), 1)
  return (
    <div aria-label={label}>
      <div className="flex items-end gap-1.5 h-20">
        {data.map((d, i) => (
          <div key={i} className="flex-1 flex flex-col items-center gap-1">
            <div
              className="w-full rounded-t-lg transition-all duration-700"
              style={{ height: `${(d.value / max) * 72}px`, background: color, minHeight: d.value > 0 ? '4px' : '0' }}
              aria-label={`${d.label}: ${d.value}`}
            />
          </div>
        ))}
      </div>
      <div className="flex gap-1.5 mt-1">
        {data.map((d, i) => (
          <div key={i} className="flex-1 text-center text-[10px] text-[var(--text-muted)] truncate">{d.label}</div>
        ))}
      </div>
    </div>
  )
}

export default function Progress() {
  const { currentProgress, currentProfile } = useApp()
  const [selectedCategory, setSelectedCategory] = useState('all')

  const levelInfo = getLevelInfo(currentProgress.xp)
  const nextLevel = getNextLevelInfo(currentProgress.level)

  // Stats per category
  const categoryStats = useMemo(() => {
    return CATEGORIES.map(cat => {
      const catActivities = Object.values(ACTIVITIES).filter(a => a.category === cat.id)
      const completed = catActivities.filter(a =>
        currentProgress.completedActivities.some(c => c.activityId === a.id)
      )
      const totalStars = currentProgress.completedActivities
        .filter(c => catActivities.some(a => a.id === c.activityId))
        .reduce((sum, c) => sum + (c.stars || 0), 0)
      const maxPossibleStars = catActivities.reduce((sum, a) => sum + a.maxStars, 0)

      return {
        ...cat,
        completedCount: completed.length,
        totalCount: catActivities.length,
        totalStars,
        maxPossibleStars,
        pct: catActivities.length > 0 ? Math.round((completed.length / catActivities.length) * 100) : 0,
      }
    })
  }, [currentProgress.completedActivities])

  // Weekly activity data (last 7 days)
  const weeklyData = useMemo(() => {
    const days = []
    for (let i = 6; i >= 0; i--) {
      const d = new Date()
      d.setDate(d.getDate() - i)
      const dateStr = d.toISOString().split('T')[0]
      const label = i === 0 ? 'Today' : ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'][d.getDay()]
      const count = currentProgress.completedActivities.filter(a => a.date.startsWith(dateStr)).length
      days.push({ label, value: count, date: dateStr })
    }
    return days
  }, [currentProgress.completedActivities])

  // Recent completions
  const recentCompletions = [...currentProgress.completedActivities]
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 10)

  // Best performances
  const bestPerActivity = useMemo(() => {
    const best = {}
    currentProgress.completedActivities.forEach(c => {
      if (!best[c.activityId] || c.stars > best[c.activityId].stars) {
        best[c.activityId] = c
      }
    })
    return Object.values(best).sort((a, b) => b.stars - a.stars)
  }, [currentProgress.completedActivities])

  const totalTime = Math.round(
    currentProgress.completedActivities.reduce((sum, c) => sum + (c.durationSecs || 0), 0) / 60
  )

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-black text-[var(--text-primary)]">Progress 📊</h1>
        <p className="text-[var(--text-secondary)] mt-1">
          {currentProfile?.name ? `${currentProfile.name}'s` : 'Your'} learning journey
        </p>
      </div>

      {/* Overview stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {[
          { label: 'Activities Done',   value: currentProgress.completedActivities.length, emoji: '🎮', color: 'bg-violet-50 border-violet-100', text: 'text-violet-700' },
          { label: 'Total Stars',       value: currentProgress.totalStars,                  emoji: '⭐', color: 'bg-yellow-50 border-yellow-100', text: 'text-yellow-700' },
          { label: 'Current Level',     value: currentProgress.level,                       emoji: levelInfo.emoji, color: 'bg-blue-50 border-blue-100', text: 'text-blue-700' },
          { label: 'Minutes Practised', value: totalTime,                                   emoji: '⏱️', color: 'bg-green-50 border-green-100', text: 'text-green-700' },
        ].map(s => (
          <div key={s.label} className={`card border ${s.color} p-4 text-center`}>
            <div className="text-3xl mb-1" aria-hidden="true">{s.emoji}</div>
            <div className={`text-2xl font-black ${s.text}`}>{s.value}</div>
            <div className="text-xs text-[var(--text-muted)] mt-0.5">{s.label}</div>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-5">
        {/* Weekly chart */}
        <Card>
          <h2 className="font-bold text-[var(--text-primary)] mb-4">This Week</h2>
          <MiniBarChart data={weeklyData} color="#9B89C4" label="Activities completed per day this week" />
          <p className="text-xs text-[var(--text-muted)] mt-3 text-center">
            Total this week: <strong>{weeklyData.reduce((s, d) => s + d.value, 0)} activities</strong>
          </p>
        </Card>

        {/* Level progress */}
        <Card>
          <h2 className="font-bold text-[var(--text-primary)] mb-4">Level Progress</h2>
          <div className="flex items-center gap-4 mb-4">
            <div
              className="w-16 h-16 rounded-2xl bg-gradient-to-br from-violet-100 to-blue-100 flex items-center justify-center text-3xl font-black text-brand-purple shadow-soft flex-shrink-0"
              aria-label={`Level ${currentProgress.level}`}
            >
              {currentProgress.level}
            </div>
            <div>
              <p className="font-bold text-[var(--text-primary)]">{levelInfo.emoji} {levelInfo.title}</p>
              <p className="text-sm text-[var(--text-muted)]">{currentProgress.xp} XP earned total</p>
              {nextLevel && (
                <p className="text-xs text-brand-purple font-semibold mt-0.5">
                  {nextLevel.min - currentProgress.xp} XP to Level {currentProgress.level + 1}
                </p>
              )}
            </div>
          </div>
          {nextLevel && (
            <ProgressBar
              value={currentProgress.xp - levelInfo.min}
              max={nextLevel.min - levelInfo.min}
              color="gradient"
              size="lg"
              showPercent
              label={`Progress to Level ${currentProgress.level + 1}`}
            />
          )}
          <div className="grid grid-cols-2 gap-3 mt-4">
            <div className="bg-orange-50 dark:bg-orange-900/20 rounded-2xl p-3 text-center">
              <p className="text-2xl font-black text-orange-600">🔥 {currentProgress.streak}</p>
              <p className="text-xs text-[var(--text-muted)]">Day streak</p>
            </div>
            <div className="bg-green-50 dark:bg-green-900/20 rounded-2xl p-3 text-center">
              <p className="text-2xl font-black text-green-600">{currentProgress.badges.length}</p>
              <p className="text-xs text-[var(--text-muted)]">Badges earned</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Category progress */}
      <Card>
        <h2 className="font-bold text-[var(--text-primary)] mb-5">Progress by Category</h2>
        <div className="space-y-4">
          {categoryStats.map(cat => (
            <div key={cat.id}>
              <div className="flex items-center justify-between mb-1.5">
                <div className="flex items-center gap-2">
                  <span className="text-lg" aria-hidden="true">{cat.emoji}</span>
                  <span className="font-semibold text-sm text-[var(--text-primary)]">{cat.title}</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <span className="text-[var(--text-muted)]">{cat.completedCount}/{cat.totalCount}</span>
                  <span className="font-bold text-[var(--text-primary)]">{cat.pct}%</span>
                </div>
              </div>
              <ProgressBar
                value={cat.completedCount}
                max={cat.totalCount}
                color="purple"
                size="md"
                aria-label={`${cat.title}: ${cat.completedCount} of ${cat.totalCount} activities completed`}
              />
            </div>
          ))}
        </div>
      </Card>

      {/* Best performances */}
      {bestPerActivity.length > 0 && (
        <Card>
          <h2 className="font-bold text-[var(--text-primary)] mb-4">Best Performances</h2>
          <div className="space-y-2">
            {bestPerActivity.map(c => {
              const act = ACTIVITIES[c.activityId]
              if (!act) return null
              return (
                <div key={c.activityId} className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 dark:bg-white/5">
                  <span className="text-xl flex-shrink-0" aria-hidden="true">{act.emoji}</span>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-sm text-[var(--text-primary)] truncate">{act.title}</p>
                    <p className="text-xs text-[var(--text-muted)]">{new Date(c.date).toLocaleDateString()}</p>
                  </div>
                  <Stars earned={c.stars} max={act.maxStars} size="sm" />
                </div>
              )
            })}
          </div>
        </Card>
      )}

      {/* Recent activity log */}
      {recentCompletions.length > 0 && (
        <Card>
          <h2 className="font-bold text-[var(--text-primary)] mb-4">Recent Activity Log</h2>
          <div className="space-y-2" aria-label="Recent activities">
            {recentCompletions.map((c, i) => {
              const act = ACTIVITIES[c.activityId]
              const date = new Date(c.date)
              return (
                <div key={i} className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-white/5 transition-colors">
                  <span className="text-xl flex-shrink-0" aria-hidden="true">{act?.emoji ?? '🎮'}</span>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-sm text-[var(--text-primary)] truncate">{act?.title ?? c.activityId}</p>
                    <p className="text-xs text-[var(--text-muted)]">
                      {date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })} · {date.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <Stars earned={c.stars ?? 0} max={act?.maxStars ?? 3} size="sm" />
                  </div>
                </div>
              )
            })}
          </div>
        </Card>
      )}

      {/* Empty state */}
      {currentProgress.completedActivities.length === 0 && (
        <div className="text-center py-12">
          <div className="text-5xl mb-4" aria-hidden="true">📊</div>
          <h3 className="text-xl font-bold text-[var(--text-primary)] mb-2">No progress yet!</h3>
          <p className="text-[var(--text-muted)] mb-4">Complete some activities to see your progress here.</p>
        </div>
      )}
    </div>
  )
}
