import React, { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { Bell, Settings, Menu, X, Star, ChevronDown } from 'lucide-react'
import { useApp } from '../../context/AppContext'

export default function Header({ onMenuToggle, menuOpen }) {
  const { currentProfile, currentProgress, state } = useApp()
  const navigate = useNavigate()
  const location = useLocation()
  const [profileOpen, setProfileOpen] = useState(false)

  const pageTitle = getPageTitle(location.pathname)

  return (
    <header
      className="sticky top-0 z-30 glass border-b border-[var(--border)] px-4 sm:px-6"
      role="banner"
    >
      <div className="flex items-center justify-between h-16">
        {/* Left: Hamburger + Page title */}
        <div className="flex items-center gap-3">
          <button
            onClick={onMenuToggle}
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={menuOpen}
            aria-controls="sidebar-nav"
            className="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-white/10 transition-colors lg:hidden min-h-[44px] min-w-[44px] flex items-center justify-center focus-visible:outline focus-visible:outline-3 focus-visible:outline-[var(--focus-ring)]"
          >
            {menuOpen ? <X size={22} aria-hidden="true" /> : <Menu size={22} aria-hidden="true" />}
          </button>

          {/* Brand logo (hidden on mobile when we have page title) */}
          <Link
            to="/dashboard"
            className="hidden lg:flex items-center gap-2 font-black text-xl text-brand-purple focus-visible:outline focus-visible:outline-3 focus-visible:outline-[var(--focus-ring)] rounded-lg px-1"
            aria-label="Spectrum Skills — go to dashboard"
          >
            <span aria-hidden="true">🌈</span>
            <span className="gradient-text">Spectrum Skills</span>
          </Link>

          <h1 className="text-lg font-bold text-[var(--text-primary)] lg:hidden">{pageTitle}</h1>
        </div>

        {/* Right: Stars + Profile */}
        {currentProfile && (
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Star count */}
            <div
              className="hidden sm:flex items-center gap-1.5 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 text-yellow-700 dark:text-yellow-300 px-3 py-1.5 rounded-full text-sm font-bold"
              aria-label={`${currentProgress.totalStars} stars earned`}
            >
              <Star size={14} fill="currentColor" aria-hidden="true" />
              <span>{currentProgress.totalStars}</span>
            </div>

            {/* Streak */}
            {currentProgress.streak > 0 && (
              <div
                className="hidden sm:flex items-center gap-1 bg-orange-50 dark:bg-orange-900/20 border border-orange-200 text-orange-600 px-3 py-1.5 rounded-full text-sm font-bold"
                aria-label={`${currentProgress.streak} day streak`}
              >
                🔥 {currentProgress.streak}
              </div>
            )}

            {/* Profile button */}
            <div className="relative">
              <button
                onClick={() => setProfileOpen(p => !p)}
                aria-expanded={profileOpen}
                aria-haspopup="menu"
                aria-label={`Profile menu for ${currentProfile.name}`}
                className="flex items-center gap-2 p-1.5 pr-3 rounded-2xl hover:bg-gray-100 dark:hover:bg-white/10 transition-colors focus-visible:outline focus-visible:outline-3 focus-visible:outline-[var(--focus-ring)] min-h-[44px]"
              >
                <div className="w-9 h-9 rounded-xl bg-brand-purple flex items-center justify-center text-xl shadow-sm select-none" aria-hidden="true">
                  {currentProfile.avatar}
                </div>
                <span className="hidden sm:block text-sm font-semibold text-[var(--text-primary)] max-w-[80px] truncate">
                  {currentProfile.name}
                </span>
                <ChevronDown size={14} className="hidden sm:block text-[var(--text-muted)]" aria-hidden="true" />
              </button>

              {/* Dropdown */}
              {profileOpen && (
                <div
                  role="menu"
                  className="absolute right-0 mt-2 w-48 bg-[var(--bg-card)] border border-[var(--border)] rounded-2xl shadow-card-hover py-1 z-40 animate-slide-up"
                  onBlur={(e) => { if (!e.currentTarget.contains(e.relatedTarget)) setProfileOpen(false) }}
                >
                  <div className="px-4 py-2 border-b border-[var(--border)]">
                    <p className="font-bold text-sm text-[var(--text-primary)]">{currentProfile.name}</p>
                    <p className="text-xs text-[var(--text-muted)]">Level {currentProgress.level} · {currentProgress.totalStars} ⭐</p>
                  </div>
                  {[
                    { label: '🏠 Dashboard', path: '/dashboard' },
                    { label: '🏆 Rewards', path: '/rewards' },
                    { label: '📊 Progress', path: '/progress' },
                    { label: '⚙️ Settings', path: '/settings' },
                    { label: '👨‍👩‍👧 Parent View', path: '/parent' },
                  ].map(item => (
                    <button
                      key={item.path}
                      role="menuitem"
                      onClick={() => { navigate(item.path); setProfileOpen(false) }}
                      className="w-full text-left px-4 py-2.5 text-sm text-[var(--text-primary)] hover:bg-gray-50 dark:hover:bg-white/5 transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-[var(--focus-ring)]"
                    >
                      {item.label}
                    </button>
                  ))}
                  <div className="border-t border-[var(--border)] mt-1">
                    <button
                      role="menuitem"
                      onClick={() => { navigate('/login'); setProfileOpen(false) }}
                      className="w-full text-left px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10 transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-red-400"
                    >
                      🔄 Switch Profile
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  )
}

function getPageTitle(pathname) {
  const map = {
    '/dashboard': '🏠 Home',
    '/activities': '🎮 Activities',
    '/progress': '📊 Progress',
    '/rewards': '🏆 Rewards',
    '/settings': '⚙️ Settings',
    '/parent': '👨‍👩‍👧 Parent View',
  }
  if (pathname.startsWith('/activities/')) return '🎮 Activity'
  return map[pathname] ?? 'Spectrum Skills'
}
