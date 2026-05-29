import React, { useState, useMemo } from 'react'
import { Check, X, ChevronRight, RotateCcw } from 'lucide-react'
import Button from '../components/ui/Button'

const ROUTINES = {
  morning: {
    name: 'Morning Routine',
    emoji: '🌅',
    description: 'What do you do in the morning?',
    easy: [
      { id: 1, label: 'Wake Up',       emoji: '⏰', order: 1 },
      { id: 2, label: 'Brush Teeth',   emoji: '🦷', order: 2 },
      { id: 3, label: 'Get Dressed',   emoji: '👕', order: 3 },
      { id: 4, label: 'Eat Breakfast', emoji: '🥣', order: 4 },
    ],
    medium: [
      { id: 1, label: 'Wake Up',         emoji: '⏰', order: 1 },
      { id: 2, label: 'Use the Toilet',  emoji: '🚽', order: 2 },
      { id: 3, label: 'Wash Face',       emoji: '🚿', order: 3 },
      { id: 4, label: 'Brush Teeth',     emoji: '🦷', order: 4 },
      { id: 5, label: 'Get Dressed',     emoji: '👕', order: 5 },
      { id: 6, label: 'Eat Breakfast',   emoji: '🥣', order: 6 },
      { id: 7, label: 'Pack School Bag', emoji: '🎒', order: 7 },
    ],
    hard: [
      { id: 1, label: 'Wake Up',          emoji: '⏰', order: 1 },
      { id: 2, label: 'Stretch',          emoji: '🧘', order: 2 },
      { id: 3, label: 'Use the Toilet',   emoji: '🚽', order: 3 },
      { id: 4, label: 'Shower',           emoji: '🚿', order: 4 },
      { id: 5, label: 'Dry Off',          emoji: '🛁', order: 5 },
      { id: 6, label: 'Get Dressed',      emoji: '👕', order: 6 },
      { id: 7, label: 'Brush Teeth',      emoji: '🦷', order: 7 },
      { id: 8, label: 'Brush Hair',       emoji: '💇', order: 8 },
      { id: 9, label: 'Eat Breakfast',    emoji: '🥣', order: 9 },
      { id: 10, label: 'Pack School Bag', emoji: '🎒', order: 10 },
    ],
  },
  bedtime: {
    name: 'Bedtime Routine',
    emoji: '🌙',
    description: 'What do you do before bed?',
    easy: [
      { id: 1, label: 'Have a Bath',    emoji: '🛁', order: 1 },
      { id: 2, label: 'Put on PJs',     emoji: '🩳', order: 2 },
      { id: 3, label: 'Brush Teeth',    emoji: '🦷', order: 3 },
      { id: 4, label: 'Read a Book',    emoji: '📖', order: 4 },
    ],
    medium: [
      { id: 1, label: 'Tidy Up Toys',  emoji: '🧸', order: 1 },
      { id: 2, label: 'Have a Bath',   emoji: '🛁', order: 2 },
      { id: 3, label: 'Put on PJs',    emoji: '🩳', order: 3 },
      { id: 4, label: 'Brush Teeth',   emoji: '🦷', order: 4 },
      { id: 5, label: 'Read a Story',  emoji: '📖', order: 5 },
      { id: 6, label: 'Turn off Light',emoji: '💡', order: 6 },
    ],
    hard: [
      { id: 1, label: 'Finish Homework', emoji: '📝', order: 1 },
      { id: 2, label: 'Pack Bag for Tomorrow', emoji: '🎒', order: 2 },
      { id: 3, label: 'Tidy Room',      emoji: '🧹', order: 3 },
      { id: 4, label: 'Have a Shower',  emoji: '🚿', order: 4 },
      { id: 5, label: 'Put on PJs',     emoji: '🩳', order: 5 },
      { id: 6, label: 'Brush Teeth',    emoji: '🦷', order: 6 },
      { id: 7, label: 'Read 15 Minutes',emoji: '📖', order: 7 },
      { id: 8, label: 'Lights Off',     emoji: '💡', order: 8 },
    ],
  },
}

