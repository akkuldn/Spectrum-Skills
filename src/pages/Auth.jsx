import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { ChevronRight, Plus, Trash2, ArrowLeft, Check } from 'lucide-react'
import { useApp } from '../context/AppContext'
import Button from '../components/ui/Button'

const AVATARS = ['🦋', '🐶', '🐱', '🦊', '🐻', '🐼', '🦁', '🐸', '🦄', '🐢', '🦖', '🐳', '🦜', '🐬', '🌟', '🚀', '🌈', '⚡', '🎮', '🎨']

const FAVORITE_COLORS = [
  { id: 'purple', label: 'Purple', bg: 'bg-violet-400', border: 'border-violet-500' },
  { id: 'blue',   label: 'Blue',   bg: 'bg-sky-400',    border: 'border-sky-500' },
  { id: 'green',  label: 'Green',  bg: 'bg-emerald-400',border: 'border-emerald-500' },
  { id: 'peach',  label: 'Peach',  bg: 'bg-orange-300', border: 'border-orange-400' },
  { id: 'pink',   label: 'Pink',   bg: 'bg-pink-400',   border: 'border-pink-500' },
  { id: 'teal',   label: 'Teal',   bg: 'bg-teal-400',   border: 'border-teal-500' },
  { id: 'yellow', label: 'Yellow', bg: 'bg-yellow-400', border: 'border-yellow-500' },
  { id: 'coral',  label: 'Coral',  bg: 'bg-red-400',    border: 'border-red-500' },
]

const DIFFICULTIES = [
  { id: 'easy',   label: 'Just Starting', emoji: '🌱', desc: 'Simple activities, lots of help' },
  { id: 'medium', label: 'Getting Good',  emoji: '🌻', desc: 'Regular activities with some challenge' },
  { id: 'hard',   label: 'Challenging',   emoji: '🔥', desc: 'Harder activities for big thinkers' },
]

const AGE_RANGES = [
  { label: '4–5 years',  min: 4, max: 5 },
  { label: '6–7 years',  min: 6, max: 7 },
  { label: '8–10 years', min: 8, max: 10 },
  { label: '11–14 years',min: 11, max: 14 },
]

