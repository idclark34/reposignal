'use client'

import { useEffect, useRef, useState } from 'react'

type BirdState = 'hidden' | 'flying-in' | 'sitting' | 'alert' | 'hopping' | 'flying-away'

interface BirdProps {
  className?: string
  perchRight?: string | number
  perchBottom?: string | number
}

export default function Bird({
  className,
  perchRight = 'clamp(80px, 8vw, 120px)',
  perchBottom = -1,
}: BirdProps) {
  const [state, setState] = useState<BirdState>('hidden')
  const hasLandedOnce = useRef(false)
  const sitTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const cycleTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  const clearTimers = () => {
    if (sitTimer.current) clearTimeout(sitTimer.current)
    if (cycleTimer.current) clearTimeout(cycleTimer.current)
  }

  const scheduleFlyAway = () => {
    // Sit for 6s, hop for 2s, then fly away
    sitTimer.current = setTimeout(() => setState('hopping'), 6000)
  }

  const scheduleReturn = () => {
    cycleTimer.current = setTimeout(() => setState('flying-in'), 15000)
  }

  useEffect(() => {
    const initial = setTimeout(() => setState('flying-in'), 2000)
    return () => { clearTimeout(initial); clearTimers() }
  }, [])

  useEffect(() => {
    if (state === 'flying-in') {
      const t = setTimeout(() => {
        setState('sitting')
        hasLandedOnce.current = true
      }, 1200)
      return () => clearTimeout(t)
    }
    if (state === 'sitting') {
      scheduleFlyAway()
      return () => clearTimers()
    }
    if (state === 'hopping') {
      const t = setTimeout(() => setState('flying-away'), 2000)
      return () => clearTimeout(t)
    }

    if (state === 'flying-away') {
      clearTimers()
      const t = setTimeout(() => setState('hidden'), 800)
      return () => clearTimeout(t)
    }
    if (state === 'hidden' && hasLandedOnce.current) {
      scheduleReturn()
      return () => clearTimers()
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state])

  const handleMouseEnter = () => {
    if (state === 'sitting' || state === 'hopping') { clearTimers(); setState('alert') }
  }
  const handleMouseLeave = () => {
    if (state === 'alert') setState('sitting')
  }
  const handleClick = () => {
    if (state === 'sitting' || state === 'alert' || state === 'hopping') { clearTimers(); setState('flying-away') }
  }

  // Outer div: handles translation animation only (no flip)
  const moverStyle = (): React.CSSProperties => {
    if (state === 'flying-in')   return { animation: 'bird-fly-in 1.2s ease-out forwards' }
    if (state === 'flying-away') return { animation: 'bird-fly-away 0.8s ease-in forwards' }
    return {}
  }

  // Middle div: handles horizontal flip.
  // Flying in  → bird moves right-to-left, so face left (scaleX(-1))
  // Sitting/alert/flying-away → face right (scaleX(1))
  // Smooth turn when landing (flying-in → sitting transition)
  const flipperStyle = (): React.CSSProperties => ({
    transform: state === 'flying-in' ? 'scaleX(-1)' : 'scaleX(1)',
    transition: state === 'sitting' ? 'transform 0.35s ease-in-out' : 'none',
    display: 'block',
    width: 48,
    height: 32,
  })

  // SVG: handles bob / hop / alert only (no translation — that lives in moverStyle)
  const svgStyle = (): React.CSSProperties => {
    if (state === 'sitting') return { animation: 'bird-bob 2s ease-in-out infinite' }
    if (state === 'hopping') return { animation: 'bird-hop 0.65s ease-in-out infinite' }
    if (state === 'alert')   return { animation: 'bird-alert 0.3s ease-out forwards' }
    return {}
  }

  const wingStyle = (): React.CSSProperties => {
    if (state === 'flying-in' || state === 'flying-away')
      return { animation: 'bird-wing-flap 0.35s ease-in-out infinite' }
    if (state === 'hopping')
      return { animation: 'bird-wing-flap 0.65s ease-in-out infinite' }
    if (state === 'sitting')
      return { animation: 'bird-wing-idle 3s ease-in-out infinite' }
    return {}
  }

  const headStyle = (): React.CSSProperties => {
    if (state === 'sitting')
      return { animation: 'bird-head-tilt 7s ease-in-out infinite' }
    return {}
  }

  const eyelidStyle = (): React.CSSProperties => {
    if (state === 'sitting' || state === 'alert' || state === 'hopping')
      return { animation: 'bird-blink 4s ease-in-out infinite' }
    return {}
  }

  if (state === 'hidden') return null

  return (
    <div
      className={`bird-container${className ? ` ${className}` : ''}`}
      style={{
        position: 'absolute',
        bottom: perchBottom,
        right: perchRight,
        width: 48,
        height: 32,
        zIndex: 10,
        cursor: state === 'sitting' || state === 'alert' ? 'pointer' : 'default',
      }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={handleClick}
    >
      {/* Translation layer */}
      <div style={moverStyle()}>
        {/* Flip layer — faces direction of travel */}
        <div style={flipperStyle()}>
          <svg
            viewBox="0 0 48 32"
            width={48}
            height={32}
            fill="var(--ink)"
            style={svgStyle()}
          >
            {/* Tail */}
            <path d="M6 20 L2 26 L8 23 Z" />

            {/* Torso */}
            <ellipse cx="20" cy="20" rx="14" ry="10" />

            {/* Wing */}
            <g style={{ transformOrigin: '16px 18px', transformBox: 'fill-box', ...wingStyle() }}>
              <ellipse cx="18" cy="20" rx="11" ry="6" fill="var(--bg)" stroke="var(--ink)" strokeWidth="1.2" />
            </g>

            {/* Feet */}
            <line x1="16" y1="29" x2="13" y2="32" stroke="var(--ink)" strokeWidth="1" />
            <line x1="16" y1="29" x2="16" y2="32" stroke="var(--ink)" strokeWidth="1" />
            <line x1="22" y1="29" x2="19" y2="32" stroke="var(--ink)" strokeWidth="1" />
            <line x1="22" y1="29" x2="22" y2="32" stroke="var(--ink)" strokeWidth="1" />

            {/* Head group */}
            <g style={{ transformOrigin: '32px 13px', transformBox: 'fill-box', ...headStyle() }}>
              <circle cx="32" cy="13" r="7" />
              <path d="M38 12 L44 13.5 L38 15 Z" />
              <circle cx="34" cy="12" r="1.8" fill="var(--bg)" />
              <circle cx="34.5" cy="12" r="0.9" />
              <circle
                cx="34" cy="12" r="2"
                fill="var(--ink)"
                style={{ transformOrigin: '34px 12px', transformBox: 'fill-box', ...eyelidStyle() }}
              />
            </g>
          </svg>
        </div>
      </div>
    </div>
  )
}
