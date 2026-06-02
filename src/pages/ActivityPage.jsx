import React, { useState, useRef, useEffect, lazy, Suspense } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { ArrowLeft, Clock, Star as StarIcon, Play, RotateCcw, Home } from 'lucide-react'
import { useApp } from '../context/AppContext'
import { ACTIVITIES, CATEGORIES, DIFFICULTY_LABELS } from '../data/activities'
import { BADGES } from '../data/badges'
import Button from '../components/ui/Button'
import Stars, { StarBurst } from '../components/ui/Stars'

// Lazy-load activity components
const activityComponents = {
  'memory-cards':         lazy(() => import('../activities/MemoryCards')),
  'breathing':            lazy(() => import('../activities/BreathingExercise')),
  'mood-tracker':         lazy(() => import('../activities/MoodTracker')),
  'emotion-recognition':  lazy(() => import('../activities/EmotionRecognition')),
  'pattern-recognition':  lazy(() => import('../activities/PatternRecognition')),
  'vocabulary':           lazy(() => import('../activities/VocabularyBuilder')),
  'focus-timer':          lazy(() => import('../activities/FocusTimer')),
  'task-sequencer':       lazy(() => import('../activities/TaskSequencer')),
  'color-sorting':        lazy(() => import('../activities/ColorSorting')),
  'feelings-journal':     lazy(() => import('../activities/FeelingsJournal')),
  // Newly implemented
  'sequence-recall':      lazy(() => import('../activities/SequenceRecall')),
  'visual-patterns':      lazy(() => import('../activities/VisualMemory')),
  'spot-difference':      lazy(() => import('../activities/SpotDifference')),
  'visual-scan':          lazy(() => import('../activities/VisualScan')),
  'daily-routine':        lazy(() => import('../activities/DailyRoutine')),
  'categorization':       lazy(() => import('../activities/Categorization')),
  'logic-games':          lazy(() => import('../activities/LogicPuzzles')),
  'cause-effect':         lazy(() => import('../activities/CauseEffect')),
  'story-completion':     lazy(() => import('../activities/StoryCompletion')),
  'facial-expressions':   lazy(() => import('../activities/FacialExpressions')),
  'social-scenarios':     lazy(() => import('../activities/SocialScenarios')),
  'perspectives':         lazy(() => import('../activities/Perspectives')),
  'coping-cards':         lazy(() => import('../activities/CopingCards')),
  'shape-recognition':    lazy(() => import('../activities/ShapeExplorer')),
  'visual-exploration':   lazy(() => import('../activities/VisualExplorer')),
}

function LoadingSpinner() {
  return (
    <div className="flex flex-col items-center justify-center py-20 gap-4" aria-label="Loading activity…" role="status">
      <div className="w-12 h-12 rounded-full border-4 border-brand-purple/20 border-t-brand-purple animate-spin" aria-hidden="true" />
      <p className="text-[var(--text-muted)] font-medium">Loading activity…</p>
    </div>
  )
}

function ComingSoon({ activity }) {
  const navigate = useNavigate()
  return (
    <div className="text-center py-16 px-4">
      <div className="text-7xl mb-5" aria-hidden="true">{activity.emoji}</div>
      <div className="inline-block bg-yellow-100 text-yellow-700 px-4 py-1.5 rounded-full text-sm font-bold mb-4">
        Coming Soon!
      </div>
      <h2 className="text-2xl font-black text-[var(--text-primary)] mb-3">{activity.title}</h2>
      <p className="text-[var(--text-secondary)] max-w-md mx-auto mb-2">{activity.description}</p>
      <p className="text-sm text-[var(--text-muted)] mb-8">We're working hard to build this activity. Check back soon!</p>
      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        <Button variant="outline" onClick={() => navigate(-1)}>
          <ArrowLeft size={16} aria-hidden="true" /> Go back
        </Button>
        <Button onClick={() => navigate('/activities')}>
          Explore other activities
        </Button>
      </div>
    </div>
  )
}

