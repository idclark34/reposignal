'use client'

import { useEffect, useState, useRef } from 'react'
import { GitHubSignals, HNSignals, RedditSignals, RawSignals, PlaybooksResponse, ReportSummary } from '@/types'

interface Props {
  owner: string
  repo: string
  onComplete: (signals: RawSignals, report: string, summary: ReportSummary | null, playbooks: PlaybooksResponse | null) => void
  onError: (msg: string) => void
}

type SourceStatus = 'waiting' | 'scanning' | 'done' | 'error'

interface SourceBlock {
  id: string
  name: string
  status: SourceStatus
  facts: string[]
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
  const d = Math.floor(ms / 86400000)
  const h = Math.floor(ms / 3600000)
  if (d > 0) return `${d}d ago`
  if (h > 0) return `${h}h ago`
  return 'recently'
}

const SOURCE_META: Record<string, { color: string; badge: React.ReactNode }> = {
  github:    { color: '#24292F', badge: <span style={{ display:'inline-flex',alignItems:'center',gap:4,fontSize:10,fontWeight:600,background:'rgba(36,41,47,0.07)',color:'#24292F',borderRadius:9999,padding:'2px 8px',fontFamily:'var(--font-ibm-plex-mono)' }}>GitHub API</span> },
  hn:        { color: '#FF6600', badge: <span style={{ display:'inline-flex',alignItems:'center',gap:4,fontSize:10,fontWeight:600,background:'rgba(255,102,0,0.09)',color:'#FF6600',borderRadius:9999,padding:'2px 8px',fontFamily:'var(--font-ibm-plex-mono)' }}>HN Algolia</span> },
  reddit:    { color: '#FF4500', badge: <span style={{ display:'inline-flex',alignItems:'center',gap:4,fontSize:10,fontWeight:600,background:'rgba(255,69,0,0.09)',color:'#FF4500',borderRadius:9999,padding:'2px 8px',fontFamily:'var(--font-ibm-plex-mono)' }}>Reddit API</span> },
  synthesis: { color: '#7C3AED', badge: <span style={{ display:'inline-flex',alignItems:'center',gap:4,fontSize:10,fontWeight:600,background:'rgba(124,58,237,0.09)',color:'#7C3AED',borderRadius:9999,padding:'2px 8px',fontFamily:'var(--font-ibm-plex-mono)' }}>Claude API</span> },
  playbooks: { color: '#0A7D4E', badge: <span style={{ display:'inline-flex',alignItems:'center',gap:4,fontSize:10,fontWeight:600,background:'rgba(10,125,78,0.09)',color:'#0A7D4E',borderRadius:9999,padding:'2px 8px',fontFamily:'var(--font-ibm-plex-mono)' }}>Growth DB</span> },
}

