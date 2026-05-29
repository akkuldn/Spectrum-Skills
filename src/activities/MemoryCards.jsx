import React, { useState, useEffect, useCallback, useRef } from 'react'
import { RotateCcw, Timer } from 'lucide-react'

const CARD_SETS = {
  easy:   ['🐶','🐱','🐭','🐹','🐰','🦊'],
  medium: ['🐶','🐱','🐭','🐹','🐰','🦊','🐻','🐼'],
  hard:   ['🐶','🐱','🐭','🐹','🐰','🦊','🐻','🐼','🐨','🐯'],
}

const GRID_COLS = { easy: 'grid-cols-4', medium: 'grid-cols-4', hard: 'grid-cols-5' }

function shuffle(arr) {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

function makeCards(difficulty) {
  const emojis = CARD_SETS[difficulty] ?? CARD_SETS.medium
  const pairs = [...emojis, ...emojis]
  return shuffle(pairs).map((emoji, i) => ({
    id: i,
    emoji,
    flipped: false,
    matched: false,
  }))
}

export default function MemoryCards({ difficulty = 'medium', onComplete }) {
  const [cards, setCards] = useState(() => makeCards(difficulty))
  const [selected, setSelected] = useState([]) // up to 2 card ids
  const [moves, setMoves] = useState(0)
  const [matches, setMatches] = useState(0)
  const [locked, setLocked] = useState(false)
  const [elapsed, setElapsed] = useState(0)
  const [finished, setFinished] = useState(false)
  const timerRef = useRef(null)
  const total = (CARD_SETS[difficulty] ?? CARD_SETS.medium).length

  // Timer
  useEffect(() => {
    timerRef.current = setInterval(() => setElapsed(e => e + 1), 1000)
    return () => clearInterval(timerRef.current)
  }, [])

  useEffect(() => {
    if (finished) clearInterval(timerRef.current)
  }, [finished])

  const handleFlip = useCallback((id) => {
    if (locked || finished) return
    if (selected.includes(id)) return
    const card = cards.find(c => c.id === id)
    if (!card || card.flipped || card.matched) return

    const newSelected = [...selected, id]
    setCards(prev => prev.map(c => c.id === id ? { ...c, flipped: true } : c))
    setSelected(newSelected)

    if (newSelected.length === 2) {
      setMoves(m => m + 1)
      setLocked(true)
      const [a, b] = newSelected.map(sid => cards.find(c => c.id === sid))

      if (a.emoji === b.emoji) {
        // Match!
        setTimeout(() => {
          setCards(prev => prev.map(c =>
            c.id === newSelected[0] || c.id === newSelected[1]
              ? { ...c, matched: true }
              : c
          ))
          const newMatches = matches + 1
          setMatches(newMatches)
          setSelected([])
          setLocked(false)

          if (newMatches === total) {
            setFinished(true)
            // Score: fewer moves = better
            const perfectMoves = total
            const score = Math.max(0, Math.round(100 - ((moves + 1 - perfectMoves) / perfectMoves) * 50))
            const stars = score >= 85 ? 3 : score >= 60 ? 2 : 1
            onComplete({ stars, score })
          }
        }, 600)
      } else {
        // No match
        setTimeout(() => {
          setCards(prev => prev.map(c =>
            c.id === newSelected[0] || c.id === newSelected[1]
              ? { ...c, flipped: false }
              : c
          ))
          setSelected([])
          setLocked(false)
        }, 1000)
      }
    }
  }, [locked, finished, selected, cards, matches, moves, total, onComplete])

  function reset() {
    setCards(makeCards(difficulty))
    setSelected([])
    setMoves(0)
    setMatches(0)
    setLocked(false)
    setElapsed(0)
    setFinished(false)
    clearInterval(timerRef.current)
    timerRef.current = setInterval(() => setElapsed(e => e + 1), 1000)
  }

  const pct = Math.round((matches / total) * 100)
  const gridCols = GRID_COLS[difficulty] ?? GRID_COLS.medium

  return (
    <div className="max-w-lg mx-auto space-y-4">
      {/* Stats bar */}
      <div className="flex items-center justify-between bg-[var(--bg-card)] border border-[var(--border)] rounded-2xl px-4 py-3">
        <div className="flex items-center gap-1.5 text-sm font-bold text-[var(--text-secondary)]">
          <Timer size={16} aria-hidden="true" />
          <span aria-label={`${elapsed} seconds`}>{String(Math.floor(elapsed / 60)).padStart(2,'0')}:{String(elapsed % 60).padStart(2,'0')}</span>
        </div>
        <div className="text-center">
          <span className="text-brand-purple font-black text-lg" aria-label={`${matches} of ${total} pairs found`}>{matches}/{total}</span>
          <p className="text-xs text-[var(--text-muted)]">Pairs found</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="text-center">
            <span className="font-black text-lg text-[var(--text-primary)]" aria-label={`${moves} moves`}>{moves}</span>
            <p className="text-xs text-[var(--text-muted)]">Moves</p>
          </div>
          <button
            onClick={reset}
            aria-label="Restart game"
            className="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-white/10 transition-colors focus-visible:outline focus-visible:outline-3 focus-visible:outline-[var(--focus-ring)] min-h-[44px] min-w-[44px] flex items-center justify-center"
          >
            <RotateCcw size={18} aria-hidden="true" />
          </button>
        </div>
      </div>

      {/* Progress bar */}
      <div className="h-3 bg-gray-100 dark:bg-white/10 rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-brand-purple to-brand-blue rounded-full transition-all duration-500"
          style={{ width: `${pct}%` }}
          role="progressbar"
          aria-valuenow={matches}
          aria-valuemax={total}
          aria-label="Matching progress"
        />
      </div>

      {/* Card grid */}
      <div
        className={`grid ${gridCols} gap-2 sm:gap-3`}
        role="grid"
        aria-label="Memory card grid"
      >
        {cards.map(card => (
          <div
            key={card.id}
            role="gridcell"
            className="card-flip-container aspect-square"
          >
            <button
              onClick={() => handleFlip(card.id)}
              disabled={card.matched || card.flipped || locked || finished}
              aria-label={card.matched || card.flipped ? `${card.emoji} — ${card.matched ? 'matched' : 'revealed'}` : 'Hidden card'}
              aria-pressed={card.flipped || card.matched}
              className={`w-full h-full rounded-2xl border-2 focus-visible:outline focus-visible:outline-3 focus-visible:outline-[var(--focus-ring)] ${
                card.matched
                  ? 'border-green-300 cursor-default'
                  : card.flipped
                  ? 'border-brand-purple cursor-default'
                  : 'border-[var(--border)] hover:border-brand-purple/50 cursor-pointer hover:scale-105 transition-transform active:scale-95'
              }`}
            >
              <div className="card-flip-inner" style={{ transform: (card.flipped || card.matched) ? 'rotateY(180deg)' : 'none' }}>
                {/* Front (face-down) */}
                <div
                  className="card-face bg-gradient-to-br from-violet-100 to-blue-100 dark:from-violet-900/30 dark:to-blue-900/30 rounded-2xl"
                  aria-hidden="true"
                >
                  <span className="text-2xl select-none">❓</span>
                </div>
                {/* Back (face-up) */}
                <div
                  className={`card-face card-face-back rounded-2xl ${
                    card.matched
                      ? 'bg-green-50 dark:bg-green-900/20'
                      : 'bg-white dark:bg-night-850'
                  }`}
                  aria-hidden="true"
                >
                  <span className="text-3xl sm:text-4xl select-none">{card.emoji}</span>
                </div>
              </div>
            </button>
          </div>
        ))}
      </div>

      {/* Encouragement */}
      {matches > 0 && matches < total && (
        <p className="text-center text-sm font-semibold text-brand-purple animate-slide-up" aria-live="polite">
          {matches === 1 ? '🎉 Great start!' : matches < total / 2 ? '⭐ You\'re doing great!' : '🌟 Almost there!'}
        </p>
      )}
    </div>
  )
}
