import React, { useState } from 'react'
import Button from '../components/ui/Button'

const TIME_SLOTS = [
  { id: 'wake',      label: 'Wake Up',   emoji: '☀️', time: 'Morning' },
  { id: 'breakfast', label: 'Breakfast', emoji: '🍳', time: 'Morning' },
  { id: 'activity',  label: 'Activity',  emoji: '📚', time: 'Morning' },
  { id: 'lunch',     label: 'Lunch',     emoji: '🥪', time: 'Afternoon' },
  { id: 'play',      label: 'Play Time', emoji: '🎮', time: 'Afternoon' },
  { id: 'snack',     label: 'Snack',     emoji: '🍎', time: 'Afternoon' },
  { id: 'dinner',    label: 'Dinner',    emoji: '🍽️', time: 'Evening' },
  { id: 'wind',      label: 'Wind Down', emoji: '🛁', time: 'Evening' },
  { id: 'bedtime',   label: 'Bedtime',   emoji: '😴', time: 'Evening' },
]

const ACTIVITY_OPTIONS = {
  wake:      ['Stretch & Yawn 🤸','Make my Bed 🛏️','Get Dressed 👕','Brush Teeth 🪥'],
  breakfast: ['Cereal 🥣','Toast 🍞','Fruit Bowl 🍓','Pancakes 🥞'],
  activity:  ['Reading 📖','Learning 🎓','Drawing ✏️','Puzzles 🧩'],
  lunch:     ['Sandwich 🥪','Soup 🍲','Salad 🥗','Pasta 🍝'],
  play:      ['Outside Play 🌳','Games 🎲','Art & Craft 🎨','Music 🎵'],
  snack:     ['Apple 🍎','Crackers 🍘','Yogurt 🥛','Carrots 🥕'],
  dinner:    ['Family Meal 🍽️','Favourite Dish 😋','Something New 🌮','Pizza 🍕'],
  wind:      ['Bath 🛁','Quiet Reading 📚','Calm Music 🎵','Light Stretching 🧘'],
  bedtime:   ['Story Time 📖','Breathing Exercise 🫧','Counting Stars ⭐','Hugs & Cuddles 🤗'],
}

export default function DailyRoutine({ difficulty = 'easy', onComplete }) {
  const totalSlots = difficulty === 'easy' ? 6 : 9
  const slots = TIME_SLOTS.slice(0, totalSlots)

  const [choices, setChoices] = useState({})
  const [phase, setPhase]     = useState('build')   // build | review

  function pick(slotId, option) {
    setChoices(prev => ({ ...prev, [slotId]: option }))
  }

  const allDone = slots.every(s => choices[s.id])

  function handleFinish() {
    if (!allDone) return
    setPhase('review')
    setTimeout(() => {
      onComplete({ stars: 3, score: 100 })
    }, 2500)
  }

  const periods = ['Morning', 'Afternoon', 'Evening']

  if (phase === 'review') {
    return (
      <div className="max-w-sm mx-auto space-y-4 animate-slide-up">
        <div className="text-center">
          <div className="text-5xl mb-2" aria-hidden="true">📅</div>
          <h2 className="text-xl font-black text-[var(--text-primary)]">Your Day Plan!</h2>
          <p className="text-sm text-[var(--text-secondary)]">Great schedule! Here's your day:</p>
        </div>
        {slots.map(s => (
          <div key={s.id} className="flex items-center gap-3 bg-[var(--bg-card)] border border-[var(--border)] rounded-2xl p-3">
            <span className="text-2xl" aria-hidden="true">{s.emoji}</span>
            <div>
              <p className="text-xs text-[var(--text-muted)]">{s.time} · {s.label}</p>
              <p className="font-bold text-sm text-[var(--text-primary)]">{choices[s.id]}</p>
            </div>
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="max-w-lg mx-auto space-y-5">
      <p className="text-center text-sm text-[var(--text-secondary)]">
        Choose what you'll do at each part of the day! 📅
      </p>

      {periods.map(period => {
        const periodSlots = slots.filter(s => s.time === period)
        if (periodSlots.length === 0) return null
        return (
          <div key={period} className="space-y-2">
            <h3 className="font-bold text-[var(--text-primary)] flex items-center gap-2">
              {period === 'Morning' ? '🌅' : period === 'Afternoon' ? '☀️' : '🌙'} {period}
            </h3>
            {periodSlots.map(slot => (
              <div key={slot.id} className="bg-[var(--bg-card)] border border-[var(--border)] rounded-2xl p-3">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xl" aria-hidden="true">{slot.emoji}</span>
                  <span className="font-semibold text-sm text-[var(--text-primary)]">{slot.label}</span>
                </div>
                <div className="grid grid-cols-2 gap-1.5">
                  {ACTIVITY_OPTIONS[slot.id].map(opt => (
                    <button
                      key={opt}
                      onClick={() => pick(slot.id, opt)}
                      aria-pressed={choices[slot.id] === opt}
                      className={`text-xs px-2 py-2 rounded-xl border-2 font-semibold transition-all text-left focus-visible:outline focus-visible:outline-2 focus-visible:outline-[var(--focus-ring)] ${
                        choices[slot.id] === opt
                          ? 'border-brand-purple bg-violet-50 dark:bg-violet-900/20 text-brand-purple'
                          : 'border-[var(--border)] text-[var(--text-secondary)] hover:border-brand-purple/40'
                      }`}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )
      })}

      <Button fullWidth size="lg" onClick={handleFinish} disabled={!allDone}>
        {allDone ? '📅 See My Day Plan!' : `Choose ${slots.filter(s => !choices[s.id]).length} more slot${slots.filter(s => !choices[s.id]).length !== 1 ? 's' : ''}`}
      </Button>
    </div>
  )
}
