'use client'

import { useState } from 'react'
import { ReportSummary } from '@/types'

// ── Circular Progress Ring ────────────────────────────────────────────

function CircularProgress({ score }: { score: number }) {
  const r = 38
  const circ = 2 * Math.PI * r // ≈ 238.76
  const offset = circ * (1 - score / 100)
  const color = score >= 70 ? '#16A34A' : score >= 40 ? '#F59E0B' : '#EF4444'

  return (
    <div style={{ position: 'relative', width: 88, height: 88 }}>
      <style>{`@keyframes ring-fill-${score} { from { stroke-dashoffset: ${circ.toFixed(2)}; } }`}</style>
      <svg viewBox="0 0 100 100" width={88} height={88}>
        <circle cx={50} cy={50} r={r} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth={8} />
        <circle
          cx={50} cy={50} r={r} fill="none"
          stroke={color} strokeWidth={8} strokeLinecap="round"
          strokeDasharray={circ} strokeDashoffset={offset}
          style={{
            transform: 'rotate(-90deg)', transformOrigin: '50px 50px',
            animation: `ring-fill-${score} 1.2s ease-out forwards`,
          }}
        />
      </svg>
      <div style={{
        position: 'absolute', inset: 0,
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
      }}>
        <span style={{ fontFamily: 'var(--font-ibm-plex-mono)', fontSize: 24, fontWeight: 600, color, lineHeight: 1 }}>
          {score}
        </span>
        <span style={{ fontFamily: 'var(--font-ibm-plex-mono)', fontSize: 9, color: 'rgba(255,255,255,0.3)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
          / 100
        </span>
      </div>
    </div>
  )
}

// ── Trend Sparkline ───────────────────────────────────────────────────

function TrendSparkline({ direction }: { direction: 'rising' | 'stable' | 'declining' }) {
  const pointSets = {
    rising:    '0,36 20,30 40,21 60,13 80,7 100,4 120,1',
    stable:    '0,20 20,17 40,22 60,17 80,21 100,16 120,20',
    declining: '0,3  20,7  40,15 60,23 80,30 100,34 120,38',
  }
  const colors = { rising: '#16A34A', stable: '#F59E0B', declining: '#EF4444' }
  const labels = { rising: 'Rising', stable: 'Stable', declining: 'Declining' }
  const color = colors[direction]
  const pts = pointSets[direction]

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
      <svg viewBox="0 0 120 40" width={100} height={34} style={{ overflow: 'visible' }}>
        <polygon points={`0,40 ${pts} 120,40`} fill={color} opacity={0.1} />
        <polyline points={pts} fill="none" stroke={color} strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
        <span style={{ width: 7, height: 7, borderRadius: '50%', background: color, display: 'inline-block', flexShrink: 0 }} />
        <span style={{ fontFamily: 'var(--font-ibm-plex-mono)', fontSize: 12, color, fontWeight: 600 }}>
          {labels[direction]}
        </span>
      </div>
    </div>
  )
}

// ── Audience Bar ──────────────────────────────────────────────────────

function AudienceBar({ size }: { size: 'small' | 'medium' | 'large' }) {
  const fills = { small: 22, medium: 58, large: 92 }
  const labels = { small: 'Niche', medium: 'Growing', large: 'Large' }
  const colors = { small: '#3B82F6', medium: '#F59E0B', large: '#16A34A' }
  const color = colors[size]

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10 }}>
      <span style={{
        fontFamily: 'var(--font-jakarta)', fontWeight: 800, fontSize: 28,
        color: '#F9FAFB', letterSpacing: '-0.03em', lineHeight: 1,
      }}>
        {labels[size]}
      </span>
      <div style={{ width: 96, height: 5, background: 'rgba(255,255,255,0.08)', borderRadius: 9999 }}>
        <div style={{
          width: `${fills[size]}%`, height: '100%',
          background: color, borderRadius: 9999,
          transition: 'width 1s ease-out',
        }} />
      </div>
    </div>
  )
}

// ── Zone 1: Hero Summary Bar ──────────────────────────────────────────

export function HeroSummaryBar({ summary }: { summary: ReportSummary }) {
  const cards = [
    { label: 'Launch Readiness', node: <CircularProgress score={summary.launchReadiness} /> },
    { label: 'Interest Trend',   node: <TrendSparkline direction={summary.trendDirection} /> },
    { label: 'Audience Size',    node: <AudienceBar size={summary.audienceSize} /> },
  ]

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 10, margin: '16px 0 0' }}>
      {cards.map((card, i) => (
        <div key={i} className="fade-up" style={{
          animationDelay: `${i * 0.1}s`,
          background: '#111111',
          border: '1px solid rgba(255,255,255,0.07)',
          borderRadius: 16,
          padding: '20px 12px',
          display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12,
        }}>
          <span style={{
            fontFamily: 'var(--font-ibm-plex-mono)', fontSize: 9, fontWeight: 500,
            letterSpacing: '0.12em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.3)',
          }}>
            {card.label}
          </span>
          {card.node}
        </div>
      ))}
    </div>
  )
}

