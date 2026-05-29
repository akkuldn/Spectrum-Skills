import React, { useState, useEffect, useRef, useCallback } from 'react'

const PATTERNS = {
  easy: {
    name: 'Simple Breathing',
    emoji: '🌬️',
    description: 'Breathe in for 4, out for 4',
    rounds: 5,
    phases: [
      { label: 'Breathe In…', duration: 4000, scale: 1.0, color: '#9B89C4' },
      { label: 'Breathe Out…', duration: 4000, scale: 0.65, color: '#7BB3D0' },
    ],
  },
  medium: {
    name: 'Box Breathing',
    emoji: '📦',
    description: 'In 4 · Hold 4 · Out 4 · Hold 4',
    rounds: 4,
    phases: [
      { label: 'Breathe In…', duration: 4000, scale: 1.0, color: '#9B89C4' },
      { label: 'Hold…',        duration: 4000, scale: 1.0, color: '#86C5A3' },
      { label: 'Breathe Out…', duration: 4000, scale: 0.65, color: '#7BB3D0' },
      { label: 'Hold…',        duration: 4000, scale: 0.65, color: '#86C5A3' },
    ],
  },
  hard: {
    name: 'Calming Breath',
    emoji: '🌊',
    description: 'In 4 · Hold 7 · Out 8',
    rounds: 4,
    phases: [
      { label: 'Breathe In…', duration: 4000, scale: 1.0,  color: '#9B89C4' },
      { label: 'Hold…',        duration: 7000, scale: 1.0,  color: '#86C5A3' },
      { label: 'Breathe Out…', duration: 8000, scale: 0.65, color: '#7BB3D0' },
    ],
  },
}

