'use client'

import { useState } from 'react'
import { RawSignals, GitHubSignals, RedditPost, HNStory } from '@/types'

interface Props {
  signals: RawSignals
  report: string
  owner: string
  repo: string
}

// ── Markdown parsing (report) ───────────────────────────────────────
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
  const [open, setOpen] = useState(defaultOpen ?? true)
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

// ── Reddit post card ────────────────────────────────────────────────
function RedditCard({ post }: { post: RedditPost }) {
  function timeAgo(iso: string) {
    const d = Math.floor((Date.now() - new Date(iso).getTime()) / 86400000)
    return d < 1 ? 'today' : d === 1 ? '1d ago' : `${d}d ago`
  }
  return (
    <div className="feed-card signal-card-reddit">
      <div style={{ padding: '14px 16px 16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 10 }}>
          <span className="badge-reddit">r/{post.subreddit}</span>
          <span style={{ fontFamily: 'var(--font-ibm-plex-mono)', fontSize: 10, color: 'var(--text-faint)' }}>
            {timeAgo(post.createdAt)}
          </span>
        </div>
        <p style={{ fontSize: 14, fontWeight: 600, lineHeight: 1.45, color: 'var(--text-primary)', marginBottom: 8 }}>
          {post.title}
        </p>
        {post.selftext && (
          <p style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: 12,
            display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical' as const, overflow: 'hidden',
          }}>
            {post.selftext}
          </p>
        )}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{
            display: 'flex', alignItems: 'center', gap: 4,
            background: 'rgba(255,69,0,0.08)', borderRadius: 20, padding: '4px 10px',
          }}>
            <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--reddit-orange)' }}>
              ▲ {post.score.toLocaleString()}
            </span>
          </div>
          <span style={{ fontSize: 12, color: 'var(--text-faint)' }}>
            {post.numComments} comments
          </span>
          {post.url && (
            <a href={post.url} target="_blank" rel="noopener noreferrer"
              style={{ marginLeft: 'auto', fontSize: 11, color: 'var(--text-faint)', textDecoration: 'none' }}>
              view →
            </a>
          )}
        </div>
      </div>
    </div>
  )
}

// ── HN story card ────────────────────────────────────────────────────
function HNCard({ story }: { story: HNStory }) {
  function timeAgo(iso: string) {
    const d = Math.floor((Date.now() - new Date(iso).getTime()) / 86400000)
    return d < 1 ? 'today' : d === 1 ? '1d ago' : `${d}d ago`
  }
  return (
    <div className="feed-card signal-card-hn">
      <div style={{ padding: '14px 16px 16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 10 }}>
          <div style={{ background: 'var(--hn-orange)', color: 'white', fontWeight: 700, fontSize: 10, padding: '2px 6px', borderRadius: 4, fontFamily: 'var(--font-ibm-plex-mono)' }}>Y</div>
          <span className="badge-hn">Hacker News</span>
          <span style={{ fontFamily: 'var(--font-ibm-plex-mono)', fontSize: 10, color: 'var(--text-faint)' }}>
            {timeAgo(story.createdAt)}
          </span>
        </div>
        <p style={{ fontSize: 14, fontWeight: 600, lineHeight: 1.45, color: 'var(--text-primary)', marginBottom: 10 }}>
          {story.title}
        </p>
        <div style={{ fontFamily: 'var(--font-ibm-plex-mono)', fontSize: 11, color: 'var(--text-faint)', display: 'flex', gap: 12, flexWrap: 'wrap' as const }}>
          <span style={{ color: 'var(--hn-orange)', fontWeight: 600 }}>▲ {story.points} pts</span>
          <span>{story.numComments} comments</span>
          <span>by {story.author}</span>
          {story.url && (
            <a href={story.url} target="_blank" rel="noopener noreferrer"
              style={{ color: 'var(--text-faint)', textDecoration: 'none', marginLeft: 'auto' }}>
              view →
            </a>
          )}
        </div>
      </div>
    </div>
  )
}

// ── Section header ────────────────────────────────────────────────────
function FeedHeader({ badge, title, count }: { badge: React.ReactNode; title: string; count?: number }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10, margin: '40px 0 16px' }}>
      {badge}
      <h2 style={{
        fontFamily: 'var(--font-jakarta)', fontWeight: 700, fontSize: 18,
        color: 'var(--text-primary)', letterSpacing: '-0.02em',
      }}>
        {title}
      </h2>
      {count !== undefined && (
        <span style={{ fontFamily: 'var(--font-ibm-plex-mono)', fontSize: 11, color: 'var(--text-faint)' }}>
          {count} found
        </span>
      )}
    </div>
  )
}

