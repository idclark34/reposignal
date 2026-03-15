'use client'

import { useState } from 'react'
import { PlaybookMatch, PlaybookPlatform } from '@/types'

const PLATFORM_COLORS: Record<PlaybookPlatform, string> = {
  twitter:     '#1D9BF0',
  hn:          '#FF6600',
  reddit:      '#FF4500',
  producthunt: '#DA552F',
  newsletter:  '#7C3AED',
}

const PLATFORM_LABELS: Record<PlaybookPlatform, string> = {
  twitter:     'Twitter',
  hn:          'HN',
  reddit:      'Reddit',
  producthunt: 'PH',
  newsletter:  'Newsletter',
}

function PlatformBadge({ platform }: { platform: PlaybookPlatform }) {
  const color = PLATFORM_COLORS[platform]
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center',
      fontFamily: 'var(--font-ibm-plex-mono)', fontSize: 10, fontWeight: 600,
      color, background: `${color}18`,
      borderRadius: 9999, padding: '2px 7px',
      whiteSpace: 'nowrap' as const,
    }}>
      {PLATFORM_LABELS[platform]}
    </span>
  )
}

function PlaybookCard({ match }: { match: PlaybookMatch }) {
  const [expanded, setExpanded] = useState(false)
  const { playbook, matchReason } = match

  const initial = playbook.name.charAt(0).toUpperCase()

  // Color by first category
  const catColors: Record<string, string> = {
    database: '#0A7D4E',
    css: '#3B82F6',
    frontend: '#3B82F6',
    scheduling: '#7C3AED',
    react: '#61DAFB',
    email: '#DA552F',
    'background-jobs': '#F59E0B',
    sqlite: '#0A7D4E',
  }
  const accentColor = catColors[playbook.categories[0]] ?? '#0A7D4E'

  return (
    <div className="feed-card signal-card-playbook" style={{ overflow: 'hidden' }}>

      {/* ── Header ── */}
      <div style={{ padding: '16px 20px 14px' }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
          {/* Initial circle */}
          <div style={{
            width: 40, height: 40, borderRadius: '50%', flexShrink: 0,
            background: `${accentColor}18`, border: `1.5px solid ${accentColor}30`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontFamily: 'var(--font-jakarta)', fontWeight: 800, fontSize: 16, color: accentColor,
          }}>
            {initial}
          </div>

          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' as const }}>
              <span style={{
                fontFamily: 'var(--font-jakarta)', fontWeight: 700, fontSize: 15,
                color: 'var(--text-primary)', letterSpacing: '-0.01em',
              }}>
                {playbook.name}
              </span>
              {/* Star count chip */}
              <span style={{
                fontFamily: 'var(--font-ibm-plex-mono)', fontSize: 10, fontWeight: 600,
                color: '#F59E0B', background: 'rgba(245,158,11,0.10)',
                borderRadius: 9999, padding: '2px 7px', whiteSpace: 'nowrap' as const,
              }}>
                ★ {playbook.currentStars}
              </span>
            </div>
            <p style={{ fontSize: 12, color: 'var(--text-secondary)', marginTop: 3, lineHeight: 1.4 }}>
              {playbook.tagline}
            </p>
          </div>

          {/* Expand toggle */}
          <button
            onClick={() => setExpanded(e => !e)}
            style={{
              fontFamily: 'var(--font-ibm-plex-mono)', fontSize: 11,
              color: '#0A7D4E', background: 'rgba(10,125,78,0.08)',
              border: '1px solid rgba(10,125,78,0.2)', borderRadius: 8,
              padding: '5px 10px', cursor: 'pointer', flexShrink: 0,
              transition: 'background 0.15s',
            }}
          >
            {expanded ? 'Less ↑' : 'Timeline ↓'}
          </button>
        </div>
      </div>

      {/* ── "Why this applies" callout ── */}
      <div style={{
        margin: '0 20px 14px',
        background: '#F8F7FF',
        borderLeft: '3px solid #0A7D4E',
        borderRadius: '0 8px 8px 0',
        padding: '10px 14px',
      }}>
        <p style={{
          fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.6,
          fontStyle: 'italic',
        }}>
          {matchReason}
        </p>
      </div>

      {/* ── Content examples (always visible) ── */}
      <div style={{ padding: '0 20px 14px', display: 'flex', flexDirection: 'column', gap: 8 }}>
        {playbook.contentExamples.map((ex, i) => (
          <div key={i} style={{
            background: 'var(--bg-surface)', borderRadius: 10,
            border: '1px solid var(--border)', padding: '10px 12px',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 6 }}>
              <PlatformBadge platform={ex.platform} />
              {ex.context && (
                <span style={{ fontFamily: 'var(--font-ibm-plex-mono)', fontSize: 10, color: 'var(--text-faint)' }}>
                  {ex.context}
                </span>
              )}
              <span style={{
                marginLeft: 'auto', fontFamily: 'var(--font-ibm-plex-mono)', fontSize: 10,
                color: 'var(--text-faint)', whiteSpace: 'nowrap' as const,
              }}>
                {ex.engagement}
              </span>
            </div>
            <p style={{
              fontFamily: 'var(--font-ibm-plex-mono)', fontSize: 12,
              color: 'var(--text-primary)', lineHeight: 1.5,
              display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' as const,
              overflow: 'hidden',
            }}>
              {ex.text}
            </p>
          </div>
        ))}
      </div>

      {/* ── Growth timeline (expand toggle) ── */}
      {expanded && (
        <div style={{ padding: '0 20px 16px' }}>
          <div style={{
            fontFamily: 'var(--font-ibm-plex-mono)', fontSize: 10, letterSpacing: '0.1em',
            textTransform: 'uppercase', color: '#0A7D4E', marginBottom: 12, fontWeight: 600,
          }}>
            Growth timeline
          </div>
          <div style={{ position: 'relative', paddingLeft: 20 }}>
            {/* Vertical line */}
            <div style={{
              position: 'absolute', left: 6, top: 8, bottom: 8,
              width: 1.5, background: 'rgba(10,125,78,0.2)',
            }} />
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {playbook.milestones.map((m, i) => (
                <div key={i} style={{ position: 'relative' }}>
                  {/* Dot */}
                  <div style={{
                    position: 'absolute', left: -17, top: 4,
                    width: 10, height: 10, borderRadius: '50%',
                    background: '#0A7D4E', border: '2px solid white',
                    boxShadow: '0 0 0 1.5px rgba(10,125,78,0.3)',
                  }} />
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginBottom: 3 }}>
                    <span style={{
                      fontFamily: 'var(--font-jakarta)', fontWeight: 700, fontSize: 13,
                      color: 'var(--text-primary)', letterSpacing: '-0.01em',
                    }}>
                      {m.label}
                    </span>
                    <span style={{
                      fontFamily: 'var(--font-ibm-plex-mono)', fontSize: 10,
                      color: '#0A7D4E', whiteSpace: 'nowrap' as const,
                    }}>
                      {m.timeframe}
                    </span>
                  </div>
                  <p style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                    {m.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── Lessons chips (always visible) ── */}
      <div style={{
        padding: '12px 20px 16px',
        borderTop: '1px solid var(--border)',
        display: 'flex', flexWrap: 'wrap' as const, gap: 6,
      }}>
        {playbook.lessons.map((lesson, i) => (
          <span key={i} style={{
            fontFamily: 'var(--font-ibm-plex-mono)', fontSize: 10,
            color: 'var(--text-secondary)', background: 'rgba(0,0,0,0.05)',
            borderRadius: 9999, padding: '3px 9px', whiteSpace: 'nowrap' as const,
          }}>
            {lesson}
          </span>
        ))}
      </div>
    </div>
  )
}

interface Props {
  matches: PlaybookMatch[]
}

export default function PlaybookSection({ matches }: Props) {
  return (
    <div style={{ margin: '40px 0' }}>
      {/* Section header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
        <span style={{
          display: 'inline-flex', alignItems: 'center',
          fontFamily: 'var(--font-ibm-plex-mono)', fontSize: 10, fontWeight: 600,
          letterSpacing: '0.06em', textTransform: 'uppercase',
          color: '#0A7D4E', background: 'rgba(10,125,78,0.10)',
          border: '1px solid rgba(10,125,78,0.2)',
          borderRadius: 9999, padding: '3px 10px',
        }}>
          Growth Playbooks
        </span>
        <h2 style={{
          fontFamily: 'var(--font-jakarta)', fontWeight: 700, fontSize: 18,
          color: 'var(--text-primary)', letterSpacing: '-0.02em',
        }}>
          Who grew like you — and how
        </h2>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        {matches.map(match => (
          <PlaybookCard key={match.playbook.id} match={match} />
        ))}
      </div>
    </div>
  )
}
