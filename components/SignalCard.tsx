interface Props {
  title: string
  source: string
  tiltClass?: string
  dark?: boolean
  children: React.ReactNode
}

export default function SignalCard({ title, source, tiltClass = '', dark = false, children }: Props) {
  const bg      = dark ? 'var(--dark-bg)'  : 'var(--bg)'
  const ink     = dark ? 'var(--dark-ink)' : 'var(--ink)'
  const muted   = dark ? 'var(--dark-muted)' : 'var(--ink-muted)'
  const border  = dark ? '#2E2926' : 'var(--border)'

  return (
    <div
      className={tiltClass}
      style={{
        border: `1px solid ${border}`,
        background: bg,
        color: ink,
      }}
    >
      {/* Card header */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '10px 16px',
          borderBottom: `1px solid ${border}`,
        }}
      >
        <span
          className="mono"
          style={{
            fontSize: 9,
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
            color: muted,
          }}
        >
          {title}
        </span>
        <span className={dark ? 'badge-dark' : 'badge'}>{source}</span>
      </div>

      <div style={{ padding: 16 }}>{children}</div>
    </div>
  )
}
