'use client'

import { useEffect, useRef, useState } from 'react'

const CARDS = [
  {
    type: 'reddit' as const,
    subreddit: 'r/SideProject',
    time: '6h ago',
    title: 'Found this tool that tells you which subreddits are already discussing your project',
    score: 847,
    comments: 93,
    preview: 'It cross-references your GitHub repo with Reddit threads and HN posts. Honestly saved me from posting in completely the wrong communities.',
  },
  {
    type: 'hn' as const,
    title: 'Show HN: ForkPulse – marketing intelligence from your GitHub repo',
    points: 312,
    comments: 87,
    author: 'torchlabs',
    time: '2d ago',
    preview: 'We built this after noticing that our tools had 3k stars but we had no idea who was actually using them or where they hung out.',
  },
  {
    type: 'github' as const,
    name: 'vercel/next.js',
    stars: 124800,
    forks: 26300,
    language: 'TypeScript',
    description: 'The React Framework — production grade React apps that scale.',
    trend: '+1.2k this week',
  },
  {
    type: 'reddit' as const,
    subreddit: 'r/programming',
    time: '1d ago',
    title: 'Your commit history is a content calendar. Most devs never look at it that way.',
    score: 2140,
    comments: 204,
    preview: 'Every feature you shipped is a story. Every closed issue is social proof. ForkPulse actually surfaces this pattern automatically.',
  },
  {
    type: 'hn' as const,
    title: 'Ask HN: How do you find where your OSS users actually congregate?',
    points: 198,
    comments: 134,
    author: 'mrkd',
    time: '4d ago',
    preview: 'I have 800 stars on my repo but zero idea where these people came from. No referrer data, no signups, nothing.',
  },
]

function RedditCard({ card }: { card: typeof CARDS[0] & { type: 'reddit' } }) {
  return (
    <div className="signal-card signal-card-reddit" style={{ height: '100%' }}>
      <div style={{ padding: '16px 16px 12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
          <div style={{
            width: 28, height: 28, borderRadius: '50%',
            background: 'var(--reddit-orange)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <svg width="14" height="14" viewBox="0 0 20 20" fill="white">
              <circle cx="10" cy="10" r="10" fill="var(--reddit-orange)" />
              <path d="M16.67 10a1.46 1.46 0 00-2.47-1 7.12 7.12 0 00-3.85-1.23l.65-3.08 2.13.45a1 1 0 101.07-1 1 1 0 00-.96.68l-2.38-.5a.27.27 0 00-.32.2l-.73 3.44a7.14 7.14 0 00-3.89 1.23 1.46 1.46 0 10-1.61 2.39 2.87 2.87 0 000 .44c0 2.24 2.61 4.06 5.83 4.06s5.83-1.82 5.83-4.06a2.87 2.87 0 000-.44 1.46 1.46 0 00.6-1.08z" fill="white" />
            </svg>
          </div>
          <div>
            <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-primary)' }}>{card.subreddit}</div>
            <div style={{ fontSize: 11, color: 'var(--text-faint)' }}>{card.time}</div>
          </div>
        </div>
        <p style={{ fontSize: 14, fontWeight: 600, lineHeight: 1.4, color: 'var(--text-primary)', marginBottom: 10 }}>
          {card.title}
        </p>
        <p style={{ fontSize: 12, color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: 14 }}>
          {card.preview}
        </p>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{
            display: 'flex', alignItems: 'center', gap: 4,
            background: 'rgba(255,69,0,0.07)', borderRadius: 20, padding: '4px 10px',
          }}>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="var(--reddit-orange)">
              <path d="M12 4l-1.41 1.41L16.17 11H4v2h12.17l-5.58 5.59L12 20l8-8z" transform="rotate(-90,12,12)" />
            </svg>
            <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--reddit-orange)' }}>
              {card.score.toLocaleString()}
            </span>
          </div>
          <span style={{ fontSize: 12, color: 'var(--text-faint)' }}>{card.comments} comments</span>
        </div>
      </div>
    </div>
  )
}

function HNCard({ card }: { card: typeof CARDS[1] & { type: 'hn' } }) {
  return (
    <div className="signal-card signal-card-hn" style={{ height: '100%' }}>
      <div style={{ padding: '16px 16px 12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 12 }}>
          <div style={{
            background: 'var(--hn-orange)', color: 'white',
            fontFamily: 'var(--font-ibm-plex-mono)', fontWeight: 700,
            fontSize: 11, padding: '3px 7px', borderRadius: 4,
          }}>Y</div>
          <span style={{ fontFamily: 'var(--font-ibm-plex-mono)', fontSize: 11, color: 'var(--text-faint)' }}>
            Hacker News
          </span>
        </div>
        <p style={{ fontSize: 14, fontWeight: 600, lineHeight: 1.4, color: 'var(--text-primary)', marginBottom: 10 }}>
          {card.title}
        </p>
        <p style={{ fontSize: 12, color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: 14 }}>
          {card.preview}
        </p>
        <div style={{
          fontFamily: 'var(--font-ibm-plex-mono)', fontSize: 11,
          color: 'var(--text-faint)', display: 'flex', gap: 12,
        }}>
          <span style={{ color: 'var(--hn-orange)', fontWeight: 600 }}>▲ {card.points}</span>
          <span>{card.comments} comments</span>
          <span>by {card.author}</span>
          <span>{card.time}</span>
        </div>
      </div>
    </div>
  )
}

function GitHubCard({ card }: { card: typeof CARDS[2] & { type: 'github' } }) {
  return (
    <div className="signal-card signal-card-github" style={{ height: '100%' }}>
      <div style={{ padding: '16px 16px 12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
          <svg width="20" height="20" viewBox="0 0 16 16" fill="var(--github-gray)">
            <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z" />
          </svg>
          <span style={{ fontFamily: 'var(--font-ibm-plex-mono)', fontSize: 12, fontWeight: 600, color: 'var(--github-gray)' }}>
            {card.name}
          </span>
        </div>
        <p style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: 16 }}>
          {card.description}
        </p>
        <div style={{ display: 'flex', gap: 16, marginBottom: 12 }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontFamily: 'var(--font-ibm-plex-mono)', fontSize: 20, fontWeight: 400, color: 'var(--text-primary)', letterSpacing: '-0.03em' }}>
              {(card.stars / 1000).toFixed(1)}k
            </div>
            <div style={{ fontSize: 11, color: 'var(--text-faint)', marginTop: 2 }}>Stars</div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontFamily: 'var(--font-ibm-plex-mono)', fontSize: 20, fontWeight: 400, color: 'var(--text-primary)', letterSpacing: '-0.03em' }}>
              {(card.forks / 1000).toFixed(1)}k
            </div>
            <div style={{ fontSize: 11, color: 'var(--text-faint)', marginTop: 2 }}>Forks</div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 20, color: '#3CB371', letterSpacing: '-0.03em' }}>↑</div>
            <div style={{ fontSize: 11, color: 'var(--text-faint)', marginTop: 2 }}>Trending</div>
          </div>
        </div>
        <div style={{ display: 'flex', gap: 6 }}>
          <span style={{
            display: 'inline-flex', alignItems: 'center', gap: 4,
            background: 'rgba(0,0,0,0.05)', borderRadius: 20, padding: '3px 8px',
            fontSize: 11, fontWeight: 500,
          }}>
            <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#3178C6', display: 'inline-block' }} />
            {card.language}
          </span>
          <span style={{
            display: 'inline-flex', alignItems: 'center', gap: 4,
            background: 'rgba(60,179,113,0.1)', borderRadius: 20, padding: '3px 8px',
            fontSize: 11, fontWeight: 500, color: '#2D9651',
          }}>
            {card.trend}
          </span>
        </div>
      </div>
    </div>
  )
}

