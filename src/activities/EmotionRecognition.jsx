import React, { useState, useMemo } from 'react'
import { CheckCircle, XCircle, ChevronRight } from 'lucide-react'
import { EMOTION_QUESTIONS, EMOTIONS } from '../data/emotions'
import Button from '../components/ui/Button'

function shuffle(arr) {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

// Large SVG emoji faces
const FACE_SVG = {
  happy: (
    <svg viewBox="0 0 100 100" className="w-24 h-24" aria-hidden="true">
      <circle cx="50" cy="50" r="45" fill="#FFF176"/>
      <circle cx="35" cy="40" r="5" fill="#555"/>
      <circle cx="65" cy="40" r="5" fill="#555"/>
      <path d="M 30 62 Q 50 80 70 62" stroke="#555" strokeWidth="4" fill="none" strokeLinecap="round"/>
    </svg>
  ),
  sad: (
    <svg viewBox="0 0 100 100" className="w-24 h-24" aria-hidden="true">
      <circle cx="50" cy="50" r="45" fill="#90CAF9"/>
      <circle cx="35" cy="38" r="5" fill="#555"/>
      <circle cx="65" cy="38" r="5" fill="#555"/>
      <path d="M 30 70 Q 50 55 70 70" stroke="#555" strokeWidth="4" fill="none" strokeLinecap="round"/>
      <line x1="32" y1="30" x2="38" y2="34" stroke="#555" strokeWidth="3"/>
      <line x1="68" y1="30" x2="62" y2="34" stroke="#555" strokeWidth="3"/>
    </svg>
  ),
  angry: (
    <svg viewBox="0 0 100 100" className="w-24 h-24" aria-hidden="true">
      <circle cx="50" cy="50" r="45" fill="#EF9A9A"/>
      <circle cx="35" cy="42" r="5" fill="#555"/>
      <circle cx="65" cy="42" r="5" fill="#555"/>
      <path d="M 30 70 Q 50 58 70 70" stroke="#555" strokeWidth="4" fill="none" strokeLinecap="round"/>
      <line x1="28" y1="30" x2="42" y2="38" stroke="#555" strokeWidth="4" strokeLinecap="round"/>
      <line x1="72" y1="30" x2="58" y2="38" stroke="#555" strokeWidth="4" strokeLinecap="round"/>
    </svg>
  ),
  scared: (
    <svg viewBox="0 0 100 100" className="w-24 h-24" aria-hidden="true">
      <circle cx="50" cy="50" r="45" fill="#CE93D8"/>
      <ellipse cx="35" cy="40" rx="7" ry="8" fill="#555"/>
      <ellipse cx="65" cy="40" rx="7" ry="8" fill="#555"/>
      <ellipse cx="50" cy="68" rx="14" ry="10" fill="#555"/>
      <path d="M 28 65 Q 38 72 50 68 Q 62 72 72 65" stroke="#CCC" strokeWidth="2" fill="none"/>
    </svg>
  ),
  surprised: (
    <svg viewBox="0 0 100 100" className="w-24 h-24" aria-hidden="true">
      <circle cx="50" cy="50" r="45" fill="#FFE082"/>
      <circle cx="35" cy="40" r="6" fill="#555"/>
      <circle cx="65" cy="40" r="6" fill="#555"/>
      <ellipse cx="50" cy="68" rx="12" ry="12" fill="#555"/>
      <line x1="32" y1="28" x2="38" y2="33" stroke="#555" strokeWidth="3"/>
      <line x1="68" y1="28" x2="62" y2="33" stroke="#555" strokeWidth="3"/>
    </svg>
  ),
  calm: (
    <svg viewBox="0 0 100 100" className="w-24 h-24" aria-hidden="true">
      <circle cx="50" cy="50" r="45" fill="#A5D6A7"/>
      <line x1="30" y1="40" x2="42" y2="40" stroke="#555" strokeWidth="3" strokeLinecap="round"/>
      <line x1="58" y1="40" x2="70" y2="40" stroke="#555" strokeWidth="3" strokeLinecap="round"/>
      <path d="M 30 65 Q 50 72 70 65" stroke="#555" strokeWidth="4" fill="none" strokeLinecap="round"/>
    </svg>
  ),
  excited: (
    <svg viewBox="0 0 100 100" className="w-24 h-24" aria-hidden="true">
      <circle cx="50" cy="50" r="45" fill="#FFCC80"/>
      <path d="M 28 35 Q 35 28 42 35" stroke="#555" strokeWidth="3" fill="none" strokeLinecap="round"/>
      <path d="M 58 35 Q 65 28 72 35" stroke="#555" strokeWidth="3" fill="none" strokeLinecap="round"/>
      <path d="M 22 58 Q 50 90 78 58" stroke="#555" strokeWidth="4" fill="none" strokeLinecap="round"/>
    </svg>
  ),
  confused: (
    <svg viewBox="0 0 100 100" className="w-24 h-24" aria-hidden="true">
      <circle cx="50" cy="50" r="45" fill="#80DEEA"/>
      <line x1="30" y1="38" x2="42" y2="43" stroke="#555" strokeWidth="3" strokeLinecap="round"/>
      <line x1="58" y1="38" x2="70" y2="43" stroke="#555" strokeWidth="3" strokeLinecap="round"/>
      <path d="M 32 68 Q 50 60 68 68" stroke="#555" strokeWidth="3" fill="none" strokeLinecap="round"/>
      <text x="48" y="30" fontSize="16" fill="#555" fontWeight="bold">?</text>
    </svg>
  ),
  proud: (
    <svg viewBox="0 0 100 100" className="w-24 h-24" aria-hidden="true">
      <circle cx="50" cy="50" r="45" fill="#CE93D8"/>
      <path d="M 28 36 Q 35 30 42 36" stroke="#555" strokeWidth="3" fill="none" strokeLinecap="round"/>
      <path d="M 58 36 Q 65 30 72 36" stroke="#555" strokeWidth="3" fill="none" strokeLinecap="round"/>
      <circle cx="35" cy="42" r="4" fill="#555"/>
      <circle cx="65" cy="42" r="4" fill="#555"/>
      <path d="M 28 63 Q 50 80 72 63" stroke="#555" strokeWidth="4" fill="none" strokeLinecap="round"/>
    </svg>
  ),
  frustrated: (
    <svg viewBox="0 0 100 100" className="w-24 h-24" aria-hidden="true">
      <circle cx="50" cy="50" r="45" fill="#FFAB91"/>
      <circle cx="35" cy="42" r="5" fill="#555"/>
      <circle cx="65" cy="42" r="5" fill="#555"/>
      <path d="M 32 69 Q 50 59 68 69" stroke="#555" strokeWidth="4" fill="none" strokeLinecap="round"/>
      <path d="M 28 30 Q 36 36 44 30" stroke="#555" strokeWidth="3" fill="none" strokeLinecap="round"/>
      <path d="M 56 30 Q 64 36 72 30" stroke="#555" strokeWidth="3" fill="none" strokeLinecap="round"/>
    </svg>
  ),
}

export default function EmotionRecognition({ difficulty = 'easy', onComplete }) {
  const questions = useMemo(() => {
    const filtered = EMOTION_QUESTIONS.filter(q => {
      if (difficulty === 'easy') return q.difficulty === 'easy'
      if (difficulty === 'medium') return q.difficulty !== 'hard'
      return true
    })
    return shuffle(filtered).slice(0, difficulty === 'easy' ? 5 : difficulty === 'medium' ? 7 : 10)
  }, [difficulty])

  const [current, setCurrent] = useState(0)
  const [answered, setAnswered] = useState(null) // selected emotion id
  const [correct, setCorrect] = useState(null)
  const [score, setScore] = useState(0)
  const [showHint, setShowHint] = useState(false)
  const [finished, setFinished] = useState(false)

  const q = questions[current]

  function handleAnswer(emotionId) {
    if (answered !== null) return
    setAnswered(emotionId)
    const isCorrect = emotionId === q.correctEmotion
    if (isCorrect) {
      setCorrect(true)
      setScore(s => s + 1)
    } else {
      setCorrect(false)
    }
  }

  function handleNext() {
    if (current + 1 >= questions.length) {
      // Done
      const pct = Math.round((score + (correct ? 0 : 0)) / questions.length * 100)
      const finalScore = Math.round(((answered !== null && correct ? score + 1 : score) / questions.length) * 100)
      const stars = finalScore >= 85 ? 3 : finalScore >= 60 ? 2 : 1
      setFinished(true)
      onComplete({ stars, score: finalScore })
    } else {
      setCurrent(c => c + 1)
      setAnswered(null)
      setCorrect(null)
      setShowHint(false)
    }
  }

  if (finished) return null

  const emotionOptions = q.options.map(id => EMOTIONS.find(e => e.id === id)).filter(Boolean)
  const faceEl = FACE_SVG[q.correctEmotion] ?? FACE_SVG.happy
  const pct = Math.round((current / questions.length) * 100)

  return (
    <div className="max-w-lg mx-auto space-y-5">
      {/* Progress */}
      <div className="flex items-center gap-3">
        <div className="flex-1 h-2.5 bg-gray-100 dark:bg-white/10 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-brand-pink to-brand-purple rounded-full transition-all duration-500"
            style={{ width: `${pct}%` }}
            role="progressbar"
            aria-valuenow={current}
            aria-valuemax={questions.length}
            aria-label="Question progress"
          />
        </div>
        <span className="text-sm font-bold text-[var(--text-muted)] whitespace-nowrap">
          {current + 1}/{questions.length}
        </span>
        <span className="text-sm font-bold text-brand-yellow">⭐ {score}</span>
      </div>

      {/* Question card */}
      <div className="card p-6 text-center space-y-4">
        {/* Face */}
        <div className="flex justify-center" aria-hidden="true">
          {faceEl}
        </div>

        {/* Situation */}
        <div>
          <p className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-wide mb-2">How does this person feel?</p>
          <p className="text-[var(--text-primary)] font-semibold leading-relaxed text-sm sm:text-base">
            {q.situation}
          </p>
        </div>

        {/* Hint */}
        <button
          onClick={() => setShowHint(h => !h)}
          className="text-xs text-brand-purple font-semibold hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-[var(--focus-ring)] rounded"
          aria-expanded={showHint}
        >
          {showHint ? 'Hide hint ↑' : '💡 Need a hint?'}
        </button>
        {showHint && (
          <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-100 rounded-xl p-3 text-sm text-yellow-700 dark:text-yellow-300 text-left">
            {q.hint}
          </div>
        )}
      </div>

      {/* Answer options */}
      <div
        className="grid grid-cols-2 gap-3"
        role="group"
        aria-label="Choose the correct emotion"
      >
        {emotionOptions.map(emotion => {
          const isSelected = answered === emotion.id
          const isRight = emotion.id === q.correctEmotion
          let style = 'border-[var(--border)] hover:border-brand-purple/50'
          if (answered !== null) {
            if (isRight) style = 'border-green-400 bg-green-50 dark:bg-green-900/20'
            else if (isSelected && !isRight) style = 'border-red-400 bg-red-50 dark:bg-red-900/20'
            else style = 'opacity-50 border-[var(--border)]'
          }

          return (
            <button
              key={emotion.id}
              onClick={() => handleAnswer(emotion.id)}
              disabled={answered !== null}
              aria-label={`${emotion.label}${answered !== null ? (isRight ? ' — correct' : isSelected ? ' — incorrect' : '') : ''}`}
              className={`flex items-center gap-3 p-4 rounded-2xl border-2 text-left transition-all focus-visible:outline focus-visible:outline-3 focus-visible:outline-[var(--focus-ring)] ${
                answered === null ? 'hover:-translate-y-0.5 cursor-pointer' : 'cursor-default'
              } ${style}`}
            >
              <span className="text-3xl flex-shrink-0" aria-hidden="true">{emotion.emoji}</span>
              <span className="font-bold text-sm text-[var(--text-primary)]">{emotion.label}</span>
              {answered !== null && isRight && (
                <CheckCircle size={18} className="text-green-500 ml-auto flex-shrink-0" aria-hidden="true" />
              )}
              {answered !== null && isSelected && !isRight && (
                <XCircle size={18} className="text-red-500 ml-auto flex-shrink-0" aria-hidden="true" />
              )}
            </button>
          )
        })}
      </div>

      {/* Feedback */}
      {answered !== null && (
        <div
          className={`rounded-2xl p-4 text-sm font-semibold animate-slide-up ${
            correct
              ? 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300 border border-green-100'
              : 'bg-orange-50 dark:bg-orange-900/20 text-orange-700 dark:text-orange-300 border border-orange-100'
          }`}
          aria-live="polite"
        >
          {correct ? (
            <p>✅ Correct! Great reading of the situation!</p>
          ) : (
            <p>
              💙 The answer was <strong className="capitalize">{EMOTIONS.find(e => e.id === q.correctEmotion)?.label}</strong>. That's okay — emotions can be tricky!
            </p>
          )}
        </div>
      )}

      {/* Next button */}
      {answered !== null && (
        <Button fullWidth onClick={handleNext} size="lg">
          {current + 1 >= questions.length ? '🏆 See Results!' : <>Next <ChevronRight size={18} aria-hidden="true" /></>}
        </Button>
      )}
    </div>
  )
}
