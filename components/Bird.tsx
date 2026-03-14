'use client'

import { useEffect, useRef, useState } from 'react'

type BirdState = 'hidden' | 'flying-in' | 'sitting' | 'alert' | 'flying-away'

export default function Bird() {
  const [state, setState] = useState<BirdState>('hidden')
  const hasLandedOnce = useRef(false)
  const sitTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const cycleTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  const clearTimers = () => {
    if (sitTimer.current) clearTimeout(sitTimer.current)
    if (cycleTimer.current) clearTimeout(cycleTimer.current)
  }

  // Schedule the fly-away after sitting for a while
  const scheduleFlyAway = () => {
    sitTimer.current = setTimeout(() => {
      setState('flying-away')
    }, 8000)
  }

  // After flying away, schedule the return
  const scheduleReturn = () => {
    cycleTimer.current = setTimeout(() => {
      setState('flying-in')
    }, 15000)
  }

  useEffect(() => {
    // Initial 2s delay before first fly-in
    const initial = setTimeout(() => {
      setState('flying-in')
    }, 2000)
    return () => {
      clearTimeout(initial)
      clearTimers()
    }
  }, [])

  useEffect(() => {
    if (state === 'flying-in') {
      // After 1200ms animation, transition to sitting
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

    if (state === 'alert') {
      // alert doesn't auto-transition; hover-end returns to sitting
    }

    if (state === 'flying-away') {
      clearTimers()
      const t = setTimeout(() => {
        setState('hidden')
      }, 800)
      return () => clearTimeout(t)
    }

    if (state === 'hidden' && hasLandedOnce.current) {
      scheduleReturn()
      return () => clearTimers()
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state])

  const handleMouseEnter = () => {
    if (state === 'sitting') {
      clearTimers()
      setState('alert')
    }
  }

  const handleMouseLeave = () => {
    if (state === 'alert') {
      setState('sitting')
    }
  }

  const handleClick = () => {
    if (state === 'sitting' || state === 'alert') {
      clearTimers()
      setState('flying-away')
    }
  }

  const isVisible = state !== 'hidden'

  // Per-state animation styles
  const outerStyle = (): React.CSSProperties => {
    if (state === 'flying-in') return { animation: 'bird-fly-in 1.2s ease-out forwards' }
    if (state === 'sitting')   return { animation: 'bird-bob 2s ease-in-out infinite' }
    if (state === 'alert')     return { animation: 'bird-alert 0.3s ease-out forwards' }
    if (state === 'flying-away') return { animation: 'bird-fly-away 0.8s ease-in forwards' }
    return {}
  }

  const wingStyle = (): React.CSSProperties => {
    if (state === 'flying-in' || state === 'flying-away')
      return { animation: 'bird-wing-flap 0.35s ease-in-out infinite' }
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
    if (state === 'sitting' || state === 'alert')
      return { animation: 'bird-blink 4s ease-in-out infinite' }
    return {}
  }

  return (
    <div
      className="bird-container"
      style={{
        position: 'absolute',
        bottom: -1,
        right: 'clamp(80px, 8vw, 120px)',
        width: 48,
        height: 32,
        zIndex: 10,
        cursor: state === 'sitting' || state === 'alert' ? 'pointer' : 'default',
        display: isVisible ? 'block' : 'none',
      }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={handleClick}
    >
      <svg
        viewBox="0 0 48 32"
        width={48}
        height={32}
        fill="var(--ink)"
        style={outerStyle()}
      >
        {/* Tail */}
        <path d="M6 20 L2 26 L8 23 Z" />

        {/* Torso */}
        <ellipse cx="20" cy="20" rx="14" ry="10" />

        {/* Wing */}
        <g
          style={{
            transformOrigin: '16px 18px',
            transformBox: 'fill-box',
            ...wingStyle(),
          }}
        >
          <ellipse cx="18" cy="20" rx="11" ry="6" fill="var(--bg)" stroke="var(--ink)" strokeWidth="1.2" />
        </g>

        {/* Feet */}
        <line x1="16" y1="29" x2="13" y2="32" stroke="var(--ink)" strokeWidth="1" />
        <line x1="16" y1="29" x2="16" y2="32" stroke="var(--ink)" strokeWidth="1" />
        <line x1="22" y1="29" x2="19" y2="32" stroke="var(--ink)" strokeWidth="1" />
        <line x1="22" y1="29" x2="22" y2="32" stroke="var(--ink)" strokeWidth="1" />

        {/* Head group */}
        <g
          style={{
            transformOrigin: '32px 13px',
            transformBox: 'fill-box',
            ...headStyle(),
          }}
        >
          {/* Head */}
          <circle cx="32" cy="13" r="7" />

          {/* Beak */}
          <path d="M38 12 L44 13.5 L38 15 Z" />

          {/* Eye white */}
          <circle cx="34" cy="12" r="1.8" fill="var(--bg)" />

          {/* Pupil */}
          <circle cx="34.5" cy="12" r="0.9" />

          {/* Eyelid (for blink) */}
          <circle
            cx="34"
            cy="12"
            r="2"
            fill="var(--ink)"
            style={{
              transformOrigin: '34px 12px',
              transformBox: 'fill-box',
              ...eyelidStyle(),
            }}
          />
        </g>
      </svg>
    </div>
  )
}