function CompletionScreen({ activity, result, onPlayAgain, onHome }) {
  const navigate = useNavigate()
  const { currentProgress } = useApp()

  const messages = [
    ['🎉 Amazing work!', 'You did a fantastic job!'],
    ['⭐ Great job!', 'You should be so proud of yourself!'],
    ['🌟 Well done!', 'Keep up the brilliant effort!'],
    ['🏆 Brilliant!', 'You are getting better every day!'],
    ['🚀 Super!', 'That was incredible effort!'],
  ]
  const msg = messages[Math.floor(Math.random() * messages.length)]

  return (
    <div className="max-w-md mx-auto text-center py-8 px-4 animate-slide-up">
      {/* Confetti animation (CSS-only) */}
      <div aria-hidden="true" className="pointer-events-none">
        {result.stars >= 2 && Array.from({ length: 12 }).map((_, i) => (
          <div
            key={i}
            className="confetti-piece w-2 h-2 rounded-full"
            style={{
              left: `${10 + Math.random() * 80}%`,
              background: ['#9B89C4', '#7BB3D0', '#86C5A3', '#F5D78E', '#F0A882', '#D4A5C7'][i % 6],
              animationDelay: `${Math.random() * 0.5}s`,
              animationDuration: `${1.5 + Math.random() * 1}s`,
            }}
          />
        ))}
      </div>

      <div className="text-6xl mb-4 animate-pop-in" aria-hidden="true">{activity.emoji}</div>

      <h2 className="text-3xl font-black text-[var(--text-primary)] mb-2">{msg[0]}</h2>
      <p className="text-[var(--text-secondary)] mb-6">{msg[1]}</p>

      {/* Stars */}
      <div className="my-6">
        <p className="text-sm text-[var(--text-muted)] mb-3" aria-live="polite">You earned:</p>
        <Stars earned={result.stars} max={activity.maxStars} size="xl" animate />
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3 mb-8">
        {[
          { label: 'Stars', value: result.stars, emoji: '⭐' },
          { label: 'Score', value: `${result.score}%`, emoji: '🎯' },
          { label: 'Time', value: result.durationSecs ? `${Math.round(result.durationSecs)}s` : '—', emoji: '⏱️' },
        ].map(stat => (
          <div key={stat.label} className="bg-gray-50 dark:bg-white/5 rounded-2xl p-3">
            <div className="text-xl" aria-hidden="true">{stat.emoji}</div>
            <div className="font-black text-lg text-[var(--text-primary)]">{stat.value}</div>
            <div className="text-xs text-[var(--text-muted)]">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* New badges earned */}
      {result.newBadges?.length > 0 && (
        <div className="mb-6 p-4 bg-gradient-to-r from-violet-50 to-blue-50 dark:from-violet-900/20 dark:to-blue-900/20 rounded-2xl border border-violet-100">
          <p className="font-bold text-violet-700 text-sm mb-2">🏆 New badge{result.newBadges.length > 1 ? 's' : ''} unlocked!</p>
          <div className="flex justify-center gap-3">
            {result.newBadges.map(b => (
              <div key={b.id} className="text-center">
                <div className="text-2xl">{b.emoji}</div>
                <div className="text-xs font-semibold text-violet-600">{b.title}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        <Button variant="outline" onClick={onHome} size="lg">
          <Home size={18} aria-hidden="true" /> Dashboard
        </Button>
        <Button onClick={onPlayAgain} size="lg">
          <RotateCcw size={18} aria-hidden="true" /> Play Again
        </Button>
      </div>

      <button
        onClick={() => navigate('/activities')}
        className="mt-4 text-sm text-[var(--text-muted)] hover:text-brand-purple transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-[var(--focus-ring)] rounded"
      >
        Try a different activity →
      </button>
    </div>
  )
}

export default function ActivityPage() {
  const { activityId } = useParams()
  const navigate = useNavigate()
  const { dispatch, currentProgress } = useApp()

  const [phase, setPhase] = useState('instructions') // 'instructions' | 'activity' | 'complete'
  const [difficulty, setDifficulty] = useState('medium')
  const [result, setResult] = useState(null)
  const [startTime, setStartTime] = useState(null)
  const prevBadgesRef = useRef(null)

  useEffect(() => {
    if (phase === 'complete' && prevBadgesRef.current) {
      const newBadges = BADGES.filter(b =>
        !prevBadgesRef.current.has(b.id) && currentProgress.badges.includes(b.id)
      )
      setResult(prev => prev ? { ...prev, newBadges } : prev)
      prevBadgesRef.current = null
    }
  }, [currentProgress.badges])

  const activity = ACTIVITIES[activityId]

  if (!activity) {
    return (
      <div className="text-center py-16">
        <div className="text-5xl mb-4" aria-hidden="true">🤔</div>
        <h2 className="text-2xl font-black text-[var(--text-primary)] mb-3">Activity not found</h2>
        <Button onClick={() => navigate('/activities')}>Back to Activities</Button>
      </div>
    )
  }

  const cat = CATEGORIES.find(c => c.id === activity.category)
  const ActivityComponent = activityComponents[activityId]

  function handleStart() {
    setStartTime(Date.now())
    setPhase('activity')
  }

  function handleComplete({ stars, score }) {
    const durationSecs = startTime ? (Date.now() - startTime) / 1000 : null
    prevBadgesRef.current = new Set(currentProgress.badges)
    dispatch({ type: 'COMPLETE_ACTIVITY', payload: { activityId, stars, score, durationSecs } })
    setResult({ stars, score: Math.round(score), durationSecs, newBadges: [] })
    setPhase('complete')
  }

  if (phase === 'complete' && result) {
    return (
      <CompletionScreen
        activity={activity}
        result={result}
        onPlayAgain={() => { setPhase('instructions'); setResult(null) }}
        onHome={() => navigate('/dashboard')}
      />
    )
  }

  if (phase === 'activity') {
    return (
      <div className="space-y-4">
        {/* Activity bar */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setPhase('instructions')}
              className="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-white/10 transition-colors focus-visible:outline focus-visible:outline-3 focus-visible:outline-[var(--focus-ring)] min-h-[44px] min-w-[44px] flex items-center justify-center"
              aria-label="Back to instructions"
            >
              <ArrowLeft size={20} aria-hidden="true" />
            </button>
            <div>
              <p className="font-bold text-[var(--text-primary)]">{activity.title}</p>
              <p className="text-xs text-[var(--text-muted)] capitalize">{DIFFICULTY_LABELS[difficulty]?.emoji} {difficulty}</p>
            </div>
          </div>
          <div className="flex items-center gap-2 text-[var(--text-muted)] text-sm">
            <Clock size={14} aria-hidden="true" />
            <span aria-label={`Estimated time: ${activity.time}`}>{activity.time}</span>
          </div>
        </div>

        {/* Activity content */}
        {ActivityComponent ? (
          <Suspense fallback={<LoadingSpinner />}>
            <ActivityComponent difficulty={difficulty} onComplete={handleComplete} />
          </Suspense>
        ) : (
          <ComingSoon activity={activity} />
        )}
      </div>
    )
  }

  // Instructions screen
  return (
    <div className="max-w-2xl mx-auto space-y-5">
      {/* Back */}
      <Link
        to="/activities"
        className="inline-flex items-center gap-2 text-sm text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-[var(--focus-ring)] rounded"
      >
        <ArrowLeft size={16} aria-hidden="true" /> All activities
      </Link>

      {/* Hero card */}
      <div className={`rounded-3xl bg-gradient-to-br ${cat?.gradient ?? 'from-gray-100 to-gray-200'} ${cat?.darkBg ?? ''} border ${cat?.border ?? 'border-gray-200'} p-7 sm:p-10 text-center`}>
        <div className="text-7xl mb-4 animate-float" aria-hidden="true">{activity.emoji}</div>
        <h1 className="text-3xl font-black text-[var(--text-primary)] mb-2">{activity.title}</h1>
        <p className="text-[var(--text-secondary)] text-base max-w-md mx-auto">{activity.description}</p>
      </div>

      {/* Info row */}
      <div className="grid grid-cols-3 gap-3">
        <div className="card text-center p-4">
          <div className="text-2xl mb-1" aria-hidden="true">⏱️</div>
          <p className="text-xs text-[var(--text-muted)]">Duration</p>
          <p className="font-bold text-sm text-[var(--text-primary)]">{activity.time}</p>
        </div>
        <div className="card text-center p-4">
          <div className="text-2xl mb-1" aria-hidden="true">⭐</div>
          <p className="text-xs text-[var(--text-muted)]">Max Stars</p>
          <p className="font-bold text-sm text-[var(--text-primary)]">{activity.maxStars} stars</p>
        </div>
        <div className="card text-center p-4">
          <div className="text-2xl mb-1" aria-hidden="true">🎯</div>
          <p className="text-xs text-[var(--text-muted)]">Skills</p>
          <p className="font-bold text-sm text-[var(--text-primary)] truncate">{activity.skills?.slice(0, 2).join(', ')}</p>
        </div>
      </div>

      {/* Instructions */}
      <div className="card">
        <h2 className="font-bold text-[var(--text-primary)] mb-3 flex items-center gap-2">
          <span aria-hidden="true">📖</span> How to play
        </h2>
        <p className="text-[var(--text-secondary)] leading-relaxed">{activity.instructions}</p>

        {activity.skills?.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-2" aria-label="Skills developed">
            {activity.skills.map(skill => (
              <span key={skill} className="bg-violet-50 dark:bg-violet-900/20 text-violet-700 dark:text-violet-300 text-xs font-semibold px-3 py-1 rounded-full border border-violet-100 dark:border-violet-800">
                {skill}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Difficulty selection */}
      {activity.difficulties.length > 1 && (
        <div className="card">
          <h2 className="font-bold text-[var(--text-primary)] mb-3">Choose your level</h2>
          <div className="grid grid-cols-3 gap-2" role="group" aria-label="Difficulty level">
            {activity.difficulties.map(d => (
              <button
                key={d}
                onClick={() => setDifficulty(d)}
                aria-pressed={difficulty === d}
                className={`py-3 px-2 rounded-2xl border-2 text-center transition-all ${
                  difficulty === d
                    ? 'border-brand-purple bg-violet-50 dark:bg-violet-900/20'
                    : 'border-[var(--border)] hover:border-brand-purple/40'
                }`}
              >
                <div className="text-xl mb-1" aria-hidden="true">{DIFFICULTY_LABELS[d]?.emoji}</div>
                <p className={`text-xs font-bold ${difficulty === d ? 'text-brand-purple' : 'text-[var(--text-secondary)]'}`}>
                  {DIFFICULTY_LABELS[d]?.label}
                </p>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Best score */}
      {(() => {
        const best = currentProgress.completedActivities
          .filter(c => c.activityId === activityId)
          .sort((a, b) => b.stars - a.stars)[0]
        if (!best) return null
        return (
          <div className="card bg-yellow-50 dark:bg-yellow-900/20 border-yellow-100 dark:border-yellow-800">
            <p className="text-sm font-bold text-yellow-700 dark:text-yellow-300 mb-1">🏆 Your best score</p>
            <Stars earned={best.stars} max={activity.maxStars} size="md" />
          </div>
        )
      })()}

      {/* Start button */}
      <div className="pb-4">
        {activity.implemented ? (
          <Button
            fullWidth
            size="xl"
            onClick={handleStart}
            className="text-xl font-black tracking-wide"
          >
            <Play size={22} aria-hidden="true" />
            Let's Play!
          </Button>
        ) : (
          <div className="text-center">
            <div className="bg-yellow-50 border border-yellow-200 rounded-2xl p-4 mb-4">
              <p className="text-yellow-700 font-bold">🚧 This activity is coming soon!</p>
              <p className="text-yellow-600 text-sm mt-1">We're building it now — check back soon.</p>
            </div>
            <Button variant="outline" fullWidth onClick={() => navigate('/activities')}>
              Explore other activities
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
