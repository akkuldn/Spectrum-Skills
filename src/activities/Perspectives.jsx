import React, { useState } from 'react'
import { CheckCircle, XCircle, ChevronRight } from 'lucide-react'
import Button from '../components/ui/Button'

const QUESTIONS = {
  easy: [
    {
      emoji: '🎂',
      character: 'Sam',
      situation: 'Sam\'s friends threw him a surprise birthday party. He walked in and everyone shouted "Surprise!"',
      question: 'How does Sam feel?',
      answer: 'Happy and Surprised',
      options: ['Happy and Surprised', 'Angry', 'Bored', 'Worried'],
      explain: 'A surprise party is a kind gesture — Sam would likely feel joyful and amazed!',
    },
    {
      emoji: '🐕',
      character: 'Leila',
      situation: 'Leila\'s dog ran away and has been missing for two days.',
      question: 'How does Leila feel?',
      answer: 'Worried and Sad',
      options: ['Happy', 'Worried and Sad', 'Excited', 'Relieved'],
      explain: 'When someone we love goes missing, it is natural to feel worried and sad.',
    },
    {
      emoji: '🏆',
      character: 'Amir',
      situation: 'Amir trained for months for his swimming race. He came first place!',
      question: 'How does Amir feel?',
      answer: 'Proud and Excited',
      options: ['Bored', 'Sad', 'Proud and Excited', 'Scared'],
      explain: 'Achieving a goal after hard work brings feelings of pride and excitement!',
    },
    {
      emoji: '😔',
      character: 'Zara',
      situation: 'Zara was not invited to her classmate\'s birthday party, but everyone else in her class was.',
      question: 'How might Zara feel?',
      answer: 'Left Out and Sad',
      options: ['Happy', 'Left Out and Sad', 'Relieved', 'Excited'],
      explain: 'Being excluded from something everyone else is part of can feel very lonely and hurtful.',
    },
    {
      emoji: '🎤',
      character: 'Ben',
      situation: 'Ben is about to perform a song on stage in front of hundreds of people.',
      question: 'How does Ben feel?',
      answer: 'Nervous and Excited',
      options: ['Bored', 'Angry', 'Nervous and Excited', 'Calm'],
      explain: 'Performing in front of a big audience often brings a mix of nerves and excitement.',
    },
  ],
  medium: [
    {
      emoji: '🖼️',
      character: 'Cleo',
      situation: 'Cleo spent three days drawing a detailed picture. When she showed it to her sister, her sister said "It\'s OK, I guess."',
      question: 'How might Cleo feel?',
      answer: 'Disappointed',
      options: ['Excited', 'Disappointed', 'Relieved', 'Proud'],
      explain: 'When you work hard on something and expect more support, a lukewarm reaction can feel deflating.',
    },
    {
      emoji: '🦮',
      character: 'Oscar',
      situation: 'Oscar promised to walk his friend\'s dog but forgot and went to play football instead.',
      question: 'How might Oscar feel later?',
      answer: 'Guilty',
      options: ['Proud', 'Happy', 'Guilty', 'Surprised'],
      explain: 'When we break a promise, we often feel guilty because we care about the other person.',
    },
    {
      emoji: '🧩',
      character: 'Maya',
      situation: 'Maya is new to a group project. She has great ideas but is worried people will not listen to her.',
      question: 'How does Maya feel?',
      answer: 'Anxious and Unsure',
      options: ['Anxious and Unsure', 'Confident', 'Excited', 'Angry'],
      explain: 'Being new to a group and not knowing if you\'ll be accepted can feel very anxious.',
    },
    {
      emoji: '🛝',
      character: 'Ellie and Josh',
      situation: 'Ellie really wants to use the slide but Josh has been on it for a long time and won\'t share.',
      question: 'How does Ellie feel?',
      answer: 'Frustrated',
      options: ['Calm', 'Happy', 'Frustrated', 'Confused'],
      explain: 'Waiting for something you really want — especially when it seems unfair — causes frustration.',
    },
    {
      emoji: '🎓',
      character: 'Lily',
      situation: 'Lily helped her younger brother learn to read. Today, he read a whole page by himself.',
      question: 'How does Lily feel?',
      answer: 'Proud and Happy',
      options: ['Disappointed', 'Worried', 'Proud and Happy', 'Confused'],
      explain: 'Seeing someone you helped succeed brings a warm, proud feeling.',
    },
    {
      emoji: '🌧️',
      character: 'Ryan',
      situation: 'Ryan had been looking forward to his school trip all week. That morning, it was cancelled due to bad weather.',
      question: 'How does Ryan feel?',
      answer: 'Disappointed and Let Down',
      options: ['Excited', 'Relieved', 'Disappointed and Let Down', 'Surprised'],
      explain: 'Having something you look forward to cancelled feels disappointing, even if it\'s out of anyone\'s control.',
    },
  ],
}

