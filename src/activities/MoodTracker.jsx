import React, { useState } from 'react'
import { useApp } from '../context/AppContext'
import { EMOTIONS, SIMPLE_EMOTIONS, COPING_STRATEGIES } from '../data/emotions'
import Button from '../components/ui/Button'

const AFFIRMATIONS = {
  happy:      ["That's wonderful! Happiness is a gift — enjoy every moment of it! 🌟", "Your joy is contagious! Keep smiling! ☀️"],
  excited:    ["Excitement is amazing! Channel that energy into something fun! ⚡", "Wow, you're buzzing with energy! Amazing! 🎉"],
  proud:      ["Being proud of yourself is so important! You worked hard and it shows! 🌟", "You should be proud — you earned it! 🏆"],
  loved:      ["You are so loved and cared for! That warm feeling is real! 💙", "Knowing you're loved is a superpower! 🤗"],
  calm:       ["Being calm is a superpower! Enjoy this peaceful feeling. 🌿", "That calm feeling is so valuable. Take a deep breath and savour it! 🌸"],
  sad:        ["It's completely okay to feel sad. Your feelings are always valid. 💙", "Sadness won't last forever. Be gentle with yourself today. 🌧️"],
  angry:      ["Feeling angry is normal and okay. Try to take some deep breaths. 🌬️", "Your anger is valid. Remember, it will pass. Take a break if you need to. 💙"],
  scared:     ["Feeling scared is brave to admit. You're not alone. 💪", "It's okay to feel scared sometimes. Take things one step at a time. 🤗"],
  nervous:    ["Nerves mean something matters to you — that's great! You can do this! 💪", "It's okay to feel nervous. Take a deep breath — you've got this! 🌟"],
  frustrated: ["Frustration means you're trying hard! That effort is admirable. 💪", "It's okay to feel frustrated. Take a break and try again later! 🌱"],
  confused:   ["It's okay not to understand everything right away. Ask for help! 🙋", "Confusion is just the feeling before you understand something new! 🧠"],
  bored:      ["Boredom is a signal to try something new and interesting! 🗺️", "Being bored means your brain is ready for something creative! 🎨"],
  tired:      ["Rest is so important! Your body and mind deserve a break. 😴", "It's okay to feel tired. Make sure to get some rest today! 🌙"],
  silly:      ["Being silly is wonderful! Laughter is great medicine! 🤪", "Your playful spirit is a gift! Have some fun! 🎭"],
  surprised:  ["Surprises keep life interesting! 😮", "Being surprised means you were paying attention! 👀"],
}