export default function SignalCarousel() {
  const [activeIndex, setActiveIndex] = useState(1)
  const scrollRef = useRef<HTMLDivElement>(null)
  const cardRefs = useRef<(HTMLDivElement | null)[]>([])

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        let best = { ratio: 0, index: -1 }
        entries.forEach(entry => {
          const index = cardRefs.current.findIndex(r => r === entry.target)
          if (index !== -1 && entry.intersectionRatio > best.ratio) {
            best = { ratio: entry.intersectionRatio, index }
          }
        })
        if (best.index !== -1) setActiveIndex(best.index)
      },
      { threshold: [0.5, 0.75, 1.0], root: scrollRef.current }
    )
    cardRefs.current.forEach(ref => { if (ref) observer.observe(ref) })
    return () => observer.disconnect()
  }, [])

  function cardClass(i: number) {
    const diff = Math.abs(i - activeIndex)
    if (diff === 0) return 'carousel-item is-active'
    if (diff === 1) return 'carousel-item is-side'
    return 'carousel-item is-far'
  }

  function rotateStyle(i: number): React.CSSProperties {
    const diff = i - activeIndex
    if (diff === 0) return {}
    return { transform: `rotate(${diff > 0 ? 2.5 : -2.5}deg)` }
  }

  return (
    <div style={{ position: 'relative' }}>
      {/* Edge fade — left */}
      <div style={{
        position: 'absolute', left: 0, top: 0, bottom: 0, width: 40, zIndex: 2,
        background: 'linear-gradient(to right, rgba(255,255,255,0.9), transparent)',
        pointerEvents: 'none',
      }} />
      {/* Edge fade — right */}
      <div style={{
        position: 'absolute', right: 0, top: 0, bottom: 0, width: 40, zIndex: 2,
        background: 'linear-gradient(to left, rgba(255,255,255,0.9), transparent)',
        pointerEvents: 'none',
      }} />

      <div ref={scrollRef} className="carousel-scroll" style={{ paddingLeft: 'clamp(24px, 10vw, 80px)', paddingRight: 'clamp(24px, 10vw, 80px)' }}>
        {CARDS.map((card, i) => (
          <div
            key={i}
            ref={el => { cardRefs.current[i] = el }}
            className={cardClass(i)}
            style={rotateStyle(i)}
          >
            {card.type === 'reddit' && <RedditCard card={card as any} />}
            {card.type === 'hn'     && <HNCard     card={card as any} />}
            {card.type === 'github' && <GitHubCard card={card as any} />}
          </div>
        ))}
      </div>

      {/* Dot indicator */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: 6, marginTop: 4 }}>
        {CARDS.map((_, i) => (
          <div
            key={i}
            style={{
              width: i === activeIndex ? 20 : 6,
              height: 6,
              borderRadius: 3,
              background: i === activeIndex ? 'var(--text-primary)' : 'rgba(0,0,0,0.15)',
              transition: 'width 0.3s ease, background 0.3s ease',
            }}
          />
        ))}
      </div>
    </div>
  )
}
