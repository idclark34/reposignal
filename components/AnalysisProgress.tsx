'use client'

import { useEffect, useState, useRef } from 'react'
import { GitHubSignals, RawSignals } from '@/types'

interface Props {
  owner: string
  repo: string
  onComplete: (signals: RawSignals, report: string) => void
  onError: (msg: string) => void
}

type SourceStatus = 'waiting' | 'scanning' | 'done' | 'error'

interface SourceBlock {
  id: string
  name: string
  status: SourceStatus
  facts: string[]      // lines of actual data
  badge: string
}

function delay(ms: number) {
  return new Promise<void>(r => setTimeout(r, ms))
}

function fmt(n: number) {
  return n.toLocaleString('en-US')
}

function timeSince(iso: string): string {
  const ms = Date.now() - new Date(iso).getTime()
  const h = Math.floor(ms / 3600000)
  const d = Math.floor(ms / 86400000)
  if (d > 0) return `${d}d ago`
  if (h > 0) return `${h}h ago`
  return 'recently'
}

// ── Single source block ──────────────────────────────────────────
function SourceBlock({ block }: { block: SourceBlock }) {
  const [visibleFacts, setVisibleFacts] = useState<string[]>([])

  // Reveal facts one at a time as they arrive
  useEffect(() => {
    if (block.facts.length <= visibleFacts.length) return
    const t = setTimeout(() => {
      setVisibleFacts(block.facts.slice(0, visibleFacts.length + 1))
    }, 80)
    return () => clearTimeout(t)
  }, [block.facts, visibleFacts])

  const isDone    = block.status === 'done'
  const isError   = block.status === 'error'
  const isActive  = block.status === 'scanning'

  return (
    <div
      className="rise"
      style={{
        paddingTop: 48,
        paddingBottom: 48,
        borderBottom: '1px solid #2E2926',
      }}
    >
      {/* Source name — the big typographic element */}
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 24, marginBottom: 20 }}>
        <h2
          className="display-italic"
          style={{
            fontSize: 'clamp(56px, 9vw, 96px)',
            lineHeight: 0.92,
            letterSpacing: '-0.03em',
            color: isDone
              ? 'var(--dark-ink)'
              : isError
              ? 'var(--accent)'
              : 'var(--dark-muted)',
            transition: 'color 0.4s ease',
          }}
        >
          {block.name}
        </h2>

        <div style={{ paddingTop: 8 }}>
          {isDone && (
            <span
              style={{
                fontFamily: 'var(--font-ibm-plex-mono)',
                fontSize: 13,
                color: 'var(--accent)',
              }}
            >
              ✓
            </span>
          )}
          {isActive && (
            <span
              className="blink"
              style={{
                fontFamily: 'var(--font-ibm-plex-mono)',
                fontSize: 13,
                color: 'var(--dark-muted)',
              }}
            >
              ▌
            </span>
          )}
          {isError && (
            <span style={{ fontFamily: 'var(--font-ibm-plex-mono)', fontSize: 13, color: 'var(--accent)' }}>
              ✕
            </span>
          )}
        </div>
      </div>

      {/* Facts */}
      {visibleFacts.length > 0 && (
        <div style={{ paddingLeft: 4, display: 'flex', flexDirection: 'column', gap: 6 }}>
          {visibleFacts.map((fact, i) => (
            <div key={i} className="rise" style={{ display: 'flex', gap: 12, alignItems: 'baseline' }}>
              <span className="mono" style={{ fontSize: 11, color: 'var(--accent)', flexShrink: 0 }}>—</span>
              <span className="mono" style={{ fontSize: 13, color: 'var(--dark-muted)', lineHeight: 1.5 }}>
                {fact}
              </span>
            </div>
          ))}
        </div>
      )}

      {/* Scanning state */}
      {isActive && visibleFacts.length === 0 && (
        <div className="mono" style={{ fontSize: 12, color: 'var(--dark-muted)', paddingLeft: 4 }}>
          Scanning<span className="blink">_</span>
        </div>
      )}
    </div>
  )
}

