import React from 'react'
import { Link } from 'react-router-dom'
import { ChevronRight, Star, Shield, Heart, Zap, BookOpen, Brain, Smile, Users } from 'lucide-react'
import Button from '../components/ui/Button'

const FEATURES = [
  { icon: Brain,    color: 'bg-violet-100 text-violet-600',  title: 'Brain Activities',       desc: 'Memory, focus, and problem-solving games designed for your brain.' },
  { icon: Heart,    color: 'bg-pink-100 text-pink-600',      title: 'Emotional Support',      desc: 'Mood tracking, breathing exercises, and coping strategy cards.' },
  { icon: BookOpen, color: 'bg-blue-100 text-blue-600',      title: 'Language & Words',       desc: 'Build vocabulary, recognize emotions, and practice communication.' },
  { icon: Zap,      color: 'bg-yellow-100 text-yellow-600',  title: 'Adaptive Learning',      desc: 'Activities adjust to your child\'s level and grow with them.' },
  { icon: Shield,   color: 'bg-green-100 text-green-600',    title: 'Safe & Affirming',       desc: 'Neurodiversity-affirming — celebrating strengths, never "fixing."' },
  { icon: Users,    color: 'bg-orange-100 text-orange-600',  title: 'Parent Dashboard',       desc: 'Track progress, view reports, and manage screen time together.' },
]

const CATEGORIES = [
  { emoji: '🧠', name: 'Memory', color: 'from-violet-200 to-purple-100' },
  { emoji: '🎯', name: 'Focus',  color: 'from-sky-200 to-blue-100' },
  { emoji: '💬', name: 'Language', color: 'from-orange-200 to-amber-100' },
  { emoji: '💙', name: 'Feelings', color: 'from-indigo-200 to-blue-100' },
  { emoji: '🌈', name: 'Sensory', color: 'from-yellow-200 to-amber-100' },
  { emoji: '🤝', name: 'Social', color: 'from-pink-200 to-rose-100' },
  { emoji: '🧩', name: 'Puzzles', color: 'from-emerald-200 to-green-100' },
  { emoji: '📋', name: 'Planning', color: 'from-teal-200 to-cyan-100' },
]

const TESTIMONIALS = [
  { quote: "My daughter looks forward to her Spectrum Skills time every day. The breathing exercises have helped her so much at school.", name: "Parent of 7-year-old", avatar: '👩' },
  { quote: "The activities are fun and never feel like therapy. My son doesn't know he's learning — he just thinks he's playing!", name: "Parent of 10-year-old", avatar: '👨' },
  { quote: "I love that it celebrates what my child CAN do. The star rewards and badges make him so proud.", name: "Parent of 9-year-old", avatar: '👩‍🦱' },
]

