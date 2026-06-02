import React, { useState, useMemo, useCallback } from 'react'
import Button from '../components/ui/Button'

const EMOJI_POOL = [
  '🐶','🐱','🐸','🦊','🐼','🦋','🌺','🍎','⭐','🌙',
  '🚂','🎈','🏠','🌈','🍦','🎸','🦁','🐧','🌻','🎀',
  '🍕','🦄','🐉','🌴','🎯','🦀','🍉','🎃','🦜','🌊',
]

const SETTINGS = {
  easy:   { gridSize: 4, rounds: 5, timeLimit: 0 },
  medium: { gridSize: 5, rounds: 7, timeLimit: 0 },
  hard:   { gridSize: 6, rounds: 8, timeLimit: 0 },
}

function shuffle(arr) {
  const a = [...arr]; for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1));[a[i], a[j]] = [a[j], a[i]] }; return a
}

function makeRound(gridSize) {
  const pool = shuffle(EMOJI_POOL)
  const target = pool[0]
  const distractors = pool.slice(1)
  const total = gridSize * gridSize
  const positions = shuffle([...Array(total).keys()])
  const targetIdx = positions[0]
  const cells = []
  let distIdx = 0
  for (let i = 0; i < total; i++) {
    cells.push({ id: i, emoji: i === targetIdx ? target : distractors[distIdx++ % distractors.length], isTarget: i === targetIdx })
  }
  return { target, cells, gridSize }
}

export default function VisualScan({ difficulty = 'medium', onComplete }) {
  const cfg = SETTINGS[difficulty] ?? SETTINGS.medium
  const [round, setRound] = useState(1)
  const [found, setFound] = useState(false)
  const [wrong, setWrong] = useState(null)
  const [score, setScore] = useState(0)
  const [roundData, setRoundData] = useState(() => makeRound(cfg.gridSize))

  const handleTap = useCallback((cell) => {
    if (found) return
    if (cell.isTarget) {
      setFound(true)
      const newScore = score + 1
      setScore(newScore)
      setTimeout(() => {
        if (round < cfg.rounds) {
          setRound(r => r + 1)
          setFound(false)
          setWrong(null)
          setRoundData(makeRound(cfg.gridSize))
        } else {
          const pct = Math.round((newScore / cfg.rounds) * 100)
          const stars = pct >= 85 ? 3 : pct >= 60 ? 2 : 1
          onComplete({ stars, score: pct })
        }
      }, 800)
    } else {
      setWrong(cell.id)
      setTimeout(() => setWrong(null), 500)
    }
  }, [found, score, round, cfg])

  const progPct = Math.round(((round - 1) / cfg.rounds) * 100)

  return (
    <div className="max-w-sm mx-auto space-y-4">
      {/* Progress */}
      <div className="flex items-center gap-3">
        <div className="flex-1 h-2.5 bg-gray-100 dark:bg-white/10 rounded-full overflow-hidden">
          <div className="h-full bg-gradient-to-r from-sky-400 to-cyan-400 rounded-full transition-all duration-500" style={{ width: `${progPct}%` }} role="progressbar" aria-valuenow={round - 1} aria-valuemax={cfg.rounds} />
        </div>
        <span className="text-sm font-bold text-[var(--text-muted)]">{round}/{cfg.rounds}</span>
        <span className="text-sm font-bold text-brand-yellow">⭐ {score}</span>
      </div>

      {/* Target */}
      <div className="flex items-center justify-center gap-4 bg-sky-50 dark:bg-sky-900/20 border border-sky-200 rounded-2xl p-4">
        <div>
          <p className="text-xs font-bold text-sky-600 mb-1">Find this:</p>
          <div className="text-5xl" aria-label={`Find: ${roundData.target}`} aria-hidden="false">{roundData.target}</div>
        </div>
        {found && <p className="text-green-600 font-bold animate-slide-up">✅ Found it!</p>}
      </div>

      {/* Grid */}
      <div
        className="grid gap-1.5"
        style={{ gridTemplateColumns: `repeat(${roundData.gridSize}, minmax(0, 1fr))` }}
        role="grid"
        aria-label="Search grid"
      >
        {roundData.cells.map(cell => (
          <button
            key={cell.id}
            onClick={() => handleTap(cell)}
            disabled={found}
            aria-label={cell.isTarget && found ? `${cell.emoji} — found!` : `cell ${cell.id + 1}`}
            className={`aspect-square text-xl sm:text-2xl flex items-center justify-center rounded-xl border transition-all focus-visible:outline focus-visible:outline-2 focus-visible:outline-[var(--focus-ring)] ${
              cell.isTarget && found
                ? 'bg-green-100 dark:bg-green-900/30 border-green-400 scale-110 ring-2 ring-green-400'
                : wrong === cell.id
                ? 'bg-red-100 dark:bg-red-900/20 border-red-300 scale-90'
                : 'bg-[var(--bg-card)] border-[var(--border)] hover:scale-110 hover:border-brand-purple/50 cursor-pointer'
            }`}
          >
            <span aria-hidden="true">{cell.emoji}</span>
          </button>
        ))}
      </div>
    </div>
  )
}
