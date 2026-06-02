import React, { useState, useMemo } from 'react'
import Button from '../components/ui/Button'
import { ChevronRight } from 'lucide-react'

const SCENES = [
  {
    label: 'Farm',
    grid: ['🐄','🐔','🌾','🏚️','🌻','🐑','🚜','🌳','🍎'],
    diffs: { 4: '🌷', 6: '🚗', 8: '🍊' },
  },
  {
    label: 'Ocean',
    grid: ['🐠','🐚','🌊','🦀','🐙','🐬','⭐','🪸','🦈'],
    diffs: { 1: '🐡', 4: '🦑', 7: '🌺' },
  },
  {
    label: 'Space',
    grid: ['🚀','⭐','🌙','🪐','☀️','🌟','👨‍🚀','🛸','🌌'],
    diffs: { 2: '🌍', 5: '💫', 8: '🌠' },
  },
  {
    label: 'Jungle',
    grid: ['🦁','🌿','🐒','🌺','🦜','🍌','🐊','🌴','🦋'],
    diffs: { 0: '🐯', 3: '🌸', 6: '🦎' },
  },
  {
    label: 'Winter',
    grid: ['⛄','❄️','🏔️','🎿','🦊','🐺','🏠','🌨️','🎁'],
    diffs: { 4: '🐻', 7: '⚡', 8: '🎄' },
  },
]

const COUNT = { easy: 2, medium: 3, hard: 3 }

export default function SpotDifference({ difficulty = 'medium', onComplete }) {
  const totalQuestions = difficulty === 'hard' ? 5 : 4
  const diffCount = COUNT[difficulty] ?? 3

  const questions = useMemo(() => {
    const shuffled = [...SCENES].sort(() => Math.random() - 0.5).slice(0, totalQuestions)
    return shuffled.map(s => {
      const diffIndices = Object.keys(s.diffs).map(Number).slice(0, diffCount)
      return { ...s, activeDiffs: diffIndices }
    })
  }, [totalQuestions, diffCount])

  const [qIdx, setQIdx]         = useState(0)
  const [found, setFound]       = useState(new Set())
  const [wrongClicks, setWrongClicks] = useState(new Set())
  const [score, setScore]       = useState(0)

  const q = questions[qIdx]

  function handleClick(side, cellIdx) {
    if (side === 'left') {
      if (!found.has(cellIdx) && !wrongClicks.has(cellIdx)) {
        setWrongClicks(prev => new Set([...prev, cellIdx]))
      }
      return
    }
    if (found.has(cellIdx)) return
    if (q.activeDiffs.includes(cellIdx)) {
      const newFound = new Set([...found, cellIdx])
      setFound(newFound)
      if (newFound.size === q.activeDiffs.length) {
        const newScore = score + 1
        setScore(newScore)
        setTimeout(() => advance(newScore), 700)
      }
    } else {
      setWrongClicks(prev => new Set([...prev, cellIdx + 100]))
      setTimeout(() => setWrongClicks(prev => { const n = new Set(prev); n.delete(cellIdx + 100); return n }), 600)
    }
  }

  function advance(s) {
    if (qIdx + 1 >= totalQuestions) {
      const pct = Math.round((s / totalQuestions) * 100)
      const stars = pct >= 85 ? 3 : pct >= 60 ? 2 : 1
      onComplete({ stars, score: pct })
    } else {
      setQIdx(i => i + 1)
      setFound(new Set())
      setWrongClicks(new Set())
    }
  }

  const progPct = Math.round((qIdx / totalQuestions) * 100)

  return (
    <div className="max-w-2xl mx-auto space-y-4">
      {/* Progress */}
      <div className="flex items-center gap-3">
        <div className="flex-1 h-2.5 bg-gray-100 dark:bg-white/10 rounded-full overflow-hidden">
          <div className="h-full bg-gradient-to-r from-sky-400 to-blue-500 rounded-full transition-all duration-500" style={{ width: `${progPct}%` }} role="progressbar" aria-valuenow={qIdx} aria-valuemax={totalQuestions} />
        </div>
        <span className="text-sm font-bold text-[var(--text-muted)]">{qIdx + 1}/{totalQuestions}</span>
      </div>

      <p className="text-center text-sm font-bold text-[var(--text-secondary)]">
        🔍 Find <span className="text-brand-purple">{q.activeDiffs.length - found.size}</span> more difference{q.activeDiffs.length - found.size !== 1 ? 's' : ''} — tap the <strong>right</strong> picture
      </p>

      {/* Two scenes side by side */}
      <div className="grid grid-cols-2 gap-3">
        {['left', 'right'].map(side => (
          <div key={side}>
            <p className="text-center text-xs font-bold text-[var(--text-muted)] mb-1.5">{side === 'left' ? 'Picture 1' : 'Picture 2'}</p>
            <div className="grid grid-cols-3 gap-1.5 p-3 rounded-2xl bg-[var(--bg-card)] border border-[var(--border)]">
              {q.grid.map((emoji, i) => {
                const isRight = side === 'right'
                const isDiff = q.activeDiffs.includes(i)
                const rightEmoji = isRight && isDiff ? q.diffs[i] : emoji
                const isFound = isRight && isDiff && found.has(i)
                const isWrong = (side === 'left' && wrongClicks.has(i)) || (side === 'right' && wrongClicks.has(i + 100))

                return (
                  <button
                    key={i}
                    onClick={() => handleClick(side, i)}
                    disabled={isFound}
                    aria-label={`${side} scene cell ${i + 1}${isFound ? ' — found' : ''}`}
                    className={`aspect-square text-2xl sm:text-3xl flex items-center justify-center rounded-xl transition-all focus-visible:outline focus-visible:outline-2 focus-visible:outline-[var(--focus-ring)] ${
                      isFound
                        ? 'bg-green-100 dark:bg-green-900/30 ring-2 ring-green-400 scale-105'
                        : isWrong
                        ? 'bg-red-100 dark:bg-red-900/20 ring-2 ring-red-300'
                        : 'hover:bg-gray-50 dark:hover:bg-white/5 hover:scale-110 cursor-pointer'
                    }`}
                  >
                    <span aria-hidden="true">{rightEmoji}</span>
                  </button>
                )
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Found indicators */}
      <div className="flex justify-center gap-2">
        {q.activeDiffs.map((_, i) => (
          <div key={i} className={`w-4 h-4 rounded-full transition-all ${i < found.size ? 'bg-green-400 scale-125' : 'bg-gray-200 dark:bg-white/20'}`} />
        ))}
      </div>

      {found.size === q.activeDiffs.length && (
        <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 rounded-2xl p-3 text-center animate-slide-up" aria-live="polite">
          <p className="font-bold text-green-700">🎉 All differences found!</p>
        </div>
      )}
    </div>
  )
}
