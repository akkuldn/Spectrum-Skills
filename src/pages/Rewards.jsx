import React, { useState } from 'react'
import { Lock } from 'lucide-react'
import { useApp } from '../context/AppContext'
import { BADGES, BADGE_RARITY_COLORS } from '../data/badges'
import { getLevelInfo, XP_LEVELS } from '../data/activities'
import Card from '../components/ui/Card'
import ProgressBar from '../components/ui/ProgressBar'

const THEMES = [
  { id: 'default',  name: 'Rainbow',     emoji: '🌈', unlockLevel: 1,  colors: ['#9B89C4','#7BB3D0','#86C5A3'] },
  { id: 'ocean',    name: 'Ocean',        emoji: '🌊', unlockLevel: 2,  colors: ['#4A90D9','#5CB8E4','#7ECEBA'] },
  { id: 'forest',   name: 'Forest',       emoji: '🌿', unlockLevel: 3,  colors: ['#5D9B84','#7BB86F','#A8D5A2'] },
  { id: 'sunset',   name: 'Sunset',       emoji: '🌅', unlockLevel: 4,  colors: ['#F4A261','#E76F51','#E9C46A'] },
  { id: 'galaxy',   name: 'Galaxy',       emoji: '🌌', unlockLevel: 5,  colors: ['#5C4B8A','#7B5EA7','#9B72CF'] },
  { id: 'candy',    name: 'Candy',        emoji: '🍬', unlockLevel: 6,  colors: ['#FF9EBF','#FFB347','#B5EAD7'] },
  { id: 'robot',    name: 'Robot',        emoji: '🤖', unlockLevel: 7,  colors: ['#607D8B','#90A4AE','#B0BEC5'] },
  { id: 'dino',     name: 'Dinosaur',     emoji: '🦕', unlockLevel: 8,  colors: ['#6BBF59','#8FD14F','#BDE93E'] },
  { id: 'cosmic',   name: 'Cosmic',       emoji: '🚀', unlockLevel: 9,  colors: ['#3D5A80','#98C1D9','#E0FBFC'] },
  { id: 'legendary',name: 'Legendary',    emoji: '👑', unlockLevel: 10, colors: ['#FFD700','#FFA500','#FF6B6B'] },
]

function BadgeCard({ badge, earned }) {
  const rarity = BADGE_RARITY_COLORS[badge.rarity] ?? BADGE_RARITY_COLORS.common

  return (
    <div
      className={`relative p-4 rounded-2xl border-2 text-center transition-all ${
        earned
          ? `${rarity.bg} ${rarity.border} shadow-soft`
          : 'bg-gray-50 dark:bg-white/5 border-gray-100 dark:border-white/10 opacity-60'
      }`}
      aria-label={`${badge.title} — ${earned ? 'Earned' : 'Locked'}`}
    >
      {!earned && (
        <div className="absolute top-2 right-2" aria-hidden="true">
          <Lock size={12} className="text-gray-400" />
        </div>
      )}
      <div className={`text-3xl mb-2 ${!earned ? 'grayscale' : ''}`} aria-hidden="true">
        {badge.emoji}
      </div>
      <p className={`font-bold text-xs mb-1 ${earned ? rarity.text : 'text-gray-400'}`}>
        {badge.title}
      </p>
      <p className={`text-[10px] capitalize mb-1 ${earned ? rarity.text : 'text-gray-300'}`}>
        {badge.rarity}
      </p>
      {earned && (
        <p className="text-[10px] text-[var(--text-muted)] leading-tight">{badge.description}</p>
      )}
    </div>
  )
}

