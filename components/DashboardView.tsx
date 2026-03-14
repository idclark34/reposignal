'use client'

import { useState } from 'react'
import SignalCard from '@/components/SignalCard'
import MarketingReport from '@/components/MarketingReport'
import { GitHubSignals, RawSignals } from '@/types'

interface Props {
  signals: RawSignals
  report: string
  owner: string
  repo: string
}

const TILTS = ['tilt-1', 'tilt-2', 'tilt-3', 'tilt-4', 'tilt-5']

export default function DashboardView({ signals, report, owner, repo }: Props) {
  const [mobileTab, setMobileTab] = useState<'signals' | 'report'>('signals')
  const g: GitHubSignals = signals.github

  return (
    <div className="has-bottom-nav" style={{ background: 'var(--bg)', minHeight: '100vh' }}>

      {/* ── Top bar ─────────────────────────────────────── */}
      <header style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '12px 32px',
        borderBottom: '1px solid var(--border)',
        background: 'var(--bg)',
        position: 'sticky',
        top: 0,
        zIndex: 10,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <a href="/" className="mono" style={{ fontSize: 10, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--ink-muted)', textDecoration: 'none' }}>
            ← RepoSignal
          </a>
          <span style={{ color: 'var(--border)' }}>/</span>
          <span className="mono" style={{ fontSize: 12, color: 'var(--ink)' }}>
            {owner} / {repo}
          </span>
        </div>
        <span className="mono" style={{ fontSize: 10, color: 'var(--ink-faint)', letterSpacing: '0.04em' }}>
          {new Date(signals.fetchedAt).toISOString().replace('T', ' ').slice(0, 16)} UTC
        </span>
      </header>

      {/* ── Hero: dark section with big numbers ─────────── */}
      <section style={{ background: 'var(--dark-bg)', padding: '48px 32px' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          {/* Repo name */}
          <div style={{ marginBottom: 32 }}>
            <p className="mono" style={{ fontSize: 10, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--dark-muted)', marginBottom: 8 }}>
              Analysis target
            </p>
            <h1
              className="display-italic"
              style={{
                fontSize: 'clamp(40px, 6vw, 72px)',
                lineHeight: 0.95,
                letterSpacing: '-0.025em',
                color: 'var(--dark-ink)',
                marginBottom: 12,
              }}
            >
              {g.name}
            </h1>
            <p style={{ fontSize: 14, color: 'var(--dark-muted)', maxWidth: 560, lineHeight: 1.6 }}>
              {g.description || 'No description.'}
            </p>
          </div>

          {/* Big number stats — these are design elements */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
            gap: 0,
            borderTop: '1px solid #2E2926',
          }}>
            {[
              { label: 'Stars',        value: g.stars,        badge: 'GitHub API' },
              { label: 'Forks',        value: g.forks,        badge: 'GitHub API' },
              { label: 'Contributors', value: g.contributors, badge: 'GitHub API' },
              { label: 'Open Issues',  value: g.openIssues,   badge: 'GitHub API' },
            ].map((stat, i) => (
              <div
                key={stat.label}
                style={{
                  padding: '32px 0 24px',
                  paddingRight: 32,
                  borderRight: i < 3 ? '1px solid #2E2926' : 'none',
                  paddingLeft: i === 0 ? 0 : 32,
                }}
              >
                <div
                  className="mono"
                  style={{
                    fontSize: 'clamp(48px, 6vw, 72px)',
                    lineHeight: 1,
                    letterSpacing: '-0.04em',
                    color: 'var(--data)',
                    marginBottom: 8,
                  }}
                >
                  {stat.value.toLocaleString()}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span className="mono" style={{ fontSize: 11, color: 'var(--dark-muted)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                    {stat.label}
                  </span>
                  <span className="badge-dark">{stat.badge}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Topics */}
          {g.topics.length > 0 && (
            <div style={{ marginTop: 24, display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center' }}>
              <span className="mono" style={{ fontSize: 10, color: 'var(--dark-muted)', textTransform: 'uppercase', letterSpacing: '0.1em', marginRight: 4 }}>
                Topics
              </span>
              {g.topics.map(t => (
                <span key={t} className="badge-dark">{t}</span>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ── Language bar ────────────────────────────────── */}
      {Object.keys(g.languages).length > 0 && (() => {
        const total = Object.values(g.languages).reduce((a, b) => a + b, 0)
        const sorted = Object.entries(g.languages).sort(([, a], [, b]) => b - a).slice(0, 5)
        return (
          <section style={{ borderBottom: '1px solid var(--border)', display: 'flex', height: 40 }}>
            {sorted.map(([lang, bytes], i) => {
              const pct = (bytes / total) * 100
              const colors = ['var(--accent)', 'var(--data)', 'var(--ink)', '#8B7355', '#6B9080']
              return (
                <div
                  key={lang}
                  title={`${lang}: ${Math.round(pct)}%`}
                  style={{
                    width: `${pct}%`,
                    background: colors[i % colors.length],
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    overflow: 'hidden',
                    borderRight: i < sorted.length - 1 ? '1px solid rgba(255,255,255,0.15)' : 'none',
                  }}
                >
                  {pct > 8 && (
                    <span className="mono" style={{ fontSize: 9, color: '#fff', letterSpacing: '0.1em', textTransform: 'uppercase', opacity: 0.9 }}>
                      {lang}
                    </span>
                  )}
                </div>
              )
            })}
          </section>
        )
      })()}

      {/* ── Main content: two-column ─────────────────────── */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'minmax(0, 420px) 1fr',
        minHeight: 'calc(100vh - 200px)',
        alignItems: 'start',
      }}>

        {/* ── Left: Signal cards ──────────────────────────── */}
        <div
          className={mobileTab === 'report' ? 'mobile-hidden' : ''}
          style={{
            borderRight: '1px solid var(--border)',
            padding: '32px 24px',
            display: 'flex',
            flexDirection: 'column',
            gap: 24,
          }}
        >
          <div>
            <p className="mono" style={{ fontSize: 9, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--ink-faint)', marginBottom: 16 }}>
              Raw Signals
            </p>

            {/* Commit history card */}
            <SignalCard title="Commit History" source="GitHub API" tiltClass={TILTS[0]}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <tbody>
                  {g.recentCommits.slice(0, 10).map((c, i) => (
                    <tr key={i} style={{ borderBottom: i < 9 ? '1px solid var(--border)' : 'none' }}>
                      <td className="mono" style={{ padding: '6px 0', fontSize: 10, color: 'var(--ink-faint)', whiteSpace: 'nowrap', paddingRight: 12, verticalAlign: 'top' }}>
                        {c.date.slice(2, 10)}
                      </td>
                      <td style={{ padding: '6px 0', fontSize: 12, color: 'var(--ink-muted)', lineHeight: 1.4 }}>
                        {c.message}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </SignalCard>
          </div>

          {/* Issues card */}
          <SignalCard title="Top Issues by Signal" source="GitHub API" tiltClass={TILTS[1]}>
            {g.topIssues.length === 0 ? (
              <span className="mono" style={{ fontSize: 11, color: 'var(--ink-faint)' }}>No open issues.</span>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                {g.topIssues.map((issue, i) => (
                  <div key={i} style={{ display: 'grid', gridTemplateColumns: '40px 1fr', gap: 12, alignItems: 'flex-start' }}>
                    <div>
                      <div className="mono" style={{ fontSize: 20, fontWeight: 400, lineHeight: 1, color: 'var(--accent)', letterSpacing: '-0.03em' }}>
                        {issue.comments}
                      </div>
                      <div className="mono" style={{ fontSize: 9, color: 'var(--ink-faint)', letterSpacing: '0.06em', textTransform: 'uppercase', marginTop: 2 }}>
                        replies
                      </div>
                    </div>
                    <div>
                      <p style={{ fontSize: 12, color: 'var(--ink)', lineHeight: 1.4, marginBottom: issue.labels.length ? 6 : 0 }}>
                        {issue.title}
                      </p>
                      {issue.labels.length > 0 && (
                        <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
                          {issue.labels.slice(0, 3).map(l => (
                            <span key={l} className="badge">{l}</span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </SignalCard>

          {/* Languages card */}
          {Object.keys(g.languages).length > 0 && (
            <SignalCard title="Languages" source="GitHub API" tiltClass={TILTS[2]}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {(() => {
                  const total = Object.values(g.languages).reduce((a, b) => a + b, 0)
                  return Object.entries(g.languages)
                    .sort(([, a], [, b]) => b - a)
                    .slice(0, 6)
                    .map(([lang, bytes]) => {
                      const pct = Math.round((bytes / total) * 100)
                      return (
                        <div key={lang}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                            <span style={{ fontSize: 12, color: 'var(--ink)' }}>{lang}</span>
                            <span className="mono" style={{ fontSize: 11, color: 'var(--data)' }}>{pct}%</span>
                          </div>
                          <div style={{ height: 2, background: 'var(--border)', position: 'relative' }}>
                            <div style={{ position: 'absolute', inset: 0, width: `${pct}%`, background: 'var(--accent)' }} />
                          </div>
                        </div>
                      )
                    })
                })()}
              </div>
            </SignalCard>
          )}

          {/* Repo meta card */}
          <SignalCard title="Repository Meta" source="GitHub API" tiltClass={TILTS[3]}>
            <dl style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px 16px' }}>
              {[
                { k: 'License',     v: g.license || 'None' },
                { k: 'Language',    v: g.language || '—' },
                { k: 'Watchers',    v: g.watchers.toLocaleString() },
                { k: 'Created',     v: g.createdAt.slice(0, 10) },
                { k: 'Updated',     v: g.updatedAt.slice(0, 10) },
                { k: 'Website',     v: g.hasWebsite ? 'Yes' : 'No' },
              ].map(({ k, v }) => (
                <div key={k}>
                  <dt className="mono" style={{ fontSize: 9, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--ink-faint)', marginBottom: 3 }}>
                    {k}
                  </dt>
                  <dd className="mono" style={{ fontSize: 12, color: 'var(--ink)' }}>{v}</dd>
                </div>
              ))}
            </dl>
          </SignalCard>
        </div>

        {/* ── Right: Report ─────────────────────────────────── */}
        <div className={mobileTab === 'signals' ? 'mobile-hidden' : ''}>
          <MarketingReport report={report} />
        </div>
      </div>

      {/* ── Mobile bottom nav ──────────────────────────────── */}
      <nav className="bottom-nav">
        <a href="/">Home</a>
        <button
          onClick={() => setMobileTab('signals')}
          className={mobileTab === 'signals' ? 'active' : ''}
        >
          Signals
        </button>
        <button
          onClick={() => setMobileTab('report')}
          className={mobileTab === 'report' ? 'active' : ''}
        >
          Report
        </button>
      </nav>
    </div>
  )
}
