import React, { useState, useRef, useCallback, useEffect } from 'react'
import Button from '../components/ui/Button'
import { RotateCcw } from 'lucide-react'

const PALETTES = [
  { name: 'Aurora',   colors: ['#9B89C4','#7BB3D0','#86C5A3','#D4A5C7','#F0A882'] },
  { name: 'Sunset',   colors: ['#FF9966','#FF5E62','#FFB347','#FFCC02','#FF6B6B'] },
  { name: 'Ocean',    colors: ['#006994','#0099CC','#00CED1','#48D1CC','#87CEEB'] },
  { name: 'Forest',   colors: ['#2D5A27','#52B788','#74C69D','#95D5B2','#B7E4C7'] },
  { name: 'Candy',    colors: ['#FF85A1','#FFB3C1','#BDE0FE','#A2D2FF','#CDB4DB'] },
]

const SHAPES_LIST = ['circle', 'star', 'heart', 'ring', 'blob']

function randomBetween(a, b) { return Math.random() * (b - a) + a }

let idCounter = 0
function makeOrb(x, y, palette) {
  const color = palette.colors[Math.floor(Math.random() * palette.colors.length)]
  const size = randomBetween(30, 90)
  return {
    id: idCounter++,
    x, y, color, size,
    shape: SHAPES_LIST[Math.floor(Math.random() * SHAPES_LIST.length)],
    opacity: 0.85,
    vx: randomBetween(-0.5, 0.5),
    vy: randomBetween(-0.5, 0.5),
    born: Date.now(),
  }
}

function OrbShape({ orb }) {
  const half = orb.size / 2
  switch (orb.shape) {
    case 'circle':
      return <circle cx={orb.x} cy={orb.y} r={half} fill={orb.color} opacity={orb.opacity} />
    case 'ring':
      return <circle cx={orb.x} cy={orb.y} r={half} fill="none" stroke={orb.color} strokeWidth={half / 3} opacity={orb.opacity} />
    case 'star': {
      const pts = []
      for (let i = 0; i < 10; i++) {
        const angle = (Math.PI / 5) * i - Math.PI / 2
        const r = i % 2 === 0 ? half : half * 0.45
        pts.push(`${orb.x + r * Math.cos(angle)},${orb.y + r * Math.sin(angle)}`)
      }
      return <polygon points={pts.join(' ')} fill={orb.color} opacity={orb.opacity} />
    }
    case 'heart': {
      const s = half * 0.9
      return <path d={`M${orb.x},${orb.y + s * 0.4} C${orb.x},${orb.y - s * 0.6} ${orb.x - s * 1.2},${orb.y - s * 0.6} ${orb.x - s * 1.2},${orb.y} C${orb.x - s * 1.2},${orb.y + s * 0.8} ${orb.x},${orb.y + s * 1.2} ${orb.x},${orb.y + s * 1.2} C${orb.x},${orb.y + s * 1.2} ${orb.x + s * 1.2},${orb.y + s * 0.8} ${orb.x + s * 1.2},${orb.y} C${orb.x + s * 1.2},${orb.y - s * 0.6} ${orb.x},${orb.y - s * 0.6} ${orb.x},${orb.y + s * 0.4} Z`} fill={orb.color} opacity={orb.opacity} />
    }
    default: {
      const r = half
      return <ellipse cx={orb.x} cy={orb.y} rx={r * 1.2} ry={r * 0.8} fill={orb.color} opacity={orb.opacity} />
    }
  }
}