export default function Rewards() {
  const { currentProgress } = useApp()
  const [activeTab, setActiveTab] = useState('badges')

  const earnedBadgeIds = new Set(currentProgress.badges)
  const earnedCount = currentProgress.badges.length
  const levelInfo = getLevelInfo(currentProgress.xp)

  const rarityOrder = { common: 0, uncommon: 1, rare: 2, epic: 3 }
  const sortedBadges = [...BADGES].sort((a, b) => {
    const aEarned = earnedBadgeIds.has(a.id) ? 0 : 1
    const bEarned = earnedBadgeIds.has(b.id) ? 0 : 1
    if (aEarned !== bEarned) return aEarned - bEarned
    return (rarityOrder[b.rarity] ?? 0) - (rarityOrder[a.rarity] ?? 0)
  })

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-black text-[var(--text-primary)]">Rewards 🏆</h1>
        <p className="text-[var(--text-secondary)] mt-1">Your achievements and unlockable content</p>
      </div>

      {/* Summary */}
      <div className="rounded-3xl bg-gradient-to-r from-yellow-400 via-orange-400 to-pink-400 text-white p-6 sm:p-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/4" aria-hidden="true" />
        <div className="relative grid grid-cols-3 gap-4 text-center">
          <div>
            <p className="text-4xl font-black" aria-label={`${currentProgress.totalStars} stars`}>
              {currentProgress.totalStars}
            </p>
            <p className="text-white/80 text-sm font-semibold">⭐ Stars</p>
          </div>
          <div>
            <p className="text-4xl font-black" aria-label={`${earnedCount} badges`}>
              {earnedCount}
            </p>
            <p className="text-white/80 text-sm font-semibold">🏆 Badges</p>
          </div>
          <div>
            <p className="text-4xl font-black" aria-label={`Level ${currentProgress.level}`}>
              {currentProgress.level}
            </p>
            <p className="text-white/80 text-sm font-semibold">{levelInfo.emoji} Level</p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-[var(--border)]" role="tablist" aria-label="Rewards sections">
        {[
          { id: 'badges', label: `Badges (${earnedCount}/${BADGES.length})` },
          { id: 'levels', label: 'Levels' },
          { id: 'themes', label: 'Themes' },
        ].map(tab => (
          <button
            key={tab.id}
            role="tab"
            aria-selected={activeTab === tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2.5 text-sm font-bold border-b-2 transition-colors min-h-[44px] ${
              activeTab === tab.id
                ? 'border-brand-purple text-brand-purple'
                : 'border-transparent text-[var(--text-muted)] hover:text-[var(--text-primary)]'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Badges tab */}
      {activeTab === 'badges' && (
        <div role="tabpanel" aria-label="Badges">
          {/* Filter by rarity */}
          <div className="flex gap-2 flex-wrap mb-4">
            {['all', 'epic', 'rare', 'uncommon', 'common'].map(r => {
              const count = r === 'all'
                ? BADGES.length
                : BADGES.filter(b => b.rarity === r).length
              const earnedInRarity = r === 'all'
                ? earnedCount
                : BADGES.filter(b => b.rarity === r && earnedBadgeIds.has(b.id)).length
              return (
                <span
                  key={r}
                  className={`px-3 py-1 rounded-full text-xs font-bold capitalize border ${
                    r === 'all' ? 'bg-violet-100 text-violet-700 border-violet-200'
                    : r === 'epic' ? 'bg-purple-100 text-purple-700 border-purple-200'
                    : r === 'rare' ? 'bg-blue-100 text-blue-700 border-blue-200'
                    : r === 'uncommon' ? 'bg-green-100 text-green-700 border-green-200'
                    : 'bg-gray-100 text-gray-600 border-gray-200'
                  }`}
                  aria-label={`${r === 'all' ? 'All rarities' : r}: ${earnedInRarity}/${count} earned`}
                >
                  {r === 'all' ? 'All' : r} ({earnedInRarity}/{count})
                </span>
              )
            })}
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
            {sortedBadges.map(badge => (
              <BadgeCard key={badge.id} badge={badge} earned={earnedBadgeIds.has(badge.id)} />
            ))}
          </div>
        </div>
      )}

      {/* Levels tab */}
      {activeTab === 'levels' && (
        <div role="tabpanel" aria-label="Levels" className="space-y-3">
          {XP_LEVELS.map(lvl => {
            const isReached = currentProgress.level >= lvl.level
            const isCurrent = currentProgress.level === lvl.level
            return (
              <div
                key={lvl.level}
                className={`flex items-center gap-4 p-4 rounded-2xl border-2 transition-all ${
                  isCurrent ? 'border-brand-purple bg-violet-50 dark:bg-violet-900/20'
                  : isReached ? 'border-green-200 bg-green-50 dark:bg-green-900/20'
                  : 'border-[var(--border)] opacity-60'
                }`}
                aria-label={`Level ${lvl.level}: ${lvl.title} — ${isReached ? 'Reached' : 'Locked'}`}
              >
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-black text-lg flex-shrink-0 ${
                  isCurrent ? 'bg-brand-purple text-white shadow-glow'
                  : isReached ? 'bg-green-500 text-white'
                  : 'bg-gray-100 dark:bg-white/10 text-gray-400'
                }`}>
                  {isReached ? lvl.level : <Lock size={16} />}
                </div>
                <div className="flex-1 min-w-0">
                  <p className={`font-bold ${isCurrent ? 'text-brand-purple' : isReached ? 'text-[var(--text-primary)]' : 'text-[var(--text-muted)]'}`}>
                    {lvl.emoji} {lvl.title}
                  </p>
                  <p className="text-xs text-[var(--text-muted)]">
                    {lvl.min === 0 ? 'Start' : `${lvl.min} XP`} {lvl.max === Infinity ? '+' : `– ${lvl.max} XP`}
                  </p>
                </div>
                {isCurrent && (
                  <span className="bg-brand-purple text-white text-xs font-bold px-2.5 py-1 rounded-full flex-shrink-0">
                    Current
                  </span>
                )}
                {isReached && !isCurrent && (
                  <span className="text-green-500 text-lg flex-shrink-0" aria-hidden="true">✓</span>
                )}
              </div>
            )
          })}
        </div>
      )}

      {/* Themes tab */}
      {activeTab === 'themes' && (
        <div role="tabpanel" aria-label="Themes">
          <p className="text-sm text-[var(--text-muted)] mb-5">
            Themes unlock as you level up. You've unlocked {THEMES.filter(t => t.unlockLevel <= currentProgress.level).length} of {THEMES.length} themes!
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {THEMES.map(theme => {
              const unlocked = currentProgress.level >= theme.unlockLevel
              return (
                <div
                  key={theme.id}
                  className={`rounded-3xl p-4 text-center border-2 transition-all ${
                    unlocked ? 'border-[var(--border)] hover:-translate-y-0.5 cursor-pointer' : 'border-gray-100 dark:border-white/5 opacity-50'
                  }`}
                  aria-label={`${theme.name} theme — ${unlocked ? 'Unlocked' : `Unlocks at level ${theme.unlockLevel}`}`}
                >
                  {/* Color preview */}
                  <div className="flex justify-center gap-1 mb-3" aria-hidden="true">
                    {theme.colors.map((c, i) => (
                      <div key={i} className="w-6 h-6 rounded-full" style={{ background: c }} />
                    ))}
                  </div>
                  <div className="text-3xl mb-1" aria-hidden="true">{theme.emoji}</div>
                  <p className="font-bold text-sm text-[var(--text-primary)]">{theme.name}</p>
                  {unlocked ? (
                    <p className="text-xs text-green-600 font-semibold mt-1">✓ Unlocked</p>
                  ) : (
                    <p className="text-xs text-[var(--text-muted)] mt-1 flex items-center justify-center gap-1">
                      <Lock size={10} aria-hidden="true" /> Level {theme.unlockLevel}
                    </p>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
