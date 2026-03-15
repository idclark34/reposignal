'use client'

import { useState } from 'react'
import type { ReactNode } from 'react'
import { RawSignals, ReportSummary, PlaybooksResponse } from '@/types'
import PlaybookSection from '@/components/PlaybookSection'

interface Props {
  signals: RawSignals
  report: string
  summary: ReportSummary | null
  owner: string
  repo: string
  playbooks: PlaybooksResponse | null
}

// ── Topbar ───────────────────────────────────────────────────────────────────
function Topbar({ owner, repo, fetchedAt }: { owner: string; repo: string; fetchedAt: string }) {
  return (
    <div style={{
      height: 44,
      display: 'flex',
      alignItems: 'center',
      gap: 10,
      padding: '0 24px',
      borderBottom: '0.5px solid #e0ddd8',
      background: '#f8f5f0',
      flexShrink: 0,
    }}>
      <a href="/" style={{
        fontSize: 13,
        fontWeight: 700,
        color: '#111',
        textDecoration: 'none',
        display: 'flex',
        alignItems: 'center',
        gap: 6,
        letterSpacing: '-0.01em',
      }}>
        <span style={{
          width: 8, height: 8, borderRadius: '50%',
          background: '#6366f1', display: 'inline-block',
          flexShrink: 0,
        }} />
        ForkPulse
      </a>
      <span style={{ color: '#bbb', fontSize: 12 }}>/</span>
      <span style={{
        fontSize: 13, fontWeight: 600, color: '#111',
        fontFamily: 'var(--font-ibm-plex-mono)',
        overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' as const,
      }}>
        {owner}/{repo}
      </span>
      <span style={{
        marginLeft: 'auto', fontSize: 11, color: '#bbb',
        fontFamily: 'var(--font-ibm-plex-mono)', flexShrink: 0,
      }}>
        {fetchedAt.slice(0, 10)}
      </span>
    </div>
  )
}

