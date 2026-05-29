import React, { createContext, useContext, useReducer, useEffect, useCallback } from 'react'
import { BADGES } from '../data/badges'

/* ─────────────────────────────────────────────
   Initial State
───────────────────────────────────────────── */
const initialState = {
  profiles: [],
  currentProfileId: null,
  settings: {
    theme: 'light',           // 'light' | 'dark' | 'high-contrast'
    fontSize: 'normal',       // 'normal' | 'large' | 'xlarge'
    reducedMotion: false,
    soundEnabled: true,
    dyslexiaFont: false,
    highContrast: false,
  },
  progress: {},               // keyed by profileId
}

/* Per-profile progress shape */
function freshProgress() {
  return {
    completedActivities: [],  // [{activityId, date, score, stars, durationSecs}]
    totalStars: 0,
    badges: [],
    dailyGoals: {
      target: 3,
      completedToday: [],
      lastResetDate: null,
    },
    streak: 0,
    lastActiveDate: null,
    level: 1,
    xp: 0,
    moods: [],               // [{date, mood, note}]
    journalEntries: [],      // [{date, text, mood}]
  }
}

/* ─────────────────────────────────────────────
   Helpers
───────────────────────────────────────────── */
function todayStr() {
  return new Date().toISOString().split('T')[0]
}

function calcLevel(xp) {
  // Every 100 xp = 1 level, with increasing requirements
  if (xp < 100) return 1
  if (xp < 300) return 2
  if (xp < 600) return 3
  if (xp < 1000) return 4
  if (xp < 1500) return 5
  if (xp < 2200) return 6
  if (xp < 3000) return 7
  if (xp < 4000) return 8
  if (xp < 5500) return 9
  return 10
}

function starsToXp(stars) {
  return stars * 25
}

function checkBadges(progress, activityId) {
  const earned = []
  const existing = new Set(progress.badges)

  BADGES.forEach(badge => {
    if (existing.has(badge.id)) return
    let unlocked = false

    switch (badge.condition.type) {
      case 'totalStars':
        unlocked = progress.totalStars >= badge.condition.value
        break
      case 'activitiesCompleted':
        unlocked = progress.completedActivities.length >= badge.condition.value
        break
      case 'uniqueActivities': {
        const unique = new Set(progress.completedActivities.map(a => a.activityId))
        unlocked = unique.size >= badge.condition.value
        break
      }
      case 'activityStars': {
        const match = progress.completedActivities.find(
          a => a.activityId === badge.condition.activityId && a.stars >= badge.condition.stars
        )
        unlocked = !!match
        break
      }
      case 'activityTimes': {
        const count = progress.completedActivities.filter(a => a.activityId === badge.condition.activityId).length
        unlocked = count >= badge.condition.value
        break
      }
      case 'streak':
        unlocked = progress.streak >= badge.condition.value
        break
      case 'level':
        unlocked = progress.level >= badge.condition.value
        break
      case 'moodEntries':
        unlocked = progress.moods.length >= badge.condition.value
        break
      case 'journalEntries':
        unlocked = progress.journalEntries.length >= badge.condition.value
        break
    }

    if (unlocked) earned.push(badge.id)
  })

  return earned
}

