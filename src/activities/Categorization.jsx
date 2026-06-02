import React, { useState, useMemo } from 'react'
import { CheckCircle, XCircle } from 'lucide-react'
import Button from '../components/ui/Button'
import { ChevronRight } from 'lucide-react'

const CATEGORIES_DATA = {
  easy: [
    {
      name: 'Animals', emoji: '🐾',
      items: [
        { label: 'Dog',     emoji: '🐶' },
        { label: 'Cat',     emoji: '🐱' },
        { label: 'Rabbit',  emoji: '🐰' },
        { label: 'Fish',    emoji: '🐟' },
      ],
    },
    {
      name: 'Food', emoji: '🍽️',
      items: [
        { label: 'Apple',  emoji: '🍎' },
        { label: 'Pizza',  emoji: '🍕' },
        { label: 'Banana', emoji: '🍌' },
        { label: 'Cake',   emoji: '🎂' },
      ],
    },
  ],
  medium: [
    { name: 'Animals', emoji: '🐾', items: [{ label: 'Lion', emoji: '🦁' },{ label: 'Elephant', emoji: '🐘' },{ label: 'Penguin', emoji: '🐧' },{ label: 'Giraffe', emoji: '🦒' }] },
    { name: 'Vehicles', emoji: '🚗', items: [{ label: 'Car', emoji: '🚗' },{ label: 'Bus', emoji: '🚌' },{ label: 'Plane', emoji: '✈️' },{ label: 'Boat', emoji: '⛵' }] },
    { name: 'Clothes', emoji: '👕', items: [{ label: 'Hat', emoji: '🧢' },{ label: 'Shoe', emoji: '👟' },{ label: 'Scarf', emoji: '🧣' },{ label: 'Gloves', emoji: '🧤' }] },
  ],
  hard: [
    { name: 'Animals', emoji: '🐾', items: [{ label: 'Tiger', emoji: '🐯' },{ label: 'Dolphin', emoji: '🐬' },{ label: 'Parrot', emoji: '🦜' },{ label: 'Fox', emoji: '🦊' }] },
    { name: 'Food', emoji: '🍽️', items: [{ label: 'Sushi', emoji: '🍣' },{ label: 'Taco', emoji: '🌮' },{ label: 'Grapes', emoji: '🍇' },{ label: 'Carrot', emoji: '🥕' }] },
    { name: 'Sports', emoji: '⚽', items: [{ label: 'Football', emoji: '⚽' },{ label: 'Tennis', emoji: '🎾' },{ label: 'Basketball', emoji: '🏀' },{ label: 'Swimming', emoji: '🏊' }] },
    { name: 'Nature', emoji: '🌿', items: [{ label: 'Cloud', emoji: '☁️' },{ label: 'Flower', emoji: '🌸' },{ label: 'Mountain', emoji: '🏔️' },{ label: 'Volcano', emoji: '🌋' }] },
  ],
}

function shuffle(arr) {
  const a = [...arr]; for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1));[a[i], a[j]] = [a[j], a[i]] }; return a
}

function buildQueue(difficulty) {
  const cats = CATEGORIES_DATA[difficulty] ?? CATEGORIES_DATA.easy
  const queue = []
  cats.forEach(cat => {
    cat.items.forEach(item => queue.push({ ...item, category: cat.name, catEmoji: cat.emoji }))
  })
  return shuffle(queue)
}

