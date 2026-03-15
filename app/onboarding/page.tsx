'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

const VOICES = [
  {
    id: 'technical',
    name: 'Technical Precision',
    emoji: '⚙️',
    desc: 'Code-first. Show the implementation, not just the idea. Appeals to devs who need to see the internals.',
  },
  {
    id: 'empathy',
    name: 'Dev Empathy',
    emoji: '💬',
    desc: 'Lead with the frustration. Speak to the exact pain your users feel before they found your project.',
  },
  {
    id: 'show-hn',
    name: 'Show HN Mode',
    emoji: '🟠',
    desc: 'Hacker News energy. Honest, technical, no fluff. Built this, here\'s why, here\'s the tradeoffs.',
  },
  {
    id: 'community',
    name: 'Community Builder',
    emoji: '🙌',
    desc: 'Reddit thread energy. Conversational, genuinely helpful, curious about what others are working on.',
  },
  {
    id: 'thought-leader',
    name: 'Thought Leader',
    emoji: '🔭',
    desc: 'Bold takes. Strong opinions. You\'re not just shipping software — you\'re reshaping how devs work.',
  },
  {
    id: 'growth',
    name: 'Growth Loop',
    emoji: '📈',
    desc: 'Every post is a funnel. Clicks, signups, activations. Marketing-native, data-backed, conversion-focused.',
  },
  {
    id: 'oss',
    name: 'Open Source Native',
    emoji: '🌱',
    desc: 'Stars, contributors, ecosystem. You\'re building in public and your marketing strategy reflects it.',
  },
  {
    id: 'minimal',
    name: 'Minimal Signal',
    emoji: '◾',
    desc: 'Say less, mean more. Short posts, pure data, zero spin. The work speaks.',
  },
]

export default function OnboardingPage() {
  const [selected, setSelected] = useState<string | null>(null)
  const router = useRouter()

  return (
    <main style={{
      minHeight: '100vh',
      background: 'var(--bg-dark)',
      color: 'var(--text-white)',
      display: 'flex', flexDirection: 'column',
    }}>
      {/* Nav */}
      <nav style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '20px clamp(16px, 5vw, 36px)',
        borderBottom: '1px solid rgba(255,255,255,0.07)',
      }}>
        <a href="/" style={{
          fontFamily: 'var(--font-jakarta)', fontWeight: 700, fontSize: 15,
          color: 'rgba(255,255,255,0.8)', textDecoration: 'none',
          letterSpacing: '-0.02em',
        }}>
          ← ForkPulse
        </a>
        <span style={{
          fontFamily: 'var(--font-ibm-plex-mono)', fontSize: 10,
          color: 'rgba(255,255,255,0.3)', letterSpacing: '0.1em', textTransform: 'uppercase',
        }}>
          Step 1 of 1
        </span>
      </nav>

      {/* Content */}
      <div style={{
        flex: 1, padding: 'clamp(40px, 8vw, 72px) clamp(16px, 5vw, 36px)',
        maxWidth: 800, margin: '0 auto', width: '100%',
      }}>
        <div style={{ textAlign: 'center', marginBottom: 'clamp(36px, 6vw, 56px)' }}>
          <h1 style={{
            fontFamily: 'var(--font-jakarta)', fontWeight: 800,
            fontSize: 'clamp(1.8rem, 6vw, 2.8rem)', letterSpacing: '-0.03em',
            color: 'white', marginBottom: 14,
          }}>
            Pick your content voice.
          </h1>
          <p style={{ fontSize: 15, color: 'rgba(255,255,255,0.45)', lineHeight: 1.7, maxWidth: 420, margin: '0 auto' }}>
            This shapes how ForkPulse frames your marketing copy and channel recommendations.
            You can change it anytime.
          </p>
        </div>

        {/* Voice cards grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 340px), 1fr))',
          gap: 14,
          marginBottom: 40,
        }}>
          {VOICES.map(voice => (
            <button
              key={voice.id}
              onClick={() => setSelected(voice.id)}
              className={`voice-card${selected === voice.id ? ' selected' : ''}`}
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                textAlign: 'left',
                width: '100%',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: 14 }}>
                <div style={{
                  width: 42, height: 42, borderRadius: 12, flexShrink: 0,
                  background: selected === voice.id
                    ? 'rgba(124,58,237,0.3)'
                    : 'rgba(255,255,255,0.07)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 20,
                  border: selected === voice.id
                    ? '1px solid rgba(124,58,237,0.5)'
                    : '1px solid rgba(255,255,255,0.1)',
                  transition: 'background 0.15s, border-color 0.15s',
                }}>
                  {voice.emoji}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{
                    fontFamily: 'var(--font-jakarta)', fontWeight: 700, fontSize: 14,
                    color: selected === voice.id ? 'white' : 'rgba(255,255,255,0.85)',
                    marginBottom: 5, letterSpacing: '-0.01em',
                    display: 'flex', alignItems: 'center', gap: 8,
                  }}>
                    {voice.name}
                    {selected === voice.id && (
                      <span style={{
                        display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                        width: 16, height: 16, borderRadius: '50%',
                        background: '#7C3AED', color: 'white', fontSize: 10,
                      }}>✓</span>
                    )}
                  </div>
                  <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.4)', lineHeight: 1.6, margin: 0 }}>
                    {voice.desc}
                  </p>
                </div>
              </div>
            </button>
          ))}
        </div>

        {/* Continue button */}
        <div style={{ position: 'sticky', bottom: 0, padding: '16px 0', background: 'var(--bg-dark)' }}>
          <button
            disabled={!selected}
            onClick={() => router.push('/')}
            style={{
              width: '100%',
              background: selected ? 'white' : 'rgba(255,255,255,0.08)',
              color: selected ? 'var(--bg-dark)' : 'rgba(255,255,255,0.3)',
              border: 'none',
              padding: '16px 28px',
              borderRadius: 9999,
              fontFamily: 'var(--font-jakarta)', fontWeight: 700, fontSize: 15,
              cursor: selected ? 'pointer' : 'not-allowed',
              transition: 'background 0.2s, color 0.2s, transform 0.15s',
              transform: selected ? 'none' : undefined,
              letterSpacing: '-0.01em',
            }}
          >
            {selected
              ? `Continue with "${VOICES.find(v => v.id === selected)?.name}" →`
              : 'Select a voice to continue'
            }
          </button>
          {!selected && (
            <p style={{
              textAlign: 'center', marginTop: 10,
              fontFamily: 'var(--font-ibm-plex-mono)', fontSize: 11,
              color: 'rgba(255,255,255,0.2)', letterSpacing: '0.04em',
            }}>
              Tap a card above
            </p>
          )}
        </div>
      </div>
    </main>
  )
}