function shuffle(arr) {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

export default function TaskSequencer({ difficulty = 'easy', onComplete }) {
  const routineKeys = Object.keys(ROUTINES)
  const [routineKey] = useState(() => routineKeys[Math.floor(Math.random() * routineKeys.length)])
  const routine = ROUTINES[routineKey]
  const correctOrder = routine[difficulty] ?? routine.easy

  const [shuffled] = useState(() => shuffle(correctOrder))
  const [selected, setSelected] = useState([])  // ordered by user taps
  const [submitted, setSubmitted] = useState(false)
  const [result, setResult] = useState(null)
  const [attempts, setAttempts] = useState(0)

  function handleTap(task) {
    if (submitted) return
    if (selected.find(s => s.id === task.id)) {
      // Deselect (remove last)
      setSelected(prev => {
        const idx = prev.findIndex(s => s.id === task.id)
        if (idx === prev.length - 1) return prev.slice(0, -1)
        return prev
      })
    } else {
      setSelected(prev => [...prev, task])
    }
  }

  function handleSubmit() {
    if (selected.length < correctOrder.length) return
    setAttempts(a => a + 1)
    const correct = selected.every((task, i) => task.order === correctOrder[i].order)
    setResult(correct)
    setSubmitted(true)
    if (correct) {
      const stars = attempts === 0 ? 3 : attempts === 1 ? 2 : 1
      onComplete({ stars, score: Math.round((1 / (attempts + 1)) * 100) })
    }
  }

  function handleReset() {
    setSelected([])
    setSubmitted(false)
    setResult(null)
  }

  const remaining = shuffled.filter(t => !selected.find(s => s.id === t.id))
  const pct = (selected.length / correctOrder.length) * 100

  return (
    <div className="max-w-lg mx-auto space-y-5">
      {/* Header */}
      <div className="text-center">
        <span className="text-4xl" aria-hidden="true">{routine.emoji}</span>
        <h2 className="text-2xl font-black text-[var(--text-primary)] mt-2">{routine.name}</h2>
        <p className="text-[var(--text-secondary)] text-sm mt-1">{routine.description}</p>
      </div>

      {/* Progress */}
      <div className="h-2.5 bg-gray-100 dark:bg-white/10 rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-brand-teal to-brand-green rounded-full transition-all duration-300"
          style={{ width: `${pct}%` }}
          role="progressbar"
          aria-valuenow={selected.length}
          aria-valuemax={correctOrder.length}
          aria-label="Steps placed"
        />
      </div>

      {/* Selected order */}
      <div className="card">
        <p className="text-xs font-bold text-[var(--text-muted)] mb-3">
          Your order ({selected.length}/{correctOrder.length} steps placed):
        </p>
        <div className="space-y-2 min-h-[80px]" role="list" aria-label="Your sequence">
          {selected.length === 0 ? (
            <p className="text-[var(--text-muted)] text-sm text-center py-2">Tap steps below to add them in order</p>
          ) : (
            selected.map((task, i) => {
              let bgColor = 'bg-violet-50 dark:bg-violet-900/20 border-violet-200'
              if (submitted) {
                bgColor = task.order === correctOrder[i].order
                  ? 'bg-green-50 dark:bg-green-900/20 border-green-300'
                  : 'bg-red-50 dark:bg-red-900/20 border-red-300'
              }
              return (
                <div
                  key={task.id}
                  role="listitem"
                  className={`flex items-center gap-3 p-3 rounded-2xl border-2 ${bgColor} animate-slide-up`}
                  aria-label={`Step ${i + 1}: ${task.label}${submitted ? (task.order === correctOrder[i].order ? ' — correct' : ' — incorrect') : ''}`}
                >
                  <span className="w-7 h-7 rounded-xl bg-white dark:bg-night-850 flex items-center justify-center text-xs font-black text-brand-purple flex-shrink-0">
                    {i + 1}
                  </span>
                  <span className="text-2xl flex-shrink-0" aria-hidden="true">{task.emoji}</span>
                  <span className="font-semibold text-sm text-[var(--text-primary)]">{task.label}</span>
                  {submitted && (
                    task.order === correctOrder[i].order
                      ? <Check size={16} className="text-green-500 ml-auto flex-shrink-0" aria-hidden="true" />
                      : <X size={16} className="text-red-500 ml-auto flex-shrink-0" aria-hidden="true" />
                  )}
                  {!submitted && (
                    <button
                      onClick={() => setSelected(prev => prev.filter(s => s.id !== task.id))}
                      aria-label={`Remove ${task.label}`}
                      className="ml-auto text-[var(--text-muted)] hover:text-red-500 transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-[var(--focus-ring)] rounded"
                    >
                      <X size={14} aria-hidden="true" />
                    </button>
                  )}
                </div>
              )
            })
          )}
        </div>
      </div>

      {/* Available tasks */}
      {!submitted && (
        <div>
          <p className="text-xs font-bold text-[var(--text-muted)] mb-2">Tap to add to your sequence:</p>
          <div className="flex flex-wrap gap-2" role="group" aria-label="Available steps">
            {remaining.map(task => (
              <button
                key={task.id}
                onClick={() => handleTap(task)}
                className="flex items-center gap-2 px-4 py-2.5 bg-[var(--bg-card)] border-2 border-[var(--border)] rounded-2xl hover:border-brand-teal/60 hover:-translate-y-0.5 transition-all font-semibold text-sm focus-visible:outline focus-visible:outline-3 focus-visible:outline-[var(--focus-ring)]"
                aria-label={`Add ${task.label}`}
              >
                <span aria-hidden="true">{task.emoji}</span>
                {task.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Feedback */}
      {submitted && (
        <div
          className={`rounded-2xl p-4 text-center animate-slide-up ${
            result
              ? 'bg-green-50 dark:bg-green-900/20 border border-green-200'
              : 'bg-orange-50 dark:bg-orange-900/20 border border-orange-200'
          }`}
          aria-live="polite"
        >
          {result ? (
            <>
              <p className="text-2xl font-black text-green-700 dark:text-green-300">🎉 Perfect order!</p>
              <p className="text-sm text-green-600 dark:text-green-400 mt-1">You got the {routine.name} exactly right!</p>
            </>
          ) : (
            <>
              <p className="text-xl font-black text-orange-700 dark:text-orange-300">💙 Not quite right!</p>
              <p className="text-sm text-orange-600 dark:text-orange-400 mt-1">Look at the order above — some steps are in the wrong place. Try again!</p>
            </>
          )}
        </div>
      )}

      {/* Controls */}
      <div className="flex gap-3">
        {!submitted ? (
          <Button
            fullWidth
            onClick={handleSubmit}
            disabled={selected.length < correctOrder.length}
            size="lg"
          >
            <Check size={20} aria-hidden="true" />
            Check my Order!
          </Button>
        ) : (
          !result && (
            <Button fullWidth variant="outline" onClick={handleReset} size="lg">
              <RotateCcw size={18} aria-hidden="true" /> Try Again
            </Button>
          )
        )}
      </div>
    </div>
  )
}
