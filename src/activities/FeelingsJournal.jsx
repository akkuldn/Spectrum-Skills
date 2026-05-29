import React, { useState } from 'react'
import { BookOpen, ChevronRight } from 'lucide-react'
import { useApp } from '../context/AppContext'
import { SIMPLE_EMOTIONS } from '../data/emotions'
import Button from '../components/ui/Button'

const PROMPTS = [
  'What made me smile today was…',
  'I felt proud when…',
  'Something hard happened today. It was…',
  'I am grateful for…',
  'I felt worried about…',
  'My favourite part of today was…',
  'I wish I could…',
  'Something I did well today was…',
  'I felt brave when…',
  'I am looking forward to…',
  'I got upset because…',
  'Something that helped me feel better was…',
  'I learned something new today! It was…',
  'My feelings today were…',
]

const STICKERS = ['⭐', '🌈', '💙', '🌟', '❤️', '🦋', '🌻', '🎉', '🏆', '🌸', '🤩', '💪', '🙌', '✨', '🎨', '🧸']

export default function FeelingsJournal({ difficulty = 'easy', onComplete }) {
  const { dispatch, currentProgress } = useApp()
  const [step, setStep] = useState('prompt') // 'prompt' | 'write' | 'sticker' | 'done'
  const [selectedPrompt, setSelectedPrompt] = useState(null)
  const [customPrompt, setCustomPrompt] = useState(false)
  const [selectedMood, setSelectedMood] = useState(null)
  const [text, setText] = useState('')
  const [selectedStickers, setSelectedStickers] = useState([])

  const todayPrompts = PROMPTS.slice(0, 4)

  function toggleSticker(s) {
    setSelectedStickers(prev =>
      prev.includes(s) ? prev.filter(x => x !== s) : prev.length < 5 ? [...prev, s] : prev
    )
  }

  function handleSave() {
    const entry = text.trim() || selectedPrompt || ''
    if (entry) {
      dispatch({ type: 'ADD_JOURNAL_ENTRY', payload: { text: entry, mood: selectedMood?.id } })
    }
    setStep('done')
    onComplete({ stars: 1, score: 100 })
  }

  // Past entries
  const pastEntries = [...currentProgress.journalEntries].reverse().slice(0, 3)

  if (step === 'prompt') {
    return (
      <div className="max-w-md mx-auto space-y-5 py-2">
        <div className="text-center">
          <span className="text-5xl" aria-hidden="true">📓</span>
          <h2 className="text-2xl font-black text-[var(--text-primary)] mt-2">Feelings Journal</h2>
          <p className="text-[var(--text-secondary)] text-sm mt-1">
            This is your safe space. Write about anything you want!
          </p>
        </div>

        {/* Mood selection */}
        <div>
          <p className="text-sm font-bold text-[var(--text-secondary)] mb-2">How are you feeling right now?</p>
          <div className="flex gap-2 flex-wrap" role="group" aria-label="Current mood">
            {SIMPLE_EMOTIONS.map(em => (
              <button
                key={em.id}
                onClick={() => setSelectedMood(em)}
                aria-pressed={selectedMood?.id === em.id}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-2xl border-2 text-sm font-semibold transition-all focus-visible:outline focus-visible:outline-3 focus-visible:outline-[var(--focus-ring)] ${
                  selectedMood?.id === em.id
                    ? 'border-brand-purple bg-violet-50 dark:bg-violet-900/20 text-brand-purple'
                    : 'border-[var(--border)] text-[var(--text-secondary)] hover:border-brand-purple/40'
                }`}
              >
                <span aria-hidden="true">{em.emoji}</span>
                {em.label}
              </button>
            ))}
          </div>
        </div>

        {/* Writing prompts */}
        <div>
          <p className="text-sm font-bold text-[var(--text-secondary)] mb-2">Choose a prompt to write about, or write freely:</p>
          <div className="space-y-2">
            {todayPrompts.map((prompt, i) => (
              <button
                key={i}
                onClick={() => { setSelectedPrompt(prompt); setText(prompt + ' '); setStep('write') }}
                className="w-full text-left p-4 rounded-2xl border-2 border-[var(--border)] hover:border-brand-purple/50 hover:bg-violet-50 dark:hover:bg-violet-900/20 transition-all focus-visible:outline focus-visible:outline-3 focus-visible:outline-[var(--focus-ring)]"
              >
                <span className="text-sm font-semibold text-[var(--text-primary)]">✏️ {prompt}</span>
              </button>
            ))}
            <button
              onClick={() => { setSelectedPrompt(null); setText(''); setStep('write') }}
              className="w-full text-left p-4 rounded-2xl border-2 border-dashed border-violet-200 dark:border-violet-800 text-violet-600 dark:text-violet-400 font-bold text-sm hover:border-violet-400 hover:bg-violet-50 dark:hover:bg-violet-900/20 transition-all focus-visible:outline focus-visible:outline-3 focus-visible:outline-[var(--focus-ring)]"
            >
              ✨ Write freely — no prompt
            </button>
          </div>
        </div>

        {/* Past entries preview */}
        {pastEntries.length > 0 && (
          <div className="card bg-gray-50 dark:bg-white/5">
            <p className="text-xs font-bold text-[var(--text-muted)] mb-3">Your recent entries</p>
            <div className="space-y-2">
              {pastEntries.map((entry, i) => (
                <div key={i} className="text-sm">
                  <p className="text-[var(--text-muted)] text-xs">{new Date(entry.date).toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' })}</p>
                  <p className="text-[var(--text-secondary)] line-clamp-1 italic">"{entry.text}"</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    )
  }

  if (step === 'write') {
    return (
      <div className="max-w-md mx-auto space-y-5 py-2">
        {/* Mood display */}
        {selectedMood && (
          <div className="flex items-center gap-2 text-sm text-[var(--text-secondary)]">
            <span aria-hidden="true">{selectedMood.emoji}</span>
            <span>Feeling <strong>{selectedMood.label}</strong> right now</span>
          </div>
        )}

        {/* Writing area */}
        <div>
          <label htmlFor="journal-text" className="block text-sm font-bold text-[var(--text-secondary)] mb-2">
            {selectedPrompt ? `"${selectedPrompt}"` : 'Write anything on your mind…'}
          </label>
          <textarea
            id="journal-text"
            value={text}
            onChange={e => setText(e.target.value)}
            placeholder="Start writing here. There's no right or wrong — just your honest thoughts and feelings…"
            rows={8}
            maxLength={1000}
            autoFocus
            className="w-full px-4 py-3 rounded-2xl border-2 border-[var(--border)] bg-[var(--bg-card)] text-[var(--text-primary)] placeholder:text-[var(--text-muted)] text-base leading-relaxed resize-none focus:outline-none focus:border-brand-purple transition-colors"
            aria-describedby="char-count"
          />
          <p id="char-count" className="text-xs text-[var(--text-muted)] text-right mt-1">{text.length}/1000</p>
        </div>

        <div className="flex gap-3">
          <Button variant="outline" onClick={() => setStep('prompt')}>Back</Button>
          <Button
            fullWidth
            onClick={() => setStep('sticker')}
          >
            Add stickers <ChevronRight size={16} aria-hidden="true" />
          </Button>
        </div>

        {/* Safety note */}
        <p className="text-xs text-[var(--text-muted)] text-center">
          🔒 Your journal is private and only you (and your parents/carers) can see it.
        </p>
      </div>
    )
  }

  if (step === 'sticker') {
    return (
      <div className="max-w-md mx-auto space-y-5 py-2">
        <div className="text-center">
          <h3 className="text-xl font-black text-[var(--text-primary)]">Add stickers to your entry!</h3>
          <p className="text-sm text-[var(--text-secondary)] mt-1">Choose up to 5 stickers ({selectedStickers.length}/5)</p>
        </div>

        {/* Selected preview */}
        {selectedStickers.length > 0 && (
          <div className="flex justify-center gap-2 py-2 bg-violet-50 dark:bg-violet-900/20 rounded-2xl">
            {selectedStickers.map((s, i) => (
              <span key={i} className="text-3xl" aria-hidden="true">{s}</span>
            ))}
          </div>
        )}

        {/* Sticker grid */}
        <div
          className="grid grid-cols-4 gap-2"
          role="group"
          aria-label="Choose stickers for your journal entry"
        >
          {STICKERS.map(s => (
            <button
              key={s}
              onClick={() => toggleSticker(s)}
              aria-pressed={selectedStickers.includes(s)}
              aria-label={`${s} sticker${selectedStickers.includes(s) ? ' — selected' : ''}`}
              className={`aspect-square text-3xl rounded-2xl border-2 flex items-center justify-center transition-all focus-visible:outline focus-visible:outline-3 focus-visible:outline-[var(--focus-ring)] ${
                selectedStickers.includes(s)
                  ? 'border-brand-purple bg-violet-50 dark:bg-violet-900/20 scale-110'
                  : 'border-[var(--border)] hover:border-brand-purple/50 hover:scale-105'
              }`}
            >
              {s}
            </button>
          ))}
        </div>

        <div className="flex gap-3">
          <Button variant="outline" onClick={() => setStep('write')}>Back</Button>
          <Button fullWidth onClick={handleSave} variant="success">
            <BookOpen size={18} aria-hidden="true" />
            Save my entry ✓
          </Button>
        </div>
      </div>
    )
  }

  if (step === 'done') {
    return (
      <div className="max-w-md mx-auto text-center space-y-5 py-8">
        <div className="text-7xl animate-pop-in" aria-hidden="true">📓</div>
        <h2 className="text-2xl font-black text-[var(--text-primary)]">Journal saved!</h2>
        <p className="text-[var(--text-secondary)]">
          Writing about your feelings takes bravery and self-awareness. You should be really proud!
        </p>

        {selectedStickers.length > 0 && (
          <div className="flex justify-center gap-2" aria-label="Your chosen stickers">
            {selectedStickers.map((s, i) => (
              <span key={i} className="text-3xl" aria-hidden="true">{s}</span>
            ))}
          </div>
        )}

        <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-100 rounded-2xl p-4">
          <p className="text-yellow-700 font-bold text-sm">⭐ You earned a star for writing in your journal!</p>
          <p className="text-yellow-600 text-xs mt-1">
            Journal entries: {currentProgress.journalEntries.length + 1}
          </p>
        </div>

        {selectedMood && (
          <p className="text-sm text-[var(--text-secondary)]">
            You checked in feeling <strong>{selectedMood.label}</strong> {selectedMood.emoji}
          </p>
        )}
      </div>
    )
  }

  return null
}
