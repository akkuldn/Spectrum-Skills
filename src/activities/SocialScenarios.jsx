import React, { useState } from 'react'
import { CheckCircle, XCircle, ChevronRight } from 'lucide-react'
import Button from '../components/ui/Button'

const SCENARIOS = {
  easy: [
    {
      emoji: '🤝',
      situation: 'A new student joins your class. They look nervous and alone at lunch.',
      question: 'What would be the kindest thing to do?',
      options: [
        { text: 'Invite them to sit with you and introduce yourself.', correct: true, why: 'Including someone new makes them feel welcome and valued.' },
        { text: 'Ignore them — you have enough friends.', correct: false, why: 'Ignoring someone who is alone can make them feel very sad.' },
        { text: 'Whisper to your friends and laugh.', correct: false, why: 'This would hurt their feelings and make them feel unwanted.' },
      ],
    },
    {
      emoji: '🏃',
      situation: 'You accidentally bump into a classmate in the hallway and they drop their books.',
      question: 'What should you do?',
      options: [
        { text: 'Say sorry and help pick up the books.', correct: true, why: 'Apologising and helping shows care and responsibility.' },
        { text: 'Keep walking and pretend it did not happen.', correct: false, why: 'Ignoring a mistake can make people feel upset or uncared for.' },
        { text: 'Laugh and point at them.', correct: false, why: 'This is unkind and can really hurt someone\'s feelings.' },
      ],
    },
    {
      emoji: '🎮',
      situation: 'Your friend is playing a game and it is not your turn. You want to play right now.',
      question: 'What is the right thing to do?',
      options: [
        { text: 'Grab the controller from them.', correct: false, why: 'Taking something from others is disrespectful and unkind.' },
        { text: 'Wait patiently for your turn and ask nicely when they might be done.', correct: true, why: 'Waiting and asking politely shows patience and respect.' },
        { text: 'Complain loudly until they give it to you.', correct: false, why: 'Complaining puts pressure on your friend and is not kind.' },
      ],
    },
    {
      emoji: '🎁',
      situation: 'You receive a present from a relative, but it is not what you wanted.',
      question: 'What is the most polite response?',
      options: [
        { text: 'Say "I didn\'t want this!" and look disappointed.', correct: false, why: 'This hurts the feelings of the person who was kind enough to give you a gift.' },
        { text: 'Say "Thank you so much, that\'s very kind!" and smile.', correct: true, why: 'Being gracious shows respect for the effort someone made for you.' },
        { text: 'Give it back and ask for something else.', correct: false, why: 'This is ungrateful and can make the giver feel very sad.' },
      ],
    },
    {
      emoji: '😢',
      situation: 'Your friend tells you they are feeling sad because their pet is unwell.',
      question: 'What would you say to comfort them?',
      options: [
        { text: '"I\'m really sorry — that must be hard. I\'m here for you."', correct: true, why: 'Showing empathy and offering support helps people feel less alone.' },
        { text: '"Stop being sad — it\'s just a pet."', correct: false, why: 'Dismissing someone\'s feelings can make them feel much worse.' },
        { text: '"Whatever, can we talk about something else?"', correct: false, why: 'Ignoring someone\'s feelings is unkind when they need support.' },
      ],
    },
  ],
  medium: [
    {
      emoji: '🗣️',
      situation: 'During a group discussion, you notice one person has not spoken and looks left out.',
      question: 'What is the most inclusive thing to do?',
      options: [
        { text: 'Say "We haven\'t heard from you yet — what do you think?" and give them space to answer.', correct: true, why: 'Including quiet members makes the group stronger and fairer.' },
        { text: 'Carry on talking — they will speak if they want to.', correct: false, why: 'Some people need a gentle invitation to feel comfortable joining in.' },
        { text: 'Tell them they have to share an idea right now or leave.', correct: false, why: 'Forcing someone to speak can make them feel anxious and pressured.' },
      ],
    },
    {
      emoji: '📱',
      situation: 'A friend shows you a private message and asks you to send it on to other people.',
      question: 'What should you do?',
      options: [
        { text: 'Share it — it is not that serious.', correct: false, why: 'Sharing private messages breaks trust and can hurt people.' },
        { text: 'Decline and tell your friend that private messages should stay private.', correct: true, why: 'Respecting privacy builds trust and protects people\'s feelings.' },
        { text: 'Screenshot it and post it publicly.', correct: false, why: 'This is a serious breach of trust and could be very harmful.' },
      ],
    },
    {
      emoji: '🤔',
      situation: 'Your classmate presents a project idea that you think has some problems.',
      question: 'How can you give feedback kindly?',
      options: [
        { text: '"That\'s a terrible idea. Here\'s what you should do instead."', correct: false, why: 'Being blunt without encouragement can crush someone\'s confidence.' },
        { text: '"I really like how you thought about X. One thing that might help is if you also considered Y."', correct: true, why: 'Balanced feedback — noticing strengths while gently suggesting improvements — is respectful and helpful.' },
        { text: 'Say nothing — it\'s not your project.', correct: false, why: 'Staying silent when you could help means a chance to improve is missed.' },
      ],
    },
    {
      emoji: '🙅',
      situation: 'A group of friends dares you to do something that makes you feel uncomfortable.',
      question: 'What is the best response?',
      options: [
        { text: 'Do it so you fit in, even though you do not want to.', correct: false, why: 'Your feelings and safety matter more than fitting in with a dare.' },
        { text: 'Firmly say "No, I\'m not comfortable with that" and walk away if needed.', correct: true, why: 'Standing up for yourself is brave and important for your wellbeing.' },
        { text: 'Do it and pretend you are fine afterwards.', correct: false, why: 'Hiding discomfort means the problem may keep happening.' },
      ],
    },
    {
      emoji: '🤝',
      situation: 'You and a friend disagree on what game to play. You both want to play something different.',
      question: 'What is the fairest solution?',
      options: [
        { text: 'Insist on your game until they give in.', correct: false, why: 'Forcing your choice is unfair and can damage the friendship.' },
        { text: 'Suggest playing your friend\'s game first, then yours, or find a game you both enjoy.', correct: true, why: 'Compromise and taking turns shows you value the friendship and fairness.' },
        { text: 'Refuse to play at all.', correct: false, why: 'Refusing to find a middle ground means neither person has fun.' },
      ],
    },
  ],
}

