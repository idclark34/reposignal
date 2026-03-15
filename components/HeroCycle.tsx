'use client'

import { useState, useEffect } from 'react'

const headlines = [
  {
    main: '500 stars. 47 Reddit upvotes.',
    accent: 'But do they actually want it?',
  },
  {
    main: 'Your commit history is a content calendar.',
    accent: 'Most devs never open it.',
  },
  {
    main: 'The communities are already talking.',
    accent: 'Know exactly what to say, and where.',
  },
]

export default function HeroCycle() {
  const [index, setIndex] = useState(0)
  const [visible, setVisible] = useState(true)

  useEffect(() => {
    const interval = setInterval(() => {
      setVisible(false)
      setTimeout(() => {
        setIndex(i => (i + 1) % headlines.length)
        setVisible(true)
      }, 400)
    }, 4500)
    return () => clearInterval(interval)
  }, [])

  const { main, accent } = headlines[index]

  return (
    <h1
      style={{
        fontSize: 'clamp(36px, 7vw, 80px)',
        lineHeight: 1.05,
        letterSpacing: '-0.03em',
        fontFamily: 'var(--font-fraunces), Georgia, serif',
        fontStyle: 'italic',
        fontOpticalSizing: 'auto',
        maxWidth: '16ch',
        minHeight: '2.2em',
        marginBottom: 'clamp(28px, 4vw, 48px)',
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(12px)',
        transition: 'opacity 0.4s cubic-bezier(0,0,0.2,1), transform 0.4s cubic-bezier(0,0,0.2,1)',
      }}
    >
      <span style={{ color: '#ffffff' }}>{main}{' '}</span>
      <span
        style={{
          background: 'linear-gradient(135deg, #c07eff 0%, #ac4bff 50%, #7f22fe 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
        }}
      >
        {accent}
      </span>
    </h1>
  )
}
