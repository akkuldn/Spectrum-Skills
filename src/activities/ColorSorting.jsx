import React, { useState, useMemo } from 'react'
import { RotateCcw, Check } from 'lucide-react'
import Button from '../components/ui/Button'

const COLOR_SETS = {
  easy: [
    { id: 'red',    label: 'Red',    hex: '#EF4444', light: '#FEF2F2', border: '#FECACA' },
    { id: 'blue',   label: 'Blue',   hex: '#3B82F6', light: '#EFF6FF', border: '#BFDBFE' },
    { id: 'yellow', label: 'Yellow', hex: '#EAB308', light: '#FEFCE8', border: '#FEF08A' },
  ],
  medium: [
    { id: 'red',    label: 'Red',    hex: '#EF4444', light: '#FEF2F2', border: '#FECACA' },
    { id: 'blue',   label: 'Blue',   hex: '#3B82F6', light: '#EFF6FF', border: '#BFDBFE' },
    { id: 'yellow', label: 'Yellow', hex: '#EAB308', light: '#FEFCE8', border: '#FEF08A' },
    { id: 'green',  label: 'Green',  hex: '#22C55E', light: '#F0FDF4', border: '#BBF7D0' },
    { id: 'purple', label: 'Purple', hex: '#A855F7', light: '#FAF5FF', border: '#E9D5FF' },
  ],
  hard: [
    { id: 'red',    label: 'Red',    hex: '#EF4444', light: '#FEF2F2', border: '#FECACA' },
    { id: 'blue',   label: 'Blue',   hex: '#3B82F6', light: '#EFF6FF', border: '#BFDBFE' },
    { id: 'yellow', label: 'Yellow', hex: '#EAB308', light: '#FEFCE8', border: '#FEF08A' },
    { id: 'green',  label: 'Green',  hex: '#22C55E', light: '#F0FDF4', border: '#BBF7D0' },
    { id: 'purple', label: 'Purple', hex: '#A855F7', light: '#FAF5FF', border: '#E9D5FF' },
    { id: 'orange', label: 'Orange', hex: '#F97316', light: '#FFF7ED', border: '#FED7AA' },
    { id: 'pink',   label: 'Pink',   hex: '#EC4899', light: '#FDF2F8', border: '#FBCFE8' },
  ],
}

const ITEM_EMOJIS_BY_COLOR = {
  red:    ['🍎', '🍓', '❤️', '🌹', '🔴', '🍒'],
  blue:   ['🫐', '💙', '🐟', '🦋', '🔵', '💎'],
  yellow: ['🍋', '🌟', '⭐', '🌻', '🟡', '🐝'],
  green:  ['🍀', '🥦', '🐸', '🌿', '🟢', '🥑'],
  purple: ['🍇', '💜', '🔮', '🫐', '🟣', '🦄'],
  orange: ['🍊', '🥕', '🦊', '🌅', '🟠', '🎃'],
  pink:   ['🌸', '🦩', '🩷', '🍬', '🌷', '🎀'],
}

