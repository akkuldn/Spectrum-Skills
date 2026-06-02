import React, { useState } from 'react'
import { CheckCircle, XCircle, ChevronRight } from 'lucide-react'
import Button from '../components/ui/Button'

const QUESTIONS = {
  easy: [
    { cause: { emoji: '🌧️', text: 'It starts to rain' },         answer: { emoji: '☂️', text: 'You open an umbrella' },          wrong: [{ emoji: '🏖️', text: 'You go to the beach' },{ emoji: '🌞', text: 'The sun gets brighter' },{ emoji: '🛷', text: 'You go sledging' }] },
    { cause: { emoji: '😴', text: 'You are very tired' },         answer: { emoji: '🛏️', text: 'You go to sleep' },               wrong: [{ emoji: '🎉', text: 'You throw a party' },{ emoji: '🏃', text: 'You go for a run' },{ emoji: '🍕', text: 'You eat pizza' }] },
    { cause: { emoji: '🔥', text: 'The candle is lit' },          answer: { emoji: '💡', text: 'The room gets brighter' },         wrong: [{ emoji: '❄️', text: 'The room gets colder' },{ emoji: '🌊', text: 'The room fills with water' },{ emoji: '🌿', text: 'Plants start growing' }] },
    { cause: { emoji: '📚', text: 'You study hard' },             answer: { emoji: '💯', text: 'You do well in the test' },        wrong: [{ emoji: '😴', text: 'You fall asleep' },{ emoji: '🎮', text: 'You unlock a new game level' },{ emoji: '🏆', text: 'You win a trophy immediately' }] },
    { cause: { emoji: '🍦', text: 'Ice cream is left in the sun' }, answer: { emoji: '💧', text: 'The ice cream melts' },          wrong: [{ emoji: '❄️', text: 'The ice cream gets colder' },{ emoji: '🎂', text: 'It turns into a cake' },{ emoji: '🌈', text: 'A rainbow appears' }] },
    { cause: { emoji: '💧', text: 'You water the plant' },        answer: { emoji: '🌱', text: 'The plant grows' },               wrong: [{ emoji: '🔥', text: 'The plant catches fire' },{ emoji: '❄️', text: 'The plant freezes' },{ emoji: '💤', text: 'The plant falls asleep' }] },
  ],
  medium: [
    { cause: { emoji: '🚴', text: 'Emma rides her bike every day' }, answer: { emoji: '💪', text: 'Her legs get stronger' },       wrong: [{ emoji: '🦶', text: 'She grows taller immediately' },{ emoji: '📖', text: 'She becomes smarter' },{ emoji: '🌙', text: 'She sleeps better' }] },
    { cause: { emoji: '🌱', text: 'A seed is planted in good soil' }, answer: { emoji: '🌳', text: 'It grows into a tree' },       wrong: [{ emoji: '🍕', text: 'It turns into food' },{ emoji: '💎', text: 'It becomes a diamond' },{ emoji: '🐛', text: 'A worm appears' }] },
    { cause: { emoji: '🎭', text: 'You practise a play every day' }, answer: { emoji: '⭐', text: 'You perform confidently' },     wrong: [{ emoji: '😴', text: 'You get bored of it' },{ emoji: '📚', text: 'You memorise every book' },{ emoji: '🎵', text: 'You learn to sing' }] },
    { cause: { emoji: '🌡️', text: 'The temperature drops below 0°' }, answer: { emoji: '❄️', text: 'Water freezes into ice' },   wrong: [{ emoji: '🌊', text: 'Water turns to waves' },{ emoji: '💨', text: 'Water evaporates' },{ emoji: '🌈', text: 'A rainbow forms' }] },
    { cause: { emoji: '😠', text: 'Jake said something unkind' }, answer: { emoji: '😢', text: 'His friend feels hurt' },         wrong: [{ emoji: '😂', text: 'His friend laughs loudly' },{ emoji: '🎉', text: 'A party starts' },{ emoji: '🤝', text: 'They become best friends' }] },
    { cause: { emoji: '🦺', text: 'You wear a life jacket in a boat' }, answer: { emoji: '🛡️', text: 'You stay safer in the water' }, wrong: [{ emoji: '🚀', text: 'You go faster' },{ emoji: '🐠', text: 'Fish swim near you' },{ emoji: '🌊', text: 'The water gets calmer' }] },
    { cause: { emoji: '💻', text: 'The laptop battery runs out' }, answer: { emoji: '🔌', text: 'You plug it in to charge' },     wrong: [{ emoji: '🔧', text: 'You take it apart' },{ emoji: '🗑️', text: 'You throw it away' },{ emoji: '🎵', text: 'Music starts playing' }] },
    { cause: { emoji: '🧂', text: 'You add salt to the soup' },   answer: { emoji: '😋', text: 'The soup tastes different' },     wrong: [{ emoji: '🌊', text: 'The soup turns into the sea' },{ emoji: '🔥', text: 'The soup catches fire' },{ emoji: '🧊', text: 'The soup goes cold' }] },
  ],
}

