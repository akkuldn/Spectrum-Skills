import React, { useState, useMemo } from 'react'
import { CheckCircle, XCircle, ChevronRight } from 'lucide-react'
import Button from '../components/ui/Button'

// Pattern sets by difficulty
const SHAPES = ['🔴','🔵','🟡','🟢','🟠','🟣','⭐','❤️','🔷','🔶']
const ANIMALS = ['🐶','🐱','🐭','🦊','🐸','🐯','🦁','🐨','🦋','🐢']
const FRUITS  = ['🍎','🍊','🍋','🍇','🍓','🫐','🍑','🥝','🍒','🍉']

const PATTERN_TEMPLATES = {
  easy: [
    { seq: (s) => [s[0],s[1],s[0],s[1],'?'],         answer: 0, wrong: [1,2,3] },
    { seq: (s) => [s[0],s[0],s[1],s[0],s[0],'?'],    answer: 1, wrong: [0,2,3] },
    { seq: (s) => [s[0],s[1],s[2],s[0],s[1],'?'],    answer: 2, wrong: [0,1,3] },
    { seq: (s) => [s[1],s[0],s[1],s[0],s[1],'?'],    answer: 0, wrong: [1,2,3] },
  ],
  medium: [
    { seq: (s) => [s[0],s[1],s[2],s[0],s[1],'?'],         answer: 2, wrong: [0,1,3] },
    { seq: (s) => [s[0],s[0],s[1],s[1],s[2],s[2],'?','?'], answer: 2, wrong: [0,1,3], extra: true },
    { seq: (s) => [s[2],s[1],s[0],s[2],s[1],'?'],         answer: 0, wrong: [1,2,3] },
    { seq: (s) => [s[0],s[1],s[1],s[0],s[1],'?'],         answer: 1, wrong: [0,2,3] },
    { seq: (s) => [s[3],s[0],s[3],s[1],s[3],'?'],         answer: 2, wrong: [0,1,3] },
  ],
  hard: [
    { seq: (s) => [s[0],s[1],s[2],s[3],s[0],s[1],s[2],'?'],   answer: 3, wrong: [0,1,2] },
    { seq: (s) => [s[1],s[0],s[0],s[1],s[0],s[0],s[1],'?'],   answer: 0, wrong: [1,2,3] },
    { seq: (s) => [s[0],s[2],s[0],s[3],s[0],s[2],s[0],'?'],   answer: 3, wrong: [0,1,2] },
    { seq: (s) => [s[4],s[3],s[2],s[1],s[0],s[4],s[3],'?'],   answer: 2, wrong: [0,1,4] },
  ],
}