export default function Categorization({ difficulty = 'medium', onComplete }) {
  const cats = CATEGORIES_DATA[difficulty] ?? CATEGORIES_DATA.easy
  const [queue] = useState(() => buildQueue(difficulty))
  const [idx, setIdx]         = useState(0)
  const [answered, setAnswered] = useState(null)
  const [correct, setCorrect]   = useState(null)
  const [score, setScore]       = useState(0)

  const item = queue[idx]
  const pct  = Math.round((idx / queue.length) * 100)

  function handleChoice(catName) {
    if (answered) return
    setAnswered(catName)
    const isCorrect = catName === item.category
    setCorrect(isCorrect)
    if (isCorrect) setScore(s => s + 1)
  }

  function handleNext() {
    if (idx + 1 >= queue.length) {
      const finalScore = Math.round(((score + (correct ? 1 : 0)) / queue.length) * 100)
      const stars = finalScore >= 85 ? 3 : finalScore >= 60 ? 2 : 1
      onComplete({ stars, score: finalScore })
    } else {
      setIdx(i => i + 1)
      setAnswered(null)
      setCorrect(null)
    }
  }

  return (
    <div className="max-w-sm mx-auto space-y-5">
      {/* Progress */}
      <div className="flex items-center gap-3">
        <div className="flex-1 h-2.5 bg-gray-100 dark:bg-white/10 rounded-full overflow-hidden">
          <div className="h-full bg-gradient-to-r from-teal-400 to-cyan-400 rounded-full transition-all duration-500" style={{ width: `${pct}%` }} role="progressbar" aria-valuenow={idx} aria-valuemax={queue.length} />
        </div>
        <span className="text-sm font-bold text-[var(--text-muted)]">{idx + 1}/{queue.length}</span>
        <span className="text-sm font-bold text-brand-yellow">⭐ {score}</span>
      </div>

      {/* Item display */}
      <div className="card p-8 text-center">
        <p className="text-sm font-bold text-[var(--text-muted)] mb-3">Which group does this belong to?</p>
        <div className="text-7xl mb-3 animate-float inline-block" aria-hidden="true">{item.emoji}</div>
        <p className="font-bold text-xl text-[var(--text-primary)]">{item.label}</p>
      </div>

      {/* Category buttons */}
      <div className="grid grid-cols-2 gap-3" role="group" aria-label="Choose a category">
        {cats.map(cat => {
          const isSelected = answered === cat.name
          const isCorrectCat = cat.name === item.category
          let cls = 'border-[var(--border)] hover:border-teal-400/60 hover:-translate-y-0.5 cursor-pointer'
          if (answered) {
            if (isCorrectCat) cls = 'border-green-400 bg-green-50 dark:bg-green-900/20 cursor-default'
            else if (isSelected) cls = 'border-red-400 bg-red-50 dark:bg-red-900/20 cursor-default'
            else cls = 'opacity-40 border-[var(--border)] cursor-default'
          }
          return (
            <button
              key={cat.name}
              onClick={() => handleChoice(cat.name)}
              disabled={!!answered}
              aria-label={`${cat.name}${answered ? (isCorrectCat ? ' — correct' : isSelected ? ' — wrong' : '') : ''}`}
              className={`flex flex-col items-center gap-2 p-5 rounded-2xl border-2 transition-all focus-visible:outline focus-visible:outline-3 focus-visible:outline-[var(--focus-ring)] ${cls}`}
            >
              <span className="text-3xl" aria-hidden="true">{cat.emoji}</span>
              <span className="font-bold text-[var(--text-primary)]">{cat.name}</span>
              {answered && isCorrectCat && <CheckCircle size={16} className="text-green-500" aria-hidden="true" />}
              {answered && isSelected && !isCorrectCat && <XCircle size={16} className="text-red-500" aria-hidden="true" />}
            </button>
          )
        })}
      </div>

      {answered && (
        <div className={`rounded-2xl p-4 text-sm font-semibold animate-slide-up ${correct ? 'bg-green-50 dark:bg-green-900/20 text-green-700 border border-green-100' : 'bg-orange-50 dark:bg-orange-900/20 text-orange-700 border border-orange-100'}`} aria-live="polite">
          {correct ? `✅ Correct! ${item.label} belongs to ${item.category} ${item.catEmoji}` : `💙 ${item.label} goes in the ${item.category} ${item.catEmoji} group!`}
        </div>
      )}

      {answered && (
        <Button fullWidth onClick={handleNext} size="lg">
          {idx + 1 >= queue.length ? '🏆 See Results!' : <>Next <ChevronRight size={18} /></>}
        </Button>
      )}
    </div>
  )
}
