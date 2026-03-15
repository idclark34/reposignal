import { ImageResponse } from 'next/og'

export const runtime = 'edge'
export const alt = 'ForkPulse — marketing intelligence for OSS builders'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default function OGImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'radial-gradient(ellipse 120% 80% at 50% -10%, #EDE9FF 0%, #F5F3FF 30%, #FFFFFF 65%)',
          fontFamily: 'system-ui, sans-serif',
          padding: '80px 100px',
        }}
      >
        {/* Logo row */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 40 }}>
          <div style={{
            width: 52, height: 52, borderRadius: 14,
            background: '#0A0A0A',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <svg width="26" height="26" viewBox="0 0 16 16" fill="none">
              <path d="M8 1.5C4.41 1.5 1.5 4.41 1.5 8s2.91 6.5 6.5 6.5S14.5 11.59 14.5 8 11.59 1.5 8 1.5z" stroke="white" strokeWidth="1.2" />
              <circle cx="8" cy="8" r="2" fill="white" />
              <path d="M8 3v1.5M8 11.5V13M3 8h1.5M11.5 8H13" stroke="white" strokeWidth="1.2" strokeLinecap="round" />
            </svg>
          </div>
          <span style={{ fontSize: 28, fontWeight: 800, color: '#0A0A0A', letterSpacing: '-0.03em' }}>
            ForkPulse
          </span>
        </div>

        {/* Headline */}
        <div style={{
          fontSize: 62,
          fontWeight: 800,
          color: '#0A0A0A',
          letterSpacing: '-0.04em',
          lineHeight: 1.05,
          textAlign: 'center',
          marginBottom: 28,
          maxWidth: 900,
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'center',
        }}>
          Your GitHub repo has an audience you&apos;ve never met.
        </div>

        {/* Subhead */}
        <div style={{
          fontSize: 22,
          color: '#6B7280',
          textAlign: 'center',
          maxWidth: 680,
          lineHeight: 1.5,
          marginBottom: 52,
          display: 'flex',
        }}>
          Map Reddit threads, HN discussions, and GitHub signals to find exactly who wants your project.
        </div>

        {/* Source pills */}
        <div style={{ display: 'flex', gap: 12 }}>
          {[
            { label: 'Reddit', color: '#FF4500', bg: 'rgba(255,69,0,0.08)' },
            { label: 'Hacker News', color: '#FF6600', bg: 'rgba(255,102,0,0.08)' },
            { label: 'GitHub', color: '#24292F', bg: 'rgba(36,41,47,0.07)' },
            { label: 'Claude AI', color: '#7C3AED', bg: 'rgba(124,58,237,0.08)' },
          ].map(p => (
            <div key={p.label} style={{
              display: 'flex',
              background: p.bg,
              border: `1.5px solid ${p.color}22`,
              borderRadius: 9999,
              padding: '10px 20px',
              fontSize: 15,
              fontWeight: 600,
              color: p.color,
              letterSpacing: '-0.01em',
            }}>
              {p.label}
            </div>
          ))}
        </div>
      </div>
    ),
    size,
  )
}