export default function BreathingExercise({ difficulty = 'easy', onComplete }) {
  const pattern = PATTERNS[difficulty] ?? PATTERNS.easy
  const [phase, setPhase] = useState(0)         // index into pattern.phases
  const [round, setRound] = useState(0)          // 0-indexed
  const [running, setRunning] = useState(false)
  const [done, setDone] = useState(false)
  const [countdown, setCountdown] = useState(null)
  const rafRef = useRef(null)
  const startRef = useRef(null)
  const phaseRef = useRef(0)
  const roundRef = useRef(0)

  const totalRounds = pattern.rounds
  const currentPhase = pattern.phases[phase]

  // Countdown within current phase
  useEffect(() => {
    if (!running || done) return
    const dur = currentPhase.duration
    setCountdown(Math.ceil(dur / 1000))
    const start = Date.now()

    const tick = () => {
      const elapsed = Date.now() - start
      const remaining = Math.max(0, Math.ceil((dur - elapsed) / 1000))
      setCountdown(remaining)
      if (elapsed < dur) {
        rafRef.current = requestAnimationFrame(tick)
      }
    }
    rafRef.current = requestAnimationFrame(tick)

    const timer = setTimeout(() => {
      // Advance phase
      const nextPhase = (phaseRef.current + 1) % pattern.phases.length
      if (nextPhase === 0) {
        // completed a full round
        const nextRound = roundRef.current + 1
        roundRef.current = nextRound
        setRound(nextRound)
        if (nextRound >= totalRounds) {
          setDone(true)
          setRunning(false)
          onComplete({ stars: 3, score: 100 })
          return
        }
      }
      phaseRef.current = nextPhase
      setPhase(nextPhase)
    }, dur)

    return () => {
      clearTimeout(timer)
      cancelAnimationFrame(rafRef.current)
    }
  }, [running, phase, done, currentPhase.duration, pattern.phases.length, totalRounds, onComplete])

  function start() {
    phaseRef.current = 0
    roundRef.current = 0
    setPhase(0)
    setRound(0)
    setDone(false)
    setRunning(true)
  }

  function stop() {
    setRunning(false)
    cancelAnimationFrame(rafRef.current)
  }

  const progress = (round / totalRounds) * 100

  return (
    <div className="max-w-md mx-auto text-center space-y-6 py-4">
      {/* Title */}
      <div>
        <h2 className="text-2xl font-black text-[var(--text-primary)]">
          {pattern.emoji} {pattern.name}
        </h2>
        <p className="text-[var(--text-secondary)] mt-1 text-sm">{pattern.description}</p>
      </div>

      {/* Round progress */}
      <div className="flex justify-center gap-2" aria-label={`Round ${round + 1} of ${totalRounds}`}>
        {Array.from({ length: totalRounds }).map((_, i) => (
          <div
            key={i}
            className={`h-2.5 rounded-full transition-all duration-500 ${
              i < round ? 'bg-brand-green w-8' :
              i === round && running ? 'bg-brand-purple w-8' :
              'bg-gray-200 dark:bg-white/20 w-5'
            }`}
            aria-hidden="true"
          />
        ))}
      </div>

      {/* Breathing circle */}
      <div className="relative flex items-center justify-center py-8">
        {/* Outer ripple */}
        {running && (
          <div
            className="absolute rounded-full border-4 border-brand-purple/20 transition-all"
            style={{
              width: `${currentPhase.scale * 220 + 40}px`,
              height: `${currentPhase.scale * 220 + 40}px`,
              transitionDuration: `${currentPhase.duration}ms`,
              transitionTimingFunction: 'ease-in-out',
            }}
            aria-hidden="true"
          />
        )}

        {/* Main bubble */}
        <div
          className="relative rounded-full flex flex-col items-center justify-center shadow-soft transition-all select-none"
          style={{
            width: '200px',
            height: '200px',
            background: running
              ? `radial-gradient(circle, ${currentPhase.color}40, ${currentPhase.color})`
              : 'radial-gradient(circle, #C4B5F560, #9B89C4)',
            transform: running ? `scale(${currentPhase.scale})` : 'scale(0.8)',
            transitionDuration: running ? `${currentPhase.duration}ms` : '0.5s',
            transitionTimingFunction: 'ease-in-out',
          }}
          aria-live="polite"
          aria-label={running ? currentPhase.label : 'Ready to begin'}
        >
          {running ? (
            <>
              <span className="text-white font-black text-2xl">{countdown}</span>
              <span className="text-white/90 font-bold text-sm mt-1 px-4 text-center leading-tight">
                {currentPhase.label}
              </span>
            </>
          ) : done ? (
            <span className="text-4xl">🌟</span>
          ) : (
            <span className="text-white font-bold text-sm">Tap to begin</span>
          )}
        </div>
      </div>

      {/* Instruction text */}
      {running && (
        <p
          className="text-xl font-black text-[var(--text-primary)] animate-slide-up"
          aria-live="assertive"
          aria-atomic="true"
        >
          {currentPhase.label}
        </p>
      )}

      {!running && !done && (
        <div className="text-[var(--text-secondary)] text-sm">
          <p>Follow the bubble and breathe with it.</p>
          <p className="mt-1">You'll do <strong>{totalRounds} rounds</strong>.</p>
        </div>
      )}

      {done && (
        <div className="bg-green-50 dark:bg-green-900/20 border border-green-100 rounded-2xl p-4">
          <p className="font-black text-green-700 dark:text-green-300 text-lg">🎉 Well done!</p>
          <p className="text-green-600 dark:text-green-400 text-sm mt-1">You completed {totalRounds} breathing rounds. You should feel calmer now.</p>
        </div>
      )}

      {/* Controls */}
      <div className="flex gap-3 justify-center">
        {!running && !done && (
          <button
            onClick={start}
            className="px-10 py-4 bg-brand-purple text-white rounded-2xl font-black text-lg hover:bg-brand-purple-dark transition-colors focus-visible:outline focus-visible:outline-3 focus-visible:outline-[var(--focus-ring)] shadow-glow"
          >
            Start 🌬️
          </button>
        )}
        {running && (
          <button
            onClick={stop}
            className="px-8 py-3 bg-gray-200 dark:bg-white/20 text-[var(--text-primary)] rounded-2xl font-bold hover:bg-gray-300 dark:hover:bg-white/30 transition-colors focus-visible:outline focus-visible:outline-3 focus-visible:outline-[var(--focus-ring)]"
          >
            Pause ⏸️
          </button>
        )}
        {(done || (!running && round > 0)) && (
          <button
            onClick={start}
            className="px-8 py-3 bg-brand-purple text-white rounded-2xl font-bold hover:bg-brand-purple-dark transition-colors focus-visible:outline focus-visible:outline-3 focus-visible:outline-[var(--focus-ring)]"
          >
            ↺ Again
          </button>
        )}
      </div>

      {/* Tip */}
      <p className="text-xs text-[var(--text-muted)] max-w-xs mx-auto">
        💡 Try to breathe through your nose if you can. It's okay to go at your own pace.
      </p>
    </div>
  )
}