function shuffle(arr) {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

function generateQuestion(difficulty) {
  const sets = [SHAPES, ANIMALS, FRUITS]
  const set = shuffle(sets)[0]
  const shuffledSet = shuffle(set)

  const templates = PATTERN_TEMPLATES[difficulty] ?? PATTERN_TEMPLATES.easy
  const tmpl = templates[Math.floor(Math.random() * templates.length)]

  const sequence = tmpl.seq(shuffledSet)
  // Replace '?' markers for display
  const displaySeq = sequence.map(s => s)
  const missingIdx = sequence.indexOf('?')

  // Answer is the item at tmpl.answer index in shuffledSet
  const answer = shuffledSet[tmpl.answer]
  // Wrong options
  const wrongPool = shuffledSet.filter((_, i) => !tmpl.wrong.includes(i) ? false : true)
  const wrongOptions = shuffle(wrongPool.filter(s => s !== answer)).slice(0, 3)
  const options = shuffle([answer, ...wrongOptions])

  return { displaySeq, missingIdx, answer, options }
}

export default function PatternRecognition({ difficulty = 'easy', onComplete }) {
  const totalQuestions = difficulty === 'easy' ? 6 : difficulty === 'medium' ? 8 : 10
  const [questions] = useState(() => Array.from({ length: totalQuestions }, () => generateQuestion(difficulty)))
  const [current, setCurrent] = useState(0)
  const [answered, setAnswered] = useState(null)
  const [correct, setCorrect] = useState(null)
  const [score, setScore] = useState(0)

  const q = questions[current]
  const pct = Math.round((current / totalQuestions) * 100)

  function handleAnswer(option) {
    if (answered !== null) return
    setAnswered(option)
    const isCorrect = option === q.answer
    setCorrect(isCorrect)
    if (isCorrect) setScore(s => s + 1)
  }

  function handleNext() {
    if (current + 1 >= totalQuestions) {
      const finalScore = Math.round(((score + (correct ? 1 : 0)) / totalQuestions) * 100)
      const stars = finalScore >= 85 ? 3 : finalScore >= 60 ? 2 : 1
      onComplete({ stars, score: finalScore })
    } else {
      setCurrent(c => c + 1)
      setAnswered(null)
      setCorrect(null)
    }
  }

  return (
    <div className="max-w-lg mx-auto space-y-5">
      {/* Progress */}
      <div className="flex items-center gap-3">
        <div className="flex-1 h-2.5 bg-gray-100 dark:bg-white/10 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-brand-purple to-brand-pink rounded-full transition-all duration-500"
            style={{ width: `${pct}%` }}
            role="progressbar"
            aria-valuenow={current}
            aria-valuemax={totalQuestions}
            aria-label="Question progress"
          />
        </div>
        <span className="text-sm font-bold text-[var(--text-muted)]">{current + 1}/{totalQuestions}</span>
        <span className="text-sm font-bold text-brand-yellow">⭐ {score}</span>
      </div>

      {/* Pattern display */}
      <div className="card p-6">
        <p className="text-sm font-bold text-[var(--text-muted)] text-center mb-4">What comes next in the pattern?</p>

        <div
          className="flex flex-wrap items-center justify-center gap-2 sm:gap-3"
          role="img"
          aria-label={`Pattern: ${q.displaySeq.map(s => s === '?' ? 'missing' : s).join(', ')}`}
        >
          {q.displaySeq.map((item, i) => (
            <div
              key={i}
              className={`flex items-center justify-center rounded-2xl border-2 text-3xl sm:text-4xl transition-all ${
                item === '?'
                  ? 'w-14 h-14 sm:w-16 sm:h-16 border-dashed border-brand-purple bg-violet-50 dark:bg-violet-900/20 animate-pulse'
                  : 'w-12 h-12 sm:w-14 sm:h-14 border-[var(--border)] bg-gray-50 dark:bg-white/5'
              }`}
              aria-hidden="true"
            >
              {item === '?' ? <span className="text-brand-purple font-black text-2xl">?</span> : item}
            </div>
          ))}
        </div>
      </div>

      {/* Options */}
      <div
        className="grid grid-cols-2 gap-3 sm:gap-4"
        role="group"
        aria-label="Choose the missing piece"
      >
        {q.options.map((option, i) => {
          const isSelected = answered === option
          const isRight = option === q.answer
          let cls = 'border-[var(--border)] hover:border-brand-purple/60 hover:-translate-y-0.5 cursor-pointer'
          if (answered !== null) {
            if (isRight) cls = 'border-green-400 bg-green-50 dark:bg-green-900/20 cursor-default'
            else if (isSelected) cls = 'border-red-400 bg-red-50 dark:bg-red-900/20 cursor-default'
            else cls = 'opacity-40 border-[var(--border)] cursor-default'
          }

          return (
            <button
              key={i}
              onClick={() => handleAnswer(option)}
              disabled={answered !== null}
              aria-label={`Option ${i + 1}: ${option}${answered !== null ? (isRight ? ' — correct' : isSelected ? ' — incorrect' : '') : ''}`}
              className={`flex items-center justify-center p-5 rounded-2xl border-2 text-4xl sm:text-5xl transition-all focus-visible:outline focus-visible:outline-3 focus-visible:outline-[var(--focus-ring)] ${cls}`}
            >
              <span aria-hidden="true">{option}</span>
              {answered !== null && isRight && <CheckCircle size={18} className="text-green-500 absolute" aria-hidden="true" />}
            </button>
          )
        })}
      </div>

      {/* Feedback */}
      {answered !== null && (
        <div
          className={`rounded-2xl p-4 text-sm font-semibold animate-slide-up ${
            correct
              ? 'bg-green-50 dark:bg-green-900/20 text-green-700 border border-green-100'
              : 'bg-orange-50 dark:bg-orange-900/20 text-orange-700 border border-orange-100'
          }`}
          aria-live="polite"
        >
          {correct
            ? '✅ Correct! You spotted the pattern!'
            : `💡 The answer was ${q.answer}. The pattern was ${q.displaySeq.filter(s => s !== '?').slice(0, 3).join(' → ')} → …`
          }
        </div>
      )}

      {answered !== null && (
        <Button fullWidth onClick={handleNext} size="lg">
          {current + 1 >= totalQuestions ? '🏆 See Results!' : <>Next <ChevronRight size={18} aria-hidden="true" /></>}
        </Button>
      )}
    </div>
  )
}
