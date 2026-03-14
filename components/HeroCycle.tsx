'use client'

import { useState, useEffect } from 'react'

const headlines = [
  {
    main: '500 stars. 47 Reddit upvotes.',
    accent: 'But do they actually want it?',
  },
  {
    main: '3,200 monthly searches. 18 HN comments.',
    accent: 'None of them reached your landing page.',
  },
  {
    main: 'Your users are already out there talking.',
    accent: 'The data tells you exactly where.',
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
      }, 350)
    }, 4500)
    return () => clearInterval(interval)
  }, [])

  const { main, accent } = headlines[index]

  return (
    <h1
      className="display-italic"
      style={{
        fontSize: 'clamp(36px, 11vw, 120px)',
        lineHeight: 0.93,
        letterSpacing: '-0.03em',
        color: 'var(--ink)',
        maxWidth: '18ch',
        marginBottom: 'clamp(28px, 4vw, 48px)',
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(10px)',
        transition: 'opacity 0.35s ease, transform 0.35s ease',
      }}
    >
      {main}{' '}
      <span style={{ color: 'var(--accent)' }}>{accent}</span>
    </h1>
  )
}
