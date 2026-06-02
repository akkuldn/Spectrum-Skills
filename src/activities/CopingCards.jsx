import React, { useState } from 'react'
import Button from '../components/ui/Button'
import { ChevronLeft, ChevronRight, Heart } from 'lucide-react'

const CARDS = [
  { emoji: '🫧', title: 'Bubble Breathing', color: 'from-blue-100 to-sky-100', border: 'border-blue-200', text: 'text-blue-700', steps: ['Take a sloooow deep breath in for 4 counts.', 'Hold it gently for 2 counts.', 'Breathe out slowly for 6 counts — like blowing a big bubble.', 'Repeat 3 times. Feel the calm.'] },
  { emoji: '🌈', title: '5-4-3-2-1 Grounding', color: 'from-violet-100 to-purple-100', border: 'border-violet-200', text: 'text-violet-700', steps: ['Name 5 things you can SEE right now.', 'Touch 4 things around you.', 'Listen for 3 sounds.', 'Name 2 things you can smell.', 'Notice 1 thing you can taste.'] },
  { emoji: '💪', title: 'Power Squeeze', color: 'from-orange-100 to-amber-100', border: 'border-orange-200', text: 'text-orange-700', steps: ['Make tight fists with both hands.', 'Squeeze as hard as you can for 5 seconds.', 'Release slowly and feel the tension flow away.', 'Shake your hands gently.', 'Repeat from your toes all the way up your body!'] },
  { emoji: '🧘', title: 'Safe Place Imagination', color: 'from-teal-100 to-cyan-100', border: 'border-teal-200', text: 'text-teal-700', steps: ['Close your eyes and take a deep breath.', 'Imagine your favourite calm, safe place.', 'Notice all the colours, sounds, and smells there.', 'Stay in that place in your mind for a minute.', 'Open your eyes feeling refreshed.'] },
  { emoji: '🚶', title: 'Movement Break', color: 'from-green-100 to-emerald-100', border: 'border-green-200', text: 'text-green-700', steps: ['Stand up and shake your whole body.', 'Do 10 jumping jacks or jump on the spot.', 'March in place for 30 seconds.', 'Roll your shoulders back and forward.', 'Take 3 deep breaths and sit back down.'] },
  { emoji: '🎶', title: 'Hum a Calm Tune', color: 'from-pink-100 to-rose-100', border: 'border-pink-200', text: 'text-pink-700', steps: ['Close your eyes and relax your shoulders.', 'Start humming any gentle tune you like.', 'Feel the vibration in your chest.', 'Breathe slowly as you hum.', 'Open your eyes when you feel calmer.'] },
  { emoji: '✍️', title: 'Brain Dump', color: 'from-indigo-100 to-blue-100', border: 'border-indigo-200', text: 'text-indigo-700', steps: ['Grab paper and a pencil.', 'Write or draw everything that is worrying you.', 'Get it all out of your head and onto the page.', 'Fold the paper up and put it aside.', 'Your brain has "handed off" the worries for now.'] },
  { emoji: '🤗', title: 'Self-Hug', color: 'from-yellow-100 to-amber-100', border: 'border-yellow-200', text: 'text-yellow-700', steps: ['Wrap both arms around yourself.', 'Squeeze gently and hold for 10 seconds.', 'Say quietly: "I am safe. I am okay."', 'Breathe slowly.', 'You deserve kindness — especially from yourself.'] },
  { emoji: '💧', title: 'Cold Water Reset', color: 'from-sky-100 to-cyan-100', border: 'border-sky-200', text: 'text-sky-700', steps: ['Go to a tap or sink.', 'Run cool water over your wrists and hands.', 'Focus on how the water feels on your skin.', 'Take slow breaths as you do this.', 'Pat dry and notice how your body feels calmer.'] },
  { emoji: '⭐', title: 'Count Your Strengths', color: 'from-amber-100 to-yellow-100', border: 'border-amber-200', text: 'text-amber-700', steps: ['Think of 1 thing you are GOOD at.', 'Think of 1 kind thing you did this week.', 'Think of 1 challenge you have overcome.', 'Say them out loud or whisper them to yourself.', 'Remember: you are stronger than you think!'] },
]

