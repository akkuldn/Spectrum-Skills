import React, { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Printer, ArrowLeft, TrendingUp, Clock, Target, Award } from 'lucide-react'
import { useApp } from '../context/AppContext'
import { ACTIVITIES, CATEGORIES, getLevelInfo } from '../data/activities'
import { BADGES } from '../data/badges'
import Card from '../components/ui/Card'
import ProgressBar from '../components/ui/ProgressBar'
import Stars from '../components/ui/Stars'
import Button from '../components/ui/Button'

function StrengthMeter({ label, value, color }) {
  return (
    <div>
      <div className="flex justify-between text-sm mb-1">
        <span className="font-medium text-[var(--text-secondary)]">{label}</span>
        <span className="font-bold text-[var(--text-primary)]">{value}%</span>
      </div>
      <ProgressBar value={value} max={100} color={color} size="md" />
    </div>
  )
}

export default function ParentDashboard() {
  const { state, currentProfile, currentProgress } = useApp()
  const navigate = useNavigate()
  const [selectedProfileId, setSelectedProfileId] = useState(state.currentProfileId)
  const [reportPeriod, setReportPeriod] = useState('week')

  const profile = state.profiles.find(p => p.id === selectedProfileId) ?? currentProfile
  const progress = selectedProfileId ? (state.progress[selectedProfileId] ?? currentProgress) : currentProgress

  // Time analytics
  const now = new Date()
  const periodStart = new Date()
  if (reportPeriod === 'week') periodStart.setDate(now.getDate() - 7)
  else if (reportPeriod === 'month') periodStart.setDate(now.getDate() - 30)
  else periodStart.setFullYear(2000)

  const periodCompletions = progress.completedActivities.filter(c => new Date(c.date) >= periodStart)

  const totalMinutes = Math.round(periodCompletions.reduce((s, c) => s + (c.durationSecs || 60), 0) / 60)
  const avgStars = periodCompletions.length > 0
    ? (periodCompletions.reduce((s, c) => s + (c.stars || 0), 0) / periodCompletions.length).toFixed(1)
    : 0

  // Category breakdown for the period
  const categoryBreakdown = useMemo(() => {
    return CATEGORIES.map(cat => {
      const catActivities = Object.values(ACTIVITIES).filter(a => a.category === cat.id)
      const done = periodCompletions.filter(c => catActivities.some(a => a.id === c.activityId))
      const stars = done.reduce((s, c) => s + (c.stars || 0), 0)
      const maxStars = catActivities.length * 3
      const pct = maxStars > 0 ? Math.min(100, Math.round((stars / maxStars) * 100)) : 0
      return { ...cat, completions: done.length, stars, pct }
    }).sort((a, b) => b.completions - a.completions)
  }, [periodCompletions])

  // Strengths & areas for practice
  const strengths = categoryBreakdown.filter(c => c.pct >= 60).slice(0, 3)
  const practiceAreas = categoryBreakdown.filter(c => c.completions === 0 || c.pct < 30).slice(0, 3)

  // Screen time by day
  const screenTimeData = useMemo(() => {
    const days = []
    for (let i = 6; i >= 0; i--) {
      const d = new Date()
      d.setDate(d.getDate() - i)
      const dateStr = d.toISOString().split('T')[0]
      const dayCompletions = progress.completedActivities.filter(c => c.date.startsWith(dateStr))
      const mins = Math.round(dayCompletions.reduce((s, c) => s + (c.durationSecs || 60), 0) / 60)
      days.push({ label: ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'][d.getDay()], mins })
    }
    return days
  }, [progress.completedActivities])

  const levelInfo = getLevelInfo(progress.xp)
  const earnedBadgeCount = progress.badges.length

  function handlePrint() {
    window.print()
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-3xl font-black text-[var(--text-primary)]">Parent Dashboard 👨‍👩‍👧</h1>
          <p className="text-[var(--text-secondary)] mt-1">Monitor progress and support your child's learning journey</p>
        </div>
        <div className="flex items-center gap-3 no-print">
          <Button variant="outline" size="sm" onClick={handlePrint}>
            <Printer size={16} aria-hidden="true" /> Print Report
          </Button>
          <Button variant="ghost" size="sm" onClick={() => navigate('/dashboard')}>
            <ArrowLeft size={16} aria-hidden="true" /> Back
          </Button>
        </div>
      </div>

      {/* Profile selector */}
      {state.profiles.length > 1 && (
        <Card className="no-print">
          <h2 className="font-bold text-[var(--text-primary)] mb-3">Select Child</h2>
          <div className="flex gap-3 flex-wrap">
            {state.profiles.map(p => (
              <button
                key={p.id}
                onClick={() => setSelectedProfileId(p.id)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl border-2 font-semibold text-sm transition-all min-h-[44px] ${
                  selectedProfileId === p.id
                    ? 'border-brand-purple bg-violet-50 dark:bg-violet-900/20 text-brand-purple'
                    : 'border-[var(--border)] text-[var(--text-secondary)] hover:border-brand-purple/40'
                }`}
              >
                <span aria-hidden="true">{p.avatar}</span>
                {p.name}
              </button>
            ))}
          </div>
        </Card>
      )}

      {/* Profile overview */}
      {profile && (
        <div className="rounded-3xl bg-gradient-to-r from-violet-500 to-blue-500 text-white p-6 sm:p-8">
          <div className="flex items-center gap-5 flex-wrap">
            <div className="w-16 h-16 rounded-2xl bg-white/20 flex items-center justify-center text-4xl" aria-hidden="true">
              {profile.avatar}
            </div>
            <div className="flex-1 min-w-0">
              <h2 className="text-2xl font-black">{profile.name}</h2>
              <p className="text-white/80 text-sm">Age {profile.age} · {levelInfo.emoji} {levelInfo.title} (Level {progress.level})</p>
            </div>
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <p className="text-3xl font-black">{progress.totalStars}</p>
                <p className="text-white/70 text-xs">⭐ Stars</p>
              </div>
              <div>
                <p className="text-3xl font-black">{progress.streak || 0}</p>
                <p className="text-white/70 text-xs">🔥 Streak</p>
              </div>
              <div>
                <p className="text-3xl font-black">{earnedBadgeCount}</p>
                <p className="text-white/70 text-xs">🏆 Badges</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Period selector */}
      <div className="flex items-center gap-2 no-print" role="group" aria-label="Report period">
        <span className="text-sm font-semibold text-[var(--text-secondary)]">Show:</span>
        {[
          { id: 'week', label: 'Last 7 days' },
          { id: 'month', label: 'Last 30 days' },
          { id: 'all', label: 'All time' },
        ].map(p => (
          <button
            key={p.id}
            onClick={() => setReportPeriod(p.id)}
            aria-pressed={reportPeriod === p.id}
            className={`px-4 py-2 rounded-xl text-sm font-semibold transition-colors min-h-[44px] ${
              reportPeriod === p.id
                ? 'bg-brand-purple text-white'
                : 'bg-[var(--bg-card)] border border-[var(--border)] text-[var(--text-secondary)] hover:border-brand-purple/40'
            }`}
          >
            {p.label}
          </button>
        ))}
      </div>

      {/* Key metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {[
          { icon: Target,    label: 'Activities',    value: periodCompletions.length, sub: 'completed', color: 'text-violet-600 bg-violet-50 border-violet-100' },
          { icon: Clock,     label: 'Screen Time',   value: `${totalMinutes}m`,        sub: 'total',     color: 'text-blue-600 bg-blue-50 border-blue-100' },
          { icon: TrendingUp,label: 'Avg Stars',     value: avgStars,                  sub: 'per activity', color: 'text-yellow-600 bg-yellow-50 border-yellow-100' },
          { icon: Award,     label: 'Badges',        value: earnedBadgeCount,           sub: `of ${BADGES.length} total`, color: 'text-green-600 bg-green-50 border-green-100' },
        ].map(m => (
          <div key={m.label} className={`card border p-4 ${m.color}`}>
            <m.icon size={20} className="mb-2" aria-hidden="true" />
            <p className="text-2xl font-black">{m.value}</p>
            <p className="font-semibold text-sm">{m.label}</p>
            <p className="text-xs opacity-70">{m.sub}</p>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-5">
        {/* Strengths */}
        <Card>
          <h2 className="font-bold text-[var(--text-primary)] mb-4 flex items-center gap-2">
            <span aria-hidden="true">💪</span> Strengths
          </h2>
          {strengths.length > 0 ? (
            <div className="space-y-3">
              {strengths.map(cat => (
                <div key={cat.id} className="flex items-center gap-3">
                  <span className="text-2xl" aria-hidden="true">{cat.emoji}</span>
                  <div className="flex-1">
                    <div className="flex justify-between text-sm mb-1">
                      <span className="font-semibold text-[var(--text-primary)]">{cat.title}</span>
                      <span className="text-[var(--text-muted)]">{cat.completions} sessions</span>
                    </div>
                    <ProgressBar value={cat.pct} max={100} color="green" size="md" />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-[var(--text-muted)] py-4 text-center">
              Complete more activities to identify strengths.
            </p>
          )}
        </Card>

        {/* Practice areas */}
        <Card>
          <h2 className="font-bold text-[var(--text-primary)] mb-4 flex items-center gap-2">
            <span aria-hidden="true">🎯</span> Areas for Practice
          </h2>
          {practiceAreas.length > 0 ? (
            <div className="space-y-3">
              {practiceAreas.map(cat => (
                <div key={cat.id} className="flex items-center gap-3 p-3 bg-orange-50 dark:bg-orange-900/20 rounded-2xl">
                  <span className="text-2xl" aria-hidden="true">{cat.emoji}</span>
                  <div className="flex-1">
                    <p className="font-semibold text-sm text-[var(--text-primary)]">{cat.title}</p>
                    <p className="text-xs text-[var(--text-muted)]">{cat.completions === 0 ? 'Not tried yet' : `${cat.completions} sessions — keep practising!`}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-[var(--text-muted)] py-4 text-center">
              All areas looking great! 🌟
            </p>
          )}
        </Card>
      </div>

      {/* Category breakdown */}
      <Card>
        <h2 className="font-bold text-[var(--text-primary)] mb-5">Skill Category Breakdown</h2>
        <div className="space-y-4">
          {categoryBreakdown.map(cat => (
            <div key={cat.id}>
              <div className="flex items-center gap-3 mb-1.5">
                <span className="text-xl w-7 flex-shrink-0" aria-hidden="true">{cat.emoji}</span>
                <div className="flex-1">
                  <div className="flex justify-between text-sm">
                    <span className="font-semibold text-[var(--text-primary)]">{cat.title}</span>
                    <span className="text-[var(--text-muted)]">{cat.completions} activities · {cat.stars} ⭐</span>
                  </div>
                  <ProgressBar value={cat.pct} max={100} color="purple" size="sm" className="mt-1" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Screen time (weekly view) */}
      <Card>
        <h2 className="font-bold text-[var(--text-primary)] mb-4">Daily Screen Time (Last 7 Days)</h2>
        <div className="flex items-end gap-2 h-24" aria-label="Daily screen time chart">
          {screenTimeData.map((d, i) => {
            const maxMins = Math.max(...screenTimeData.map(x => x.mins), 1)
            return (
              <div key={i} className="flex-1 flex flex-col items-center gap-1">
                <span className="text-xs text-[var(--text-muted)]">{d.mins}m</span>
                <div
                  className="w-full rounded-t-lg bg-gradient-to-t from-brand-purple to-brand-blue transition-all"
                  style={{ height: `${(d.mins / maxMins) * 56}px`, minHeight: d.mins > 0 ? '4px' : '0' }}
                  aria-label={`${d.label}: ${d.mins} minutes`}
                />
                <span className="text-xs text-[var(--text-muted)]">{d.label}</span>
              </div>
            )
          })}
        </div>
        <p className="text-sm text-[var(--text-muted)] text-center mt-2">
          Total this week: <strong>{screenTimeData.reduce((s, d) => s + d.mins, 0)} minutes</strong>
        </p>
      </Card>

      {/* Mood log */}
      {progress.moods.length > 0 && (
        <Card>
          <h2 className="font-bold text-[var(--text-primary)] mb-4">Recent Mood Log</h2>
          <div className="flex flex-wrap gap-2">
            {progress.moods.slice(-14).reverse().map((m, i) => (
              <div
                key={i}
                className="flex items-center gap-2 px-3 py-2 bg-gray-50 dark:bg-white/5 rounded-2xl text-sm"
                aria-label={`${m.mood} on ${new Date(m.date).toLocaleDateString()}`}
              >
                <span className="capitalize font-semibold text-[var(--text-primary)]">{m.mood}</span>
                <span className="text-[var(--text-muted)] text-xs">{new Date(m.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}</span>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Recommendations */}
      <Card className="bg-gradient-to-r from-violet-50 to-blue-50 dark:from-violet-900/20 dark:to-blue-900/20 border-violet-100 dark:border-violet-800">
        <h2 className="font-bold text-[var(--text-primary)] mb-3">💡 Recommendations for Parents</h2>
        <ul className="space-y-2 text-sm text-[var(--text-secondary)]">
          {progress.completedActivities.length === 0 && (
            <li>🌱 Encourage {profile?.name ?? 'your child'} to try their first activity — even 5 minutes a day makes a difference!</li>
          )}
          {progress.streak === 0 && progress.completedActivities.length > 0 && (
            <li>🔥 Try to build a daily habit — even one short activity each day helps maintain progress.</li>
          )}
          {practiceAreas.length > 0 && (
            <li>🎯 {profile?.name ?? 'Your child'} hasn't tried {practiceAreas[0].title} yet — this could be a great next step!</li>
          )}
          <li>💙 Celebrate every effort, not just high scores. The act of trying is itself an achievement.</li>
          <li>⏱️ Aim for short, regular sessions (10–15 minutes) rather than long infrequent ones.</li>
          {progress.moods.length > 0 && (
            <li>😊 Check the mood log together and talk about any feelings that come up during activities.</li>
          )}
        </ul>
      </Card>
    </div>
  )
}