/* ─────────────────────────────────────────────
   Reducer
───────────────────────────────────────────── */
function reducer(state, action) {
  switch (action.type) {

    case 'CREATE_PROFILE': {
      const profile = {
        id: Date.now().toString(),
        name: action.payload.name,
        age: action.payload.age,
        avatar: action.payload.avatar || '🦋',
        difficulty: action.payload.difficulty || 'medium',
        favoriteColor: action.payload.favoriteColor || 'purple',
        createdAt: new Date().toISOString(),
      }
      const newProgress = { ...state.progress, [profile.id]: freshProgress() }
      return {
        ...state,
        profiles: [...state.profiles, profile],
        currentProfileId: profile.id,
        progress: newProgress,
      }
    }

    case 'SELECT_PROFILE':
      return { ...state, currentProfileId: action.payload }

    case 'UPDATE_PROFILE': {
      const profiles = state.profiles.map(p =>
        p.id === action.payload.id ? { ...p, ...action.payload } : p
      )
      return { ...state, profiles }
    }

    case 'DELETE_PROFILE': {
      const profiles = state.profiles.filter(p => p.id !== action.payload)
      const progress = { ...state.progress }
      delete progress[action.payload]
      const currentProfileId = state.currentProfileId === action.payload
        ? (profiles[0]?.id ?? null)
        : state.currentProfileId
      return { ...state, profiles, progress, currentProfileId }
    }

    case 'COMPLETE_ACTIVITY': {
      const { activityId, score, stars, durationSecs } = action.payload
      const pid = state.currentProfileId
      if (!pid) return state

      const prev = state.progress[pid] || freshProgress()
      const today = todayStr()

      // Daily goals reset
      let dailyGoals = { ...prev.dailyGoals }
      if (dailyGoals.lastResetDate !== today) {
        dailyGoals = { ...dailyGoals, completedToday: [], lastResetDate: today }
      }
      if (!dailyGoals.completedToday.includes(activityId)) {
        dailyGoals = { ...dailyGoals, completedToday: [...dailyGoals.completedToday, activityId] }
      }

      // Streak
      let streak = prev.streak
      const lastDate = prev.lastActiveDate
      if (lastDate) {
        const diff = (new Date(today) - new Date(lastDate)) / 86400000
        if (diff === 1) streak += 1
        else if (diff > 1) streak = 1
      } else {
        streak = 1
      }

      const entry = { activityId, date: new Date().toISOString(), score, stars, durationSecs }
      const completedActivities = [...prev.completedActivities, entry]
      const totalStars = prev.totalStars + (stars || 0)
      const xp = prev.xp + starsToXp(stars || 0)
      const level = calcLevel(xp)

      const updatedProgress = {
        ...prev,
        completedActivities,
        totalStars,
        xp,
        level,
        streak,
        lastActiveDate: today,
        dailyGoals,
      }

      // Check for new badges
      const newBadgeIds = checkBadges(updatedProgress, activityId)
      updatedProgress.badges = [...new Set([...prev.badges, ...newBadgeIds])]

      return {
        ...state,
        progress: { ...state.progress, [pid]: updatedProgress },
      }
    }

    case 'LOG_MOOD': {
      const pid = state.currentProfileId
      if (!pid) return state
      const prev = state.progress[pid] || freshProgress()
      const entry = { date: new Date().toISOString(), mood: action.payload.mood, note: action.payload.note || '' }
      const moods = [...prev.moods, entry]
      let badges = prev.badges
      const newBadgeIds = checkBadges({ ...prev, moods }, null)
      badges = [...new Set([...badges, ...newBadgeIds])]
      return {
        ...state,
        progress: { ...state.progress, [pid]: { ...prev, moods, badges } },
      }
    }

    case 'ADD_JOURNAL_ENTRY': {
      const pid = state.currentProfileId
      if (!pid) return state
      const prev = state.progress[pid] || freshProgress()
      const entry = { date: new Date().toISOString(), text: action.payload.text, mood: action.payload.mood || null }
      const journalEntries = [...prev.journalEntries, entry]
      let badges = prev.badges
      const newBadgeIds = checkBadges({ ...prev, journalEntries }, null)
      badges = [...new Set([...badges, ...newBadgeIds])]
      return {
        ...state,
        progress: { ...state.progress, [pid]: { ...prev, journalEntries, badges } },
      }
    }

    case 'UPDATE_SETTINGS':
      return { ...state, settings: { ...state.settings, ...action.payload } }

    case 'UPDATE_DAILY_GOAL_TARGET': {
      const pid = state.currentProfileId
      if (!pid) return state
      const prev = state.progress[pid] || freshProgress()
      return {
        ...state,
        progress: {
          ...state.progress,
          [pid]: { ...prev, dailyGoals: { ...prev.dailyGoals, target: action.payload } },
        },
      }
    }

    default:
      return state
  }
}

/* ─────────────────────────────────────────────
   Context
───────────────────────────────────────────── */
const AppContext = createContext(null)

const STORAGE_KEY = 'spectrum-skills-v1'

export function AppProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState, () => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      return saved ? JSON.parse(saved) : initialState
    } catch {
      return initialState
    }
  })

  // Persist to localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
  }, [state])

  // Apply theme / accessibility classes to <html>
  useEffect(() => {
    const root = document.documentElement
    const { settings } = state

    // Theme
    root.classList.remove('dark', 'high-contrast')
    if (settings.theme === 'dark') root.classList.add('dark')
    if (settings.theme === 'high-contrast') root.classList.add('high-contrast')

    // Font size
    root.classList.remove('font-size-large', 'font-size-xlarge')
    if (settings.fontSize === 'large') root.classList.add('font-size-large')
    if (settings.fontSize === 'xlarge') root.classList.add('font-size-xlarge')

    // Reduced motion
    root.classList.toggle('reduce-motion', !!settings.reducedMotion)

    // Dyslexia font
    root.classList.toggle('dyslexic-font', !!settings.dyslexiaFont)
  }, [state.settings])

  const currentProfile = state.profiles.find(p => p.id === state.currentProfileId) ?? null
  const currentProgress = state.currentProfileId ? (state.progress[state.currentProfileId] ?? freshProgress()) : freshProgress()

  const completeActivity = useCallback((activityId, score, stars, durationSecs) => {
    dispatch({ type: 'COMPLETE_ACTIVITY', payload: { activityId, score, stars, durationSecs } })
  }, [])

  const value = {
    state,
    dispatch,
    currentProfile,
    currentProgress,
    completeActivity,
    isLoggedIn: !!state.currentProfileId,
  }

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}

export function useApp() {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error('useApp must be used within AppProvider')
  return ctx
}

export { calcLevel, freshProgress }
