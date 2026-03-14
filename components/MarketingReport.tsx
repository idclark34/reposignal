'use client'

import { useState } from 'react'

interface Props { report: string }

interface Section {
  num: string
  title: string
  content: string
}

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
      ? <strong key={i} style={{ fontWeight: 600 }}>{p.slice(2, -2)}</strong>
      : <span key={i}>{p}</span>
  )
}

function renderContent(content: string, dark: boolean) {
  const inkColor   = dark ? 'var(--dark-ink)'   : 'var(--ink)'
  const mutedColor = dark ? 'var(--dark-muted)'  : 'var(--ink-muted)'

  return content.split('\n').map((line, i) => {
    const t = line.trim()
    if (!t) return <div key={i} style={{ height: 8 }} />

    const isBullet = t.startsWith('- ') || t.startsWith('• ')
    const text = isBullet ? t.slice(2) : t

    return isBullet ? (
      <div key={i} style={{ display: 'flex', gap: 12, marginBottom: 8, alignItems: 'flex-start' }}>
        <span style={{ color: 'var(--accent)', fontWeight: 700, lineHeight: 1.7, flexShrink: 0, fontSize: 14 }}>—</span>
        <span style={{ fontSize: 14, color: mutedColor, lineHeight: 1.7 }}>{renderInline(text)}</span>
      </div>
    ) : (
      <p key={i} style={{ fontSize: 14, color: mutedColor, lineHeight: 1.7, marginBottom: 6 }}>
        {renderInline(text)}
      </p>
    )
  })
}

function Section({ section, index }: { section: Section; index: number }) {
  const [open, setOpen] = useState(true)
  // Alternate: even sections are dark, odd sections are light
  const dark = index % 2 === 1

  const bg        = dark ? 'var(--dark-bg)'   : 'var(--bg)'
  const ink       = dark ? 'var(--dark-ink)'  : 'var(--ink)'
  const muted     = dark ? 'var(--dark-muted)' : 'var(--ink-muted)'
  const border    = dark ? '#2E2926'           : 'var(--border)'

  return (
    <div style={{ background: bg, borderBottom: `1px solid ${border}` }}>
      <button
        onClick={() => setOpen(o => !o)}
        style={{
          width: '100%',
          display: 'grid',
          gridTemplateColumns: '56px 1fr 32px',
          alignItems: 'center',
          gap: 16,
          padding: '24px 32px',
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          textAlign: 'left',
        }}
      >
        <span
          className="mono"
          style={{ fontSize: 11, color: 'var(--accent)', letterSpacing: '0.06em' }}
        >
          0{section.num}
        </span>
        <h3
          className="display"
          style={{
            fontSize: 20,
            fontWeight: 700,
            color: ink,
            letterSpacing: '-0.01em',
          }}
        >
          {section.title}
        </h3>
        <span
          className="mono"
          style={{
            fontSize: 11,
            color: muted,
            transform: open ? 'rotate(90deg)' : 'rotate(0)',
            transition: 'transform 0.2s',
            display: 'inline-block',
            textAlign: 'right',
          }}
        >
          ▶
        </span>
      </button>

      {open && (
        <div style={{ padding: '0 32px 28px 104px' }}>
          {renderContent(section.content, dark)}
        </div>
      )}
    </div>
  )
}

export default function MarketingReport({ report }: Props) {
  const [copied, setCopied] = useState(false)
  const sections = parseSections(report)

  function handleCopy() {
    navigator.clipboard.writeText(report)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  function handleExport() {
    const blob = new Blob([report], { type: 'text/markdown' })
    const url = URL.createObjectURL(blob)
    Object.assign(document.createElement('a'), { href: url, download: 'intelligence-report.md' }).click()
    URL.revokeObjectURL(url)
  }

  if (!sections.length) {
    return (
      <div style={{ padding: 32 }}>
        <pre className="mono" style={{ fontSize: 12, color: 'var(--ink-muted)', whiteSpace: 'pre-wrap', lineHeight: 1.7 }}>
          {report}
        </pre>
      </div>
    )
  }

  return (
    <div>
      {/* Toolbar */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '12px 32px',
        borderBottom: '1px solid var(--border)',
        background: 'var(--bg)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <span className="mono" style={{ fontSize: 9, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--ink-muted)' }}>
            Intelligence Report
          </span>
          <span className="badge-accent">Claude API</span>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button
            onClick={handleCopy}
            className="mono"
            style={{
              fontSize: 10,
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              color: 'var(--ink-muted)',
              background: 'none',
              border: '1px solid var(--border)',
              padding: '4px 12px',
              cursor: 'pointer',
            }}
          >
            {copied ? 'Copied ✓' : 'Copy'}
          </button>
          <button
            onClick={handleExport}
            className="mono"
            style={{
              fontSize: 10,
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              color: 'var(--accent)',
              background: 'none',
              border: '1px solid var(--accent)',
              padding: '4px 12px',
              cursor: 'pointer',
            }}
          >
            Export .md
          </button>
        </div>
      </div>

      {/* Alternating sections */}
      {sections.map((s, i) => (
        <Section key={s.num} section={s} index={i} />
      ))}
    </div>
  )
}