export default function MoodTracker({ difficulty = 'easy', onComplete }) {
  const { dispatch, currentProgress } = useApp()
  const [step, setStep] = useState('select')  // 'select' | 'note' | 'done'
  const [selectedMood, setSelectedMood] = useState(null)
  const [note, setNote] = useState('')
  const [affirmation, setAffirmation] = useState('')

  const emotions = difficulty === 'hard' ? EMOTIONS : SIMPLE_EMOTIONS

  function handleMoodSelect(emotion) {
    setSelectedMood(emotion)
    const affs = AFFIRMATIONS[emotion.id] ?? ["Thank you for sharing how you feel! 💙"]
    setAffirmation(affs[Math.floor(Math.random() * affs.length)])
    setStep('note')
  }

  function handleSave() {
    dispatch({ type: 'LOG_MOOD', payload: { mood: selectedMood.id, note } })
    setStep('done')
    onComplete({ stars: 1, score: 100 })
  }

  // Today's mood history
  const today = new Date().toISOString().split('T')[0]
  const todayMoods = currentProgress.moods.filter(m => m.date.startsWith(today))

  if (step === 'select') {
    return (
      <div className="max-w-lg mx-auto space-y-6 py-2">
        <div className="text-center">
          <h2 className="text-2xl font-black text-[var(--text-primary)]">How are you feeling? 🌤️</h2>
          <p className="text-[var(--text-secondary)] mt-1 text-sm">
            There's no wrong answer — all feelings are welcome here.
          </p>
        </div>

        {/* Mood grid */}
        <div
          className="grid grid-cols-3 gap-3"
          role="listbox"
          aria-label="Select your current mood"
        >
          {emotions.map(emotion => (
            <button
              key={emotion.id}
              onClick={() => handleMoodSelect(emotion)}
              role="option"
              aria-selected={false}
              aria-label={`${emotion.label}: ${emotion.description}`}
              className="flex flex-col items-center gap-2 p-4 rounded-3xl border-2 border-[var(--border)] hover:border-brand-purple/50 hover:-translate-y-1 hover:shadow-card transition-all group focus-visible:outline focus-visible:outline-3 focus-visible:outline-[var(--focus-ring)]"
              style={{ background: `${emotion.color}20` }}
            >
              <span className="text-4xl group-hover:scale-110 transition-transform" aria-hidden="true">
                {emotion.emoji}
              </span>
              <span className="text-sm font-bold text-[var(--text-primary)]">{emotion.label}</span>
            </button>
          ))}
        </div>

        {/* Today's previous moods */}
        {todayMoods.length > 0 && (
          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800 rounded-2xl p-4">
            <p className="text-sm font-bold text-blue-700 dark:text-blue-300 mb-2">Today's mood log</p>
            <div className="flex flex-wrap gap-2">
              {todayMoods.map((m, i) => {
                const em = emotions.find(e => e.id === m.mood)
                return (
                  <span key={i} className="flex items-center gap-1 px-3 py-1 bg-white dark:bg-white/10 rounded-full text-sm">
                    <span aria-hidden="true">{em?.emoji ?? '😊'}</span>
                    <span className="font-semibold capitalize text-[var(--text-primary)]">{m.mood}</span>
                  </span>
                )
              })}
            </div>
          </div>
        )}
      </div>
    )
  }

  if (step === 'note') {
    const coping = COPING_STRATEGIES[selectedMood?.id]
    return (
      <div className="max-w-md mx-auto space-y-6 py-2">
        {/* Mood confirmation */}
        <div
          className="text-center p-6 rounded-3xl border-2"
          style={{ background: `${selectedMood.color}20`, borderColor: `${selectedMood.color}60` }}
        >
          <span className="text-6xl" aria-hidden="true">{selectedMood.emoji}</span>
          <h2 className="text-2xl font-black text-[var(--text-primary)] mt-3">
            You're feeling {selectedMood.label}
          </h2>
          <p
            className="text-[var(--text-secondary)] mt-2 text-sm leading-relaxed"
            aria-live="polite"
          >
            {affirmation}
          </p>
        </div>

        {/* Optional note */}
        <div>
          <label htmlFor="mood-note" className="block text-sm font-bold text-[var(--text-secondary)] mb-2">
            Want to write anything about how you feel? (optional)
          </label>
          <textarea
            id="mood-note"
            value={note}
            onChange={e => setNote(e.target.value)}
            placeholder="Write a little about your day, or what made you feel this way…"
            rows={3}
            maxLength={300}
            className="w-full px-4 py-3 rounded-2xl border-2 border-[var(--border)] bg-[var(--bg-card)] text-[var(--text-primary)] placeholder:text-[var(--text-muted)] text-sm resize-none focus:outline-none focus:border-brand-purple transition-colors"
          />
          <p className="text-xs text-[var(--text-muted)] text-right mt-1">{note.length}/300</p>
        </div>

        {/* Coping strategies if needed */}
        {coping && ['angry', 'sad', 'scared', 'frustrated'].includes(selectedMood.id) && (
          <div>
            <p className="text-sm font-bold text-[var(--text-secondary)] mb-2">
              💡 Things that might help:
            </p>
            <div className="grid grid-cols-2 gap-2">
              {coping.slice(0, 2).map((strategy, i) => (
                <div key={i} className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-2xl border border-blue-100 dark:border-blue-800">
                  <span className="text-xl" aria-hidden="true">{strategy.emoji}</span>
                  <p className="font-bold text-xs text-blue-700 dark:text-blue-300 mt-1">{strategy.title}</p>
                  <p className="text-[10px] text-[var(--text-muted)] mt-0.5 leading-tight">{strategy.description}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="flex gap-3">
          <Button variant="outline" onClick={() => setStep('select')}>Back</Button>
          <Button fullWidth onClick={handleSave}>Save Mood ✓</Button>
        </div>
      </div>
    )
  }

  if (step === 'done') {
    return (
      <div className="max-w-md mx-auto text-center space-y-5 py-8">
        <div className="text-7xl animate-pop-in" aria-hidden="true">🌈</div>
        <h2 className="text-2xl font-black text-[var(--text-primary)]">Thank you!</h2>
        <p className="text-[var(--text-secondary)]">
          Checking in with your feelings is a wonderful habit. You're doing great!
        </p>
        <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-100 rounded-2xl p-4">
          <p className="text-yellow-700 font-bold text-sm">⭐ You earned a star for checking in today!</p>
        </div>

        {/* Week mood preview */}
        {currentProgress.moods.length >= 2 && (
          <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-2xl p-4">
            <p className="text-sm font-bold text-[var(--text-secondary)] mb-3">Your recent moods</p>
            <div className="flex justify-center gap-2 flex-wrap">
              {currentProgress.moods.slice(-7).map((m, i) => {
                const em = emotions.find(e => e.id === m.mood)
                return (
                  <span
                    key={i}
                    className="text-2xl"
                    aria-label={m.mood}
                    title={`${m.mood} — ${new Date(m.date).toLocaleDateString()}`}
                  >
                    {em?.emoji ?? '😊'}
                  </span>
                )
              })}
            </div>
          </div>
        )}
      </div>
    )
  }

  return null
}