export default function CopingCards({ difficulty = 'easy', onComplete }) {
  const [idx, setIdx]       = useState(0)
  const [flipped, setFlipped] = useState(false)
  const [visited, setVisited] = useState(new Set([0]))
  const [favourite, setFavourite] = useState(new Set())

  const card = CARDS[idx]
  const allVisited = visited.size >= CARDS.length

  function go(dir) {
    const next = (idx + dir + CARDS.length) % CARDS.length
    setIdx(next)
    setFlipped(false)
    setVisited(prev => new Set([...prev, next]))
  }

  function toggleFav() {
    setFavourite(prev => {
      const n = new Set(prev)
      if (n.has(idx)) n.delete(idx); else n.add(idx)
      return n
    })
  }

  function handleDone() {
    onComplete({ stars: favourite.size >= 2 ? 3 : favourite.size >= 1 ? 2 : 1, score: 100 })
  }

  return (
    <div className="max-w-sm mx-auto space-y-4">
      {/* Progress dots */}
      <div className="flex justify-center gap-1.5 flex-wrap">
        {CARDS.map((_, i) => (
          <button
            key={i}
            onClick={() => { setIdx(i); setFlipped(false); setVisited(prev => new Set([...prev, i])) }}
            aria-label={`Card ${i + 1}${i === idx ? ' — current' : visited.has(i) ? ' — visited' : ''}`}
            className={`w-3 h-3 rounded-full transition-all focus-visible:outline focus-visible:outline-2 focus-visible:outline-[var(--focus-ring)] ${
              i === idx ? 'bg-brand-purple scale-125' : visited.has(i) ? 'bg-brand-purple/40' : 'bg-gray-200 dark:bg-white/20'
            }`}
          />
        ))}
      </div>

      {/* Card */}
      <div
        className={`rounded-3xl border-2 ${card.border} bg-gradient-to-br ${card.color} p-7 min-h-[260px] flex flex-col justify-between cursor-pointer transition-all duration-300 hover:scale-[1.01]`}
        onClick={() => setFlipped(f => !f)}
        role="button"
        tabIndex={0}
        onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') setFlipped(f => !f) }}
        aria-label={flipped ? `${card.title} — steps. Click to flip back.` : `${card.title} — click to see how`}
      >
        {!flipped ? (
          <div className="text-center flex flex-col items-center justify-center flex-1 gap-4">
            <span className="text-7xl" aria-hidden="true">{card.emoji}</span>
            <h3 className={`text-2xl font-black ${card.text}`}>{card.title}</h3>
            <p className="text-sm text-[var(--text-muted)]">Tap to see how it works ✨</p>
          </div>
        ) : (
          <div className="flex flex-col flex-1 gap-3">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-2xl" aria-hidden="true">{card.emoji}</span>
              <h3 className={`font-black ${card.text}`}>{card.title}</h3>
            </div>
            <ol className="space-y-2 flex-1">
              {card.steps.map((step, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-[var(--text-primary)]">
                  <span className={`font-black ${card.text} flex-shrink-0`}>{i + 1}.</span>
                  <span>{step}</span>
                </li>
              ))}
            </ol>
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="flex items-center justify-between">
        <button onClick={() => go(-1)} aria-label="Previous card" className="p-3 rounded-2xl bg-[var(--bg-card)] border border-[var(--border)] hover:border-brand-purple/50 transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-[var(--focus-ring)] min-h-[44px] min-w-[44px] flex items-center justify-center">
          <ChevronLeft size={20} aria-hidden="true" />
        </button>

        <button
          onClick={toggleFav}
          aria-label={favourite.has(idx) ? 'Remove from favourites' : 'Save as favourite'}
          aria-pressed={favourite.has(idx)}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl border-2 font-semibold text-sm transition-all focus-visible:outline focus-visible:outline-2 focus-visible:outline-[var(--focus-ring)] ${
            favourite.has(idx)
              ? 'border-pink-400 bg-pink-50 dark:bg-pink-900/20 text-pink-600'
              : 'border-[var(--border)] text-[var(--text-muted)] hover:border-pink-400/50'
          }`}
        >
          <Heart size={16} className={favourite.has(idx) ? 'fill-pink-500' : ''} aria-hidden="true" />
          {favourite.has(idx) ? 'Saved!' : 'Save'}
        </button>

        <button onClick={() => go(1)} aria-label="Next card" className="p-3 rounded-2xl bg-[var(--bg-card)] border border-[var(--border)] hover:border-brand-purple/50 transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-[var(--focus-ring)] min-h-[44px] min-w-[44px] flex items-center justify-center">
          <ChevronRight size={20} aria-hidden="true" />
        </button>
      </div>

      <p className="text-center text-xs text-[var(--text-muted)]">
        {visited.size}/{CARDS.length} cards explored
        {favourite.size > 0 && ` · ${favourite.size} saved 💙`}
      </p>

      {allVisited && (
        <Button fullWidth size="lg" onClick={handleDone} className="animate-slide-up">
          🏆 Done Exploring!
        </Button>
      )}
    </div>
  )
}