// ── Shared: insight card shell ────────────────────────────────────────

function InsightCard({ label, accent, index, children }: {
  label: string
  accent: string
  index: number
  children: React.ReactNode
}) {
  return (
    <div className="fade-up" style={{
      animationDelay: `${index * 0.1}s`,
      background: '#0F0F0F',
      border: '1px solid rgba(255,255,255,0.08)',
      borderLeft: `3px solid ${accent}`,
      borderRadius: 12,
      padding: '24px',
    }}>
      <div style={{
        fontFamily: 'var(--font-ibm-plex-mono)', fontSize: 10, fontWeight: 500,
        letterSpacing: '0.12em', textTransform: 'uppercase',
        color: '#6B7280', marginBottom: 12,
      }}>
        {label}
      </div>
      {children}
    </div>
  )
}

function Pill({ text }: { text: string }) {
  return (
    <span style={{
      background: 'rgba(255,255,255,0.06)', borderRadius: 9999,
      padding: '4px 12px', fontSize: 13, color: '#D1D5DB',
      fontFamily: 'var(--font-ibm-plex-mono)',
      display: 'inline-block', whiteSpace: 'nowrap' as const,
    }}>
      {text}
    </span>
  )
}

function FakeHNPost({ headline }: { headline: string }) {
  const clean = headline.replace(/^Show HN:\s*/i, '')
  return (
    <div style={{ background: '#F6F6EF', borderRadius: 6, padding: '10px 14px' }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 8 }}>
        <div style={{
          background: '#FF6600', color: 'white', fontWeight: 700,
          fontSize: 11, padding: '1px 5px', borderRadius: 3, flexShrink: 0,
          fontFamily: 'var(--font-ibm-plex-mono)', lineHeight: 1.6,
        }}>Y</div>
        <div>
          <div style={{ fontSize: 13, color: '#000', lineHeight: 1.45, marginBottom: 4, fontFamily: 'Verdana, sans-serif' }}>
            <span style={{ color: '#FF6600', fontWeight: 600 }}>Show HN:</span>{' '}{clean}
          </div>
          <div style={{ fontSize: 11, color: '#828282', fontFamily: 'Verdana, sans-serif' }}>
            <span style={{ color: '#FF6600' }}>▲ — pts</span>
            {' '}by you · just now · 0 comments
          </div>
        </div>
      </div>
    </div>
  )
}

// ── Zone 2: Intelligence Cards Grid ──────────────────────────────────

function IntelligenceGrid({ summary }: { summary: ReportSummary }) {
  const cards = [
    {
      label: 'Ideal Customer Profile',
      accent: '#3B82F6',
      content: (
        <>
          <p style={{ fontSize: 15, color: '#F9FAFB', lineHeight: 1.6, marginBottom: 14 }}>
            {summary.icp}
          </p>
          <div style={{ display: 'flex', flexWrap: 'wrap' as const, gap: 6 }}>
            {summary.painPhrases.map((p, i) => <Pill key={i} text={p} />)}
          </div>
        </>
      ),
    },
    {
      label: 'Top Communities',
      accent: '#FF4500',
      content: (
        <>
          <div style={{ display: 'flex', flexWrap: 'wrap' as const, gap: 6, marginBottom: 12 }}>
            {summary.topSubreddits.map((s, i) => (
              <span key={i} style={{
                background: 'rgba(255,69,0,0.12)', color: '#FF6B35',
                borderRadius: 9999, padding: '5px 12px', fontSize: 13,
                fontFamily: 'var(--font-ibm-plex-mono)', fontWeight: 600,
              }}>{s}</span>
            ))}
          </div>
          <p style={{ fontSize: 12, color: '#6B7280', lineHeight: 1.5 }}>
            These communities are actively discussing your problem space
          </p>
        </>
      ),
    },
    {
      label: 'Winning Angle',
      accent: '#7C3AED',
      content: (
        <p style={{
          fontSize: 16, color: '#F9FAFB', lineHeight: 1.55,
          fontStyle: 'italic', borderLeft: '2px solid rgba(124,58,237,0.4)',
          paddingLeft: 14,
        }}>
          "{summary.winningAngle}"
        </p>
      ),
    },
    {
      label: 'Show HN Headline',
      accent: '#FF6600',
      content: <FakeHNPost headline={summary.showHNHeadline} />,
    },
    {
      label: 'Biggest Risk',
      accent: '#EF4444',
      content: (
        <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
          <span style={{ fontSize: 18, flexShrink: 0, lineHeight: 1.4 }}>⚠</span>
          <p style={{ fontSize: 14, color: '#F9FAFB', lineHeight: 1.6, fontWeight: 500 }}>
            {summary.biggestRisk}
          </p>
        </div>
      ),
    },
    {
      label: 'Best Launch Channel',
      accent: '#16A34A',
      content: (
        <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
          <span style={{ fontSize: 22, flexShrink: 0 }}>🚀</span>
          <span style={{ fontSize: 18, color: '#F9FAFB', fontFamily: 'var(--font-jakarta)', fontWeight: 700, letterSpacing: '-0.01em' }}>
            {summary.topChannel}
          </span>
        </div>
      ),
    },
  ]

  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 280px), 1fr))',
      gap: 12,
    }}>
      {cards.map((card, i) => (
        <InsightCard key={i} label={card.label} accent={card.accent} index={i}>
          {card.content}
        </InsightCard>
      ))}
    </div>
  )
}