function shuffle(arr) {
  const a = [...arr]; for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1));[a[i], a[j]] = [a[j], a[i]] }; return a
}

export default function Perspectives({ difficulty = 'easy', onComplete }) {
  const pool = QUESTIONS[difficulty] ?? QUESTIONS.easy
  const total = difficulty === 'medium' ? 5 : 5
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
    <div className="max-w-lg mx-auto space-y-5">
      {/* Progress */}
      <div className="flex items-center gap-3">
        <div className="flex-1 h-2.5 bg-gray-100 dark:bg-white/10 rounded-full overflow-hidden">
          <div className="h-full bg-gradient-to-r from-violet-400 to-pink-400 rounded-full transition-all duration-500" style={{ width: `${pct}%` }} role="progressbar" aria-valuenow={idx} aria-valuemax={total} />
        </div>
        <span className="text-sm font-bold text-[var(--text-muted)]">{idx + 1}/{total}</span>
        <span className="text-sm font-bold text-brand-yellow">⭐ {score}</span>
      </div>

      {/* Story card */}
      <div className="card p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="text-4xl" aria-hidden="true">{q.emoji}</div>
          <div>
            <p className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-wide">💭 Think about {q.character}</p>
          </div>
        </div>
        <p className="text-[var(--text-primary)] leading-relaxed font-medium">{q.situation}</p>
        <p className="mt-4 text-sm font-bold text-brand-purple">{q.question}</p>
      </div>

      {/* Options */}
      <div className="grid grid-cols-2 gap-3" role="group" aria-label="Choose how the character feels">
        {q.options.map((opt, i) => {
          const isSelected = answered === opt
          const isRight = opt === q.answer
          let cls = 'border-[var(--border)] hover:border-violet-400/60 hover:-translate-y-0.5 cursor-pointer'
          if (answered) {
            if (isRight) cls = 'border-green-400 bg-green-50 dark:bg-green-900/20 cursor-default'
            else if (isSelected) cls = 'border-red-400 bg-red-50 dark:bg-red-900/20 cursor-default'
            else cls = 'opacity-40 border-[var(--border)] cursor-default'
          }
          return (
            <button key={i} onClick={() => handleAnswer(opt)} disabled={!!answered}
              aria-label={`${opt}${answered ? (isRight ? ' — correct' : isSelected ? ' — incorrect' : '') : ''}`}
              className={`p-4 rounded-2xl border-2 font-semibold text-sm text-[var(--text-primary)] transition-all flex items-center justify-center gap-2 text-center leading-snug focus-visible:outline focus-visible:outline-3 focus-visible:outline-[var(--focus-ring)] ${cls}`}
            >
              {opt}
              {answered && isRight && <CheckCircle size={14} className="text-green-500 flex-shrink-0" aria-hidden="true" />}
              {answered && isSelected && !isRight && <XCircle size={14} className="text-red-500 flex-shrink-0" aria-hidden="true" />}
            </button>
          )
        })}
      </div>

      {answered && (
        <div className={`rounded-2xl p-4 text-sm font-semibold animate-slide-up ${correct ? 'bg-green-50 dark:bg-green-900/20 text-green-700 border border-green-100' : 'bg-orange-50 dark:bg-orange-900/20 text-orange-700 border border-orange-100'}`} aria-live="polite">
          {correct ? `✅ ${q.explain}` : `💙 ${q.character} likely feels ${q.answer}. ${q.explain}`}
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
