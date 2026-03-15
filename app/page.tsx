import type { Metadata } from 'next'
import GitHubAuth from '@/components/GitHubAuth'
import RepoInput from '@/components/RepoInput'
import SignalCarousel from '@/components/SignalCarousel'

export const metadata: Metadata = {
  openGraph: {
    images: [{ url: '/api/og', width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    images: ['/api/og'],
  },
}

const AVATARS = [
  { initials: 'AK', bg: '#7C3AED' },
  { initials: 'MR', bg: '#3B82F6' },
  { initials: 'JL', bg: '#059669' },
]

const FEATURES = [
  {
    icon: '⚡',
    name: 'Scan every source',
    desc: 'We fetch your GitHub signals, then cross-reference Reddit threads, Hacker News discussions, and trending searches — all in under 30 seconds.',
    mockup: (
      <div style={{ background: '#F1F5F9', borderRadius: 12, padding: '20px 16px', marginBottom: 20, display: 'flex', flexDirection: 'column' as const, gap: 8 }}>
        {['GitHub API', 'Reddit Search', 'HN Algolia', 'Claude API'].map((s, i) => (
          <div key={s} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 8, height: 8, borderRadius: '50%', background: i < 3 ? '#059669' : '#7C3AED', flexShrink: 0 }} />
            <span style={{ fontFamily: 'var(--font-ibm-plex-mono)', fontSize: 11, color: '#374151' }}>{s}</span>
            <div style={{ flex: 1, height: 1, background: 'rgba(0,0,0,0.08)' }} />
            <span style={{ fontFamily: 'var(--font-ibm-plex-mono)', fontSize: 10, color: '#9CA3AF' }}>
              {i < 3 ? '✓ done' : '● synth'}
            </span>
          </div>
        ))}
      </div>
    ),
  },
  {
    icon: '🎯',
    name: 'Surface real intent',
    desc: 'Not impressions. Not guesses. Actual people discussing actual problems your project solves — with the exact language they use.',
    mockup: (
      <div style={{ background: '#F1F5F9', borderRadius: 12, padding: '16px', marginBottom: 20 }}>
        {[
          { label: 'r/devops', score: '↑ 847', snippet: '"finally a tool that tells you WHERE..."' },
          { label: 'news.ycombinator', score: '▲ 312', snippet: '"Show HN: This saved our launch..."' },
        ].map(item => (
          <div key={item.label} style={{ marginBottom: 12, paddingBottom: 12, borderBottom: '1px solid rgba(0,0,0,0.07)' }}>
            <div style={{ fontFamily: 'var(--font-ibm-plex-mono)', fontSize: 10, color: '#9CA3AF', marginBottom: 4 }}>
              {item.label}  <span style={{ color: '#6B7280', fontWeight: 600 }}>{item.score}</span>
            </div>
            <div style={{ fontSize: 12, color: '#374151', fontStyle: 'italic' }}>{item.snippet}</div>
          </div>
        ))}
        <div style={{ fontSize: 11, color: '#9CA3AF' }}>+14 more communities →</div>
      </div>
    ),
  },
  {
    icon: '📋',
    name: 'Get your strategy',
    desc: 'A Claude-powered marketing brief: your ICP, the best channels, exact messaging to use, when to post, and which risks to watch.',
    mockup: (
      <div style={{ background: '#F1F5F9', borderRadius: 12, padding: '16px', marginBottom: 20 }}>
        {['Ideal Customer Profile', 'Best Channels', 'Messaging Framework', 'Launch Timing'].map((s, i) => (
          <div key={s} style={{
            display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8,
            opacity: i > 1 ? 0.5 : 1,
          }}>
            <div style={{ width: 20, height: 20, borderRadius: '50%', background: 'white', border: '1.5px solid rgba(0,0,0,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <div style={{ width: 8, height: 8, borderRadius: '50%', background: i < 2 ? '#7C3AED' : 'transparent' }} />
            </div>
            <span style={{ fontSize: 12, color: '#374151', fontWeight: i < 2 ? 500 : 400 }}>{s}</span>
          </div>
        ))}
      </div>
    ),
  },
]

export default function Home() {
  return (
    <main style={{
      background: 'radial-gradient(ellipse 130% 55% at 50% -2%, #EDE9FF 0%, #F5F3FF 24%, #FFFFFF 58%)',
      minHeight: '100vh',
      position: 'relative',
    }}>

      {/* ── Nav ── */}
      <nav style={{
        position: 'sticky', top: 0, zIndex: 20,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '0 clamp(16px, 5vw, 36px)',
        height: 60,
        background: 'rgba(255,255,255,0.85)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        borderBottom: '1px solid var(--border)',
      }}>
        {/* Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{
            width: 30, height: 30, borderRadius: 8,
            background: 'var(--text-primary)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            flexShrink: 0,
          }}>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M8 1.5C4.41 1.5 1.5 4.41 1.5 8s2.91 6.5 6.5 6.5S14.5 11.59 14.5 8 11.59 1.5 8 1.5z" stroke="white" strokeWidth="1.2" />
              <circle cx="8" cy="8" r="2" fill="white" />
              <path d="M8 3v1.5M8 11.5V13M3 8h1.5M11.5 8H13" stroke="white" strokeWidth="1.2" strokeLinecap="round" />
            </svg>
          </div>
          <span style={{
            fontFamily: 'var(--font-jakarta)', fontWeight: 700, fontSize: 15,
            color: 'var(--text-primary)', letterSpacing: '-0.02em',
          }}>
            ForkPulse
          </span>
        </div>

        {/* Desktop: ghost button */}
        <a
          href="#get-started"
          className="btn-outline desktop-only"
          style={{ fontSize: 13, padding: '8px 18px', minHeight: 36 }}
        >
          Analyze your repo
        </a>

        {/* Mobile: hamburger */}
        <button
          aria-label="Menu"
          className="mobile-only"
          style={{
            background: 'none', border: 'none', cursor: 'pointer',
            padding: 8, display: 'flex', flexDirection: 'column', gap: 5,
          }}
        >
          <span style={{ display: 'block', width: 22, height: 2, background: 'var(--text-primary)', borderRadius: 2 }} />
          <span style={{ display: 'block', width: 22, height: 2, background: 'var(--text-primary)', borderRadius: 2 }} />
          <span style={{ display: 'block', width: 16, height: 2, background: 'var(--text-primary)', borderRadius: 2 }} />
        </button>
      </nav>

      {/* ── Hero ── */}
      <section style={{
        position: 'relative', zIndex: 1,
        padding: 'clamp(56px, 10vw, 104px) clamp(16px, 5vw, 36px) 0',
        maxWidth: 680, margin: '0 auto', width: '100%',
        textAlign: 'center',
      }}>
        <div className="fade-up" style={{ marginBottom: 24 }}>
          <span className="eyebrow">Marketing intelligence for OSS builders</span>
        </div>

        <h1
          className="fade-up-d1"
          style={{
            fontFamily: 'var(--font-jakarta), var(--font-geist-sans), system-ui, sans-serif',
            fontWeight: 800,
            fontSize: 'clamp(2.4rem, 8.5vw, 4rem)',
            lineHeight: 1.08,
            letterSpacing: '-0.03em',
            color: '#0A0A0A',
            marginBottom: 20,
          }}
        >
          Your GitHub repo has an audience you&apos;ve never met.
        </h1>

        <p
          className="fade-up-d2"
          style={{
            fontSize: 'clamp(1rem, 2.2vw, 1.15rem)',
            color: '#6B7280',
            lineHeight: 1.7,
            maxWidth: '85%',
            margin: '0 auto 32px',
          }}
        >
          ForkPulse maps Reddit discussions, HN threads, and GitHub signals to show you exactly
          who wants your project — and where to reach them.
        </p>

        {/* Social proof row */}
        <div
          className="fade-up-d3"
          style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, marginBottom: 32 }}
        >
          <div style={{ display: 'flex' }}>
            {AVATARS.map((a, i) => (
              <div
                key={i}
                style={{
                  width: 34, height: 34, borderRadius: '50%',
                  background: a.bg, border: '2.5px solid white',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  marginLeft: i === 0 ? 0 : -10,
                  fontFamily: 'var(--font-jakarta)', fontWeight: 700, fontSize: 11,
                  color: 'white', letterSpacing: '0.02em',
                  position: 'relative', zIndex: AVATARS.length - i,
                }}
              >
                {a.initials}
              </div>
            ))}
          </div>
          <p style={{ fontSize: 13, color: '#374151', letterSpacing: '-0.01em' }}>
            <strong style={{ color: '#0A0A0A', fontWeight: 600 }}>47 repos</strong>
            {' '}analyzed this week
          </p>
        </div>

        {/* Primary CTA */}
        <div className="fade-up-d4" style={{ marginBottom: 16 }}>
          <GitHubAuth />
        </div>

        {/* Secondary CTA */}
        <div className="fade-up-d5">
          <a
            href="#try-repo"
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 6,
              fontSize: 13, color: 'var(--text-secondary)', textDecoration: 'none',
              letterSpacing: '-0.01em', transition: 'color 0.15s',
            }}
          >
            <span style={{ opacity: 0.7 }}>✦</span>
            Or try any public repo — no sign-in needed
          </a>
        </div>
      </section>

      {/* ── Carousel ── */}
      <section style={{
        position: 'relative', zIndex: 1,
        padding: 'clamp(48px, 8vw, 80px) 0 0',
      }}>
        <p style={{
          textAlign: 'center', marginBottom: 24,
          fontFamily: 'var(--font-ibm-plex-mono)', fontSize: 11,
          color: '#9CA3AF', letterSpacing: '0.14em', textTransform: 'uppercase',
        }}>
          Real signals — live from the communities
        </p>
        <SignalCarousel />
      </section>

      {/* ── Repo input ── */}
      <section
        id="try-repo"
        style={{
          position: 'relative', zIndex: 1,
          padding: 'clamp(48px, 8vw, 80px) clamp(16px, 5vw, 36px)',
          maxWidth: 600, margin: '0 auto',
        }}
      >
        <div className="rule" style={{ marginBottom: 'clamp(32px, 6vw, 56px)' }} />
        <p style={{
          fontFamily: 'var(--font-ibm-plex-mono)', fontSize: 11,
          letterSpacing: '0.1em', textTransform: 'uppercase',
          color: 'var(--text-faint)', marginBottom: 14, textAlign: 'center',
        }}>
          Analyze any public repository
        </p>
        <RepoInput />
      </section>

      {/* ── Features ── */}
      <section style={{
        position: 'relative', zIndex: 1,
        padding: 'clamp(48px, 8vw, 96px) clamp(16px, 5vw, 36px)',
        maxWidth: 1060, margin: '0 auto',
      }}>
        <div className="rule" style={{ marginBottom: 'clamp(40px, 7vw, 72px)' }} />
        <h2
          style={{
            fontFamily: 'var(--font-jakarta)', fontWeight: 800,
            fontSize: 'clamp(1.5rem, 4vw, 2.1rem)',
            letterSpacing: '-0.025em', color: 'var(--text-primary)',
            marginBottom: 8, textAlign: 'center',
          }}
        >
          How ForkPulse works
        </h2>
        <p style={{
          fontSize: 15, color: 'var(--text-secondary)', textAlign: 'center',
          marginBottom: 'clamp(32px, 6vw, 56px)', maxWidth: 420, margin: '0 auto clamp(32px, 6vw, 56px)',
          lineHeight: 1.7,
        }}>
          Paste your repo URL. We handle the rest in about 30 seconds.
        </p>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: 20,
        }}>
          {FEATURES.map((f) => (
            <div key={f.name} className="feature-card">
              <div style={{ padding: '24px 24px 0' }}>
                {f.mockup}
              </div>
              <div style={{ padding: '0 24px 28px' }}>
                <div style={{ fontSize: 22, marginBottom: 10 }}>{f.icon}</div>
                <h3 style={{
                  fontFamily: 'var(--font-jakarta)', fontWeight: 700,
                  fontSize: '1.1rem', letterSpacing: '-0.02em',
                  color: 'var(--text-primary)', marginBottom: 8,
                }}>
                  {f.name}
                </h3>
                <p style={{ fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.7 }}>
                  {f.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Get started ── */}
      <section
        id="get-started"
        style={{
          position: 'relative', zIndex: 1,
          background: '#F8F7FF',
          borderTop: '1px solid rgba(124,58,237,0.1)',
          padding: 'clamp(56px, 10vw, 96px) clamp(16px, 5vw, 36px)',
          textAlign: 'center',
        }}
      >
        <span className="eyebrow">
          Early access
        </span>
        <h2
          style={{
            fontFamily: 'var(--font-jakarta)', fontWeight: 800,
            fontSize: 'clamp(1.7rem, 5vw, 2.6rem)',
            letterSpacing: '-0.03em', color: 'var(--text-primary)',
            marginTop: 20, marginBottom: 16,
          }}
        >
          Ready to find your audience?
        </h2>
        <p style={{
          fontSize: 15, color: 'var(--text-secondary)', lineHeight: 1.7,
          maxWidth: 420, margin: '0 auto 36px',
        }}>
          Connect your GitHub account and analyze any of your repos in seconds. Free during beta.
        </p>
        <div style={{ maxWidth: 480, margin: '0 auto' }}>
          <GitHubAuth />
        </div>
      </section>

      {/* ── Footer ── */}
      <footer style={{
        position: 'relative', zIndex: 1,
        padding: 'clamp(24px, 4vw, 40px) clamp(16px, 5vw, 36px)',
        borderTop: '1px solid var(--border)',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        flexWrap: 'wrap', gap: 12,
      }}>
        <span style={{ fontFamily: 'var(--font-ibm-plex-mono)', fontSize: 11, color: 'var(--text-faint)', letterSpacing: '0.04em' }}>
          ForkPulse · v0.1 beta
        </span>
        <a
          href="/onboarding"
          style={{ fontFamily: 'var(--font-ibm-plex-mono)', fontSize: 11, color: 'var(--text-faint)', textDecoration: 'none', letterSpacing: '0.04em' }}
        >
          Pick your voice →
        </a>
      </footer>
    </main>
  )
}