// ── SidebarRepoCard ───────────────────────────────────────────────────────────
function SidebarRepoCard({ g }: { g: RawSignals['github'] }) {
  return (
    <div style={{
      background: '#ffffff',
      border: '0.5px solid #e0ddd8',
      borderRadius: 10,
      padding: '14px 16px',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: g.description ? 8 : 12 }}>
        <svg width="16" height="16" viewBox="0 0 16 16" fill="#555" style={{ flexShrink: 0 }}>
          <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z" />
        </svg>
        <span style={{
          fontSize: 13, fontWeight: 700, color: '#111',
          overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' as const,
        }}>
          {g.name}
        </span>
        {g.language && (
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 3, marginLeft: 'auto', flexShrink: 0 }}>
            <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#3178C6', display: 'inline-block' }} />
            <span style={{ fontSize: 10, color: '#bbb' }}>{g.language}</span>
          </span>
        )}
      </div>
      {g.description && (
        <p style={{
          fontSize: 11, color: '#555', lineHeight: 1.5, marginBottom: 12,
          display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' as const, overflow: 'hidden',
        }}>
          {g.description}
        </p>
      )}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
        {[
          { label: 'Stars',        value: g.stars },
          { label: 'Forks',        value: g.forks },
          { label: 'Contributors', value: g.contributors },
          { label: 'Issues',       value: g.openIssues },
        ].map(s => (
          <div key={s.label} style={{ background: '#f0ede8', borderRadius: 7, padding: '8px 10px' }}>
            <div style={{
              fontSize: 17, fontWeight: 600, color: '#111', letterSpacing: '-0.03em',
              lineHeight: 1, fontFamily: 'var(--font-ibm-plex-mono)',
            }}>
              {s.value >= 1000 ? `${(s.value / 1000).toFixed(1)}k` : s.value}
            </div>
            <div style={{
              fontSize: 9, color: '#bbb', marginTop: 3,
              textTransform: 'uppercase', letterSpacing: '0.06em',
            }}>
              {s.label}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

// ── LaunchGauge ───────────────────────────────────────────────────────────────
function LaunchGauge({ score }: { score: number }) {
  const r = 26
  const circumference = 2 * Math.PI * r // ≈ 163.4
  const offset = circumference * (1 - score / 100)

  const label = score >= 70 ? 'Growing' : score >= 40 ? 'Stable' : 'Declining'
  const labelColor = score >= 70 ? '#3B6D11' : score >= 40 ? '#854F0B' : '#A32D2D'
  const gaugeColor = score >= 70 ? '#1D9E75' : score >= 40 ? '#EF9F27' : '#E24B4A'

  return (
    <div style={{
      background: '#ffffff',
      border: '0.5px solid #e0ddd8',
      borderRadius: 10,
      padding: '14px 16px',
    }}>
      <div style={{
        fontSize: 10, fontWeight: 600, color: '#bbb',
        textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 12,
      }}>
        Launch Readiness
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
        <svg width={72} height={72} style={{ flexShrink: 0, transform: 'rotate(-90deg)' }}>
          <circle cx={36} cy={36} r={r} fill="none" stroke="#e0ddd8" strokeWidth={6} />
          <circle
            cx={36} cy={36} r={r}
            fill="none"
            stroke={gaugeColor}
            strokeWidth={6}
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
          />
        </svg>
        <div>
          <div style={{
            fontSize: 30, fontWeight: 700, color: '#111',
            letterSpacing: '-0.04em', lineHeight: 1,
            fontFamily: 'var(--font-ibm-plex-mono)',
          }}>
            {score}
          </div>
          <div style={{
            display: 'inline-block', marginTop: 5,
            fontSize: 10, fontWeight: 600,
            color: labelColor,
            background: `${labelColor}18`,
            borderRadius: 20, padding: '2px 8px',
          }}>
            {label}
          </div>
        </div>
      </div>
    </div>
  )
}

// ── SignalsCard ───────────────────────────────────────────────────────────────
function SignalsCard({ summary, signals }: { summary: ReportSummary | null; signals: RawSignals }) {
  const rows = [
    {
      label: 'Trend',
      value: summary?.trendDirection ?? '—',
      color: summary?.trendDirection === 'rising' ? '#3B6D11'
           : summary?.trendDirection === 'declining' ? '#A32D2D'
           : '#854F0B',
    },
    {
      label: 'Audience',
      value: summary?.audienceSize ?? '—',
      color: summary?.audienceSize === 'large' ? '#3B6D11'
           : summary?.audienceSize === 'medium' ? '#854F0B'
           : '#555',
    },
    {
      label: 'Top channel',
      value: summary?.topChannel ?? '—',
      color: '#555',
    },
    {
      label: 'HN stories',
      value: signals.hn ? String(signals.hn.totalStories) : 'No data',
      color: signals.hn ? '#111' : '#bbb',
    },
    {
      label: 'Reddit posts',
      value: signals.reddit ? String(signals.reddit.totalResults) : 'No data',
      color: signals.reddit ? '#111' : '#bbb',
    },
  ]

  return (
    <div style={{
      background: '#ffffff',
      border: '0.5px solid #e0ddd8',
      borderRadius: 10,
      padding: '14px 16px',
    }}>
      <div style={{
        fontSize: 10, fontWeight: 600, color: '#bbb',
        textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 12,
      }}>
        Signals
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {rows.map(row => (
          <div key={row.label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: 12, color: '#555' }}>{row.label}</span>
            <span style={{ fontSize: 12, fontWeight: 600, color: row.color, textTransform: 'capitalize' as const }}>
              {row.value}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}

// ── CommitsCard ───────────────────────────────────────────────────────────────
function CommitsCard({ commits }: { commits: RawSignals['github']['recentCommits'] }) {
  function getCommitBadge(msg: string) {
    const lower = msg.toLowerCase()
    if (lower.startsWith('fix')) return { bg: '#FCEBEB', color: '#A32D2D', label: 'fix' }
    if (lower.startsWith('feat')) return { bg: '#EAF3DE', color: '#3B6D11', label: 'feat' }
    return { bg: '#FAEEDA', color: '#854F0B', label: 'chore' }
  }

  return (
    <div style={{
      background: '#ffffff',
      border: '0.5px solid #e0ddd8',
      borderRadius: 10,
      padding: '14px 16px',
    }}>
      <div style={{
        fontSize: 10, fontWeight: 600, color: '#bbb',
        textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 12,
      }}>
        Recent Commits
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 9 }}>
        {commits.slice(0, 6).map((c, i) => {
          const badge = getCommitBadge(c.message)
          return (
            <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 7 }}>
              <span style={{
                fontSize: 9, fontWeight: 700,
                color: badge.color, background: badge.bg,
                borderRadius: 4, padding: '2px 5px',
                flexShrink: 0, marginTop: 1,
                textTransform: 'uppercase' as const,
                letterSpacing: '0.04em',
              }}>
                {badge.label}
              </span>
              <span style={{
                fontSize: 11, color: '#555', lineHeight: 1.45,
                display: '-webkit-box', WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical' as const, overflow: 'hidden',
              }}>
                {c.message}
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}

// ── BriefHeader ───────────────────────────────────────────────────────────────
function BriefHeader({ owner, repo }: { owner: string; repo: string }) {
  return (
    <div style={{ marginBottom: 20 }}>
      <div style={{
        display: 'inline-flex', alignItems: 'center', gap: 6,
        background: '#f8f5f0', border: '0.5px solid #e0ddd8',
        borderRadius: 20, padding: '4px 12px', marginBottom: 12,
      }}>
        <span style={{ fontSize: 10, color: '#6366f1', fontWeight: 600, fontFamily: 'var(--font-ibm-plex-mono)' }}>
          Claude API
        </span>
        <span style={{ fontSize: 10, color: '#bbb' }}>→</span>
        <span style={{ fontSize: 10, color: '#555', fontWeight: 500, fontFamily: 'var(--font-ibm-plex-mono)' }}>
          Intelligence Report
        </span>
      </div>
      <h1 style={{
        fontSize: 22, fontWeight: 800, color: '#111',
        letterSpacing: '-0.03em', lineHeight: 1.2, margin: 0,
        fontFamily: 'var(--font-jakarta)',
      }}>
        Your marketing brief
      </h1>
      <p style={{ fontSize: 13, color: '#555', marginTop: 5, lineHeight: 1.5 }}>
        Audience insights, positioning, and launch strategy for{' '}
        <span style={{ fontFamily: 'var(--font-ibm-plex-mono)', fontWeight: 600 }}>
          {owner}/{repo}
        </span>
      </p>
    </div>
  )
}

// ── BriefCard ─────────────────────────────────────────────────────────────────
type BriefCardVariant = 'purple' | 'teal' | 'amber' | 'red' | 'dark' | 'default'

const ACCENT: Record<BriefCardVariant, string | undefined> = {
  purple: '#6366f1',
  teal: '#1D9E75',
  amber: '#EF9F27',
  red: '#E24B4A',
  dark: undefined,
  default: undefined,
}

function BriefCard({
  variant = 'default',
  title,
  children,
}: {
  variant?: BriefCardVariant
  title?: string
  children: ReactNode
}) {
  const accent = ACCENT[variant]
  const isDark = variant === 'dark'

  return (
    <div style={{
      background: isDark ? '#111' : '#ffffff',
      border: isDark ? 'none' : '0.5px solid #e0ddd8',
      borderRadius: 10,
      borderLeft: accent ? `3px solid ${accent}` : undefined,
      padding: '16px 18px',
      overflow: 'hidden',
    }}>
      {title && (
        <div style={{
          fontSize: 9, fontWeight: 700, textTransform: 'uppercase' as const,
          letterSpacing: '0.08em',
          color: isDark ? 'rgba(255,255,255,0.35)' : (accent ?? '#bbb'),
          marginBottom: 9,
          fontFamily: 'var(--font-ibm-plex-mono)',
        }}>
          {title}
        </div>
      )}
      {children}
    </div>
  )
}

// ── HNHeadlineCard ────────────────────────────────────────────────────────────
function HNHeadlineCard({ headline }: { headline: string }) {
  return (
    <BriefCard title="Show HN Headline">
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
        <div style={{
          background: '#FF6600', color: 'white',
          fontWeight: 800, fontSize: 12,
          width: 22, height: 22, borderRadius: 4,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          flexShrink: 0,
        }}>
          Y
        </div>
        <div>
          <p style={{
            fontSize: 13, fontWeight: 600, color: '#111',
            lineHeight: 1.45, margin: 0,
            fontFamily: 'var(--font-ibm-plex-mono)',
          }}>
            {headline}
          </p>
          <span style={{
            fontSize: 10, color: '#bbb', fontFamily: 'var(--font-ibm-plex-mono)',
            marginTop: 5, display: 'block',
          }}>
            1 point · 0 comments · Show HN
          </span>
        </div>
      </div>
    </BriefCard>
  )
}

// ── Main DashboardView ────────────────────────────────────────────────────────
export default function DashboardView({ signals, report, summary, owner, repo, playbooks }: Props) {
  const [reportOpen, setReportOpen] = useState(false)
  const g = signals.github

  return (
    <div style={{ background: '#f0ede8', minHeight: '100vh' }}>
      {/* Responsive styles */}
      <style>{`
        .db-layout {
          display: grid;
          grid-template-columns: 260px 1fr;
          min-height: calc(100vh - 44px);
          align-items: start;
        }
        .db-sidebar {
          background: #f8f5f0;
          border-right: 0.5px solid #e0ddd8;
          padding: 18px 14px;
          display: flex;
          flex-direction: column;
          gap: 10px;
          position: sticky;
          top: 0;
          max-height: 100vh;
          overflow-y: auto;
        }
        .db-main {
          padding: 24px 28px 60px;
          min-width: 0;
        }
        .brief-grid-3 {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 12px;
          margin-bottom: 12px;
        }
        .brief-grid-2 {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 12px;
          margin-bottom: 12px;
        }
        @media (max-width: 900px) {
          .db-layout {
            grid-template-columns: 1fr;
          }
          .db-sidebar {
            position: static;
            max-height: none;
            border-right: none;
            border-bottom: 0.5px solid #e0ddd8;
          }
          .brief-grid-3 {
            grid-template-columns: 1fr;
          }
          .brief-grid-2 {
            grid-template-columns: 1fr;
          }
        }
      `}</style>

      {/* Topbar */}
      <Topbar owner={owner} repo={repo} fetchedAt={signals.fetchedAt} />

      <div className="db-layout">
        {/* ── Sidebar ────────────────────────────────────────── */}
        <aside className="db-sidebar">
          <SidebarRepoCard g={g} />
          {summary !== null && <LaunchGauge score={summary.launchReadiness} />}
          <SignalsCard summary={summary} signals={signals} />
          {g.recentCommits.length > 0 && <CommitsCard commits={g.recentCommits} />}
        </aside>

        {/* ── Main area ──────────────────────────────────────── */}
        <main className="db-main">
          {summary !== null ? (
            <>
              <BriefHeader owner={owner} repo={repo} />

              {/* Row 1: 3-col — ICP / Communities / Winning Angle */}
              <div className="brief-grid-3">
                <BriefCard variant="purple" title="Ideal Customer Profile">
                  <p style={{ fontSize: 13, color: '#111', lineHeight: 1.6, margin: 0 }}>
                    {summary.icp}
                  </p>
                  {summary.painPhrases.length > 0 && (
                    <div style={{ display: 'flex', flexWrap: 'wrap' as const, gap: 5, marginTop: 10 }}>
                      {summary.painPhrases.slice(0, 4).map((p, i) => (
                        <span key={i} style={{
                          fontSize: 10, color: '#6366f1',
                          background: '#6366f112',
                          borderRadius: 20, padding: '2px 8px',
                        }}>
                          {p}
                        </span>
                      ))}
                    </div>
                  )}
                </BriefCard>

                <BriefCard variant="teal" title="Top Communities">
                  {summary.topSubreddits.length > 0 ? (
                    <>
                      <div style={{ display: 'flex', flexWrap: 'wrap' as const, gap: 5, marginBottom: 8 }}>
                        {summary.topSubreddits.slice(0, 5).map((s, i) => (
                          <span key={i} style={{
                            fontSize: 10, fontWeight: 600,
                            color: '#1D9E75', background: '#1D9E7514',
                            borderRadius: 20, padding: '2px 8px',
                          }}>
                            r/{s}
                          </span>
                        ))}
                      </div>
                      <p style={{ fontSize: 12, color: '#555', lineHeight: 1.5, margin: 0 }}>
                        Active developer communities discussing this problem space.
                      </p>
                    </>
                  ) : (
                    <p style={{ fontSize: 12, color: '#bbb', margin: 0 }}>No community data</p>
                  )}
                </BriefCard>

                <BriefCard variant="amber" title="Winning Angle">
                  <p style={{ fontSize: 13, color: '#111', lineHeight: 1.6, fontStyle: 'italic', margin: 0 }}>
                    &ldquo;{summary.winningAngle}&rdquo;
                  </p>
                </BriefCard>
              </div>

              {/* Row 2: 2-col — HN Headline / Dark positioning */}
              <div className="brief-grid-2">
                <HNHeadlineCard headline={summary.showHNHeadline} />

                <BriefCard variant="dark" title="Positioning Statement">
                  <p style={{
                    fontSize: 14, color: 'rgba(255,255,255,0.88)',
                    lineHeight: 1.65, margin: 0, fontStyle: 'italic',
                  }}>
                    &ldquo;{summary.winningAngle}&rdquo;
                  </p>
                </BriefCard>
              </div>

              {/* Row 3: 2-col — Risk / Launch channel */}
              <div className="brief-grid-2">
                <BriefCard variant="red" title="Biggest Risk">
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: 8 }}>
                    <span style={{ fontSize: 15, lineHeight: '1.45', flexShrink: 0 }}>⚠</span>
                    <p style={{ fontSize: 13, color: '#111', lineHeight: 1.6, margin: 0 }}>
                      {summary.biggestRisk}
                    </p>
                  </div>
                </BriefCard>

                <BriefCard title="Best Launch Channel">
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: 8 }}>
                    <span style={{ fontSize: 15, lineHeight: '1.45', flexShrink: 0 }}>🚀</span>
                    <p style={{ fontSize: 13, color: '#111', lineHeight: 1.6, margin: 0 }}>
                      {summary.topChannel}
                    </p>
                  </div>
                </BriefCard>
              </div>

              {/* Growth Playbooks */}
              {playbooks && playbooks.matches.length > 0 && (
                <div style={{ marginTop: 8, marginBottom: 12 }}>
                  <PlaybookSection matches={playbooks.matches} />
                </div>
              )}

              {/* Full report — collapsible */}
              {report && (
                <div style={{ marginTop: 16 }}>
                  <button
                    onClick={() => setReportOpen(o => !o)}
                    style={{
                      display: 'flex', alignItems: 'center', gap: 8,
                      width: '100%', textAlign: 'left' as const,
                      background: '#ffffff', border: '0.5px solid #e0ddd8',
                      borderRadius: 10, padding: '12px 18px',
                      cursor: 'pointer', fontSize: 13, fontWeight: 600,
                      color: '#111',
                    }}
                  >
                    <span style={{ flex: 1 }}>Full Intelligence Report</span>
                    <span style={{ fontSize: 11, color: '#bbb', fontFamily: 'var(--font-ibm-plex-mono)' }}>
                      {reportOpen ? '▲ Collapse' : '▼ Expand'}
                    </span>
                  </button>
                  {reportOpen && (
                    <div style={{
                      marginTop: 6, background: '#ffffff',
                      border: '0.5px solid #e0ddd8', borderRadius: 10,
                      padding: '20px 24px',
                    }}>
                      <pre style={{
                        fontSize: 13, color: '#555', lineHeight: 1.75,
                        whiteSpace: 'pre-wrap' as const, wordBreak: 'break-word' as const,
                        margin: 0, fontFamily: 'inherit',
                      }}>
                        {report}
                      </pre>
                    </div>
                  )}
                </div>
              )}
            </>
          ) : (
            /* summary = null: placeholder */
            <>
              {/* Still show report if available */}
              <div style={{
                background: '#ffffff', border: '0.5px solid #e0ddd8',
                borderRadius: 10, padding: '32px 28px',
                textAlign: 'center' as const, marginBottom: 16,
              }}>
                <div style={{ fontSize: 32, marginBottom: 12 }}>📊</div>
                <h2 style={{
                  fontSize: 18, fontWeight: 700, color: '#111',
                  margin: '0 0 8px', fontFamily: 'var(--font-jakarta)',
                  letterSpacing: '-0.02em',
                }}>
                  Report unavailable
                </h2>
                <p style={{ fontSize: 13, color: '#555', lineHeight: 1.6, margin: 0 }}>
                  The intelligence report could not be generated for this repository.
                  GitHub data is available in the sidebar.
                </p>
              </div>
              {report && (
                <div style={{ marginTop: 8 }}>
                  <button
                    onClick={() => setReportOpen(o => !o)}
                    style={{
                      display: 'flex', alignItems: 'center', gap: 8,
                      width: '100%', textAlign: 'left' as const,
                      background: '#ffffff', border: '0.5px solid #e0ddd8',
                      borderRadius: 10, padding: '12px 18px',
                      cursor: 'pointer', fontSize: 13, fontWeight: 600, color: '#111',
                    }}
                  >
                    <span style={{ flex: 1 }}>Raw Report</span>
                    <span style={{ fontSize: 11, color: '#bbb', fontFamily: 'var(--font-ibm-plex-mono)' }}>
                      {reportOpen ? '▲ Collapse' : '▼ Expand'}
                    </span>
                  </button>
                  {reportOpen && (
                    <div style={{
                      marginTop: 6, background: '#ffffff',
                      border: '0.5px solid #e0ddd8', borderRadius: 10,
                      padding: '20px 24px',
                    }}>
                      <pre style={{
                        fontSize: 13, color: '#555', lineHeight: 1.75,
                        whiteSpace: 'pre-wrap' as const, wordBreak: 'break-word' as const,
                        margin: 0, fontFamily: 'inherit',
                      }}>
                        {report}
                      </pre>
                    </div>
                  )}
                </div>
              )}
            </>
          )}
        </main>
      </div>
    </div>
  )
}
