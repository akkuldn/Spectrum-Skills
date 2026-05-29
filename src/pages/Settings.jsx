import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Moon, Sun, Contrast, Type, Volume2, VolumeX, Zap, Eye, Edit3, Trash2, Check } from 'lucide-react'
import { useApp } from '../context/AppContext'
import Card from '../components/ui/Card'
import Button from '../components/ui/Button'
import Modal from '../components/ui/Modal'

function Toggle({ checked, onChange, label, id }) {
  return (
    <label
      htmlFor={id}
      className="flex items-center justify-between gap-4 cursor-pointer group"
    >
      <span className="text-[var(--text-primary)] font-medium">{label}</span>
      <button
        id={id}
        role="switch"
        aria-checked={checked}
        aria-label={label}
        onClick={() => onChange(!checked)}
        className={`relative inline-flex h-7 w-13 items-center rounded-full transition-colors focus-visible:outline focus-visible:outline-3 focus-visible:outline-[var(--focus-ring)] ${
          checked ? 'bg-brand-purple' : 'bg-gray-200 dark:bg-white/20'
        }`}
        style={{ minWidth: '52px' }}
      >
        <span
          className={`inline-block h-5 w-5 rounded-full bg-white shadow-sm transition-transform ${
            checked ? 'translate-x-7' : 'translate-x-1'
          }`}
          aria-hidden="true"
        />
      </button>
    </label>
  )
}

function Section({ title, icon: Icon, children }) {
  return (
    <Card>
      <h2 className="flex items-center gap-2 text-lg font-bold text-[var(--text-primary)] mb-4">
        <Icon size={20} className="text-brand-purple" aria-hidden="true" />
        {title}
      </h2>
      <div className="space-y-4">{children}</div>
    </Card>
  )
}

