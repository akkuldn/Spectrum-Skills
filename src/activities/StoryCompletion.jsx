import React, { useState } from 'react'
import { CheckCircle, XCircle, ChevronRight } from 'lucide-react'
import Button from '../components/ui/Button'

const STORIES = {
  easy: [
    {
      beginning: 'Ella found a tiny lost puppy in the park. It looked cold and hungry. She knew she had to help.',
      emoji: '🐶',
      question: 'What did Ella do next?',
      options: [
        { text: 'She took the puppy home and gave it food and water.', correct: true },
        { text: 'She ignored the puppy and kept walking.', correct: false },
        { text: 'She hid the puppy in a bush.', correct: false },
      ],
      feedback: 'Ella showed kindness by caring for the puppy!',
    },
    {
      beginning: 'Max wanted to eat a biscuit before dinner, but his mum had said to wait. The biscuits were right there on the counter.',
      emoji: '🍪',
      question: 'What should Max do?',
      options: [
        { text: 'Eat a biscuit quickly when his mum is not looking.', correct: false },
        { text: 'Wait patiently until after dinner, as his mum asked.', correct: true },
        { text: 'Eat all of the biscuits so there are none left.', correct: false },
      ],
      feedback: 'Waiting shows patience and respect — well done for choosing wisely!',
    },
    {
      beginning: 'Lily was building a tall tower with blocks. Just as it got very high, her little brother bumped it and it fell down.',
      emoji: '🧱',
      question: 'What is the best thing Lily can do?',
      options: [
        { text: 'Get very angry and push her brother.', correct: false },
        { text: 'Take a deep breath and start building again.', correct: true },
        { text: 'Cry all day and never play again.', correct: false },
      ],
      feedback: 'Taking a deep breath and trying again is a great way to handle frustration!',
    },
    {
      beginning: 'During lunch, Tom saw that his friend Chloe had forgotten her packed lunch at home.',
      emoji: '🥪',
      question: 'What is the kindest thing Tom can do?',
      options: [
        { text: 'Offer to share some of his lunch with Chloe.', correct: true },
        { text: 'Eat quickly before Chloe notices.', correct: false },
        { text: 'Tell everyone that Chloe forgot her lunch.', correct: false },
      ],
      feedback: 'Sharing shows kindness and care for a friend!',
    },
    {
      beginning: 'Sam could not find his favourite toy. He looked everywhere but it was gone. He felt upset.',
      emoji: '🧸',
      question: 'What should Sam do?',
      options: [
        { text: 'Ask a grown-up for help looking for it.', correct: true },
        { text: 'Throw all his other toys on the floor in anger.', correct: false },
        { text: 'Stay upset all week and refuse to play.', correct: false },
      ],
      feedback: 'Asking for help is a great idea — grown-ups love to help!',
    },
  ],
  medium: [
    {
      beginning: 'During a group project, Maya had a great idea, but every time she tried to speak, her partner talked over her.',
      emoji: '🗣️',
      question: 'What is the best way for Maya to handle this?',
      options: [
        { text: 'Calmly say "Can I share my idea please?" and wait for her turn.', correct: true },
        { text: 'Stop contributing to the project entirely.', correct: false },
        { text: 'Get louder and louder until everyone listens.', correct: false },
      ],
      feedback: 'Using polite words to ask for a turn is a great communication skill!',
    },
    {
      beginning: 'Alex borrowed a book from the school library and accidentally got a small tear on the cover.',
      emoji: '📚',
      question: 'What should Alex do?',
      options: [
        { text: 'Return the book without saying anything and hope no one notices.', correct: false },
        { text: 'Throw the book away so no one finds out.', correct: false },
        { text: 'Tell the librarian honestly what happened and apologise.', correct: true },
      ],
      feedback: 'Being honest and taking responsibility is the brave and right thing to do!',
    },
    {
      beginning: 'During PE, Jamie\'s team was losing badly. Some teammates started arguing with each other and giving up.',
      emoji: '⚽',
      question: 'What would a good team member do?',
      options: [
        { text: 'Join in the arguing and blame the worst player.', correct: false },
        { text: 'Encourage the team and say "We can still do this!"', correct: true },
        { text: 'Quit the game and sit on the sideline.', correct: false },
      ],
      feedback: 'Encouraging teammates shows great leadership and sportsmanship!',
    },
    {
      beginning: 'Sophia worked very hard on a drawing for art class. Her classmate looked at it and said it was not very good.',
      emoji: '🎨',
      question: 'What is the best way for Sophia to respond?',
      options: [
        { text: 'Say thank you, then remember she worked hard and is proud of her effort.', correct: true },
        { text: 'Scribble over her classmate\'s drawing to get back at them.', correct: false },
        { text: 'Throw her drawing away and never draw again.', correct: false },
      ],
      feedback: 'Being proud of your effort matters more than what others think!',
    },
    {
      beginning: 'On the way home from school, Zara saw an older student dropping litter on the pavement.',
      emoji: '🗑️',
      question: 'What should Zara do?',
      options: [
        { text: 'Start dropping litter too since others are doing it.', correct: false },
        { text: 'Politely say something like "There\'s a bin just over there!" or pick it up herself.', correct: true },
        { text: 'Take a photo to embarrass the student online.', correct: false },
      ],
      feedback: 'Standing up for the environment — even in small ways — makes a big difference!',
    },
  ],
}