// ── Zone 3: Full Report (collapsed) ──────────────────────────────────

interface Section { num: string; title: string; content: string }

function parseSections(text: string): Section[] {
  return text
    .split(/(?=\d+\.\s+\*\*)/)
    .map(part => {
      const m = part.match(/^(\d+)\.\s+\*\*([^*]+)\*\*\s*(?:—\s*)?([\s\S]*)/)
      return m ? { num: m[1], title: m[2].trim(), content: m[3].trim() } : null
    })
    .filter(Boolean) as Section[]
}

function renderInline(text: string): React.ReactNode[] {
  return text.split(/(\*\*[^*]+\*\*)/).map((p, i) =>
    p.startsWith('**') && p.endsWith('**')
      ? <strong key={i} style={{ fontWeight: 600, color: 'rgba(255,255,255,0.9)' }}>{p.slice(2, -2)}</strong>
      : <span key={i}>{p}</span>
  )
}

function ReportSection({ s, defaultOpen }: { s: Section; defaultOpen?: boolean }) {
  const [open, setOpen] = useState(defaultOpen ?? false)
  return (
    <div style={{ borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
      <button
        onClick={() => setOpen(o => !o)}
        style={{
          width: '100%', display: 'flex', alignItems: 'center', gap: 16,
          padding: '18px 0', background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left',
        }}
      >
        <span style={{ fontFamily: 'var(--font-ibm-plex-mono)', fontSize: 11, color: 'rgba(124,58,237,0.8)', minWidth: 24 }}>
          0{s.num}
        </span>
        <span style={{ fontFamily: 'var(--font-jakarta)', fontWeight: 700, fontSize: 16, color: 'white', flex: 1, letterSpacing: '-0.01em' }}>
          {s.title}
        </span>
        <span style={{
          fontFamily: 'var(--font-ibm-plex-mono)', fontSize: 11, color: 'rgba(255,255,255,0.3)',
          transform: open ? 'rotate(90deg)' : 'none', transition: 'transform 0.2s', display: 'inline-block',
        }}>▶</span>
      </button>
      {open && (
        <div style={{ paddingLeft: 40, paddingBottom: 20 }}>
          {s.content.split('\n').map((line, i) => {
            const t = line.trim()
            if (!t) return <div key={i} style={{ height: 6 }} />
            const isBullet = t.startsWith('- ') || t.startsWith('• ')
            const text = isBullet ? t.slice(2) : t
            return isBullet ? (
              <div key={i} style={{ display: 'flex', gap: 10, marginBottom: 7, alignItems: 'flex-start' }}>
                <span style={{ color: 'rgba(124,58,237,0.8)', fontWeight: 700, flexShrink: 0, lineHeight: 1.7 }}>—</span>
                <span style={{ fontSize: 14, color: 'rgba(255,255,255,0.55)', lineHeight: 1.7 }}>{renderInline(text)}</span>
              </div>
            ) : (
              <p key={i} style={{ fontSize: 14, color: 'rgba(255,255,255,0.55)', lineHeight: 1.7, marginBottom: 5 }}>
                {renderInline(text)}
              </p>
            )
          })}
        </div>
      )}
    </div>
  )
}

function CollapsibleReport({ report, onCopy, onExport, copied }: {
  report: string
  onCopy: () => void
  onExport: () => void
  copied: boolean
}) {
  const [open, setOpen] = useState(false)
  const sections = parseSections(report)

  return (
    <div style={{ marginTop: 32, borderTop: '1px solid rgba(255,255,255,0.07)' }}>
      {/* Toggle row */}
      <button
        onClick={() => setOpen(o => !o)}
        style={{
          width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '18px 0', background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left',
        }}
      >
        <span style={{
          fontFamily: 'var(--font-jakarta)', fontWeight: 600, fontSize: 15,
          color: 'rgba(255,255,255,0.6)', letterSpacing: '-0.01em',
        }}>
          {open ? 'Hide full intelligence report ↑' : 'View full intelligence report ↓'}
        </span>
        {open && (
          <div style={{ display: 'flex', gap: 8 }} onClick={e => e.stopPropagation()}>
            <button onClick={onCopy} style={{
              fontFamily: 'var(--font-ibm-plex-mono)', fontSize: 11,
              color: 'rgba(255,255,255,0.5)', background: 'rgba(255,255,255,0.07)',
              border: '1px solid rgba(255,255,255,0.12)', borderRadius: 8,
              padding: '5px 12px', cursor: 'pointer',
            }}>
              {copied ? '✓ Copied' : 'Copy'}
            </button>
            <button onClick={onExport} style={{
              fontFamily: 'var(--font-ibm-plex-mono)', fontSize: 11,
              color: 'rgba(124,58,237,0.9)', background: 'rgba(124,58,237,0.12)',
              border: '1px solid rgba(124,58,237,0.3)', borderRadius: 8,
              padding: '5px 12px', cursor: 'pointer',
            }}>
              Export .md
            </button>
          </div>
        )}
      </button>

      {/* Report sections */}
      {open && (
        <div>
          {sections.length > 0
            ? sections.map(s => <ReportSection key={s.num} s={s} />)
            : <pre style={{ fontFamily: 'var(--font-ibm-plex-mono)', fontSize: 12, color: 'rgba(255,255,255,0.5)', whiteSpace: 'pre-wrap', lineHeight: 1.7 }}>{report}</pre>
          }
        </div>
      )}
    </div>
  )
}

// ── Default export: Zone 2 + Zone 3 ──────────────────────────────────

interface Props {
  summary: ReportSummary | null
  report: string
}

export default function IntelligenceView({ summary, report }: Props) {
  const [copied, setCopied] = useState(false)

  function handleCopy() {
    navigator.clipboard.writeText(report)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  function handleExport() {
    const blob = new Blob([report], { type: 'text/markdown' })
    const url = URL.createObjectURL(blob)
    Object.assign(document.createElement('a'), { href: url, download: 'forkpulse-report.md' }).click()
    URL.revokeObjectURL(url)
  }

  return (
    <div style={{
      margin: '40px calc(-1 * clamp(16px, 4vw, 24px))',
    }}>
      <div className="feed-section-dark">
        {/* Section header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 28, flexWrap: 'wrap' as const, gap: 12 }}>
          <div>
            <span className="badge-claude" style={{ marginBottom: 10, display: 'inline-block' }}>
              Claude API · Intelligence Report
            </span>
            <h2 style={{
              fontFamily: 'var(--font-jakarta)', fontWeight: 800,
              fontSize: 'clamp(1.4rem, 4vw, 1.9rem)', letterSpacing: '-0.025em',
              color: 'white', lineHeight: 1.15,
            }}>
              {summary ? 'Your marketing brief' : 'Your marketing brief'}
            </h2>
          </div>
          {/* Copy/export shown here when report is not expanded */}
          {!summary && (
            <div style={{ display: 'flex', gap: 8 }}>
              <button onClick={handleCopy} style={{
                fontFamily: 'var(--font-ibm-plex-mono)', fontSize: 11,
                color: 'rgba(255,255,255,0.5)', background: 'rgba(255,255,255,0.07)',
                border: '1px solid rgba(255,255,255,0.12)', borderRadius: 8,
                padding: '6px 12px', cursor: 'pointer',
              }}>
                {copied ? '✓ Copied' : 'Copy'}
              </button>
              <button onClick={handleExport} style={{
                fontFamily: 'var(--font-ibm-plex-mono)', fontSize: 11,
                color: 'rgba(124,58,237,0.9)', background: 'rgba(124,58,237,0.12)',
                border: '1px solid rgba(124,58,237,0.3)', borderRadius: 8,
                padding: '6px 12px', cursor: 'pointer',
              }}>
                Export .md
              </button>
            </div>
          )}
        </div>

        {/* Zone 2: Intelligence grid (only if summary available) */}
        {summary && <IntelligenceGrid summary={summary} />}

        {/* Zone 3: Collapsible full report */}
        <CollapsibleReport
          report={report}
          onCopy={handleCopy}
          onExport={handleExport}
          copied={copied}
        />

        {/* Fallback: if no summary, show full report inline (old behavior) */}
        {!summary && (() => {
          const sections = parseSections(report)
          return sections.length > 0
            ? sections.map((s, i) => <ReportSection key={s.num} s={s} defaultOpen={i < 2} />)
            : <pre style={{ fontFamily: 'var(--font-ibm-plex-mono)', fontSize: 12, color: 'rgba(255,255,255,0.5)', whiteSpace: 'pre-wrap', lineHeight: 1.7 }}>{report}</pre>
        })()}
      </div>
    </div>
  )
}
