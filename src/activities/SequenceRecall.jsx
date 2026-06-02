import React, { useState, useEffect, useRef, useCallback } from 'react'
import { RotateCcw } from 'lucide-react'
import Button from '../components/ui/Button'

const COLORS = [
  { id: 0, bg: 'bg-red-400',    active: 'bg-red-200',    label: 'Red',    emoji: '🔴' },
  { id: 1, bg: 'bg-blue-400',   active: 'bg-blue-200',   label: 'Blue',   emoji: '🔵' },
  { id: 2, bg: 'bg-yellow-400', active: 'bg-yellow-200', label: 'Yellow', emoji: '🟡' },
  { id: 3, bg: 'bg-green-400',  active: 'bg-green-200',  label: 'Green',  emoji: '🟢' },
  { id: 4, bg: 'bg-purple-400', active: 'bg-purple-200', label: 'Purple', emoji: '🟣' },
  { id: 5, bg: 'bg-orange-400', active: 'bg-orange-200', label: 'Orange', emoji: '🟠' },
]

const SETTINGS = {
  easy:   { colors: 4, startLen: 2, rounds: 5,  speed: 700 },
  medium: { colors: 5, startLen: 3, rounds: 7,  speed: 600 },
  hard:   { colors: 6, startLen: 4, rounds: 9,  speed: 500 },
}

function makeSequence(len, numColors) {
  return Array.from({ length: len }, () => Math.floor(Math.random() * numColors))
}

export default function SequenceRecall({ difficulty = 'medium', onComplete }) {
  const cfg = SETTINGS[difficulty] ?? SETTINGS.medium
  const colors = COLORS.slice(0, cfg.colors)

  const [phase, setPhase]         = useState('intro')   // intro | showing | input | correct | wrong | done
  const [sequence, setSequence]   = useState([])
  const [round, setRound]         = useState(1)
  const [lit, setLit]             = useState(null)
  const [userInput, setUserInput] = useState([])
  const [score, setScore]         = useState(0)
  const [lastWrong, setLastWrong] = useState(false)
  const timerRef = useRef(null)

  const showSequence = useCallback((seq) => {
    setPhase('showing')
    setUserInput([])
    let i = 0
    function step() {
      if (i < seq.length) {
        setLit(seq[i])
        i++
        timerRef.current = setTimeout(() => {
          setLit(null)
          timerRef.current = setTimeout(step, 200)
        }, cfg.speed)
      } else {
        setPhase('input')
      }
    }
    timerRef.current = setTimeout(step, 600)
  }, [cfg.speed])

  function startRound(r) {
    const len = cfg.startLen + r - 1
    const seq = makeSequence(len, cfg.colors)
    setSequence(seq)
    setRound(r)
    showSequence(seq)
  }

  function handleStart() {
    startRound(1)
    setScore(0)
  }

  function handleTap(colorId) {
    if (phase !== 'input') return
    const newInput = [...userInput, colorId]
    setUserInput(newInput)
    const idx = newInput.length - 1

    if (colorId !== sequence[idx]) {
      setLastWrong(true)
      setPhase('wrong')
      setTimeout(() => {
        setLastWrong(false)
        if (round < cfg.rounds) {
          startRound(round + 1)
        } else {
          finishGame(score)
        }
      }, 1500)
      return
    }

    if (newInput.length === sequence.length) {
      const newScore = score + 1
      setScore(newScore)
      setPhase('correct')
      setTimeout(() => {
        if (round < cfg.rounds) {
          startRound(round + 1)
        } else {
          finishGame(newScore)
        }
      }, 1000)
    }
  }

  function finishGame(finalScore) {
    setPhase('done')
    const pct = Math.round((finalScore / cfg.rounds) * 100)
    const stars = pct >= 85 ? 3 : pct >= 60 ? 2 : 1
    onComplete({ stars, score: pct })
  }

  useEffect(() => () => clearTimeout(timerRef.current), [])

  const progPct = Math.round(((round - 1) / cfg.rounds) * 100)

  if (phase === 'intro') {
    return (
      <div className="max-w-sm mx-auto text-center space-y-6 py-4">
        <div className="text-6xl" aria-hidden="true">🔢</div>
        <h2 className="text-xl font-black text-[var(--text-primary)]">Ready to play?</h2>
        <p className="text-[var(--text-secondary)] text-sm">Watch the colors light up, then tap them in the <strong>same order</strong>!</p>
        <div className="grid grid-cols-3 gap-2 max-w-xs mx-auto">
          {colors.map(c => (
            <div key={c.id} className={`${c.bg} h-12 rounded-2xl opacity-80`} aria-hidden="true" />
          ))}
        </div>
        <Button fullWidth size="lg" onClick={handleStart}>Start!</Button>
      </div>
    )
  }

  return (
    <div className="max-w-sm mx-auto space-y-5">
      {/* Progress */}
      <div className="flex items-center gap-3">
        <div className="flex-1 h-2.5 bg-gray-100 dark:bg-white/10 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-brand-purple to-brand-blue rounded-full transition-all duration-500"
            style={{ width: `${progPct}%` }}
            role="progressbar" aria-valuenow={round - 1} aria-valuemax={cfg.rounds}
            aria-label="Round progress"
          />
        </div>
        <span className="text-sm font-bold text-[var(--text-muted)]">Round {round}/{cfg.rounds}</span>
        <span className="text-sm font-bold text-brand-yellow">⭐ {score}</span>
      </div>

      {/* Status */}
      <div className="text-center py-2" aria-live="polite">
        {phase === 'showing' && (
          <p className="text-sm font-bold text-[var(--text-secondary)] animate-pulse">👀 Watch the sequence…</p>
        )}
        {phase === 'input' && (
          <p className="text-sm font-bold text-brand-purple">🎯 Your turn! Tap {sequence.length - userInput.length} more</p>
        )}
        {phase === 'correct' && (
          <p className="text-sm font-bold text-green-600">✅ Correct! Well done!</p>
        )}
        {phase === 'wrong' && (
          <p className="text-sm font-bold text-orange-500">💙 Oops! Let's try the next one</p>
        )}
      </div>

      {/* Color buttons */}
      <div className="grid grid-cols-3 gap-3" role="group" aria-label="Color buttons">
        {colors.map(c => {
          const isLit = lit === c.id
          return (
            <button
              key={c.id}
              onClick={() => handleTap(c.id)}
              disabled={phase !== 'input'}
              aria-label={`${c.label} button`}
              className={`h-20 rounded-3xl border-2 transition-all duration-150 focus-visible:outline focus-visible:outline-3 focus-visible:outline-[var(--focus-ring)] ${
                isLit
                  ? `${c.active} border-white scale-105 shadow-lg`
                  : phase === 'input'
                  ? `${c.bg} border-transparent hover:scale-105 active:scale-95 cursor-pointer opacity-90`
                  : `${c.bg} border-transparent opacity-60 cursor-default`
              }`}
            >
              <span className="text-2xl" aria-hidden="true">{c.emoji}</span>
            </button>
          )
        })}
      </div>

      {/* Input progress dots */}
      <div className="flex justify-center gap-2" aria-label={`${userInput.length} of ${sequence.length} tapped`}>
        {sequence.map((_, i) => (
          <div
            key={i}
            className={`w-3 h-3 rounded-full transition-all ${
              i < userInput.length ? 'bg-brand-purple scale-110' : 'bg-gray-200 dark:bg-white/20'
            }`}
          />
        ))}
      </div>
    </div>
  )
}