function shuffle(arr) {
  const a = [...arr]; for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1));[a[i], a[j]] = [a[j], a[i]] }; return a
}

export default function StoryCompletion({ difficulty = 'easy', onComplete }) {
  const pool = STORIES[difficulty] ?? STORIES.easy
  const total = difficulty === 'medium' ? 4 : 4
  const [stories] = useState(() => shuffle(pool).slice(0, total).map(s => ({ ...s, shuffledOptions: shuffle(s.options) })))
  const [idx, setIdx]           = useState(0)
  const [answered, setAnswered] = useState(null)
  const [correct, setCorrect]   = useState(null)
  const [score, setScore]       = useState(0)

  const s = stories[idx]
  const pct = Math.round((idx / total) * 100)

  function handleAnswer(opt) {
    if (answered !== null) return
    setAnswered(opt.text)
    const isCorrect = opt.correct
    setCorrect(isCorrect)
    if (isCorrect) setScore(sc => sc + 1)
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
          <div className="h-full bg-gradient-to-r from-orange-400 to-yellow-400 rounded-full transition-all duration-500" style={{ width: `${pct}%` }} role="progressbar" aria-valuenow={idx} aria-valuemax={total} />
        </div>
        <span className="text-sm font-bold text-[var(--text-muted)]">{idx + 1}/{total}</span>
        <span className="text-sm font-bold text-brand-yellow">⭐ {score}</span>
      </div>

      {/* Story */}
      <div className="card p-6">
        <div className="flex items-center gap-3 mb-4">
          <span className="text-4xl" aria-hidden="true">{s.emoji}</span>
          <p className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-wide">📖 The Story</p>
        </div>
        <p className="text-[var(--text-primary)] leading-relaxed font-medium">{s.beginning}</p>
        <p className="mt-4 text-sm font-bold text-brand-purple">{s.question}</p>
      </div>

      {/* Options */}
      <div className="space-y-2.5" role="group" aria-label="Choose the best ending">
        {s.shuffledOptions.map((opt, i) => {
          const isSelected = answered === opt.text
          const isRight = opt.correct
          let cls = 'border-[var(--border)] hover:border-orange-400/60 cursor-pointer'
          if (answered !== null) {
            if (isRight) cls = 'border-green-400 bg-green-50 dark:bg-green-900/20 cursor-default'
            else if (isSelected) cls = 'border-red-400 bg-red-50 dark:bg-red-900/20 cursor-default'
            else cls = 'opacity-40 border-[var(--border)] cursor-default'
          }
          return (
            <button key={i} onClick={() => handleAnswer(opt)} disabled={answered !== null}
              aria-label={`Option ${i + 1}: ${opt.text}${answered !== null ? (isRight ? ' — best choice' : isSelected ? ' — not the best choice' : '') : ''}`}
              className={`w-full flex items-start gap-3 p-4 rounded-2xl border-2 text-left transition-all focus-visible:outline focus-visible:outline-3 focus-visible:outline-[var(--focus-ring)] ${cls}`}
            >
              <span className="text-sm font-bold text-[var(--text-muted)] mt-0.5 w-5 flex-shrink-0">{String.fromCharCode(65 + i)}.</span>
              <span className="font-medium text-sm text-[var(--text-primary)] flex-1 leading-snug">{opt.text}</span>
              {answered !== null && isRight && <CheckCircle size={16} className="text-green-500 flex-shrink-0 mt-0.5" aria-hidden="true" />}
              {answered !== null && isSelected && !isRight && <XCircle size={16} className="text-red-500 flex-shrink-0 mt-0.5" aria-hidden="true" />}
            </button>
          )
        })}
      </div>

      {answered !== null && (
        <div className={`rounded-2xl p-4 text-sm font-semibold animate-slide-up ${correct ? 'bg-green-50 dark:bg-green-900/20 text-green-700 border border-green-100' : 'bg-orange-50 dark:bg-orange-900/20 text-orange-700 border border-orange-100'}`} aria-live="polite">
          {correct ? `✅ ${s.feedback}` : `💙 ${s.feedback}`}
        </div>
      )}

      {answered !== null && (
        <Button fullWidth onClick={handleNext} size="lg">
          {idx + 1 >= total ? '🏆 See Results!' : <>Next Story <ChevronRight size={18} /></>}
        </Button>
      )}
    </div>
  )
}
