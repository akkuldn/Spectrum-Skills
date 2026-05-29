import React from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import {
  Home, Gamepad2, BarChart2, Award, Settings, Users,
  Brain, ChevronRight, Star, Flame
} from 'lucide-react'
import { useApp } from '../../context/AppContext'
import ProgressBar from '../ui/ProgressBar'
import { getLevelInfo, getNextLevelInfo, XP_LEVELS } from '../../data/activities'

const NAV_ITEMS = [
  { to: '/dashboard',  label: 'Home',       icon: Home,     color: 'text-brand-purple' },
  { to: '/activities', label: 'Activities', icon: Gamepad2, color: 'text-brand-blue' },
  { to: '/progress',   label: 'Progress',   icon: BarChart2,color: 'text-brand-green' },
  { to: '/rewards',    label: 'Rewards',    icon: Award,    color: 'text-brand-yellow' },
  { to: '/settings',   label: 'Settings',   icon: Settings, color: 'text-brand-teal' },
  { to: '/parent',     label: 'Parent View',icon: Users,    color: 'text-brand-peach' },
]

export default function Sidebar({ open, onClose }) {
  const { currentProfile, currentProgress } = useApp()
  const navigate = useNavigate()

  const levelInfo = getLevelInfo(currentProgress.xp)
  const nextLevel = getNextLevelInfo(currentProgress.level)
  const xpProgress = nextLevel
    ? ((currentProgress.xp - levelInfo.min) / (nextLevel.min - levelInfo.min)) * 100
    : 100

  return (
    <>
      {/* Mobile overlay */}
      {open && (
        <div
          className="fixed inset-0 z-20 bg-black/30 backdrop-blur-sm lg:hidden"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      {/* Sidebar panel */}
      <nav
        id="sidebar-nav"
        aria-label="Main navigation"
        className={[
          'fixed left-0 top-0 h-full w-72 z-30',
          'bg-[var(--bg-sidebar)] border-r border-[var(--border)]',
          'flex flex-col overflow-y-auto',
          'transition-transform duration-300 ease-out',
          open ? 'translate-x-0' : '-translate-x-full',
          'lg:translate-x-0 lg:sticky lg:top-0 lg:h-screen lg:flex-shrink-0',
        ].join(' ')}
      >
        {/* Brand */}
        <div className="px-6 pt-5 pb-4 border-b border-[var(--border)]">
          <button
            onClick={() => { navigate('/dashboard'); onClose() }}
            className="flex items-center gap-3 w-full focus-visible:outline focus-visible:outline-3 focus-visible:outline-[var(--focus-ring)] rounded-xl p-1"
            aria-label="Go to dashboard"
          >
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-brand-purple to-brand-blue flex items-center justify-center text-xl shadow-sm" aria-hidden="true">
              🌈
            </div>
            <div className="text-left">
              <p className="font-black text-lg gradient-text leading-tight">Spectrum Skills</p>
              <p className="text-xs text-[var(--text-muted)] font-medium">Learning with joy</p>
            </div>
          </button>
        </div>

        {/* Profile card */}
        {currentProfile && (
          <div className="mx-4 mt-4 p-3 bg-gradient-to-r from-violet-50 to-blue-50 dark:from-violet-900/20 dark:to-blue-900/20 rounded-2xl border border-violet-100 dark:border-violet-800">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-xl bg-brand-purple flex items-center justify-center text-2xl shadow-sm select-none" aria-hidden="true">
                {currentProfile.avatar}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-bold text-sm text-[var(--text-primary)] truncate">{currentProfile.name}</p>
                <p className="text-xs text-[var(--text-secondary)]">{levelInfo.emoji} {levelInfo.title}</p>
              </div>
              <div className="text-right">
                <p className="text-xs font-bold text-brand-yellow flex items-center gap-0.5">
                  <Star size={11} fill="currentColor" aria-hidden="true" />
                  {currentProgress.totalStars}
                </p>
                {currentProgress.streak > 0 && (
                  <p className="text-xs font-bold text-orange-500 flex items-center gap-0.5 justify-end">
                    <Flame size={11} aria-hidden="true" />
                    {currentProgress.streak}
                  </p>
                )}
              </div>
            </div>
            {/* XP bar */}
            <div className="mt-2.5">
              <div className="flex justify-between text-[10px] text-[var(--text-muted)] mb-1">
                <span>Level {currentProgress.level}</span>
                {nextLevel && <span>{currentProgress.xp} / {nextLevel.min} XP</span>}
              </div>
              <div className="h-1.5 bg-white/60 dark:bg-white/10 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-brand-purple to-brand-blue rounded-full transition-all duration-700"
                  style={{ width: `${xpProgress}%` }}
                  role="progressbar"
                  aria-valuenow={currentProgress.xp}
                  aria-valuemax={nextLevel?.min ?? currentProgress.xp}
                  aria-label="XP progress"
                />
              </div>
            </div>
          </div>
        )}

        {/* Daily goals mini */}
        {currentProfile && (
          <div className="mx-4 mt-3 p-3 bg-green-50 dark:bg-green-900/20 rounded-2xl border border-green-100 dark:border-green-800">
            <p className="text-xs font-bold text-green-700 dark:text-green-400 mb-1.5">Today's Goals 🎯</p>
            <div className="flex items-center gap-2">
              <div className="flex-1 h-2 bg-green-100 dark:bg-green-900/40 rounded-full overflow-hidden">
                <div
                  className="h-full bg-green-500 rounded-full transition-all duration-700"
                  style={{ width: `${Math.min(100, (currentProgress.dailyGoals.completedToday.length / currentProgress.dailyGoals.target) * 100)}%` }}
                />
              </div>
              <span className="text-xs font-bold text-green-700 dark:text-green-400">
                {currentProgress.dailyGoals.completedToday.length}/{currentProgress.dailyGoals.target}
              </span>
            </div>
          </div>
        )}

        {/* Nav links */}
        <ul className="flex-1 px-3 mt-4 space-y-1" role="list">
          {NAV_ITEMS.map(({ to, label, icon: Icon, color }) => (
            <li key={to} role="listitem">
              <NavLink
                to={to}
                onClick={onClose}
                className={({ isActive }) => [
                  'flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-semibold',
                  'transition-all duration-150',
                  'focus-visible:outline focus-visible:outline-3 focus-visible:outline-[var(--focus-ring)]',
                  isActive
                    ? 'bg-gradient-to-r from-violet-100 to-blue-50 dark:from-violet-900/30 dark:to-blue-900/20 text-brand-purple shadow-sm'
                    : 'text-[var(--text-secondary)] hover:bg-gray-50 dark:hover:bg-white/5 hover:text-[var(--text-primary)]',
                ].join(' ')}
              >
                {({ isActive }) => (
                  <>
                    <Icon
                      size={20}
                      aria-hidden="true"
                      className={isActive ? 'text-brand-purple' : color}
                    />
                    <span>{label}</span>
                    {isActive && <ChevronRight size={14} className="ml-auto" aria-hidden="true" />}
                  </>
                )}
              </NavLink>
            </li>
          ))}
        </ul>

        {/* Bottom: Quick activity hint */}
        <div className="mx-4 mb-5 p-3 bg-gradient-to-r from-brand-purple/10 to-brand-blue/10 rounded-2xl border border-violet-100 dark:border-violet-800/40">
          <p className="text-xs text-[var(--text-secondary)] font-medium">💡 <strong>Tip:</strong> Complete 3 activities today to keep your streak alive!</p>
        </div>
      </nav>
    </>
  )
}
