import React, { useState, useMemo } from 'react'
import { CheckCircle, XCircle, ChevronRight, Volume2 } from 'lucide-react'
import Button from '../components/ui/Button'
import { useApp } from '../context/AppContext'

const WORD_CATEGORIES = {
  animals: [
    { word: 'Dog',      emoji: '🐶', hint: 'A friendly pet that barks' },
    { word: 'Cat',      emoji: '🐱', hint: 'A pet that meows and purrs' },
    { word: 'Elephant', emoji: '🐘', hint: 'The biggest land animal with a long trunk' },
    { word: 'Lion',     emoji: '🦁', hint: 'The king of the jungle with a big mane' },
    { word: 'Penguin',  emoji: '🐧', hint: 'A bird that cannot fly and lives in cold places' },
    { word: 'Giraffe',  emoji: '🦒', hint: 'The tallest animal with a very long neck' },
    { word: 'Butterfly',emoji: '🦋', hint: 'A beautiful insect with colourful wings' },
    { word: 'Dolphin',  emoji: '🐬', hint: 'A clever sea animal that loves to jump' },
    { word: 'Frog',     emoji: '🐸', hint: 'A small green animal that jumps and croaks' },
    { word: 'Fox',      emoji: '🦊', hint: 'A clever animal with orange fur and a bushy tail' },
  ],
  food: [
    { word: 'Apple',      emoji: '🍎', hint: 'A round red or green fruit' },
    { word: 'Pizza',      emoji: '🍕', hint: 'A round Italian dish with cheese and toppings' },
    { word: 'Ice Cream',  emoji: '🍦', hint: 'A cold sweet treat on a cone' },
    { word: 'Banana',     emoji: '🍌', hint: 'A yellow curved fruit' },
    { word: 'Strawberry', emoji: '🍓', hint: 'A small red fruit with seeds on the outside' },
    { word: 'Carrot',     emoji: '🥕', hint: 'An orange vegetable that rabbits love' },
    { word: 'Cake',       emoji: '🎂', hint: 'A sweet baked treat, often for birthdays' },
    { word: 'Grapes',     emoji: '🍇', hint: 'Small round fruits that grow in clusters' },
    { word: 'Watermelon', emoji: '🍉', hint: 'A big green fruit with red inside' },
    { word: 'Cookie',     emoji: '🍪', hint: 'A small round sweet biscuit' },
  ],
  places: [
    { word: 'School',   emoji: '🏫', hint: 'Where children go to learn' },
    { word: 'Hospital', emoji: '🏥', hint: 'Where doctors and nurses help sick people' },
    { word: 'Park',     emoji: '🌳', hint: 'An outdoor space with grass, trees, and benches' },
    { word: 'Library',  emoji: '📚', hint: 'A building where you can borrow books' },
    { word: 'Home',     emoji: '🏠', hint: 'The place where you live with your family' },
    { word: 'Beach',    emoji: '🏖️', hint: 'A sandy place next to the sea' },
    { word: 'Zoo',      emoji: '🦁', hint: 'A place where you can see many animals' },
    { word: 'Castle',   emoji: '🏰', hint: 'A big strong building where kings and queens live' },
  ],
  transport: [
    { word: 'Car',        emoji: '🚗',  hint: 'A vehicle with four wheels' },
    { word: 'Aeroplane',  emoji: '✈️',  hint: 'A vehicle that flies through the sky' },
    { word: 'Bicycle',    emoji: '🚲',  hint: 'A two-wheeled vehicle you pedal' },
    { word: 'Bus',        emoji: '🚌',  hint: 'A large vehicle that carries many people' },
    { word: 'Boat',       emoji: '⛵',  hint: 'A vehicle that travels on water' },
    { word: 'Train',      emoji: '🚂',  hint: 'A vehicle that runs on rails' },
    { word: 'Rocket',     emoji: '🚀',  hint: 'A vehicle that travels to outer space' },
    { word: 'Ambulance',  emoji: '🚑',  hint: 'An emergency vehicle for sick or injured people' },
  ],
  emotions_words: [
    { word: 'Happy',       emoji: '😄', hint: 'Feeling joyful and cheerful' },
    { word: 'Sad',         emoji: '😢', hint: 'Feeling unhappy or down' },
    { word: 'Excited',     emoji: '🤩', hint: 'Very enthusiastic and eager' },
    { word: 'Scared',      emoji: '😨', hint: 'Feeling afraid or frightened' },
    { word: 'Surprised',   emoji: '😮', hint: 'Feeling shocked or amazed by something unexpected' },
    { word: 'Proud',       emoji: '🥹', hint: 'Feeling great about an achievement' },
    { word: 'Confused',    emoji: '😕', hint: 'Feeling unsure or puzzled' },
    { word: 'Frustrated',  emoji: '😤', hint: 'Feeling annoyed because of difficulty' },
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

function generateQuestions(difficulty) {
  const allWords = Object.values(WORD_CATEGORIES).flat()
  const shuffled = shuffle(allWords)
  const count = difficulty === 'easy' ? 6 : difficulty === 'medium' ? 9 : 12

  return shuffled.slice(0, count).map(word => {
    const wrongPool = shuffle(allWords.filter(w => w.word !== word.word)).slice(0, 3)
    const options = shuffle([word, ...wrongPool])
    return { ...word, options }
  })
}

export default function VocabularyBuilder({ difficulty = 'easy', onComplete }) {
  const { state } = useApp()
  const soundEnabled = state.settings.soundEnabled

  const [questions] = useState(() => generateQuestions(difficulty))
  const [current, setCurrent] = useState(0)
  const [answered, setAnswered] = useState(null)
  const [correct, setCorrect] = useState(null)
  const [score, setScore] = useState(0)
  const [showHint, setShowHint] = useState(false)

  const q = questions[current]
  const totalQuestions = questions.length
  const pct = Math.round((current / totalQuestions) * 100)

  function speak(text) {
    if (soundEnabled && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel()
      const utterance = new SpeechSynthesisUtterance(text)
      utterance.rate = 0.9
      utterance.pitch = 1.1
      window.speechSynthesis.speak(utterance)
    }
  }

  function handleAnswer(word) {
    if (answered !== null) return
    setAnswered(word)
    const isCorrect = word === q.word
    setCorrect(isCorrect)
    if (isCorrect) {
      setScore(s => s + 1)
      speak(`${q.word}! That's correct!`)
    } else {
      speak(`The answer was ${q.word}.`)
    }
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
      setShowHint(false)
    }
  }

  return (
    <div className="max-w-lg mx-auto space-y-5">
      {/* Progress */}
      <div className="flex items-center gap-3">
        <div className="flex-1 h-2.5 bg-gray-100 dark:bg-white/10 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-brand-green to-brand-teal rounded-full transition-all duration-500"
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

      {/* Emoji display */}
      <div className="card p-8 text-center">
        <p className="text-sm font-bold text-[var(--text-muted)] mb-4">What is this called?</p>
        <div
          className="text-8xl sm:text-9xl mb-4 animate-float inline-block select-none"
          aria-hidden="true"
          role="img"
        >
          {q.emoji}
        </div>

        {/* Text-to-speech button */}
        {soundEnabled && (
          <div className="flex justify-center">
            <button
              onClick={() => speak(`What is this? Is it ${q.options.map(o => o.word).join(', or ')}?`)}
              className="flex items-center gap-2 text-xs text-brand-purple font-semibold hover:text-brand-purple-dark transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-[var(--focus-ring)] rounded"
              aria-label="Read the question aloud"
            >
              <Volume2 size={14} aria-hidden="true" />
              Read aloud
            </button>
          </div>
        )}

        {/* Hint */}
        <button
          onClick={() => { setShowHint(h => !h); if (!showHint) speak(q.hint) }}
          className="block mx-auto mt-3 text-xs text-brand-purple font-semibold hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-[var(--focus-ring)] rounded"
          aria-expanded={showHint}
        >
          {showHint ? 'Hide hint ↑' : '💡 Hint'}
        </button>
        {showHint && (
          <p className="mt-2 text-sm text-[var(--text-secondary)] bg-yellow-50 dark:bg-yellow-900/20 rounded-xl px-3 py-2">
            {q.hint}
          </p>
        )}
      </div>

      {/* Word options */}
      <div
        className="grid grid-cols-2 gap-3"
        role="group"
        aria-label="Choose the correct word"
      >
        {q.options.map((option, i) => {
          const isSelected = answered === option.word
          const isRight = option.word === q.word
          let cls = 'border-[var(--border)] hover:border-brand-green/60 hover:-translate-y-0.5 cursor-pointer'
          if (answered !== null) {
            if (isRight) cls = 'border-green-400 bg-green-50 dark:bg-green-900/20 cursor-default'
            else if (isSelected) cls = 'border-red-400 bg-red-50 dark:bg-red-900/20 cursor-default'
            else cls = 'opacity-40 border-[var(--border)] cursor-default'
          }

          return (
            <button
              key={i}
              onClick={() => handleAnswer(option.word)}
              disabled={answered !== null}
              aria-label={`${option.word}${answered !== null ? (isRight ? ' — correct' : isSelected ? ' — incorrect' : '') : ''}`}
              className={`flex flex-col items-center gap-2 p-4 rounded-2xl border-2 text-center transition-all focus-visible:outline focus-visible:outline-3 focus-visible:outline-[var(--focus-ring)] ${cls}`}
            >
              <span className="text-3xl" aria-hidden="true">{option.emoji}</span>
              <span className="font-bold text-[var(--text-primary)]">{option.word}</span>
              {answered !== null && isRight && <CheckCircle size={16} className="text-green-500" aria-hidden="true" />}
              {answered !== null && isSelected && !isRight && <XCircle size={16} className="text-red-500" aria-hidden="true" />}
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
            ? `✅ Correct! That's a ${q.word}! ${q.hint}`
            : `💙 It was "${q.word}" — ${q.hint}`
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
