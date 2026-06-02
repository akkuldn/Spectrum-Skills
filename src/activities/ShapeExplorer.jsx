import React, { useState, useMemo } from 'react'
import Button from '../components/ui/Button'

const SHAPES = [
  { name: 'Circle',    sides: 0, svg: <circle cx="24" cy="24" r="20" /> },
  { name: 'Square',    sides: 4, svg: <rect x="4" y="4" width="40" height="40" /> },
  { name: 'Triangle',  sides: 3, svg: <polygon points="24,4 44,44 4,44" /> },
  { name: 'Rectangle', sides: 4, svg: <rect x="2" y="10" width="44" height="28" /> },
  { name: 'Pentagon',  sides: 5, svg: <polygon points="24,3 45,18 37,43 11,43 3,18" /> },
  { name: 'Hexagon',   sides: 6, svg: <polygon points="24,3 43,13.5 43,34.5 24,45 5,34.5 5,13.5" /> },
  { name: 'Star',      sides: 5, svg: <polygon points="24,3 29,18 45,18 32,28 37,43 24,33 11,43 16,28 3,18 19,18" /> },
  { name: 'Diamond',   sides: 4, svg: <polygon points="24,3 45,24 24,45 3,24" /> },
  { name: 'Oval',      sides: 0, svg: <ellipse cx="24" cy="24" rx="20" ry="14" /> },
  { name: 'Heart',     sides: 0, svg: <path d="M24,42 C24,42 4,28 4,16 C4,9 9,5 14,5 C18,5 22,8 24,11 C26,8 30,5 34,5 C39,5 44,9 44,16 C44,28 24,42 24,42 Z" /> },
]

const COLORS = ['#9B89C4','#7BB3D0','#86C5A3','#F0A882','#D4A5C7','#F5D78E','#F08080','#7EC8C8']

const SETTINGS = {
  easy:   { pool: SHAPES.slice(0, 5),  gridCount: 6,  rounds: 5 },
  medium: { pool: SHAPES.slice(0, 8),  gridCount: 9,  rounds: 6 },
}

function shuffle(arr) {
  const a = [...arr]; for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1));[a[i], a[j]] = [a[j], a[i]] }; return a
}

function makeRound(pool, gridCount) {
  const target = pool[Math.floor(Math.random() * pool.length)]
  const targetColor = COLORS[Math.floor(Math.random() * COLORS.length)]

  const cells = []
  const targetIdx = Math.floor(Math.random() * gridCount)

  for (let i = 0; i < gridCount; i++) {
    const shape = i === targetIdx
      ? target
      : (() => { const others = pool.filter(s => s.name !== target.name); return others[Math.floor(Math.random() * others.length)] })()
    const color = COLORS[Math.floor(Math.random() * COLORS.length)]
    cells.push({ id: i, shape, color, isTarget: i === targetIdx })
  }

  return { target, targetColor, cells }
}

function ShapeSVG({ svg, color, size = 48 }) {
  return (
    <svg viewBox="0 0 48 48" width={size} height={size} aria-hidden="true">
      {React.cloneElement(svg, { fill: color, stroke: 'none' })}
    </svg>
  )
}

export default function ShapeExplorer({ difficulty = 'easy', onComplete }) {
  const cfg = SETTINGS[difficulty] ?? SETTINGS.easy
  const [round, setRound] = useState(1)
  const [found, setFound] = useState(false)
  const [wrong, setWrong] = useState(null)
  const [score, setScore] = useState(0)
  const [roundData, setRoundData] = useState(() => makeRound(cfg.pool, cfg.gridCount))

  function handleTap(cell) {
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
          setRoundData(makeRound(cfg.pool, cfg.gridCount))
        } else {
          const pct = Math.round((newScore / cfg.rounds) * 100)
          onComplete({ stars: pct >= 85 ? 3 : pct >= 60 ? 2 : 1, score: pct })
        }
      }, 800)
    } else {
      setWrong(cell.id)
      setTimeout(() => setWrong(null), 500)
    }
  }

  const cols = difficulty === 'easy' ? 3 : 3
  const progPct = Math.round(((round - 1) / cfg.rounds) * 100)

  return (
    <div className="max-w-sm mx-auto space-y-4">
      {/* Progress */}
      <div className="flex items-center gap-3">
        <div className="flex-1 h-2.5 bg-gray-100 dark:bg-white/10 rounded-full overflow-hidden">
          <div className="h-full bg-gradient-to-r from-yellow-400 to-amber-400 rounded-full transition-all duration-500" style={{ width: `${progPct}%` }} role="progressbar" aria-valuenow={round - 1} aria-valuemax={cfg.rounds} />
        </div>
        <span className="text-sm font-bold text-[var(--text-muted)]">{round}/{cfg.rounds}</span>
        <span className="text-sm font-bold text-brand-yellow">⭐ {score}</span>
      </div>

      {/* Target */}
      <div className="flex items-center justify-center gap-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 rounded-2xl p-4">
        <div className="text-center">
          <p className="text-xs font-bold text-yellow-600 mb-2">Find this shape:</p>
          <div className="flex items-center justify-center">
            <ShapeSVG svg={roundData.target.svg} color={roundData.targetColor} size={64} />
          </div>
          <p className="text-sm font-bold text-yellow-700 mt-1">{roundData.target.name}</p>
        </div>
        {found && <p className="text-green-600 font-bold animate-slide-up">✅ Found it!</p>}
      </div>

      {/* Grid */}
      <div
        className="grid gap-3"
        style={{ gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))` }}
        role="grid"
        aria-label="Shape grid"
      >
        {roundData.cells.map(cell => (
          <button
            key={cell.id}
            onClick={() => handleTap(cell)}
            disabled={found}
            aria-label={`${cell.shape.name} shape${cell.isTarget && found ? ' — found!' : ''}`}
            className={`aspect-square flex items-center justify-center rounded-2xl border-2 transition-all focus-visible:outline focus-visible:outline-3 focus-visible:outline-[var(--focus-ring)] ${
              cell.isTarget && found
                ? 'bg-green-100 dark:bg-green-900/30 border-green-400 scale-110 ring-2 ring-green-400'
                : wrong === cell.id
                ? 'bg-red-100 dark:bg-red-900/20 border-red-300 scale-90'
                : 'bg-[var(--bg-card)] border-[var(--border)] hover:scale-110 hover:border-yellow-400/60 cursor-pointer'
            }`}
          >
            <ShapeSVG svg={cell.shape.svg} color={cell.color} size={40} />
          </button>
        ))}
      </div>
    </div>
  )
}