function shuffle(arr) {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

function generateItems(colors) {
  const items = []
  colors.forEach(color => {
    const emojis = shuffle(ITEM_EMOJIS_BY_COLOR[color.id] ?? ['⚫']).slice(0, 3)
    emojis.forEach((emoji, i) => {
      items.push({ id: `${color.id}-${i}`, emoji, colorId: color.id })
    })
  })
  return shuffle(items)
}

export default function ColorSorting({ difficulty = 'easy', onComplete }) {
  const colors = COLOR_SETS[difficulty] ?? COLOR_SETS.easy
  const [items] = useState(() => generateItems(colors))
  const [sorted, setSorted] = useState({})    // { colorId: [itemId, ...] }
  const [selected, setSelected] = useState(null) // currently picked item id
  const [correct, setCorrect] = useState({})  // { itemId: true/false }
  const [mistakes, setMistakes] = useState(0)
  const [done, setDone] = useState(false)

  const unsorted = items.filter(item => !sorted[item.colorId]?.includes(item.id))

  function handlePickItem(itemId) {
    if (done) return
    setSelected(s => s === itemId ? null : itemId)
  }

  function handleDropInBucket(colorId) {
    if (!selected || done) return
    const item = items.find(i => i.id === selected)
    if (!item) return

    const isCorrect = item.colorId === colorId

    if (!isCorrect) {
      setMistakes(m => m + 1)
      setCorrect(prev => ({ ...prev, [selected]: false }))
      // Show wrong flash then remove
      setTimeout(() => {
        setCorrect(prev => ({ ...prev, [selected]: null }))
        setSelected(null)
      }, 800)
      return
    }

    setCorrect(prev => ({ ...prev, [selected]: true }))
    setSorted(prev => ({
      ...prev,
      [colorId]: [...(prev[colorId] ?? []), selected],
    }))
    setSelected(null)

    // Check if all sorted
    const totalSorted = Object.values(sorted).flat().length + 1
    if (totalSorted >= items.length) {
      setDone(true)
      const score = Math.max(0, 100 - mistakes * 10)
      const stars = score >= 85 ? 3 : score >= 60 ? 2 : 1
      onComplete({ stars, score })
    }
  }

  const sortedCount = Object.values(sorted).flat().length
  const pct = (sortedCount / items.length) * 100

  return (
    <div className="max-w-2xl mx-auto space-y-5">
      {/* Header stats */}
      <div className="flex items-center justify-between bg-[var(--bg-card)] border border-[var(--border)] rounded-2xl px-4 py-3">
        <div className="text-sm font-bold text-[var(--text-secondary)]">
          Sorted: <span className="text-brand-green">{sortedCount}/{items.length}</span>
        </div>
        <div className="text-sm font-bold text-[var(--text-secondary)]">
          Mistakes: <span className="text-brand-coral">{mistakes}</span>
        </div>
      </div>

      {/* Progress */}
      <div className="h-2.5 bg-gray-100 dark:bg-white/10 rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-brand-yellow to-brand-peach rounded-full transition-all duration-500"
          style={{ width: `${pct}%` }}
          role="progressbar"
          aria-valuenow={sortedCount}
          aria-valuemax={items.length}
          aria-label="Sorting progress"
        />
      </div>

      {/* Instructions */}
      {!selected && !done && unsorted.length > 0 && (
        <p className="text-sm text-center text-[var(--text-secondary)]">
          👆 Tap an item to pick it up, then tap the matching colour bucket
        </p>
      )}
      {selected && (
        <p className="text-sm text-center font-bold text-brand-purple animate-slide-up" aria-live="polite">
          Now tap the {colors.find(c => c.id === items.find(i => i.id === selected)?.colorId)?.label} bucket!
        </p>
      )}

      {/* Items to sort */}
      {unsorted.length > 0 && (
        <div className="card">
          <p className="text-xs font-bold text-[var(--text-muted)] mb-3">Pick an item:</p>
          <div
            className="flex flex-wrap gap-3 justify-center min-h-[80px]"
            role="group"
            aria-label="Items to sort"
          >
            {unsorted.map(item => {
              const isSelected = selected === item.id
              const isWrong = correct[item.id] === false
              return (
                <button
                  key={item.id}
                  onClick={() => handlePickItem(item.id)}
                  aria-pressed={isSelected}
                  aria-label={`Sort ${item.emoji}`}
                  className={`w-16 h-16 text-4xl rounded-2xl border-2 flex items-center justify-center transition-all focus-visible:outline focus-visible:outline-3 focus-visible:outline-[var(--focus-ring)] ${
                    isSelected
                      ? 'border-brand-purple bg-violet-50 dark:bg-violet-900/20 scale-110 shadow-glow'
                      : isWrong
                      ? 'border-red-400 bg-red-50 dark:bg-red-900/20 scale-90 opacity-70'
                      : 'border-[var(--border)] hover:border-brand-purple/50 hover:scale-105 cursor-pointer'
                  }`}
                >
                  <span aria-hidden="true">{item.emoji}</span>
                </button>
              )
            })}
          </div>
        </div>
      )}

      {/* Color buckets */}
      <div
        className={`grid gap-3 ${colors.length <= 3 ? 'grid-cols-3' : colors.length <= 5 ? 'grid-cols-3 sm:grid-cols-5' : 'grid-cols-4'}`}
        role="group"
        aria-label="Colour buckets — tap to sort"
      >
        {colors.map(color => {
          const inBucket = (sorted[color.id] ?? []).map(id => items.find(i => i.id === id)).filter(Boolean)
          const isTarget = selected && items.find(i => i.id === selected)?.colorId === color.id

          return (
            <button
              key={color.id}
              onClick={() => handleDropInBucket(color.id)}
              disabled={!selected}
              aria-label={`${color.label} bucket — ${inBucket.length} items sorted`}
              className={`flex flex-col items-center p-3 rounded-3xl border-2 transition-all min-h-[100px] focus-visible:outline focus-visible:outline-3 focus-visible:outline-[var(--focus-ring)] ${
                selected
                  ? isTarget
                    ? 'border-green-400 scale-105 shadow-card-hover cursor-pointer'
                    : 'border-[var(--border)] hover:scale-102 cursor-pointer hover:border-gray-300'
                  : 'border-[var(--border)] cursor-default'
              }`}
              style={{ background: color.light, borderColor: isTarget ? '#22C55E' : color.border }}
            >
              {/* Bucket visual */}
              <div
                className="w-10 h-10 rounded-2xl mb-2 flex items-center justify-center text-white font-black text-sm shadow-sm"
                style={{ background: color.hex }}
                aria-hidden="true"
              >
                {inBucket.length}
              </div>
              <p className="text-xs font-bold" style={{ color: color.hex }}>{color.label}</p>
              {/* Items in bucket */}
              <div className="flex flex-wrap gap-0.5 justify-center mt-1">
                {inBucket.slice(-4).map(item => (
                  <span key={item.id} className="text-lg" aria-hidden="true">{item.emoji}</span>
                ))}
              </div>
            </button>
          )
        })}
      </div>

      {/* Done! */}
      {done && (
        <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 rounded-2xl p-5 text-center animate-slide-up" aria-live="assertive">
          <p className="text-2xl font-black text-green-700 dark:text-green-300">🎉 All sorted!</p>
          <p className="text-sm text-green-600 dark:text-green-400 mt-1">
            Excellent work! You sorted all {items.length} items perfectly!
            {mistakes > 0 ? ` (${mistakes} mistake${mistakes > 1 ? 's' : ''})` : ' With no mistakes!'}
          </p>
        </div>
      )}
    </div>
  )
}
