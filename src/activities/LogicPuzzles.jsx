import React, { useState } from 'react'
import { CheckCircle, XCircle, ChevronRight } from 'lucide-react'
import Button from '../components/ui/Button'

const PUZZLES = {
  easy: [
    { q: 'I have four legs but I cannot walk. People sit on me every day. What am I?', options: ['A Table 🪑', 'A Chair 🪑', 'A Bed 🛏️', 'A Car 🚗'], answer: 'A Chair 🪑', hint: 'Think about something you sit on at school.' },
    { q: 'Sara has 3 apples. She gives 1 to her friend. How many does she have now?', options: ['1 🍎', '2 🍎', '3 🍎', '4 🍎'], answer: '2 🍎', hint: 'Start with 3 and take away 1.' },
    { q: 'All dogs have 4 legs. Rex is a dog. How many legs does Rex have?', options: ['2', '3', '4', '6'], answer: '4', hint: 'All dogs have the same number of legs.' },
    { q: 'Tom is taller than Ben. Ben is taller than Lily. Who is the shortest?', options: ['Tom', 'Ben', 'Lily', 'They are all the same'], answer: 'Lily', hint: 'Think about the order from tallest to shortest.' },
    { q: 'A fish lives in water. A bird lives in a nest. Where does a fish NOT live?', options: ['The sea 🌊', 'A pond 🌿', 'A nest 🐦', 'A river 🏞️'], answer: 'A nest 🐦', hint: 'Fish need water to survive.' },
    { q: 'If today is Monday, what day is tomorrow?', options: ['Sunday', 'Tuesday', 'Wednesday', 'Monday'], answer: 'Tuesday', hint: 'The days go: Monday, Tuesday, Wednesday…' },
  ],
  medium: [
    { q: 'There are 5 birds on a branch. 2 fly away. Then 3 more arrive. How many are there now?', options: ['3', '4', '6', '8'], answer: '6', hint: '5 − 2 = 3, then 3 + 3 = ?' },
    { q: 'Every square has 4 sides. A rectangle also has 4 sides. A triangle has 3 sides. Which shape has the fewest sides?', options: ['Square', 'Rectangle', 'Triangle', 'They are all the same'], answer: 'Triangle', hint: 'Count the sides: square = 4, rectangle = 4, triangle = ?' },
    { q: 'Emma is older than Jake. Jake is older than Sam. Sam is older than Zoe. Who is the youngest?', options: ['Emma', 'Jake', 'Sam', 'Zoe'], answer: 'Zoe', hint: 'Follow the chain: Emma > Jake > Sam > Zoe.' },
    { q: 'A cake needs to bake for 30 minutes. It goes in the oven at 3:00. When will it be ready?', options: ['3:15', '3:20', '3:30', '3:45'], answer: '3:30', hint: 'Add 30 minutes to 3:00.' },
    { q: 'All cats chase mice. Whiskers is a cat. Does Whiskers chase mice?', options: ['Yes', 'No', 'Sometimes', 'We cannot tell'], answer: 'Yes', hint: 'If ALL cats do something and Whiskers is a cat…' },
    { q: 'A bag has 2 red balls and 3 blue balls. Which colour is there MORE of?', options: ['Red', 'Blue', 'They are the same', 'Neither'], answer: 'Blue', hint: 'Compare 2 red vs 3 blue.' },
    { q: 'Leo reads 5 pages every day. How many pages will he read in 4 days?', options: ['9', '15', '20', '25'], answer: '20', hint: 'Multiply 5 × 4.' },
    { q: 'A snail is at the bottom of a 10-step staircase. It climbs 3 steps each hour. After 2 hours, how high is it?', options: ['3 steps', '5 steps', '6 steps', '10 steps'], answer: '6 steps', hint: '3 steps × 2 hours = ?' },
  ],
  hard: [
    { q: 'Alex, Bob, and Cal each have a pet: a dog, a cat, or a fish. Alex does not have a cat. Bob does not have a dog. Cal has a fish. What pet does Alex have?', options: ['Dog 🐶', 'Cat 🐱', 'Fish 🐟', 'We cannot tell'], answer: 'Dog 🐶', hint: 'Cal has a fish. Bob has no dog. So Bob has a cat. That leaves Alex with…' },
    { q: 'A train leaves at 9:15 and the journey takes 1 hour and 45 minutes. What time does it arrive?', options: ['10:45', '11:00', '11:15', '10:15'], answer: '11:00', hint: '9:15 + 1hr 45min = 9:15 + 1:45.' },
    { q: 'If all roses are flowers, and some flowers are red, can we say all roses are red?', options: ['Yes, definitely', 'No, not necessarily', 'Only if they are in a garden', 'Only in summer'], answer: 'No, not necessarily', hint: 'Just because SOME flowers are red does not mean ALL roses are.' },
    { q: 'A shop sells apples for 30p each. Mia buys 4 apples and pays with £2. How much change does she get?', options: ['80p', '50p', '60p', '70p'], answer: '80p', hint: '4 × 30p = 120p = £1.20. Change = £2.00 − £1.20.' },
    { q: 'Five friends stand in a line. Amy is behind Dan. Dan is in front of Eli. Ben is between Amy and Cal. Cal is first. What position is Amy?', options: ['2nd', '3rd', '4th', '5th'], answer: '4th', hint: 'Order: Cal (1st), Ben (2nd), Amy (3rd)? Check each clue step by step.' },
    { q: 'A palindrome reads the same forwards and backwards. Which of these IS a palindrome?', options: ['"star"', '"level"', '"table"', '"chair"'], answer: '"level"', hint: 'Read each word backwards.' },
    { q: 'If 3 workers build a wall in 6 days, how many days would 6 workers take (working at the same rate)?', options: ['12 days', '6 days', '3 days', '2 days'], answer: '3 days', hint: 'Double the workers = half the time.' },
    { q: 'A snail climbs 3 metres up a 10-metre pole each day but slips 2 metres each night. After how many days does it reach the top?', options: ['7 days', '8 days', '9 days', '10 days'], answer: '8 days', hint: 'Net gain is 1 metre per day. On day 8 it reaches 10 metres before slipping.' },
    { q: 'Red + Yellow = Orange. Blue + Red = Purple. Yellow + Blue = Green. Which mix makes the most colours together?', options: ['Red + Blue + Yellow', 'Red + Blue', 'Yellow + Blue', 'Only one colour is needed'], answer: 'Red + Blue + Yellow', hint: 'Using all three primary colours lets you mix all the secondary colours.' },
    { q: 'A clock shows 3:00. What angle do the hands form?', options: ['180°', '90°', '45°', '120°'], answer: '90°', hint: 'At 3:00, the minute hand points to 12 and the hour hand points to 3 — that is a quarter turn.' },
  ],
}

