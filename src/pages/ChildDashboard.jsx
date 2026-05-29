import React, { useMemo } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ChevronRight, Flame, Star, Target, Zap } from 'lucide-react'
import { useApp } from '../context/AppContext'
import Card from '../components/ui/Card'
import ProgressBar from '../components/ui/ProgressBar'
import { ACTIVITIES, CATEGORIES, getRecommendedActivities, getLevelInfo, getNextLevelInfo } from '../data/activities'
import { BADGES } from '../data/badges'

const GREETING_EMOJIS = { morning: '🌅', afternoon: '☀️', evening: '🌙' }
const GREETINGS = {
  morning:   ['Good morning', 'Rise and shine', 'Good morning'],
  afternoon: ['Good afternoon', 'Hello there', 'Great to see you'],
  evening:   ['Good evening', 'Welcome back', 'Hi there'],
}

function getTimeOfDay() {
  const h = new Date().getHours()
  if (h < 12) return 'morning'
  if (h < 18) return 'afternoon'
  return 'evening'
}

function todayStr() {
  return new Date().toISOString().split('T')[0]
}

export default function ChildDashboard() {
  const { currentProfile, currentProgress } = useApp()
  const navigate = useNavigate()

  const timeOfDay = getTimeOfDay()
  const greeting = GREETINGS[timeOfDay][Math.floor(Math.random() * 3)]

  const levelInfo = getLevelInfo(currentProgress.xp)
  const nextLevel = getNextLevelInfo(currentProgress.level)
  const xpToNext = nextLevel ? nextLevel.min - currentProgress.xp : 0
  const xpProgress = nextLevel ? ((currentProgress.xp - levelInfo.min) / (nextLevel.min - levelInfo.min)) * 100 : 100

  // Daily goals
  const dailyCompleted = currentProgress.dailyGoals.completedToday.length
  const dailyTarget = currentProgress.dailyGoals.target
  const dailyPct = Math.min(100, (dailyCompleted / dailyTarget) * 100)
  const isGoalMet = dailyCompleted >= dailyTarget

  // Recent badges
  const recentBadges = BADGES.filter(b => currentProgress.badges.includes(b.id)).slice(-4)

  // Recommended activities
  const recommended = useMemo(() => {
    const completedIds = currentProgress.completedActivities.map(a => a.activityId)
    return getRecommendedActivities(currentProfile?.age ?? 8, completedIds).slice(0, 3)
  }, [currentProgress.completedActivities, currentProfile?.age])

  // Today's activity completions
  const today = todayStr()
  const todayCompletions = currentProgress.completedActivities.filter(a =>
    a.date.startsWith(today)
  )

  // Total activities completed (unique)
  const uniqueDone = new Set(currentProgress.completedActivities.map(a => a.activityId)).size

  return (
    <div className="space-y-6">
      {/* Welcome banner */}
      <div
        className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-violet-500 to-blue-500 text-white p-6 sm:p-8"
        aria-label="Welcome message"
      >
        <div className="absolute top-0 right-0 w-48 h-48 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/4" aria-hidden="true" />
        <div className="absolute bottom-0 right-12 w-24 h-24 bg-white/10 rounded-full translate-y-1/2" aria-hidden="true" />

        <div className="relative">
          <p className="text-white/80 text-sm font-semibold mb-1">
            {GREETING_EMOJIS[timeOfDay]} {greeting},
          </p>
          <h1 className="text-3xl sm:text-4xl font-black mb-2">
            {currentProfile?.name}! 👋
          </h1>
          <p className="text-white/85 mb-6 text-sm sm:text-base">
            {isGoalMet
              ? "🎉 You've hit today's goal! Keep going for bonus stars!"
              : `You need ${dailyTarget - dailyCompleted} more ${dailyTarget - dailyCompleted === 1 ? 'activity' : 'activities'} for today's goal.`
            }
          </p>

          {/* Daily goal bar */}
          <div className="bg-white/20 rounded-2xl p-3 sm:p-4 max-w-sm">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-1.5 font-bold text-sm">
                <Target size={15} aria-hidden="true" />
                Today's Goal
              </div>
              <span className="text-sm font-bold" aria-live="polite">{dailyCompleted}/{dailyTarget}</span>
            </div>
            <div className="h-3 bg-white/30 rounded-full overflow-hidden">
              <div
                className="h-full bg-white rounded-full transition-all duration-700"
                style={{ width: `${dailyPct}%` }}
                role="progressbar"
                aria-valuenow={dailyCompleted}
                aria-valuemax={dailyTarget}
                aria-label="Daily goal progress"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {[
          { label: 'Total Stars', value: currentProgress.totalStars, emoji: '⭐', color: 'bg-yellow-50 border-yellow-100', text: 'text-yellow-700' },
          { label: 'Day Streak', value: currentProgress.streak || 0, emoji: '🔥', color: 'bg-orange-50 border-orange-100', text: 'text-orange-600' },
          { label: 'Activities Done', value: uniqueDone, emoji: '🎮', color: 'bg-violet-50 border-violet-100', text: 'text-violet-600' },
          { label: 'Badges Earned', value: currentProgress.badges.length, emoji: '🏆', color: 'bg-blue-50 border-blue-100', text: 'text-blue-600' },
        ].map(stat => (
          <div key={stat.label} className={`card border ${stat.color} p-4 text-center`}>
            <div className="text-3xl mb-1" aria-hidden="true">{stat.emoji}</div>
            <div className={`text-2xl font-black ${stat.text}`} aria-label={`${stat.value} ${stat.label}`}>
              {stat.value}
            </div>
            <div className="text-xs text-[var(--text-muted)] font-medium mt-0.5">{stat.label}</div>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-5">
        {/* Level progress */}
        <Card className="lg:col-span-1">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold text-[var(--text-primary)]">Your Level</h2>
            <span className="text-2xl" aria-hidden="true">{levelInfo.emoji}</span>
          </div>
          <div className="text-center py-2">
            <div
              className="w-20 h-20 mx-auto rounded-3xl bg-gradient-to-br from-violet-100 to-blue-100 flex flex-col items-center justify-center mb-3 shadow-soft"
              aria-label={`Level ${currentProgress.level}`}
            >
              <span className="text-3xl font-black text-brand-purple">{currentProgress.level}</span>
            </div>
            <p className="font-bold text-[var(--text-primary)] text-lg">{levelInfo.title}</p>
            {nextLevel && (
              <p className="text-sm text-[var(--text-muted)] mt-1">{xpToNext} XP to Level {currentProgress.level + 1}</p>
            )}
          </div>
          <ProgressBar
            value={currentProgress.xp - levelInfo.min}
            max={nextLevel ? nextLevel.min - levelInfo.min : 1}
            color="gradient"
            size="lg"
            label="XP Progress"
            showPercent
            className="mt-3"
          />
        </Card>

        {/* Recommended activities */}
        <Card className="lg:col-span-2" padding={false}>
          <div className="flex items-center justify-between p-5 sm:p-6 border-b border-[var(--border)]">
            <h2 className="font-bold text-[var(--text-primary)]">Recommended for you</h2>
            <Link
              to="/activities"
              className="text-sm font-semibold text-brand-purple hover:text-brand-purple-dark transition-colors flex items-center gap-1 focus-visible:outline focus-visible:outline-2 focus-visible:outline-[var(--focus-ring)] rounded"
              aria-label="See all activities"
            >
              See all <ChevronRight size={14} aria-hidden="true" />
            </Link>
          </div>
          <div className="p-5 sm:p-6 space-y-3">
            {recommended.length > 0 ? recommended.map(activity => {
              const cat = CATEGORIES.find(c => c.id === activity.category)
              return (
                <button
                  key={activity.id}
                  onClick={() => navigate(`/activities/${activity.id}`)}
                  className="w-full flex items-center gap-4 p-3 rounded-2xl hover:bg-gray-50 dark:hover:bg-white/5 transition-colors text-left group focus-visible:outline focus-visible:outline-3 focus-visible:outline-[var(--focus-ring)]"
                  aria-label={`Start ${activity.title}`}
                >
                  <div
                    className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${cat?.gradient ?? 'from-gray-100 to-gray-200'} flex items-center justify-center text-2xl flex-shrink-0 group-hover:scale-105 transition-transform`}
                    aria-hidden="true"
                  >
                    {activity.emoji}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-sm text-[var(--text-primary)]">{activity.title}</p>
                    <p className="text-xs text-[var(--text-muted)] truncate">{activity.description}</p>
                  </div>
                  <ChevronRight size={16} className="text-[var(--text-muted)] group-hover:text-brand-purple transition-colors flex-shrink-0" aria-hidden="true" />
                </button>
              )
            }) : (
              <p className="text-[var(--text-muted)] text-sm text-center py-4">
                You've tried everything! Check the activities hub for more. 🎉
              </p>
            )}
          </div>
        </Card>
      </div>

      <div className="grid lg:grid-cols-2 gap-5">
        {/* Recent badges */}
        <Card>
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold text-[var(--text-primary)]">Recent Badges</h2>
            <Link
              to="/rewards"
              className="text-sm font-semibold text-brand-purple flex items-center gap-1 hover:text-brand-purple-dark transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-[var(--focus-ring)] rounded"
            >
              All badges <ChevronRight size={14} aria-hidden="true" />
            </Link>
          </div>
          {recentBadges.length > 0 ? (
            <div className="grid grid-cols-2 gap-3">
              {recentBadges.map(badge => (
                <div
                  key={badge.id}
                  className="flex items-center gap-3 p-3 bg-gradient-to-r from-violet-50 to-blue-50 dark:from-violet-900/20 dark:to-blue-900/20 rounded-2xl border border-violet-100 dark:border-violet-800"
                  aria-label={`Badge: ${badge.title}`}
                >
                  <span className="text-2xl" aria-hidden="true">{badge.emoji}</span>
                  <div className="min-w-0">
                    <p className="font-bold text-xs text-[var(--text-primary)] truncate">{badge.title}</p>
                    <p className="text-[10px] text-[var(--text-muted)] capitalize">{badge.rarity}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-6">
              <div className="text-4xl mb-2" aria-hidden="true">🏆</div>
              <p className="text-sm text-[var(--text-muted)]">Complete activities to earn your first badge!</p>
              <Link
                to="/activities"
                className="inline-flex items-center gap-1 mt-3 text-sm font-bold text-brand-purple hover:text-brand-purple-dark focus-visible:outline focus-visible:outline-2 focus-visible:outline-[var(--focus-ring)] rounded"
              >
                Start now <ChevronRight size={14} aria-hidden="true" />
              </Link>
            </div>
          )}
        </Card>

        {/* Today's activity log */}
        <Card>
          <h2 className="font-bold text-[var(--text-primary)] mb-4">Today's Activities</h2>
          {todayCompletions.length > 0 ? (
            <div className="space-y-2" aria-label="Activities completed today">
              {todayCompletions.slice(-4).reverse().map((c, i) => {
                const act = ACTIVITIES[c.activityId]
                return (
                  <div key={i} className="flex items-center gap-3 p-2.5 rounded-xl bg-gray-50 dark:bg-white/5">
                    <span className="text-xl flex-shrink-0" aria-hidden="true">{act?.emoji ?? '🎮'}</span>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-sm text-[var(--text-primary)] truncate">{act?.title ?? c.activityId}</p>
                    </div>
                    <div className="flex items-center gap-0.5 flex-shrink-0">
                      {Array.from({ length: c.stars ?? 0 }).map((_, s) => (
                        <span key={s} className="text-sm" aria-hidden="true">⭐</span>
                      ))}
                    </div>
                  </div>
                )
              })}
              {isGoalMet && (
                <div className="flex items-center justify-center gap-2 p-2 bg-green-50 dark:bg-green-900/20 rounded-xl border border-green-100">
                  <span aria-hidden="true">🎉</span>
                  <p className="text-xs font-bold text-green-700">Goal complete! Amazing work!</p>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-6">
              <div className="text-4xl mb-2" aria-hidden="true">🌟</div>
              <p className="text-sm text-[var(--text-muted)]">No activities yet today.</p>
              <p className="text-xs text-[var(--text-muted)] mt-1">Pick one to get started!</p>
              <Link
                to="/activities"
                className="inline-flex items-center gap-1 mt-3 text-sm font-bold text-brand-purple hover:text-brand-purple-dark focus-visible:outline focus-visible:outline-2 focus-visible:outline-[var(--focus-ring)] rounded"
              >
                Choose an activity <ChevronRight size={14} aria-hidden="true" />
              </Link>
            </div>
          )}
        </Card>
      </div>

      {/* Quick access to activity categories */}
      <Card padding={false}>
        <div className="p-5 sm:p-6 border-b border-[var(--border)]">
          <h2 className="font-bold text-[var(--text-primary)]">Explore activities</h2>
        </div>
        <div className="p-4 sm:p-5">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3">
            {CATEGORIES.map(cat => (
              <Link
                key={cat.id}
                to="/activities"
                state={{ category: cat.id }}
                className={`flex flex-col items-center gap-2 p-3 sm:p-4 rounded-2xl bg-gradient-to-br ${cat.gradient} ${cat.darkBg} border ${cat.border} hover:-translate-y-0.5 transition-all focus-visible:outline focus-visible:outline-3 focus-visible:outline-[var(--focus-ring)]`}
                aria-label={`Explore ${cat.title}`}
              >
                <span className="text-2xl sm:text-3xl" aria-hidden="true">{cat.emoji}</span>
                <span className={`text-xs font-bold text-center ${cat.text}`}>{cat.title}</span>
              </Link>
            ))}
          </div>
        </div>
      </Card>
    </div>
  )
}