function SourceCard({ block }: { block: SourceBlock }) {
  const [visibleFacts, setVisibleFacts] = useState<string[]>([])
  const meta = SOURCE_META[block.id] ?? SOURCE_META.github

  useEffect(() => {
    if (block.facts.length <= visibleFacts.length) return
    const t = setTimeout(() => {
      setVisibleFacts(block.facts.slice(0, visibleFacts.length + 1))
    }, 80)
    return () => clearTimeout(t)
  }, [block.facts, visibleFacts])

  const isDone   = block.status === 'done'
  const isError  = block.status === 'error'
  const isActive = block.status === 'scanning'

  return (
    <div style={{
      background: '#FFFFFF',
      border: '1.5px solid',
      borderColor: isDone ? 'var(--border)' : isError ? '#FCA5A5' : isActive ? meta.color : 'var(--border)',
      borderRadius: 16,
      overflow: 'hidden',
      transition: 'border-color 0.3s',
      boxShadow: isActive ? `0 0 0 3px ${meta.color}18` : 'var(--shadow-sm)',
    }}>
      {/* Card header */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '14px 16px',
        borderBottom: (visibleFacts.length > 0 || isActive) ? '1px solid var(--border)' : 'none',
        background: isDone ? 'transparent' : isActive ? `${meta.color}06` : 'transparent',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          {/* Status indicator */}
          <div style={{ width: 20, height: 20, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            {isDone && (
              <div style={{ width: 20, height: 20, borderRadius: '50%', background: '#DCFCE7', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <span style={{ fontSize: 10, color: '#16A34A' }}>✓</span>
              </div>
            )}
            {isError && (
              <div style={{ width: 20, height: 20, borderRadius: '50%', background: '#FEE2E2', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <span style={{ fontSize: 10, color: '#DC2626' }}>✕</span>
              </div>
            )}
            {isActive && (
              <div style={{ width: 20, height: 20, borderRadius: '50%', border: `2px solid ${meta.color}`, borderTopColor: 'transparent', animation: 'spin 0.7s linear infinite' }}>
                <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
              </div>
            )}
            {block.status === 'waiting' && (
              <div style={{ width: 20, height: 20, borderRadius: '50%', border: '2px solid var(--border)' }} />
            )}
          </div>
          <span style={{
            fontFamily: 'var(--font-jakarta)', fontWeight: 700, fontSize: 14,
            color: isDone ? 'var(--text-primary)' : isActive ? meta.color : 'var(--text-faint)',
            transition: 'color 0.3s',
            letterSpacing: '-0.01em',
          }}>
            {block.name}
          </span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          {meta.badge}
          {isActive && (
            <span style={{ fontFamily: 'var(--font-ibm-plex-mono)', fontSize: 11, color: meta.color }}>
              Scanning<span className="blink">_</span>
            </span>
          )}
        </div>
      </div>

      {/* Facts */}
      {visibleFacts.length > 0 && (
        <div style={{ padding: '10px 16px 12px', display: 'flex', flexDirection: 'column', gap: 5 }}>
          {visibleFacts.map((fact, i) => (
            <div key={i} style={{ display: 'flex', gap: 8, alignItems: 'baseline' }}>
              <span style={{ color: meta.color, flexShrink: 0, fontSize: 10, marginTop: 1 }}>—</span>
              <span style={{ fontFamily: 'var(--font-ibm-plex-mono)', fontSize: 12, color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                {fact}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default function AnalysisProgress({ owner, repo, onComplete, onError }: Props) {
  const [sources, setSources] = useState<SourceBlock[]>([])
  const [elapsed, setElapsed] = useState(0)
  const [phase, setPhase] = useState<'github' | 'sources' | 'synthesis' | 'playbooks' | 'done'>('github')
  const startRef = useRef(Date.now())

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
      const ghBlock: SourceBlock = { id: 'github', name: 'GitHub', status: 'scanning', facts: [], badge: 'GitHub API' }
      setSources([ghBlock])

      let github: GitHubSignals
      try {
        const res = await fetch('/api/sources/github', {
          method: 'POST', headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ owner, repo }),
        })
        if (!res.ok) throw new Error((await res.json()).error ?? 'GitHub fetch failed')
        github = await res.json()
      } catch (err: any) {
        if (cancelled) return
        console.error('[forkpulse] GitHub step failed:', err.name, err.message)
        updateSource('github', { status: 'error', facts: [err.message] })
        onError(err.message)
        return
      }

      if (cancelled) return
      updateSource('github', { status: 'done' })
      await delay(120)
      addFact('github', `${fmt(github.stars)} stars  ·  ${fmt(github.forks)} forks  ·  ${fmt(github.contributors)} contributors`)
      await delay(100)
      addFact('github', `README: ${fmt(github.readme.length)} characters indexed`)
      await delay(100)
      addFact('github', `${github.recentCommits.length} commits  ·  last activity ${timeSince(github.recentCommits[0]?.date ?? github.updatedAt)}`)
      await delay(100)
      addFact('github', `${github.topIssues.length} issues ranked by signal strength`)
      if (github.topics.length > 0) {
        await delay(100)
        addFact('github', `Topics: ${github.topics.slice(0, 6).join('  ·  ')}`)
      }

      await delay(300)
      setPhase('sources')

      const hnBlock: SourceBlock    = { id: 'hn',     name: 'Hacker News', status: 'scanning', facts: [], badge: 'HN Algolia' }
      const redditBlock: SourceBlock = { id: 'reddit', name: 'Reddit',      status: 'scanning', facts: [], badge: 'Reddit API' }
      setSources(prev => [...prev, hnBlock, redditBlock])

      const payload = { repoName: github.name, repoDescription: github.description, topics: github.topics }
      const [hnRes, redditRes] = await Promise.allSettled([
        fetch('/api/sources/hn',     { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) }),
        fetch('/api/sources/reddit', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) }),
      ])

      let hn: HNSignals | undefined
      try {
        if (hnRes.status === 'fulfilled' && hnRes.value.ok) {
          hn = await hnRes.value.json()
          updateSource('hn', { status: 'done' })
          await delay(80)
          addFact('hn', `${hn!.totalStories.toLocaleString()} story mentions  ·  ${hn!.totalComments.toLocaleString()} comment mentions`)
          await delay(80)
          addFact('hn', `Query: "${hn!.query}"`)
          if (hn!.showHNPosts.length > 0) {
            await delay(80)
            addFact('hn', `${hn!.showHNPosts.length} Show HN post${hn!.showHNPosts.length > 1 ? 's' : ''} found`)
          }
        } else {
          updateSource('hn', { status: 'error', facts: ['Could not reach HN — continuing without it'] })
        }
      } catch (err: any) {
        console.error('[forkpulse] HN parse error:', err.name, err.message)
        updateSource('hn', { status: 'error', facts: ['Could not reach HN — continuing without it'] })
      }

      let reddit: RedditSignals | undefined
      try {
        if (redditRes.status === 'fulfilled' && redditRes.value.ok) {
          reddit = await redditRes.value.json()
          updateSource('reddit', { status: 'done' })
          await delay(80)
          addFact('reddit', `${reddit!.totalResults.toLocaleString()} results  ·  ${reddit!.posts.length} posts indexed`)
          await delay(80)
          addFact('reddit', `Query: "${reddit!.query}"`)
          if (reddit!.posts.length > 0) {
            const topSubs = [...new Set(reddit!.posts.slice(0, 5).map(p => `r/${p.subreddit}`))].join('  ·  ')
            await delay(80)
            addFact('reddit', `Top subreddits: ${topSubs}`)
          }
        } else {
          updateSource('reddit', { status: 'error', facts: ['Could not reach Reddit — continuing without it'] })
        }
      } catch (err: any) {
        console.error('[forkpulse] Reddit parse error:', err.name, err.message)
        updateSource('reddit', { status: 'error', facts: ['Could not reach Reddit — continuing without it'] })
      }

      await delay(300)
      setPhase('synthesis')

      const synBlock: SourceBlock = { id: 'synthesis', name: 'Synthesis', status: 'scanning', facts: [], badge: 'Claude API' }
      setSources(prev => [...prev, synBlock])

      const signals: RawSignals = { github, hn, reddit, fetchedAt: new Date().toISOString() }
      let report = ''
      let summary: ReportSummary | null = null

      try {
        const res = await fetch('/api/synthesize', {
          method: 'POST', headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(signals),
        })
        if (!res.ok) {
          let errorMsg = res.status === 524 || res.status === 502 || res.status === 504
            ? 'Analysis timed out — Claude took too long. Try a smaller repo or try again.'
            : 'Synthesis failed'
          try { const e = await res.json(); errorMsg = e.error ?? errorMsg } catch { /* non-JSON (Cloudflare HTML) */ }
          throw new Error(errorMsg)
        }

        // Route streams NDJSON: keepalive newlines, then one JSON line per chunk.
        // First line: { type: 'summary', summary: {...} }  — arrives fast via Haiku
        // Second line: { type: 'report', fullReport: '...' } — arrives after Sonnet
        const reader = res.body!.getReader()
        const decoder = new TextDecoder()
        let buf = ''

        while (true) {
          const { done, value } = await reader.read()
          if (cancelled) { try { reader.cancel() } catch {} return }
          if (done) break
          buf += decoder.decode(value, { stream: true })
          const lines = buf.split('\n')
          buf = lines.pop() ?? ''
          for (const line of lines) {
            const trimmed = line.trim()
            if (!trimmed) continue
            let data: any
            try { data = JSON.parse(trimmed) } catch { continue }
            if (data.error) throw new Error(data.error)
            if (data.type === 'summary') {
              summary = data.summary ?? null
              addFact('synthesis', 'ICP + signals data ready')
            } else if (data.type === 'report') {
              report = data.fullReport ?? ''
            }
          }
        }

        if (!report) throw new Error('Synthesis returned invalid response')
      } catch (err: any) {
        if (cancelled) return
        console.error('[forkpulse] Synthesis step failed:', err.name, err.message)
        updateSource('synthesis', { status: 'error', facts: [err.message] })
        onError(err.message)
        return
      }

      if (cancelled) return
      updateSource('synthesis', { status: 'done' })
      await delay(100)
      addFact('synthesis', `Intelligence report generated  ·  ${report.split('\n').length} lines`)
      addFact('synthesis', `7 sections: ICP, Positioning, Channels, Show HN, Content, Timing, Risks`)

      await delay(300)
      setPhase('playbooks')

      const pbBlock: SourceBlock = { id: 'playbooks', name: 'Growth Playbooks', status: 'scanning', facts: [], badge: 'Growth DB' }
      setSources(prev => [...prev, pbBlock])

      let playbooks = null
      try {
        const pbRes = await fetch('/api/playbooks', {
          method: 'POST', headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ signals, report }),
        })
        if (!pbRes.ok) throw new Error('Playbook matching failed')
        playbooks = await pbRes.json()
        if (cancelled) return
        updateSource('playbooks', { status: 'done' })
        await delay(80)
        addFact('playbooks', `${playbooks.matches.length} matched case studies found`)
        await delay(80)
        addFact('playbooks', playbooks.matches.map((m: any) => m.playbook.name).join('  ·  '))
      } catch {
        if (cancelled) return
        updateSource('playbooks', { status: 'error', facts: ['Could not match playbooks — continuing without them'] })
      }

      setPhase('done')
      await delay(800)
      onComplete(signals, report, summary, playbooks)
    }

    run().catch(err => {
      if (cancelled) return
      console.error('[forkpulse] Unhandled error in run():', err.name, err.message)
      onError(err.message ?? 'Unexpected scan error')
    })
    return () => { cancelled = true }
  }, [owner, repo])

  const elapsedFmt = `${String(Math.floor(elapsed / 60)).padStart(2, '0')}:${String(elapsed % 60).padStart(2, '0')}`
  const isDone = phase === 'done'

  return (
    <div style={{ background: 'var(--bg)', minHeight: '100vh' }}>
      <div className="bg-glow-layer" />

      {/* Header */}
      <header style={{
        position: 'sticky', top: 0, zIndex: 10,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '0 clamp(16px, 5vw, 36px)', height: 56,
        background: 'rgba(255,255,255,0.9)', backdropFilter: 'blur(14px)',
        borderBottom: '1px solid var(--border)',
      }}>
        <a href="/" style={{
          fontFamily: 'var(--font-jakarta)', fontWeight: 700, fontSize: 14,
          color: 'var(--text-primary)', textDecoration: 'none', letterSpacing: '-0.02em',
        }}>
          ← ForkPulse
        </a>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <span style={{ fontFamily: 'var(--font-ibm-plex-mono)', fontSize: 12, color: 'var(--text-faint)' }}>
            {owner}/{repo}
          </span>
          <span style={{ fontFamily: 'var(--font-ibm-plex-mono)', fontSize: 11, color: 'var(--text-faint)' }}>
            {elapsedFmt}
          </span>
          <span style={{
            fontFamily: 'var(--font-ibm-plex-mono)', fontSize: 10, letterSpacing: '0.08em',
            textTransform: 'uppercase',
            color: isDone ? '#16A34A' : phase === 'playbooks' ? '#0A7D4E' : '#7C3AED',
          }}>
            ● {isDone ? 'Complete' : phase === 'synthesis' ? 'Synthesizing' : phase === 'playbooks' ? 'Matching' : 'Scanning'}
          </span>
        </div>
      </header>

      {/* Content */}
      <div style={{
        maxWidth: 560, margin: '0 auto',
        padding: 'clamp(36px, 6vw, 60px) clamp(16px, 5vw, 36px) 80px',
        position: 'relative', zIndex: 1,
      }}>
        {/* Heading */}
        <div style={{ marginBottom: 32 }}>
          <p style={{ fontFamily: 'var(--font-ibm-plex-mono)', fontSize: 10, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--text-faint)', marginBottom: 10 }}>
            Intelligence scan — {new Date().toISOString().slice(0, 10)}
          </p>
          <h1 style={{
            fontFamily: 'var(--font-jakarta)', fontWeight: 800,
            fontSize: 'clamp(1.6rem, 5vw, 2.2rem)', letterSpacing: '-0.025em',
            color: 'var(--text-primary)', lineHeight: 1.1,
          }}>
            Scanning {repo}
          </h1>
        </div>

        {/* Source cards */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {sources.map(block => (
            <SourceCard key={block.id} block={block} />
          ))}
        </div>

        {/* Footer hint */}
        <p style={{
          marginTop: 28, fontFamily: 'var(--font-ibm-plex-mono)',
          fontSize: 11, color: 'var(--text-faint)', letterSpacing: '0.04em',
        }}>
          {isDone
            ? 'Loading your results…'
            : <>Do not close this window<span className="blink">_</span></>
          }
        </p>
      </div>
    </div>
  )
}
