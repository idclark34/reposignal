'use client'

import { useState, use } from 'react'
import AnalysisProgress from '@/components/AnalysisProgress'
import DashboardView from '@/components/DashboardView'
import { RawSignals, PlaybooksResponse, ReportSummary } from '@/types'

interface Props {
  params: Promise<{ owner: string; repo: string }>
}

type State =
  | { phase: 'loading' }
  | { phase: 'done'; signals: RawSignals; report: string; summary: ReportSummary | null; playbooks: PlaybooksResponse | null }
  | { phase: 'error'; message: string }

export default function DashboardPage({ params }: Props) {
  const { owner, repo } = use(params)
  const [state, setState] = useState<State>({ phase: 'loading' })

  if (state.phase === 'error') {
    return (
      <div
        style={{
          minHeight: '100vh',
          background: 'var(--bg)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <div
          style={{
            border: '1px solid var(--border)',
            background: 'var(--card)',
            padding: 40,
            maxWidth: 480,
            width: '100%',
            textAlign: 'center',
          }}
        >
          <div
            className="font-data"
            style={{ fontSize: 10, letterSpacing: '0.12em', color: 'var(--accent)', marginBottom: 16, textTransform: 'uppercase' }}
          >
            Scan Failed
          </div>
          <p style={{ fontSize: 13, color: 'var(--text-muted)', lineHeight: 1.6, marginBottom: 24 }}>
            {state.message}
          </p>
          <a
            href="/"
            style={{
              fontFamily: 'var(--font-dm-mono)',
              fontSize: 11,
              letterSpacing: '0.08em',
              color: 'var(--text-muted)',
              border: '1px solid var(--border)',
              padding: '8px 20px',
              textDecoration: 'none',
              textTransform: 'uppercase',
              display: 'inline-block',
            }}
          >
            ← New Scan
          </a>
        </div>
      </div>
    )
  }

  if (state.phase === 'loading') {
    return (
      <AnalysisProgress
        owner={owner}
        repo={repo}
        onComplete={(signals, report, summary, playbooks) => setState({ phase: 'done', signals, report, summary, playbooks })}
        onError={msg => setState({ phase: 'error', message: msg })}
      />
    )
  }

  return <DashboardView signals={state.signals} report={state.report} summary={state.summary} owner={owner} repo={repo} playbooks={state.playbooks} />
}
