import React, { useState } from 'react'
import { CheckCircle, XCircle, ChevronRight } from 'lucide-react'
import Button from '../components/ui/Button'

const SCENARIOS = {
  easy: [
    { emoji: '😊', context: 'A child just got a surprise birthday cake!', answer: 'Happy', options: ['Happy', 'Sad', 'Scared', 'Angry'], tip: 'A big smile and bright eyes show happiness.' },
    { emoji: '😢', context: 'A child\'s favourite toy was accidentally broken.', answer: 'Sad', options: ['Happy', 'Sad', 'Surprised', 'Bored'], tip: 'Tears and a downturned mouth show sadness.' },
    { emoji: '😠', context: 'Someone pushed to the front of the queue.', answer: 'Angry', options: ['Angry', 'Happy', 'Tired', 'Confused'], tip: 'Furrowed brows and a tight mouth show anger.' },
    { emoji: '😨', context: 'A very loud bang woke the child up at night.', answer: 'Scared', options: ['Excited', 'Scared', 'Happy', 'Surprised'], tip: 'Wide eyes and a pale face show fear.' },
    { emoji: '😮', context: 'A magician pulled a rabbit out of a hat!', answer: 'Surprised', options: ['Angry', 'Bored', 'Surprised', 'Sad'], tip: 'An open mouth and wide eyes show surprise.' },
    { emoji: '😴', context: 'It is midnight and the child has been awake all day.', answer: 'Tired', options: ['Tired', 'Happy', 'Scared', 'Excited'], tip: 'Drooping eyes and a relaxed face show tiredness.' },
  ],
  medium: [
    { emoji: '😤', context: 'The child worked hard on a puzzle but cannot solve it.', answer: 'Frustrated', options: ['Frustrated', 'Happy', 'Excited', 'Confused'], tip: 'A tense frown with puffed cheeks shows frustration.' },
    { emoji: '😌', context: 'The child just had a warm bath and curled up in bed.', answer: 'Calm', options: ['Excited', 'Angry', 'Calm', 'Worried'], tip: 'Soft, relaxed features show a calm feeling.' },
    { emoji: '🤩', context: 'The child is about to go on a rollercoaster for the first time!', answer: 'Excited', options: ['Scared', 'Excited', 'Bored', 'Sad'], tip: 'Sparkling eyes and a huge grin show excitement.' },
    { emoji: '😟', context: 'The child is about to give a speech in front of the whole school.', answer: 'Worried', options: ['Worried', 'Happy', 'Angry', 'Excited'], tip: 'Knitted brows and a tight expression show worry.' },
    { emoji: '🥹', context: 'The child received a heartfelt letter from their best friend.', answer: 'Touched', options: ['Sad', 'Touched', 'Scared', 'Confused'], tip: 'Teary but smiling eyes show feeling moved or touched.' },
    { emoji: '😒', context: 'The child has been waiting for a long time with nothing to do.', answer: 'Bored', options: ['Happy', 'Bored', 'Tired', 'Angry'], tip: 'A blank, distant look shows boredom.' },
    { emoji: '😳', context: 'The child accidentally spilled their drink in front of everyone.', answer: 'Embarrassed', options: ['Embarrassed', 'Excited', 'Worried', 'Calm'], tip: 'Wide eyes and a flushed face show embarrassment.' },
  ],
  hard: [
    { emoji: '😬', context: 'The child knows they made a mistake but does not want to admit it.', answer: 'Guilty', options: ['Guilty', 'Excited', 'Calm', 'Happy'], tip: 'Tense jaw and avoiding eye contact show guilt.' },
    { emoji: '🫤', context: 'The child does not agree, but does not want to argue.', answer: 'Doubtful', options: ['Doubtful', 'Happy', 'Excited', 'Calm'], tip: 'A tilted head and tight lips can show doubt or uncertainty.' },
    { emoji: '😶', context: 'The child heard something shocking but does not know how to react.', answer: 'Overwhelmed', options: ['Overwhelmed', 'Happy', 'Tired', 'Bored'], tip: 'A blank, still face can show being overwhelmed.' },
    { emoji: '🙁', context: 'The child heard a friend is moving away to another country.', answer: 'Disappointed', options: ['Disappointed', 'Angry', 'Excited', 'Confused'], tip: 'A downturned mouth and heavy eyes show disappointment.' },
    { emoji: '🥺', context: 'The child really wants help but feels nervous to ask.', answer: 'Hopeful', options: ['Hopeful', 'Scared', 'Angry', 'Bored'], tip: 'Big, soft eyes and a slight smile can show hopefulness.' },
    { emoji: '😏', context: 'The child knows the answer and is waiting for others to catch up.', answer: 'Confident', options: ['Confident', 'Worried', 'Sad', 'Angry'], tip: 'A slight smile and relaxed posture can show confidence.' },
    { emoji: '😑', context: 'The child has heard the same joke for the twentieth time.', answer: 'Unamused', options: ['Unamused', 'Happy', 'Excited', 'Calm'], tip: 'Flat expression and glazed eyes show being unamused.' },
    { emoji: '🤭', context: 'The child saw something funny they were not supposed to find funny.', answer: 'Amused', options: ['Amused', 'Scared', 'Angry', 'Sad'], tip: 'A covered smile and bright eyes show amusement.' },
  ],
}