function shuffle(arr) {
  const a = [...arr]; for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1));[a[i], a[j]] = [a[j], a[i]] }; return a
}

export default function CauseEffect({ difficulty = 'easy', onComplete }) {
  const pool = QUESTIONS[difficulty] ?? QUESTIONS.easy
  const total = difficulty === 'medium' ? 7 : 5
  const [questions] = useState(() =>
    shuffle(pool).slice(0, total).map(q => {
      const options = shuffle([q.answer, ...q.wrong.slice(0, 3)])
      return { ...q, options }
    })
  )
  const [idx, setIdx]           = useState(0)
  const [answered, setAnswered] = useState(null)
  const [correct, setCorrect]   = useState(null)
  const [score, setScore]       = useState(0)

  const q = questions[idx]
  const pct = Math.round((idx / total) * 100)

  function handleAnswer(opt) {
    if (answered) return
    setAnswered(opt.text)
    const isCorrect = opt.text === q.answer.text
    setCorrect(isCorrect)
    if (isCorrect) setScore(s => s + 1)
  }

  function handleNext() {
    if (idx + 1 >= total) {
      const finalScore = Math.round(((score + (correct ? 1 : 0)) / total) * 100)
      onComplete({ stars: finalScore >= 85 ? 3 : finalScore >= 60 ? 2 : 1, score: finalScore })
    } else {
      setIdx(i => i + 1)
      setAnswered(null)
      setCorrect(null)
    }
  }

  return (
    <div className="max-w-lg mx-auto space-y-5">
      {/* Progress */}
      <div className="flex items-center gap-3">
        <div className="flex-1 h-2.5 bg-gray-100 dark:bg-white/10 rounded-full overflow-hidden">
          <div className="h-full bg-gradient-to-r from-orange-400 to-amber-400 rounded-full transition-all duration-500" style={{ width: `${pct}%` }} role="progressbar" aria-valuenow={idx} aria-valuemax={total} />
        </div>
        <span className="text-sm font-bold text-[var(--text-muted)]">{idx + 1}/{total}</span>
        <span className="text-sm font-bold text-brand-yellow">⭐ {score}</span>
      </div>

      {/* Cause */}
      <div className="card p-6">
        <p className="text-xs font-bold text-[var(--text-muted)] mb-3 uppercase tracking-wide">⚡ This happens:</p>
        <div className="flex items-center gap-4">
          <span className="text-5xl" aria-hidden="true">{q.cause.emoji}</span>
          <p className="text-lg font-bold text-[var(--text-primary)]">{q.cause.text}</p>
        </div>
        <p className="mt-4 text-sm font-bold text-brand-purple">What happens because of this? 👇</p>
      </div>

      {/* Effect options */}
      <div className="grid grid-cols-2 gap-3" role="group" aria-label="Choose what happens next">
        {q.options.map((opt, i) => {
          const isSelected = answered === opt.text
          const isRight = opt.text === q.answer.text
          let cls = 'border-[var(--border)] hover:border-orange-400/60 hover:-translate-y-0.5 cursor-pointer'
          if (answered) {
            if (isRight) cls = 'border-green-400 bg-green-50 dark:bg-green-900/20 cursor-default'
            else if (isSelected) cls = 'border-red-400 bg-red-50 dark:bg-red-900/20 cursor-default'
            else cls = 'opacity-40 border-[var(--border)] cursor-default'
          }
          return (
            <button key={i} onClick={() => handleAnswer(opt)} disabled={!!answered}
              aria-label={`${opt.text}${answered ? (isRight ? ' — correct' : isSelected ? ' — wrong' : '') : ''}`}
              className={`flex flex-col items-center gap-2 p-4 rounded-2xl border-2 transition-all text-center focus-visible:outline focus-visible:outline-3 focus-visible:outline-[var(--focus-ring)] ${cls}`}
            >
              <span className="text-3xl" aria-hidden="true">{opt.emoji}</span>
              <span className="font-semibold text-sm text-[var(--text-primary)] leading-snug">{opt.text}</span>
              {answered && isRight && <CheckCircle size={14} className="text-green-500" aria-hidden="true" />}
              {answered && isSelected && !isRight && <XCircle size={14} className="text-red-500" aria-hidden="true" />}
            </button>
          )
        })}
      </div>

      {answered && (
        <div className={`rounded-2xl p-4 text-sm font-semibold animate-slide-up ${correct ? 'bg-green-50 dark:bg-green-900/20 text-green-700 border border-green-100' : 'bg-orange-50 dark:bg-orange-900/20 text-orange-700 border border-orange-100'}`} aria-live="polite">
          {correct ? `✅ Correct! ${q.cause.emoji} ${q.cause.text} → ${q.answer.emoji} ${q.answer.text}` : `💙 "${q.answer.text}" is what happens! That's cause and effect.`}
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