export default function Settings() {
  const { state, dispatch, currentProfile } = useApp()
  const navigate = useNavigate()
  const [editNameOpen, setEditNameOpen] = useState(false)
  const [deleteOpen, setDeleteOpen] = useState(false)
  const [newName, setNewName] = useState(currentProfile?.name ?? '')

  const s = state.settings

  function set(key, value) {
    dispatch({ type: 'UPDATE_SETTINGS', payload: { [key]: value } })
  }

  function handleSaveName() {
    if (newName.trim().length >= 2 && currentProfile) {
      dispatch({ type: 'UPDATE_PROFILE', payload: { id: currentProfile.id, name: newName.trim() } })
      setEditNameOpen(false)
    }
  }

  function handleDeleteProfile() {
    if (currentProfile) {
      dispatch({ type: 'DELETE_PROFILE', payload: currentProfile.id })
      navigate('/login')
    }
  }

  const AVATARS = ['🦋', '🐶', '🐱', '🦊', '🐻', '🐼', '🦁', '🐸', '🦄', '🐢', '🦖', '🐳', '🦜', '🐬', '🌟', '🚀', '🌈', '⚡', '🎮', '🎨']

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="text-3xl font-black text-[var(--text-primary)]">Settings ⚙️</h1>
        <p className="text-[var(--text-secondary)] mt-1">Customise your experience</p>
      </div>

      {/* Profile */}
      {currentProfile && (
        <Section title="My Profile" icon={Edit3}>
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-brand-purple flex items-center justify-center text-3xl" aria-hidden="true">
              {currentProfile.avatar}
            </div>
            <div>
              <p className="font-bold text-[var(--text-primary)]">{currentProfile.name}</p>
              <p className="text-sm text-[var(--text-muted)]">Age {currentProfile.age} · Level {state.progress[currentProfile.id]?.level ?? 1}</p>
            </div>
            <Button variant="outline" size="sm" onClick={() => setEditNameOpen(true)} className="ml-auto">
              Edit
            </Button>
          </div>

          {/* Avatar picker */}
          <div>
            <p className="text-sm font-semibold text-[var(--text-secondary)] mb-2">Avatar</p>
            <fieldset>
              <legend className="sr-only">Choose avatar</legend>
              <div className="flex flex-wrap gap-2">
                {AVATARS.map(av => (
                  <label key={av}>
                    <input
                      type="radio"
                      name="settings-avatar"
                      value={av}
                      checked={currentProfile.avatar === av}
                      onChange={() => dispatch({ type: 'UPDATE_PROFILE', payload: { id: currentProfile.id, avatar: av } })}
                      className="sr-only"
                      aria-label={`Set avatar to ${av}`}
                    />
                    <div
                      className={`w-10 h-10 text-2xl rounded-xl flex items-center justify-center cursor-pointer border-2 transition-all ${
                        currentProfile.avatar === av
                          ? 'border-brand-purple bg-violet-50 dark:bg-violet-900/20 scale-110'
                          : 'border-transparent hover:border-gray-200'
                      }`}
                      aria-hidden="true"
                    >
                      {av}
                    </div>
                  </label>
                ))}
              </div>
            </fieldset>
          </div>

          {/* Difficulty */}
          <div>
            <p className="text-sm font-semibold text-[var(--text-secondary)] mb-2">Learning level</p>
            <div className="flex gap-2 flex-wrap" role="group" aria-label="Learning difficulty">
              {[
                { id: 'easy',   label: '🌱 Easy' },
                { id: 'medium', label: '🌻 Medium' },
                { id: 'hard',   label: '🔥 Hard' },
              ].map(d => (
                <button
                  key={d.id}
                  onClick={() => dispatch({ type: 'UPDATE_PROFILE', payload: { id: currentProfile.id, difficulty: d.id } })}
                  aria-pressed={currentProfile.difficulty === d.id}
                  className={`px-4 py-2 rounded-xl text-sm font-semibold border-2 transition-colors min-h-[44px] ${
                    currentProfile.difficulty === d.id
                      ? 'border-brand-purple bg-violet-50 dark:bg-violet-900/20 text-brand-purple'
                      : 'border-[var(--border)] text-[var(--text-secondary)] hover:border-brand-purple/40'
                  }`}
                >
                  {d.label}
                </button>
              ))}
            </div>
          </div>

          {/* Daily goal */}
          <div>
            <p className="text-sm font-semibold text-[var(--text-secondary)] mb-2">Daily goal (activities per day)</p>
            <div className="flex gap-2" role="group" aria-label="Daily activity goal">
              {[1, 2, 3, 5, 7].map(n => (
                <button
                  key={n}
                  onClick={() => dispatch({ type: 'UPDATE_DAILY_GOAL_TARGET', payload: n })}
                  aria-pressed={state.progress[currentProfile.id]?.dailyGoals.target === n}
                  className={`px-4 py-2 rounded-xl text-sm font-bold border-2 transition-colors min-h-[44px] min-w-[44px] ${
                    state.progress[currentProfile.id]?.dailyGoals.target === n
                      ? 'border-brand-purple bg-violet-50 dark:bg-violet-900/20 text-brand-purple'
                      : 'border-[var(--border)] text-[var(--text-secondary)] hover:border-brand-purple/40'
                  }`}
                >
                  {n}
                </button>
              ))}
            </div>
          </div>
        </Section>
      )}

      {/* Appearance */}
      <Section title="Appearance" icon={Sun}>
        <div>
          <p className="text-sm font-semibold text-[var(--text-secondary)] mb-2">Theme</p>
          <div className="grid grid-cols-3 gap-2" role="group" aria-label="Theme selection">
            {[
              { id: 'light', label: 'Light', icon: Sun },
              { id: 'dark', label: 'Dark', icon: Moon },
              { id: 'high-contrast', label: 'High Contrast', icon: Contrast },
            ].map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => set('theme', id)}
                aria-pressed={s.theme === id}
                className={`flex flex-col items-center gap-2 p-3 rounded-2xl border-2 transition-all min-h-[44px] ${
                  s.theme === id
                    ? 'border-brand-purple bg-violet-50 dark:bg-violet-900/20'
                    : 'border-[var(--border)] hover:border-brand-purple/40'
                }`}
              >
                <Icon size={20} className={s.theme === id ? 'text-brand-purple' : 'text-[var(--text-muted)]'} aria-hidden="true" />
                <span className={`text-xs font-bold ${s.theme === id ? 'text-brand-purple' : 'text-[var(--text-secondary)]'}`}>{label}</span>
                {s.theme === id && <Check size={12} className="text-brand-purple" aria-hidden="true" />}
              </button>
            ))}
          </div>
        </div>

        <div>
          <p className="text-sm font-semibold text-[var(--text-secondary)] mb-2">Text Size</p>
          <div className="flex gap-2" role="group" aria-label="Text size">
            {[
              { id: 'normal', label: 'A', size: 'text-sm' },
              { id: 'large', label: 'A', size: 'text-base' },
              { id: 'xlarge', label: 'A', size: 'text-lg' },
            ].map(sz => (
              <button
                key={sz.id}
                onClick={() => set('fontSize', sz.id)}
                aria-pressed={s.fontSize === sz.id}
                className={`px-5 py-3 rounded-xl border-2 font-bold transition-all min-h-[44px] ${sz.size} ${
                  s.fontSize === sz.id
                    ? 'border-brand-purple bg-violet-50 dark:bg-violet-900/20 text-brand-purple'
                    : 'border-[var(--border)] text-[var(--text-secondary)] hover:border-brand-purple/40'
                }`}
              >
                {sz.label}
              </button>
            ))}
          </div>
        </div>
      </Section>

      {/* Accessibility */}
      <Section title="Accessibility" icon={Eye}>
        <Toggle
          id="dyslexia-font"
          label="Dyslexia-Friendly Font (Lexend)"
          checked={s.dyslexiaFont}
          onChange={v => set('dyslexiaFont', v)}
        />
        <Toggle
          id="reduced-motion"
          label="Reduce Motion & Animations"
          checked={s.reducedMotion}
          onChange={v => set('reducedMotion', v)}
        />
        <Toggle
          id="sound-enabled"
          label="Sound Effects"
          checked={s.soundEnabled}
          onChange={v => set('soundEnabled', v)}
        />
      </Section>

      {/* Font preview */}
      <Card className="bg-gradient-to-r from-violet-50 to-blue-50 dark:from-violet-900/20 dark:to-blue-900/20">
        <p className="text-sm font-semibold text-[var(--text-secondary)] mb-2">Font Preview</p>
        <p className={`text-lg text-[var(--text-primary)] ${s.dyslexiaFont ? 'font-dyslexic' : ''}`}>
          The quick brown fox jumps over the lazy dog.
        </p>
        <p className="text-xs text-[var(--text-muted)] mt-1">
          {s.dyslexiaFont ? 'Lexend (Dyslexia-friendly)' : 'Nunito (Default)'}
        </p>
      </Card>

      {/* Danger zone */}
      {currentProfile && (
        <Card className="border-red-100 dark:border-red-900/30">
          <h2 className="flex items-center gap-2 text-lg font-bold text-red-600 mb-4">
            <Trash2 size={20} aria-hidden="true" />
            Danger Zone
          </h2>
          <p className="text-sm text-[var(--text-secondary)] mb-4">
            Deleting this profile will permanently remove all progress, stars, and badges for <strong>{currentProfile.name}</strong>. This cannot be undone.
          </p>
          <Button variant="danger" size="sm" onClick={() => setDeleteOpen(true)}>
            <Trash2 size={16} aria-hidden="true" />
            Delete Profile
          </Button>
        </Card>
      )}

      {/* Edit name modal */}
      <Modal open={editNameOpen} onClose={() => setEditNameOpen(false)} title="Edit Name">
        <div className="space-y-4">
          <label htmlFor="edit-name" className="block text-sm font-bold text-[var(--text-secondary)]">Name</label>
          <input
            id="edit-name"
            type="text"
            value={newName}
            onChange={e => setNewName(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter') handleSaveName() }}
            maxLength={30}
            autoFocus
            className="w-full px-4 py-3 rounded-2xl border-2 border-[var(--border)] bg-[var(--bg-card)] text-[var(--text-primary)] text-lg font-semibold focus:outline-none focus:border-brand-purple transition-colors"
          />
          <div className="flex gap-3">
            <Button variant="outline" fullWidth onClick={() => setEditNameOpen(false)}>Cancel</Button>
            <Button fullWidth onClick={handleSaveName} disabled={newName.trim().length < 2}>Save</Button>
          </div>
        </div>
      </Modal>

      {/* Delete confirm modal */}
      <Modal open={deleteOpen} onClose={() => setDeleteOpen(false)} title="Delete Profile?">
        <div className="space-y-4">
          <p className="text-[var(--text-secondary)]">
            Are you sure you want to delete <strong>{currentProfile?.name}</strong>'s profile? All progress will be permanently lost.
          </p>
          <div className="flex gap-3">
            <Button variant="outline" fullWidth onClick={() => setDeleteOpen(false)}>Cancel</Button>
            <Button variant="danger" fullWidth onClick={handleDeleteProfile}>Yes, Delete</Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}