function shuffle(arr) {
  const a = [...arr]; for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1));[a[i], a[j]] = [a[j], a[i]] }; return a
}

export default function SocialScenarios({ difficulty = 'easy', onComplete }) {
  const pool = SCENARIOS[difficulty] ?? SCENARIOS.easy
  const total = 4
  const [scenarios] = useState(() => shuffle(pool).slice(0, total).map(s => ({ ...s, shuffledOptions: shuffle(s.options) })))
  const [idx, setIdx]           = useState(0)
  const [answered, setAnswered] = useState(null)
  const [correct, setCorrect]   = useState(null)
  const [score, setScore]       = useState(0)

  const s = scenarios[idx]
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
          <div className="h-full bg-gradient-to-r from-pink-400 to-violet-400 rounded-full transition-all duration-500" style={{ width: `${pct}%` }} role="progressbar" aria-valuenow={idx} aria-valuemax={total} />
        </div>
        <span className="text-sm font-bold text-[var(--text-muted)]">{idx + 1}/{total}</span>
        <span className="text-sm font-bold text-brand-yellow">⭐ {score}</span>
      </div>

      {/* Scenario */}
      <div className="card p-6">
        <div className="flex items-center gap-3 mb-3">
          <span className="text-4xl" aria-hidden="true">{s.emoji}</span>
          <p className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-wide">What Would You Do?</p>
        </div>
        <p className="text-[var(--text-primary)] leading-relaxed font-medium">{s.situation}</p>
        <p className="mt-3 text-sm font-bold text-brand-purple">{s.question}</p>
      </div>

      {/* Options */}
      <div className="space-y-2.5" role="group" aria-label="Choose the best response">
        {s.shuffledOptions.map((opt, i) => {
          const isSelected = answered === opt.text
          const isRight = opt.correct
          let cls = 'border-[var(--border)] hover:border-pink-400/60 cursor-pointer'
          if (answered !== null) {
            if (isRight) cls = 'border-green-400 bg-green-50 dark:bg-green-900/20 cursor-default'
            else if (isSelected) cls = 'border-red-400 bg-red-50 dark:bg-red-900/20 cursor-default'
            else cls = 'opacity-40 border-[var(--border)] cursor-default'
          }
          return (
            <button key={i} onClick={() => handleAnswer(opt)} disabled={answered !== null}
              aria-label={`${opt.text}${answered !== null ? (isRight ? ' — best response' : isSelected ? ' — not the best response' : '') : ''}`}
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
          {(() => {
            const selectedOpt = s.shuffledOptions.find(o => o.text === answered)
            return correct ? `✅ ${selectedOpt?.why}` : `💙 ${selectedOpt?.why}`
          })()}
        </div>
      )}

      {answered !== null && (
        <Button fullWidth onClick={handleNext} size="lg">
          {idx + 1 >= total ? '🏆 See Results!' : <>Next <ChevronRight size={18} /></>}
        </Button>
      )}
    </div>
  )
}