export default function VisualExplorer({ difficulty = 'easy', onComplete }) {
  const [paletteIdx, setPaletteIdx] = useState(0)
  const [orbs, setOrbs]             = useState([])
  const [taps, setTaps]             = useState(0)
  const rafRef = useRef(null)
  const svgRef = useRef(null)

  const palette = PALETTES[paletteIdx]
  const TARGET_TAPS = 15

  const animate = useCallback(() => {
    const now = Date.now()
    setOrbs(prev =>
      prev
        .filter(o => now - o.born < 4000)
        .map(o => ({
          ...o,
          x: o.x + o.vx,
          y: o.y + o.vy,
          opacity: Math.max(0, 0.85 - (now - o.born) / 4000 * 0.85),
          size: o.size * (1 + (now - o.born) / 6000 * 0.5),
        }))
    )
    rafRef.current = requestAnimationFrame(animate)
  }, [])

  useEffect(() => {
    rafRef.current = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(rafRef.current)
  }, [animate])

  function handleTap(e) {
    const svg = svgRef.current
    if (!svg) return
    const rect = svg.getBoundingClientRect()
    const cx = e.clientX - rect.left
    const cy = e.clientY - rect.top
    const newOrbs = Array.from({ length: 5 }, () => makeOrb(cx + randomBetween(-20, 20), cy + randomBetween(-20, 20), palette))
    setOrbs(prev => [...prev, ...newOrbs].slice(-80))
    const newTaps = taps + 1
    setTaps(newTaps)
    if (newTaps >= TARGET_TAPS) {
      setTimeout(() => onComplete({ stars: 1, score: 100 }), 1000)
    }
  }

  function reset() {
    setOrbs([])
    setTaps(0)
  }

  const progress = Math.min(taps / TARGET_TAPS, 1)

  return (
    <div className="max-w-lg mx-auto space-y-3">
      {/* Palette selector */}
      <div className="flex items-center justify-between">
        <div className="flex gap-1.5">
          {PALETTES.map((p, i) => (
            <button
              key={p.name}
              onClick={() => setPaletteIdx(i)}
              aria-label={`${p.name} palette${i === paletteIdx ? ' — selected' : ''}`}
              aria-pressed={i === paletteIdx}
              className={`w-7 h-7 rounded-full border-2 transition-all focus-visible:outline focus-visible:outline-2 focus-visible:outline-[var(--focus-ring)] ${i === paletteIdx ? 'border-[var(--text-primary)] scale-125' : 'border-transparent hover:scale-110'}`}
              style={{ background: `linear-gradient(135deg, ${p.colors[0]}, ${p.colors[2]})` }}
            />
          ))}
        </div>
        <button onClick={reset} aria-label="Clear canvas" className="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-white/10 transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-[var(--focus-ring)]">
          <RotateCcw size={16} aria-hidden="true" />
        </button>
      </div>

      {/* Progress */}
      <div className="flex items-center gap-3">
        <div className="flex-1 h-2 bg-gray-100 dark:bg-white/10 rounded-full overflow-hidden">
          <div className="h-full rounded-full transition-all duration-300" style={{ width: `${progress * 100}%`, background: `linear-gradient(90deg, ${palette.colors[0]}, ${palette.colors[2]})` }} role="progressbar" aria-valuenow={taps} aria-valuemax={TARGET_TAPS} aria-label="Exploration progress" />
        </div>
        <span className="text-xs font-bold text-[var(--text-muted)]">{taps}/{TARGET_TAPS}</span>
      </div>

      {/* Canvas */}
      <div className="relative">
        <svg
          ref={svgRef}
          viewBox="0 0 400 300"
          className="w-full rounded-3xl border-2 border-[var(--border)] cursor-crosshair"
          style={{ background: `radial-gradient(ellipse at center, ${palette.colors[4]}22, ${palette.colors[0]}11)`, minHeight: '240px' }}
          onClick={handleTap}
          role="img"
          aria-label="Interactive visual canvas — tap to create shapes"
        >
          {orbs.map(orb => <OrbShape key={orb.id} orb={orb} />)}
          {orbs.length === 0 && (
            <text x="200" y="155" textAnchor="middle" fill="#999" fontSize="14" fontFamily="sans-serif">
              Tap anywhere to create shapes! ✨
            </text>
          )}
        </svg>
      </div>

      <p className="text-center text-xs text-[var(--text-muted)]">
        {palette.name} palette · Tap the canvas to explore!
      </p>
    </div>
  )
}
