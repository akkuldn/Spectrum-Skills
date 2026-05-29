import React, { useState, useEffect, useRef, useCallback } from 'react'
import { Play, Pause, RotateCcw } from 'lucide-react'
import Button from '../components/ui/Button'

const PRESET_TIMES = {
  easy:   [2, 3, 5],
  medium: [5, 10, 15],
  hard:   [15, 20, 25],
}

const FOCUS_TASKS = [
  'Draw a picture 🎨',
  'Read a book 📖',
  'Tidy your room 🏠',
  'Practice writing ✍️',
  'Build something with LEGO 🧱',
  'Look out the window and count things you see 👀',
  'Do some colouring in 🖍️',
  'Practice your times tables 🔢',
  'Write about your day 📓',
  'Do some stretches 🧘',
]

const ENCOURAGEMENTS = [
  'You\'re doing amazingly! 🌟',
  'Stay focused — you\'ve got this! 💪',
  'Every minute counts! Keep going! ⭐',
  'You\'re a focus champion! 🏆',
  'Brilliant concentration! 🧠',
  'Almost there — keep it up! 🎯',
]

function formatTime(seconds) {
  const m = Math.floor(seconds / 60)
  const s = seconds % 60
  return `${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}`
}

export default function FocusTimer({ difficulty = 'easy', onComplete }) {
  const presets = PRESET_TIMES[difficulty] ?? PRESET_TIMES.easy
  const [selectedMinutes, setSelectedMinutes] = useState(presets[0])
  const [secondsLeft, setSecondsLeft] = useState(presets[0] * 60)
  const [running, setRunning] = useState(false)
  const [done, setDone] = useState(false)
  const [phase, setPhase] = useState('setup') // 'setup' | 'focus' | 'break' | 'done'
  const [task, setTask] = useState(() => FOCUS_TASKS[Math.floor(Math.random() * FOCUS_TASKS.length)])
  const [encouragement, setEncouragement] = useState(ENCOURAGEMENTS[0])
  const [completedSessions, setCompletedSessions] = useState(0)
  const intervalRef = useRef(null)
  const encourageRef = useRef(null)

  const totalSeconds = selectedMinutes * 60
  const progress = (1 - secondsLeft / totalSeconds) * 100

  const handleComplete = useCallback(() => {
    const pct = Math.round(((completedSessions + 1) / 1) * 100)
    const stars = completedSessions >= 2 ? 3 : completedSessions >= 1 ? 2 : 1
    onComplete({ stars: 3, score: 100 })
  }, [completedSessions, onComplete])

  // Timer tick
  useEffect(() => {
    if (!running) return
    intervalRef.current = setInterval(() => {
      setSecondsLeft(s => {
        if (s <= 1) {
          clearInterval(intervalRef.current)
          setRunning(false)
          setDone(true)
          setPhase('done')
          setCompletedSessions(c => c + 1)
          handleComplete()
          return 0
        }
        return s - 1
      })
    }, 1000)
    return () => clearInterval(intervalRef.current)
  }, [running, handleComplete])

  // Rotate encouragement every 30s
  useEffect(() => {
    if (!running) return
    encourageRef.current = setInterval(() => {
      setEncouragement(ENCOURAGEMENTS[Math.floor(Math.random() * ENCOURAGEMENTS.length)])
    }, 30000)
    return () => clearInterval(encourageRef.current)
  }, [running])

  function handleStart() {
    setSecondsLeft(selectedMinutes * 60)
    setRunning(true)
    setDone(false)
    setPhase('focus')
    setTask(FOCUS_TASKS[Math.floor(Math.random() * FOCUS_TASKS.length)])
  }

  function handlePause() {
    setRunning(r => !r)
  }

  function handleReset() {
    clearInterval(intervalRef.current)
    setRunning(false)
    setSecondsLeft(selectedMinutes * 60)
    setDone(false)
    setPhase('setup')
  }

  // Stroke dash for SVG circle
  const radius = 90
  const circumference = 2 * Math.PI * radius
  const dashOffset = circumference - (progress / 100) * circumference

  if (phase === 'setup') {
    return (
      <div className="max-w-md mx-auto text-center space-y-7 py-4">
        <div>
          <h2 className="text-2xl font-black text-[var(--text-primary)]">⏱️ Focus Timer</h2>
          <p className="text-[var(--text-secondary)] mt-1 text-sm">Set your timer and stay focused!</p>
        </div>

        {/* Task display */}
        <div className="card bg-violet-50 dark:bg-violet-900/20 border-violet-100 p-5 text-center">
          <p className="text-sm font-bold text-violet-600 dark:text-violet-400 mb-2">Your focus task:</p>
          <p className="text-xl font-black text-[var(--text-primary)]">{task}</p>
          <button
            onClick={() => setTask(FOCUS_TASKS[Math.floor(Math.random() * FOCUS_TASKS.length)])}
            className="mt-2 text-xs text-violet-500 hover:text-violet-700 font-semibold focus-visible:outline focus-visible:outline-2 focus-visible:outline-[var(--focus-ring)] rounded"
          >
            🔀 Pick a different task
          </button>
        </div>

        {/* Duration selection */}
        <div>
          <p className="text-sm font-bold text-[var(--text-secondary)] mb-3">Choose your focus time:</p>
          <div className="flex justify-center gap-3" role="group" aria-label="Focus duration">
            {presets.map(mins => (
              <button
                key={mins}
                onClick={() => { setSelectedMinutes(mins); setSecondsLeft(mins * 60) }}
                aria-pressed={selectedMinutes === mins}
                className={`w-20 h-20 rounded-3xl border-2 font-black text-lg transition-all focus-visible:outline focus-visible:outline-3 focus-visible:outline-[var(--focus-ring)] ${
                  selectedMinutes === mins
                    ? 'border-brand-purple bg-violet-50 dark:bg-violet-900/20 text-brand-purple shadow-glow'
                    : 'border-[var(--border)] text-[var(--text-secondary)] hover:border-brand-purple/40'
                }`}
              >
                {mins}m
              </button>
            ))}
          </div>
        </div>

        <Button size="xl" onClick={handleStart} fullWidth>
          <Play size={22} aria-hidden="true" /> Start Focusing!
        </Button>

        <p className="text-xs text-[var(--text-muted)]">
          💡 Turn off distractions, get comfortable, and focus on your task for the full time.
        </p>
      </div>
    )
  }

  return (
    <div className="max-w-sm mx-auto text-center space-y-6 py-4">
      {/* Task reminder */}
      <div className="bg-violet-50 dark:bg-violet-900/20 border border-violet-100 rounded-2xl px-4 py-3">
        <p className="text-sm font-bold text-violet-600 dark:text-violet-400">Focus on:</p>
        <p className="font-black text-[var(--text-primary)] text-sm">{task}</p>
      </div>

      {/* Circular timer */}
      <div className="relative flex items-center justify-center">
        <svg width="220" height="220" viewBox="0 0 220 220" className="-rotate-90" aria-hidden="true">
          {/* Background circle */}
          <circle cx="110" cy="110" r={radius} fill="none" stroke="currentColor" strokeWidth="12" className="text-gray-100 dark:text-white/10" />
          {/* Progress circle */}
          <circle
            cx="110" cy="110" r={radius}
            fill="none"
            stroke="url(#timerGradient)"
            strokeWidth="12"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={dashOffset}
            className="transition-all duration-1000"
          />
          <defs>
            <linearGradient id="timerGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#9B89C4"/>
              <stop offset="100%" stopColor="#7BB3D0"/>
            </linearGradient>
          </defs>
        </svg>

        {/* Center content */}
        <div
          className="absolute inset-0 flex flex-col items-center justify-center"
          aria-live="polite"
          aria-label={`${formatTime(secondsLeft)} remaining`}
        >
          <span className="text-5xl font-black text-[var(--text-primary)] tabular-nums">
            {formatTime(secondsLeft)}
          </span>
          <span className="text-sm text-[var(--text-muted)] mt-1 font-medium">
            {running ? '⏳ Focusing…' : done ? '✅ Done!' : '⏸ Paused'}
          </span>
        </div>
      </div>

      {/* Encouragement */}
      {running && (
        <p
          className="text-sm font-bold text-brand-purple animate-slide-up"
          aria-live="polite"
          key={encouragement}
        >
          {encouragement}
        </p>
      )}

      {done && (
        <div className="bg-green-50 dark:bg-green-900/20 border border-green-100 rounded-2xl p-4" aria-live="assertive">
          <p className="text-2xl font-black text-green-700 dark:text-green-300">🎉 Amazing Focus!</p>
          <p className="text-sm text-green-600 dark:text-green-400 mt-1">
            You focused for {selectedMinutes} {selectedMinutes === 1 ? 'minute' : 'minutes'}! That's incredible!
          </p>
        </div>
      )}

      {/* Controls */}
      <div className="flex gap-3 justify-center">
        {!done && (
          <button
            onClick={handlePause}
            aria-label={running ? 'Pause timer' : 'Resume timer'}
            className="flex items-center gap-2 px-6 py-3.5 bg-brand-purple text-white rounded-2xl font-bold hover:bg-brand-purple-dark transition-colors focus-visible:outline focus-visible:outline-3 focus-visible:outline-[var(--focus-ring)] min-h-[52px]"
          >
            {running ? <Pause size={20} aria-hidden="true" /> : <Play size={20} aria-hidden="true" />}
            {running ? 'Pause' : 'Resume'}
          </button>
        )}
        <button
          onClick={handleReset}
          aria-label="Reset timer"
          className="flex items-center gap-2 px-6 py-3.5 bg-gray-100 dark:bg-white/10 text-[var(--text-primary)] rounded-2xl font-bold hover:bg-gray-200 dark:hover:bg-white/20 transition-colors focus-visible:outline focus-visible:outline-3 focus-visible:outline-[var(--focus-ring)] min-h-[52px]"
        >
          <RotateCcw size={18} aria-hidden="true" /> Reset
        </button>
      </div>

      {/* Sessions */}
      {completedSessions > 0 && (
        <p className="text-xs text-[var(--text-muted)]">
          🔥 Sessions completed today: <strong>{completedSessions}</strong>
        </p>
      )}
    </div>
  )
}