export default function Landing() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#F5F0FF] via-[#F9F7F4] to-white" style={{ fontFamily: 'Nunito, system-ui, sans-serif' }}>
      {/* Skip to content */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 z-50 bg-brand-purple text-white px-4 py-2 rounded-xl font-semibold"
      >
        Skip to main content
      </a>

      {/* Nav */}
      <header className="sticky top-0 z-30 backdrop-blur-md bg-white/80 border-b border-violet-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 font-black text-xl">
            <span aria-hidden="true">🌈</span>
            <span className="bg-gradient-to-r from-violet-600 to-blue-500 bg-clip-text text-transparent">Spectrum Skills</span>
          </div>
          <nav aria-label="Site navigation" className="flex items-center gap-3">
            <Link
              to="/login"
              className="text-sm font-semibold text-slate-600 hover:text-violet-600 transition-colors px-4 py-2 rounded-xl focus-visible:outline focus-visible:outline-3 focus-visible:outline-violet-400 min-h-[44px] flex items-center"
            >
              Sign In
            </Link>
            <Link
              to="/login"
              className="bg-brand-purple text-white px-5 py-2.5 rounded-xl text-sm font-bold hover:bg-brand-purple-dark transition-colors focus-visible:outline focus-visible:outline-3 focus-visible:outline-violet-400 min-h-[44px] flex items-center"
            >
              Get Started Free
            </Link>
          </nav>
        </div>
      </header>

      <main id="main-content">
        {/* Hero */}
        <section aria-labelledby="hero-heading" className="relative overflow-hidden pt-16 pb-20 px-4">
          {/* Background blobs */}
          <div className="absolute top-10 left-1/4 w-64 h-64 bg-violet-200/40 rounded-full blur-3xl pointer-events-none" aria-hidden="true" />
          <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-blue-200/30 rounded-full blur-3xl pointer-events-none" aria-hidden="true" />

          <div className="max-w-4xl mx-auto text-center relative">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 bg-violet-100 text-violet-700 px-4 py-1.5 rounded-full text-sm font-bold mb-6">
              <span aria-hidden="true">✨</span>
              Neurodiversity-Affirming Learning Platform
            </div>

            <h1 id="hero-heading" className="text-4xl sm:text-5xl lg:text-6xl font-black text-slate-800 leading-tight mb-6">
              Learning that{' '}
              <span className="bg-gradient-to-r from-violet-600 via-blue-500 to-teal-400 bg-clip-text text-transparent">
                celebrates
              </span>
              {' '}your child
            </h1>
            <p className="text-lg sm:text-xl text-slate-600 max-w-2xl mx-auto mb-10 leading-relaxed">
              Spectrum Skills is a joyful, screen-time platform for autistic children aged 4–14.
              We build skills through play — never by trying to "fix" anyone.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                to="/login"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-brand-purple text-white px-8 py-4 rounded-2xl text-lg font-black hover:bg-brand-purple-dark transition-all hover:-translate-y-0.5 shadow-lg hover:shadow-xl focus-visible:outline focus-visible:outline-3 focus-visible:outline-violet-400"
              >
                Start for Free
                <ChevronRight size={20} aria-hidden="true" />
              </Link>
              <a
                href="#features"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 border-2 border-violet-200 text-violet-700 px-8 py-4 rounded-2xl text-lg font-bold hover:bg-violet-50 transition-colors focus-visible:outline focus-visible:outline-3 focus-visible:outline-violet-400"
              >
                Learn More
              </a>
            </div>

            {/* Social proof */}
            <div className="mt-10 flex items-center justify-center gap-2 text-slate-500 text-sm">
              <div className="flex -space-x-2" aria-hidden="true">
                {['👦', '👧', '🧒', '👦🏽', '👧🏾'].map((e, i) => (
                  <div key={i} className="w-8 h-8 rounded-full bg-violet-100 border-2 border-white flex items-center justify-center text-sm">{e}</div>
                ))}
              </div>
              <span><strong className="text-slate-700">2,000+</strong> children learning every day</span>
            </div>
          </div>
        </section>

        {/* Activity categories showcase */}
        <section aria-labelledby="categories-heading" className="py-16 px-4 bg-white">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-10">
              <h2 id="categories-heading" className="text-3xl sm:text-4xl font-black text-slate-800 mb-3">
                8 skill areas, hundreds of activities
              </h2>
              <p className="text-slate-600 text-lg">Every activity is designed with autism-affirming principles.</p>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
              {CATEGORIES.map(cat => (
                <div
                  key={cat.name}
                  className={`bg-gradient-to-br ${cat.color} rounded-3xl p-5 text-center`}
                  aria-label={cat.name}
                >
                  <div className="text-4xl mb-2" aria-hidden="true">{cat.emoji}</div>
                  <p className="font-bold text-slate-700 text-sm sm:text-base">{cat.name}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Features */}
        <section id="features" aria-labelledby="features-heading" className="py-16 px-4 bg-[#F9F7F4]">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 id="features-heading" className="text-3xl sm:text-4xl font-black text-slate-800 mb-3">
                Built for every learner
              </h2>
              <p className="text-slate-600 text-lg max-w-xl mx-auto">
                Features designed with input from autistic children, parents, and specialists.
              </p>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {FEATURES.map(f => (
                <div key={f.title} className="bg-white rounded-3xl p-6 shadow-soft border border-gray-100">
                  <div className={`w-12 h-12 ${f.color} rounded-2xl flex items-center justify-center mb-4`} aria-hidden="true">
                    <f.icon size={24} />
                  </div>
                  <h3 className="font-bold text-lg text-slate-800 mb-2">{f.title}</h3>
                  <p className="text-slate-600 text-sm leading-relaxed">{f.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Accessibility highlight */}
        <section aria-labelledby="a11y-heading" className="py-16 px-4 bg-gradient-to-r from-violet-600 to-blue-500 text-white">
          <div className="max-w-4xl mx-auto text-center">
            <h2 id="a11y-heading" className="text-3xl sm:text-4xl font-black mb-6">
              Accessibility first — always
            </h2>
            <div className="grid sm:grid-cols-3 gap-6 mb-10">
              {[
                { icon: '🌙', title: 'Dark & High-Contrast Modes', desc: 'Comfortable for every visual need' },
                { icon: '📖', title: 'Dyslexia-Friendly Fonts', desc: 'Lexend font option for easier reading' },
                { icon: '🔇', title: 'Reduced Motion & Sound Controls', desc: 'Fully customizable sensory experience' },
              ].map(item => (
                <div key={item.title} className="bg-white/15 rounded-2xl p-5">
                  <div className="text-3xl mb-2" aria-hidden="true">{item.icon}</div>
                  <h3 className="font-bold mb-1">{item.title}</h3>
                  <p className="text-white/80 text-sm">{item.desc}</p>
                </div>
              ))}
            </div>
            <p className="text-white/80 text-sm">Built to WCAG 2.2 AA standards</p>
          </div>
        </section>

        {/* Reward system */}
        <section aria-labelledby="rewards-heading" className="py-16 px-4 bg-white">
          <div className="max-w-4xl mx-auto">
            <div className="grid md:grid-cols-2 gap-10 items-center">
              <div>
                <h2 id="rewards-heading" className="text-3xl sm:text-4xl font-black text-slate-800 mb-4">
                  Earn stars, unlock rewards 🌟
                </h2>
                <p className="text-slate-600 mb-6 leading-relaxed">
                  Our reward system is built on <strong>positive reinforcement only</strong> — no punishments, no countdowns, no pressure.
                  Children earn stars, unlock badges, and level up at their own pace.
                </p>
                <ul className="space-y-3" aria-label="Reward features">
                  {[
                    '⭐ Stars for every completed activity',
                    '🏆 20+ achievement badges to unlock',
                    '📈 10 levels of progress to climb',
                    '🎨 Unlockable themes and avatars',
                    '🔥 Daily streaks to celebrate consistency',
                  ].map(item => (
                    <li key={item} className="flex items-center gap-2 text-slate-700">
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="grid grid-cols-3 gap-3" aria-hidden="true">
                {['⭐', '🏆', '🌟', '🔥', '💫', '👑', '🧠', '💙', '🌈'].map((e, i) => (
                  <div
                    key={i}
                    className="aspect-square bg-gradient-to-br from-violet-100 to-blue-50 rounded-2xl flex items-center justify-center text-3xl sm:text-4xl shadow-soft"
                  >
                    {e}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section aria-labelledby="testimonials-heading" className="py-16 px-4 bg-[#F9F7F4]">
          <div className="max-w-5xl mx-auto">
            <h2 id="testimonials-heading" className="text-3xl font-black text-slate-800 text-center mb-10">
              What parents say
            </h2>
            <div className="grid md:grid-cols-3 gap-6">
              {TESTIMONIALS.map((t, i) => (
                <figure key={i} className="bg-white rounded-3xl p-6 shadow-soft border border-gray-100">
                  <blockquote className="text-slate-600 text-sm leading-relaxed mb-4">"{t.quote}"</blockquote>
                  <figcaption className="flex items-center gap-3">
                    <span className="text-2xl" aria-hidden="true">{t.avatar}</span>
                    <span className="font-bold text-sm text-slate-700">{t.name}</span>
                  </figcaption>
                </figure>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section aria-labelledby="cta-heading" className="py-20 px-4 bg-gradient-to-br from-violet-50 to-blue-50">
          <div className="max-w-xl mx-auto text-center">
            <div className="text-6xl mb-4" aria-hidden="true">🌈</div>
            <h2 id="cta-heading" className="text-3xl sm:text-4xl font-black text-slate-800 mb-4">
              Ready to start the adventure?
            </h2>
            <p className="text-slate-600 mb-8 text-lg">
              Create a free profile for your child and start exploring today.
            </p>
            <Link
              to="/login"
              className="inline-flex items-center gap-2 bg-brand-purple text-white px-10 py-4 rounded-2xl text-lg font-black hover:bg-brand-purple-dark transition-all hover:-translate-y-0.5 shadow-lg focus-visible:outline focus-visible:outline-3 focus-visible:outline-violet-400"
            >
              Start for Free
              <ChevronRight size={20} aria-hidden="true" />
            </Link>
            <p className="mt-4 text-slate-500 text-sm">No account required to get started.</p>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-slate-800 text-white py-8 px-4">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 font-black text-lg">
            <span aria-hidden="true">🌈</span>
            <span>Spectrum Skills</span>
          </div>
          <p className="text-slate-400 text-sm text-center">
            Built with love for neurodivergent children and families everywhere.
          </p>
          <p className="text-slate-500 text-xs">© 2025 Spectrum Skills</p>
        </div>
      </footer>
    </div>
  )
}
