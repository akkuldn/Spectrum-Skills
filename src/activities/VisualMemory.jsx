import React, { useState, useEffect, useRef } from 'react'
import Button from '../components/ui/Button'

const ITEMS = ['🐶','🐱','🐸','🦊','🐼','🦋','🌺','🍎','⭐','🌙','🚂','🎈','🏠','🌈','🍦','🎸','🦁','🐧','🌻','🎀']

const SETTINGS = {
  easy:   { cols: 3, rows: 3, shown: 3, showTime: 3000, rounds: 4 },
  medium: { cols: 4, rows: 3, shown: 5, showTime: 3000, rounds: 5 },
  hard:   { cols: 4, rows: 4, shown: 7, showTime: 2500, rounds: 6 },
}

function shuffle(arr) {
  const a = [...arr]; for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1));[a[i], a[j]] = [a[j], a[i]] }; return a
}

function makeGrid(cols, rows, shown) {
  const total = cols * rows
  const items = shuffle(ITEMS).slice(0, total).map((emoji, i) => ({ id: i, emoji, hasTarget: false, revealed: false, found: false, wrong: false }))
  const targetIndices = shuffle([...Array(total).keys()]).slice(0, shown)
  targetIndices.forEach(i => { items[i].hasTarget = true })
  return items
}

export default function VisualMemory({ difficulty = 'medium', onComplete }) {
  const cfg = SETTINGS[difficulty] ?? SETTINGS.medium
  const [phase, setPhase]   = useState('peek')   // peek | recall | roundEnd | done
  const [grid, setGrid]     = useState(() => makeGrid(cfg.cols, cfg.rows, cfg.shown))
  const [round, setRound]   = useState(1)
  const [found, setFound]   = useState(0)
  const [errors, setErrors] = useState(0)
  const [totalScore, setTotalScore] = useState(0)
  const timerRef = useRef(null)

  useEffect(() => {
    if (phase === 'peek') {
      timerRef.current = setTimeout(() => setPhase('recall'), cfg.showTime)
    }
    return () => clearTimeout(timerRef.current)
  }, [phase, cfg.showTime])

  function handleCellClick(id) {
    if (phase !== 'recall') return
    setGrid(prev => {
      const cell = prev.find(c => c.id === id)
      if (!cell || cell.found || cell.wrong || cell.revealed) return prev

      if (cell.hasTarget) {
        const newFound = found + 1
        setFound(newFound)
        const updated = prev.map(c => c.id === id ? { ...c, found: true } : c)
        if (newFound === cfg.shown) {
          const roundScore = Math.max(0, cfg.shown - errors)
          const newTotal = totalScore + roundScore
          setTotalScore(newTotal)
          setTimeout(() => {
            if (round < cfg.rounds) {
              setRound(r => r + 1)
              setGrid(makeGrid(cfg.cols, cfg.rows, cfg.shown))
              setFound(0)
              setErrors(0)
              setPhase('peek')
            } else {
              const pct = Math.round((newTotal / (cfg.shown * cfg.rounds)) * 100)
              const stars = pct >= 85 ? 3 : pct >= 60 ? 2 : 1
              onComplete({ stars, score: pct })
            }
          }, 800)
        }
        return updated
      } else {
        setErrors(e => e + 1)
        return prev.map(c => c.id === id ? { ...c, wrong: true } : c)
      }
    })
  }

  const progPct = Math.round(((round - 1) / cfg.rounds) * 100)

  return (
    <div className="max-w-sm mx-auto space-y-4">
      {/* Progress */}
      <div className="flex items-center gap-3">
        <div className="flex-1 h-2.5 bg-gray-100 dark:bg-white/10 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-violet-400 to-blue-400 rounded-full transition-all duration-500"
            style={{ width: `${progPct}%` }}
            role="progressbar" aria-valuenow={round - 1} aria-valuemax={cfg.rounds}
          />
        </div>
        <span className="text-sm font-bold text-[var(--text-muted)]">Round {round}/{cfg.rounds}</span>
      </div>

      {/* Status */}
      <div className="text-center" aria-live="polite">
        {phase === 'peek' ? (
          <p className="text-sm font-bold text-brand-purple animate-pulse">
            👁️ Memorise the highlighted items!
          </p>
        ) : (
          <p className="text-sm font-bold text-[var(--text-secondary)]">
            🎯 Tap the {cfg.shown} items you saw! ({found}/{cfg.shown} found)
          </p>
        )}
      </div>

      {/* Grid */}
      <div
        className="grid gap-2"
        style={{ gridTemplateColumns: `repeat(${cfg.cols}, minmax(0, 1fr))` }}
        role="grid"
        aria-label="Memory grid"
      >
        {grid.map(cell => {
          const isShowing = phase === 'peek' && cell.hasTarget
          return (
            <button
              key={cell.id}
              onClick={() => handleCellClick(cell.id)}
              disabled={phase !== 'recall' || cell.found || cell.wrong}
              aria-label={cell.found ? `${cell.emoji} found` : cell.wrong ? 'wrong' : 'hidden cell'}
              className={`aspect-square rounded-2xl border-2 text-2xl flex items-center justify-center transition-all duration-300 focus-visible:outline focus-visible:outline-3 focus-visible:outline-[var(--focus-ring)] ${
                isShowing
                  ? 'border-brand-purple bg-violet-100 dark:bg-violet-900/40 scale-105 shadow-md'
                  : cell.found
                  ? 'border-green-400 bg-green-50 dark:bg-green-900/30'
                  : cell.wrong
                  ? 'border-red-400 bg-red-50 dark:bg-red-900/20'
                  : phase === 'recall'
                  ? 'border-[var(--border)] bg-[var(--bg-card)] hover:border-brand-purple/50 hover:scale-105 cursor-pointer'
                  : 'border-[var(--border)] bg-gray-100 dark:bg-white/5 cursor-default'
              }`}
            >
              {(isShowing || cell.found || cell.wrong || phase === 'recall') ? (
                <span aria-hidden="true">
                  {cell.found ? '✅' : cell.wrong ? '❌' : phase === 'recall' ? cell.emoji : ''}
                </span>
              ) : (
                <span className="text-[var(--text-muted)] text-lg" aria-hidden="true">❓</span>
              )}
            </button>
          )
        })}
      </div>

      {errors > 0 && (
        <p className="text-center text-xs text-orange-500 font-semibold" aria-live="polite">
          {errors} {errors === 1 ? 'mistake' : 'mistakes'} — keep going! 💙
        </p>
      )}
    </div>
  )
}