function shuffle(arr) {
  const a = [...arr]; for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1));[a[i], a[j]] = [a[j], a[i]] }; return a
}

export default function FacialExpressions({ difficulty = 'easy', onComplete }) {
  const pool = SCENARIOS[difficulty] ?? SCENARIOS.easy
  const total = difficulty === 'hard' ? 7 : difficulty === 'medium' ? 6 : 5
  const [questions] = useState(() => shuffle(pool).slice(0, total))
  const [idx, setIdx]           = useState(0)
  const [answered, setAnswered] = useState(null)
  const [correct, setCorrect]   = useState(null)
  const [score, setScore]       = useState(0)

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
      onComplete({ stars: finalScore >= 85 ? 3 : finalScore >= 60 ? 2 : 1, score: finalScore })
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
          <div className="h-full bg-gradient-to-r from-pink-400 to-rose-400 rounded-full transition-all duration-500" style={{ width: `${pct}%` }} role="progressbar" aria-valuenow={idx} aria-valuemax={total} />
        </div>
        <span className="text-sm font-bold text-[var(--text-muted)]">{idx + 1}/{total}</span>
        <span className="text-sm font-bold text-brand-yellow">⭐ {score}</span>
      </div>

      {/* Face + Context */}
      <div className="card p-6 text-center">
        <div
          className="text-8xl sm:text-9xl mb-4 inline-block animate-float select-none"
          aria-label={`Facial expression: ${answered ? q.answer : 'unknown'}`}
        >
          {q.emoji}
        </div>
        <div className="bg-gray-50 dark:bg-white/5 rounded-2xl p-3">
          <p className="text-sm text-[var(--text-secondary)] italic">"{q.context}"</p>
        </div>
        <p className="mt-3 text-sm font-bold text-brand-purple">How is this person feeling?</p>
      </div>

      {/* Options */}
      <div className="grid grid-cols-2 gap-3" role="group" aria-label="Choose the emotion">
        {q.options.map((opt, i) => {
          const isSelected = answered === opt
          const isRight = opt === q.answer
          let cls = 'border-[var(--border)] hover:border-pink-400/60 hover:-translate-y-0.5 cursor-pointer'
          if (answered) {
            if (isRight) cls = 'border-green-400 bg-green-50 dark:bg-green-900/20 cursor-default'
            else if (isSelected) cls = 'border-red-400 bg-red-50 dark:bg-red-900/20 cursor-default'
            else cls = 'opacity-40 border-[var(--border)] cursor-default'
          }
          return (
            <button key={i} onClick={() => handleAnswer(opt)} disabled={!!answered}
              aria-label={`${opt}${answered ? (isRight ? ' — correct' : isSelected ? ' — incorrect' : '') : ''}`}
              className={`p-4 rounded-2xl border-2 font-bold text-[var(--text-primary)] transition-all flex items-center justify-center gap-2 focus-visible:outline focus-visible:outline-3 focus-visible:outline-[var(--focus-ring)] ${cls}`}
            >
              {opt}
              {answered && isRight && <CheckCircle size={14} className="text-green-500" aria-hidden="true" />}
              {answered && isSelected && !isRight && <XCircle size={14} className="text-red-500" aria-hidden="true" />}
            </button>
          )
        })}
      </div>

      {answered && (
        <div className={`rounded-2xl p-4 text-sm font-semibold animate-slide-up ${correct ? 'bg-green-50 dark:bg-green-900/20 text-green-700 border border-green-100' : 'bg-orange-50 dark:bg-orange-900/20 text-orange-700 border border-orange-100'}`} aria-live="polite">
          {correct ? `✅ Well spotted! ${q.tip}` : `💙 They feel ${q.answer}. ${q.tip}`}
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