// ── Main component ───────────────────────────────────────────────
export default function AnalysisProgress({ owner, repo, onComplete, onError }: Props) {
  const [sources, setSources] = useState<SourceBlock[]>([])
  const [elapsed, setElapsed] = useState(0)
  const [phase, setPhase] = useState<'github' | 'synthesis' | 'done'>('github')
  const startRef = useRef(Date.now())

  // Elapsed timer
  useEffect(() => {
    const t = setInterval(() => setElapsed(Math.floor((Date.now() - startRef.current) / 1000)), 1000)
    return () => clearInterval(t)
  }, [])

  function updateSource(id: string, patch: Partial<SourceBlock>) {
    setSources(prev => prev.map(s => s.id === id ? { ...s, ...patch } : s))
  }

  function addFact(id: string, fact: string) {
    setSources(prev => prev.map(s => s.id === id ? { ...s, facts: [...s.facts, fact] } : s))
  }

  useEffect(() => {
    let cancelled = false

    async function run() {
      // ── Phase 1: GitHub ─────────────────────────────────
      const ghBlock: SourceBlock = {
        id: 'github', name: 'GitHub', status: 'scanning', facts: [], badge: 'GitHub API',
      }
      setSources([ghBlock])

      let github: GitHubSignals
      try {
        const res = await fetch('/api/sources/github', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ owner, repo }),
        })
        if (!res.ok) throw new Error((await res.json()).error ?? 'GitHub fetch failed')
        github = await res.json()
      } catch (err: any) {
        if (cancelled) return
        updateSource('github', { status: 'error', facts: [err.message] })
        onError(err.message)
        return
      }

      if (cancelled) return

      // Reveal facts with small stagger
      updateSource('github', { status: 'done' })
      await delay(120)
      addFact('github', `${fmt(github.stars)} stars  ·  ${fmt(github.forks)} forks  ·  ${fmt(github.contributors)} contributors`)
      await delay(100)
      addFact('github', `README: ${fmt(github.readme.length)} characters indexed`)
      await delay(100)
      addFact('github', `${github.recentCommits.length} commits  ·  last activity ${timeSince(github.recentCommits[0]?.date ?? github.updatedAt)}`)
      await delay(100)
      addFact('github', `${github.topIssues.length} issues ranked by signal strength  ·  ${fmt(github.openIssues)} total open`)
      if (github.topics.length > 0) {
        await delay(100)
        addFact('github', `Topics: ${github.topics.slice(0, 6).join('  ·  ')}`)
      }

      // ── Phase 2: Synthesis ──────────────────────────────
      await delay(300)
      setPhase('synthesis')

      const synBlock: SourceBlock = {
        id: 'synthesis', name: 'Synthesis', status: 'scanning', facts: [], badge: 'Claude API',
      }
      setSources(prev => [...prev, synBlock])

      const signals: RawSignals = { github, fetchedAt: new Date().toISOString() }
      let report: string

      try {
        const res = await fetch('/api/synthesize', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(signals),
        })
        if (!res.ok) throw new Error((await res.json()).error ?? 'Synthesis failed')
        const data = await res.json()
        report = data.report
      } catch (err: any) {
        if (cancelled) return
        updateSource('synthesis', { status: 'error', facts: [err.message] })
        onError(err.message)
        return
      }

      if (cancelled) return

      updateSource('synthesis', { status: 'done' })
      await delay(100)
      addFact('synthesis', `Intelligence report generated  ·  ${report.split('\n').length} lines`)
      addFact('synthesis', `7 sections  ·  ICP, Positioning, Channels, Show HN, Content, Timing, Risks`)

      setPhase('done')

      await delay(800)
      onComplete(signals, report)
    }

    run()
    return () => { cancelled = true }
  }, [owner, repo])

  const elapsedFmt = `${String(Math.floor(elapsed / 60)).padStart(2, '0')}:${String(elapsed % 60).padStart(2, '0')}`

  return (
    <div style={{ background: 'var(--dark-bg)', minHeight: '100vh', color: 'var(--dark-ink)' }}>

      {/* Top bar */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '16px 32px',
        borderBottom: '1px solid #2E2926',
      }}>
        <a href="/" className="mono" style={{ fontSize: 11, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--dark-muted)', textDecoration: 'none' }}>
          ← RepoSignal
        </a>
        <div style={{ display: 'flex', gap: 24, alignItems: 'center' }}>
          <span className="mono" style={{ fontSize: 10, color: 'var(--dark-muted)', letterSpacing: '0.08em' }}>
            {owner} / {repo}
          </span>
          <span className="mono" style={{ fontSize: 10, color: 'var(--dark-muted)' }}>
            {elapsedFmt}
          </span>
          <span
            className="mono"
            style={{
              fontSize: 10,
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              color: phase === 'done' ? 'var(--accent)' : 'var(--dark-muted)',
            }}
          >
            {phase === 'done' ? '● Complete' : '● Live'}
          </span>
        </div>
      </div>

      {/* Scan label */}
      <div style={{ padding: '40px 32px 0' }}>
        <p className="mono" style={{ fontSize: 10, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--dark-muted)', marginBottom: 0 }}>
          Intelligence scan — {new Date().toISOString().slice(0, 10)}
        </p>
      </div>

      {/* Source blocks */}
      <div style={{ padding: '0 32px', maxWidth: 960 }}>
        {sources.map(block => (
          <SourceBlock key={block.id} block={block} />
        ))}
      </div>

      {/* Footer hint */}
      <div style={{ padding: '32px 32px', display: 'flex', gap: 16, alignItems: 'center' }}>
        <span className="mono" style={{ fontSize: 10, color: 'var(--dark-muted)', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
          {phase === 'done' ? 'Loading dashboard' : 'Do not close this window'}
          {phase !== 'done' && <span className="blink" style={{ marginLeft: 2 }}>_</span>}
        </span>
      </div>
    </div>
  )
}