// ── Main dashboard ────────────────────────────────────────────────────
export default function DashboardView({ signals, report, owner, repo }: Props) {
  const g: GitHubSignals = signals.github
  const sections = parseSections(report)
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

  const langTotal = Object.values(g.languages).reduce((a, b) => a + b, 0)
  const langSorted = Object.entries(g.languages).sort(([, a], [, b]) => b - a).slice(0, 5)

  return (
    <div style={{ background: 'var(--bg)', minHeight: '100vh' }}>

      {/* ── Sticky header ────────────────────────────────── */}
      <header style={{
        position: 'sticky', top: 0, zIndex: 20,
        display: 'flex', alignItems: 'center', gap: 12,
        padding: '0 clamp(16px, 4vw, 32px)',
        height: 56,
        background: 'rgba(255,255,255,0.9)',
        backdropFilter: 'blur(14px)',
        WebkitBackdropFilter: 'blur(14px)',
        borderBottom: '1px solid var(--border)',
      }}>
        <a href="/" style={{
          fontFamily: 'var(--font-jakarta)', fontWeight: 700, fontSize: 14,
          color: 'var(--text-primary)', textDecoration: 'none', letterSpacing: '-0.02em',
          display: 'flex', alignItems: 'center', gap: 4, flexShrink: 0,
        }}>
          ← ForkPulse
        </a>
        <span style={{ color: 'var(--border-strong)', flexShrink: 0 }}>/</span>
        <span style={{
          fontFamily: 'var(--font-ibm-plex-mono)', fontSize: 13,
          color: 'var(--text-primary)', fontWeight: 600,
          overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' as const,
        }}>
          {owner}/{repo}
        </span>
        <span style={{ marginLeft: 'auto', fontFamily: 'var(--font-ibm-plex-mono)', fontSize: 10, color: 'var(--text-faint)', flexShrink: 0 }}>
          {new Date(signals.fetchedAt).toISOString().slice(0, 10)}
        </span>
      </header>

      {/* ── Feed container ────────────────────────────────── */}
      <div style={{ maxWidth: 680, margin: '0 auto', padding: '0 clamp(16px, 4vw, 24px) 80px' }}>

        {/* ── GitHub repo card ── */}
        <div className="feed-card signal-card-github" style={{ marginTop: 28 }}>
          <div style={{ padding: '20px 20px 16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
              <svg width="18" height="18" viewBox="0 0 16 16" fill="var(--github-gray)">
                <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z" />
              </svg>
              <span style={{ fontFamily: 'var(--font-ibm-plex-mono)', fontSize: 13, fontWeight: 600, color: 'var(--github-gray)' }}>
                {g.name}
              </span>
              {g.language && (
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, marginLeft: 'auto' }}>
                  <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#3178C6', display: 'inline-block' }} />
                  <span style={{ fontSize: 11, color: 'var(--text-faint)' }}>{g.language}</span>
                </span>
              )}
            </div>
            {g.description && (
              <p style={{ fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: 16 }}>
                {g.description}
              </p>
            )}

            {/* Stats row */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, marginBottom: g.topics.length > 0 ? 16 : 0 }}>
              {[
                { label: 'Stars',        value: g.stars },
                { label: 'Forks',        value: g.forks },
                { label: 'Contributors', value: g.contributors },
                { label: 'Issues',       value: g.openIssues },
              ].map(stat => (
                <div key={stat.label} style={{ textAlign: 'center' }}>
                  <div style={{
                    fontFamily: 'var(--font-ibm-plex-mono)', fontSize: 'clamp(18px, 4vw, 24px)',
                    fontWeight: 400, letterSpacing: '-0.03em', color: 'var(--text-primary)', lineHeight: 1,
                  }}>
                    {stat.value >= 1000 ? `${(stat.value / 1000).toFixed(1)}k` : stat.value}
                  </div>
                  <div style={{ fontSize: 10, color: 'var(--text-faint)', marginTop: 4, textTransform: 'uppercase', letterSpacing: '0.06em', fontFamily: 'var(--font-ibm-plex-mono)' }}>
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>

            {/* Topics */}
            {g.topics.length > 0 && (
              <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' as const }}>
                {g.topics.map(t => (
                  <span key={t} className="badge">{t}</span>
                ))}
              </div>
            )}
          </div>

          {/* Language bar */}
          {langSorted.length > 0 && (
            <div style={{ display: 'flex', height: 6 }}>
              {langSorted.map(([lang, bytes], i) => {
                const pct = (bytes / langTotal) * 100
                const colors = ['#3178C6', '#f1e05a', '#e34c26', '#563d7c', '#89e051']
                return (
                  <div key={lang} title={`${lang}: ${Math.round(pct)}%`}
                    style={{ width: `${pct}%`, background: colors[i % colors.length] }} />
                )
              })}
            </div>
          )}
        </div>

        {/* ── Reddit section ── */}
        {signals.reddit && signals.reddit.posts.length > 0 && (
          <>
            <FeedHeader
              badge={<span className="badge-reddit">Reddit</span>}
              title="What Reddit is saying"
              count={signals.reddit.totalResults}
            />
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {signals.reddit.posts.slice(0, 6).map(post => (
                <RedditCard key={post.id} post={post} />
              ))}
            </div>
          </>
        )}

        {/* ── Full-bleed dark report section ── */}
        {report && (
          <div style={{
            margin: '48px -clamp(16px, 4vw, 24px)',
            marginLeft: 'calc(-1 * clamp(16px, 4vw, 24px))',
            marginRight: 'calc(-1 * clamp(16px, 4vw, 24px))',
          }}>
            <div className="feed-section-dark">
              {/* Report header */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 32, flexWrap: 'wrap' as const, gap: 12 }}>
                <div>
                  <span className="badge-claude" style={{ marginBottom: 10, display: 'inline-block' }}>Claude API · Intelligence Report</span>
                  <h2 style={{
                    fontFamily: 'var(--font-jakarta)', fontWeight: 800,
                    fontSize: 'clamp(1.4rem, 4vw, 1.9rem)', letterSpacing: '-0.025em',
                    color: 'white', lineHeight: 1.15,
                  }}>
                    Your marketing brief
                  </h2>
                </div>
                <div style={{ display: 'flex', gap: 8 }}>
                  <button
                    onClick={handleCopy}
                    style={{
                      fontFamily: 'var(--font-ibm-plex-mono)', fontSize: 11,
                      color: 'rgba(255,255,255,0.5)', background: 'rgba(255,255,255,0.07)',
                      border: '1px solid rgba(255,255,255,0.12)', borderRadius: 8,
                      padding: '6px 12px', cursor: 'pointer', transition: 'background 0.15s',
                    }}
                  >
                    {copied ? '✓ Copied' : 'Copy'}
                  </button>
                  <button
                    onClick={handleExport}
                    style={{
                      fontFamily: 'var(--font-ibm-plex-mono)', fontSize: 11,
                      color: 'rgba(124,58,237,0.9)', background: 'rgba(124,58,237,0.12)',
                      border: '1px solid rgba(124,58,237,0.3)', borderRadius: 8,
                      padding: '6px 12px', cursor: 'pointer', transition: 'background 0.15s',
                    }}
                  >
                    Export .md
                  </button>
                </div>
              </div>

              {/* Report sections */}
              {sections.length > 0
                ? sections.map((s, i) => <ReportSection key={s.num} s={s} defaultOpen={i < 2} />)
                : (
                  <pre style={{
                    fontFamily: 'var(--font-ibm-plex-mono)', fontSize: 12,
                    color: 'rgba(255,255,255,0.5)', whiteSpace: 'pre-wrap', lineHeight: 1.7,
                  }}>
                    {report}
                  </pre>
                )
              }
            </div>
          </div>
        )}

        {/* ── HN section ── */}
        {signals.hn && (
          <>
            {signals.hn.showHNPosts.length > 0 && (
              <>
                <FeedHeader
                  badge={<span className="badge-hn">HN</span>}
                  title="Show HN posts"
                  count={signals.hn.showHNPosts.length}
                />
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  {signals.hn.showHNPosts.map(s => <HNCard key={s.objectId} story={s} />)}
                </div>
              </>
            )}
            {signals.hn.stories.length > 0 && (
              <>
                <FeedHeader
                  badge={<span className="badge-hn">HN</span>}
                  title="Hacker News mentions"
                  count={signals.hn.totalStories}
                />
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  {signals.hn.stories.slice(0, 5).map(s => <HNCard key={s.objectId} story={s} />)}
                </div>
              </>
            )}
          </>
        )}

        {/* ── GitHub issues ── */}
        {g.topIssues.length > 0 && (
          <>
            <FeedHeader
              badge={<span className="badge-github">GitHub</span>}
              title="Top issues by signal"
              count={g.openIssues}
            />
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {g.topIssues.map((issue, i) => (
                <div key={i} className="feed-card signal-card-github">
                  <div style={{ padding: '14px 16px' }}>
                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
                      <div style={{ flexShrink: 0, textAlign: 'center', minWidth: 36 }}>
                        <div style={{ fontFamily: 'var(--font-ibm-plex-mono)', fontSize: 18, color: 'var(--text-primary)', fontWeight: 400 }}>
                          {issue.comments}
                        </div>
                        <div style={{ fontFamily: 'var(--font-ibm-plex-mono)', fontSize: 9, color: 'var(--text-faint)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                          replies
                        </div>
                      </div>
                      <div style={{ flex: 1 }}>
                        <p style={{ fontSize: 14, fontWeight: 500, color: 'var(--text-primary)', lineHeight: 1.4, marginBottom: issue.labels.length ? 8 : 0 }}>
                          {issue.title}
                        </p>
                        {issue.labels.length > 0 && (
                          <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' as const }}>
                            {issue.labels.slice(0, 3).map(l => (
                              <span key={l} className="badge">{l}</span>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {/* ── Recent commits ── */}
        {g.recentCommits.length > 0 && (
          <>
            <FeedHeader
              badge={<span className="badge-github">GitHub</span>}
              title="Recent commits"
            />
            <div className="feed-card signal-card-github">
              <div style={{ padding: '4px 0' }}>
                {g.recentCommits.slice(0, 8).map((c, i) => (
                  <div key={i} style={{
                    display: 'grid', gridTemplateColumns: '80px 1fr',
                    gap: 12, padding: '10px 16px', alignItems: 'baseline',
                    borderBottom: i < g.recentCommits.slice(0, 8).length - 1 ? '1px solid var(--border)' : 'none',
                  }}>
                    <span style={{ fontFamily: 'var(--font-ibm-plex-mono)', fontSize: 11, color: 'var(--text-faint)' }}>
                      {c.date.slice(0, 10)}
                    </span>
                    <span style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.4 }}>
                      {c.message}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

        {/* ── Bottom CTA ── */}
        <div style={{ marginTop: 56, paddingTop: 32, borderTop: '1px solid var(--border)', textAlign: 'center' }}>
          <a href="/" className="btn-dark" style={{ display: 'inline-flex' }}>
            ← Analyze another repo
          </a>
        </div>
      </div>
    </div>
  )
}