function shuffle(arr) {
  const a = [...arr]; for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1));[a[i], a[j]] = [a[j], a[i]] }; return a
}

export default function LogicPuzzles({ difficulty = 'easy', onComplete }) {
  const pool = PUZZLES[difficulty] ?? PUZZLES.easy
  const total = difficulty === 'easy' ? 5 : difficulty === 'medium' ? 7 : 8
  const [questions] = useState(() => shuffle(pool).slice(0, total))
  const [idx, setIdx]           = useState(0)
  const [answered, setAnswered] = useState(null)
  const [correct, setCorrect]   = useState(null)
  const [score, setScore]       = useState(0)
  const [showHint, setShowHint] = useState(false)

  const q = questions[idx]
  const pct = Math.round((idx / total) * 100)

  function handleAnswer(opt) {
    if (answered) return
    setAnswered(opt)
    const isCorrect = opt === q.answer
    setCorrect(isCorrect)
    if (isCorrect) setScore(s => s + 1)
  }

  function handleNext() {
    if (idx + 1 >= total) {
      const finalScore = Math.round(((score + (correct ? 1 : 0)) / total) * 100)
      const stars = finalScore >= 85 ? 3 : finalScore >= 60 ? 2 : 1
      onComplete({ stars, score: finalScore })
    } else {
      setIdx(i => i + 1)
      setAnswered(null)
      setCorrect(null)
      setShowHint(false)
    }
  }

  return (
    <div className="max-w-lg mx-auto space-y-5">
      {/* Progress */}
      <div className="flex items-center gap-3">
        <div className="flex-1 h-2.5 bg-gray-100 dark:bg-white/10 rounded-full overflow-hidden">
          <div className="h-full bg-gradient-to-r from-emerald-400 to-teal-400 rounded-full transition-all duration-500" style={{ width: `${pct}%` }} role="progressbar" aria-valuenow={idx} aria-valuemax={total} />
        </div>
        <span className="text-sm font-bold text-[var(--text-muted)]">{idx + 1}/{total}</span>
        <span className="text-sm font-bold text-brand-yellow">⭐ {score}</span>
      </div>

      {/* Question */}
      <div className="card p-6">
        <div className="flex items-start gap-3">
          <span className="text-3xl flex-shrink-0" aria-hidden="true">🧩</span>
          <p className="font-semibold text-[var(--text-primary)] leading-relaxed">{q.q}</p>
        </div>

        <button
          onClick={() => setShowHint(h => !h)}
          aria-expanded={showHint}
          className="mt-3 text-xs text-brand-purple font-semibold hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-[var(--focus-ring)] rounded"
        >
          {showHint ? 'Hide hint ↑' : '💡 Need a hint?'}
        </button>
        {showHint && (
          <p className="mt-2 text-sm text-[var(--text-secondary)] bg-yellow-50 dark:bg-yellow-900/20 rounded-xl px-3 py-2">
            {q.hint}
          </p>
        )}
      </div>

      {/* Options */}
      <div className="grid grid-cols-2 gap-3" role="group" aria-label="Choose the answer">
        {q.options.map((opt, i) => {
          const isSelected = answered === opt
          const isRight = opt === q.answer
          let cls = 'border-[var(--border)] hover:border-emerald-400/60 hover:-translate-y-0.5 cursor-pointer text-left'
          if (answered) {
            if (isRight) cls = 'border-green-400 bg-green-50 dark:bg-green-900/20 cursor-default text-left'
            else if (isSelected) cls = 'border-red-400 bg-red-50 dark:bg-red-900/20 cursor-default text-left'
            else cls = 'opacity-40 border-[var(--border)] cursor-default text-left'
          }
          return (
            <button
              key={i}
              onClick={() => handleAnswer(opt)}
              disabled={!!answered}
              aria-label={`${opt}${answered ? (isRight ? ' — correct' : isSelected ? ' — incorrect' : '') : ''}`}
              className={`flex items-center gap-2 p-4 rounded-2xl border-2 transition-all focus-visible:outline focus-visible:outline-3 focus-visible:outline-[var(--focus-ring)] ${cls}`}
            >
              <span className="font-semibold text-sm text-[var(--text-primary)] leading-snug flex-1">{opt}</span>
              {answered && isRight && <CheckCircle size={16} className="text-green-500 flex-shrink-0" aria-hidden="true" />}
              {answered && isSelected && !isRight && <XCircle size={16} className="text-red-500 flex-shrink-0" aria-hidden="true" />}
            </button>
          )
        })}
      </div>

      {answered && (
        <div className={`rounded-2xl p-4 text-sm font-semibold animate-slide-up ${correct ? 'bg-green-50 dark:bg-green-900/20 text-green-700 border border-green-100' : 'bg-orange-50 dark:bg-orange-900/20 text-orange-700 border border-orange-100'}`} aria-live="polite">
          {correct ? '✅ Brilliant thinking!' : `💙 The answer was: ${q.answer}. ${q.hint}`}
        </div>
      )}

      {answered && (
        <Button fullWidth onClick={handleNext} size="lg">
          {idx + 1 >= total ? '🏆 See Results!' : <>Next <ChevronRight size={18} /></>}
        </Button>
      )}
    </div>
  )
}