export default function Auth() {
  const { state, dispatch } = useApp()
  const navigate = useNavigate()
  const [view, setView] = useState(state.profiles.length > 0 ? 'select' : 'create')

  // Create form state
  const [step, setStep] = useState(1) // 1=name/age, 2=avatar, 3=settings
  const [form, setForm] = useState({
    name: '',
    age: 7,
    avatar: '🦋',
    favoriteColor: 'purple',
    difficulty: 'medium',
  })
  const [errors, setErrors] = useState({})

  function handleSelect(profileId) {
    dispatch({ type: 'SELECT_PROFILE', payload: profileId })
    navigate('/dashboard')
  }

  function handleDelete(e, profileId) {
    e.stopPropagation()
    if (window.confirm('Delete this profile? All progress will be lost.')) {
      dispatch({ type: 'DELETE_PROFILE', payload: profileId })
    }
  }

  function validateStep1() {
    const e = {}
    if (!form.name.trim()) e.name = 'Please enter a name'
    else if (form.name.trim().length < 2) e.name = 'Name must be at least 2 characters'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  function nextStep() {
    if (step === 1 && !validateStep1()) return
    setStep(s => s + 1)
  }

  function handleCreate() {
    dispatch({ type: 'CREATE_PROFILE', payload: { ...form, name: form.name.trim() } })
    navigate('/dashboard')
  }

  if (view === 'select') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-violet-50 via-white to-blue-50 flex flex-col items-center justify-center px-4 py-10">
        <div className="w-full max-w-lg">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="text-5xl mb-3" aria-hidden="true">🌈</div>
            <h1 className="text-3xl font-black text-slate-800 mb-2">Welcome back!</h1>
            <p className="text-slate-600">Who is learning today?</p>
          </div>

          {/* Profile cards */}
          <div className="space-y-3 mb-6" role="list" aria-label="Choose a profile">
            {state.profiles.map(profile => (
              <div
                key={profile.id}
                role="listitem"
              >
                <button
                  onClick={() => handleSelect(profile.id)}
                  className="w-full flex items-center gap-4 p-4 bg-white rounded-3xl border-2 border-gray-100 hover:border-violet-300 hover:shadow-card transition-all text-left group focus-visible:outline focus-visible:outline-3 focus-visible:outline-violet-400"
                  aria-label={`Sign in as ${profile.name}`}
                >
                  <div className="w-14 h-14 bg-gradient-to-br from-violet-100 to-blue-100 rounded-2xl flex items-center justify-center text-3xl shadow-sm flex-shrink-0 group-hover:scale-105 transition-transform" aria-hidden="true">
                    {profile.avatar}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-black text-lg text-slate-800">{profile.name}</p>
                    <p className="text-sm text-slate-500">Age {profile.age} · {profile.difficulty === 'easy' ? '🌱 Just Starting' : profile.difficulty === 'medium' ? '🌻 Getting Good' : '🔥 Challenging'}</p>
                  </div>
                  <ChevronRight size={20} className="text-slate-400 group-hover:text-violet-500 transition-colors flex-shrink-0" aria-hidden="true" />
                  <button
                    onClick={(e) => handleDelete(e, profile.id)}
                    aria-label={`Delete ${profile.name}'s profile`}
                    className="p-2 rounded-xl hover:bg-red-50 text-slate-400 hover:text-red-500 transition-colors focus-visible:outline focus-visible:outline-3 focus-visible:outline-red-400"
                  >
                    <Trash2 size={16} aria-hidden="true" />
                  </button>
                </button>
              </div>
            ))}
          </div>

          {/* Add new profile */}
          <button
            onClick={() => { setStep(1); setView('create') }}
            className="w-full flex items-center justify-center gap-2 p-4 rounded-3xl border-2 border-dashed border-violet-200 text-violet-600 font-bold hover:border-violet-400 hover:bg-violet-50 transition-colors focus-visible:outline focus-visible:outline-3 focus-visible:outline-violet-400"
          >
            <Plus size={20} aria-hidden="true" />
            Add new profile
          </button>

          <div className="text-center mt-6">
            <Link to="/" className="text-sm text-slate-500 hover:text-violet-600 transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-violet-400 rounded">
              ← Back to home
            </Link>
          </div>
        </div>
      </div>
    )
  }

  // Create profile — multi-step
  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-50 via-white to-blue-50 flex flex-col items-center justify-center px-4 py-10">
      <div className="w-full max-w-md">
        {/* Back button */}
        {state.profiles.length > 0 && (
          <button
            onClick={() => setView('select')}
            className="flex items-center gap-2 text-sm text-slate-500 hover:text-violet-600 mb-6 transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-violet-400 rounded"
          >
            <ArrowLeft size={16} aria-hidden="true" />
            Back
          </button>
        )}

        {/* Step indicator */}
        <div className="flex items-center justify-center gap-2 mb-8" aria-label={`Step ${step} of 3`}>
          {[1, 2, 3].map(s => (
            <div
              key={s}
              aria-current={s === step ? 'step' : undefined}
              className={`h-2 rounded-full transition-all duration-300 ${
                s === step ? 'w-8 bg-brand-purple' : s < step ? 'w-4 bg-brand-purple/50' : 'w-4 bg-gray-200'
              }`}
            />
          ))}
        </div>

        <div className="bg-white rounded-3xl shadow-soft border border-gray-100 p-6 sm:p-8">
          {/* Step 1: Name & Age */}
          {step === 1 && (
            <div>
              <div className="text-center mb-6">
                <div className="text-5xl mb-3" aria-hidden="true">👋</div>
                <h1 className="text-2xl font-black text-slate-800 mb-1">Let's get started!</h1>
                <p className="text-slate-500 text-sm">Tell us about the child learning today.</p>
              </div>

              <div className="space-y-4">
                <div>
                  <label htmlFor="profile-name" className="block text-sm font-bold text-slate-700 mb-1.5">
                    What's your name? <span aria-hidden="true">😊</span>
                  </label>
                  <input
                    id="profile-name"
                    type="text"
                    value={form.name}
                    onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                    onKeyDown={e => { if (e.key === 'Enter') nextStep() }}
                    placeholder="e.g. Alex"
                    maxLength={30}
                    autoFocus
                    aria-describedby={errors.name ? 'name-error' : undefined}
                    aria-invalid={!!errors.name}
                    className={`w-full px-4 py-3 rounded-2xl border-2 text-lg font-semibold text-slate-800 placeholder:text-slate-300 focus:outline-none focus:border-violet-400 transition-colors ${errors.name ? 'border-red-400 bg-red-50' : 'border-gray-200 bg-gray-50'}`}
                  />
                  {errors.name && (
                    <p id="name-error" role="alert" className="text-red-500 text-sm mt-1 flex items-center gap-1">
                      <span aria-hidden="true">⚠️</span> {errors.name}
                    </p>
                  )}
                </div>

                <div>
                  <label htmlFor="profile-age" className="block text-sm font-bold text-slate-700 mb-1.5">
                    How old are you? <span aria-hidden="true">🎂</span>
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {AGE_RANGES.map(range => (
                      <button
                        key={range.label}
                        type="button"
                        onClick={() => setForm(f => ({ ...f, age: Math.floor((range.min + range.max) / 2) }))}
                        aria-pressed={form.age >= range.min && form.age <= range.max}
                        className={`py-3 px-4 rounded-2xl border-2 font-semibold text-sm transition-all ${
                          form.age >= range.min && form.age <= range.max
                            ? 'border-violet-400 bg-violet-50 text-violet-700'
                            : 'border-gray-200 text-slate-600 hover:border-violet-200'
                        }`}
                      >
                        {range.label}
                        {form.age >= range.min && form.age <= range.max && (
                          <Check size={14} className="inline ml-1" aria-hidden="true" />
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <Button fullWidth size="lg" onClick={nextStep} className="mt-6">
                Next <ChevronRight size={18} aria-hidden="true" />
              </Button>
            </div>
          )}

          {/* Step 2: Avatar */}
          {step === 2 && (
            <div>
              <div className="text-center mb-6">
                <div className="text-5xl mb-3" aria-hidden="true">{form.avatar}</div>
                <h2 className="text-2xl font-black text-slate-800 mb-1">Pick your avatar!</h2>
                <p className="text-slate-500 text-sm">Choose the one that feels most like you.</p>
              </div>

              <fieldset>
                <legend className="sr-only">Choose your avatar</legend>
                <div className="grid grid-cols-5 gap-2 mb-6">
                  {AVATARS.map(av => (
                    <label key={av} className="cursor-pointer">
                      <input
                        type="radio"
                        name="avatar"
                        value={av}
                        checked={form.avatar === av}
                        onChange={() => setForm(f => ({ ...f, avatar: av }))}
                        className="sr-only"
                        aria-label={`Avatar ${av}`}
                      />
                      <div
                        className={`aspect-square flex items-center justify-center text-2xl rounded-2xl border-2 transition-all ${
                          form.avatar === av
                            ? 'border-violet-400 bg-violet-50 scale-110 shadow-sm'
                            : 'border-gray-100 hover:border-violet-200 hover:bg-gray-50'
                        }`}
                        aria-hidden="true"
                      >
                        {av}
                      </div>
                    </label>
                  ))}
                </div>
              </fieldset>

              <div className="flex gap-3">
                <Button variant="outline" onClick={() => setStep(1)} className="flex-1">
                  Back
                </Button>
                <Button onClick={nextStep} className="flex-1">
                  Next <ChevronRight size={18} aria-hidden="true" />
                </Button>
              </div>
            </div>
          )}

          {/* Step 3: Difficulty & color */}
          {step === 3 && (
            <div>
              <div className="text-center mb-6">
                <div className="text-5xl mb-3" aria-hidden="true">🎮</div>
                <h2 className="text-2xl font-black text-slate-800 mb-1">Almost there!</h2>
                <p className="text-slate-500 text-sm">Set your learning level and favourite colour.</p>
              </div>

              <fieldset className="mb-5">
                <legend className="block text-sm font-bold text-slate-700 mb-2">Learning level</legend>
                <div className="space-y-2">
                  {DIFFICULTIES.map(d => (
                    <label key={d.id} className="flex items-center gap-3 p-3 rounded-2xl border-2 cursor-pointer transition-all"
                      style={{ borderColor: form.difficulty === d.id ? '#9B89C4' : '#E5E7EB', background: form.difficulty === d.id ? '#F5F3FF' : 'white' }}
                    >
                      <input
                        type="radio"
                        name="difficulty"
                        value={d.id}
                        checked={form.difficulty === d.id}
                        onChange={() => setForm(f => ({ ...f, difficulty: d.id }))}
                        className="sr-only"
                      />
                      <span className="text-2xl" aria-hidden="true">{d.emoji}</span>
                      <div className="flex-1">
                        <p className="font-bold text-sm text-slate-800">{d.label}</p>
                        <p className="text-xs text-slate-500">{d.desc}</p>
                      </div>
                      {form.difficulty === d.id && <Check size={18} className="text-violet-500 flex-shrink-0" aria-hidden="true" />}
                    </label>
                  ))}
                </div>
              </fieldset>

              <fieldset className="mb-6">
                <legend className="block text-sm font-bold text-slate-700 mb-2">Favourite colour</legend>
                <div className="flex flex-wrap gap-2">
                  {FAVORITE_COLORS.map(c => (
                    <label key={c.id}>
                      <input
                        type="radio"
                        name="favoriteColor"
                        value={c.id}
                        checked={form.favoriteColor === c.id}
                        onChange={() => setForm(f => ({ ...f, favoriteColor: c.id }))}
                        className="sr-only"
                        aria-label={c.label}
                      />
                      <div
                        className={`w-8 h-8 rounded-full ${c.bg} cursor-pointer transition-transform ${form.favoriteColor === c.id ? 'scale-125 ring-2 ring-offset-2 ring-slate-400' : 'hover:scale-110'}`}
                        aria-hidden="true"
                      />
                    </label>
                  ))}
                </div>
              </fieldset>

              <div className="flex gap-3">
                <Button variant="outline" onClick={() => setStep(2)} className="flex-1">
                  Back
                </Button>
                <Button onClick={handleCreate} variant="success" className="flex-1">
                  Let's go! 🚀
                </Button>
              </div>
            </div>
          )}
        </div>

        {step === 1 && (
          <div className="text-center mt-4">
            <Link to="/" className="text-sm text-slate-500 hover:text-violet-600 transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-violet-400 rounded">
              ← Back to home
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}
