import RepoInput from '@/components/RepoInput'
import HeroCycle from '@/components/HeroCycle'

export default function Home() {
  return (
    <main style={{ background: 'var(--bg)', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>

      {/* ── Top bar ── */}
      <header style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '12px clamp(16px, 5vw, 32px)',
        borderBottom: '1px solid var(--border)',
      }}>
        <span className="mono" style={{ fontSize: 11, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--ink-muted)' }}>
          RepoSignal
        </span>
        <span className="mono" style={{ fontSize: 10, color: 'var(--ink-faint)', letterSpacing: '0.06em' }}>
          v0.1 · MVP
        </span>
      </header>

      {/* ── Hero ── */}
      <section style={{
        padding: 'clamp(40px, 8vw, 96px) clamp(16px, 5vw, 32px) clamp(32px, 6vw, 72px)',
        maxWidth: 1040,
        margin: '0 auto',
        width: '100%',
      }}>

        {/* H1 */}
        <HeroCycle />

        {/* Subheading */}
        <p style={{
          fontSize: 'clamp(15px, 1.4vw, 18px)',
          color: 'var(--ink-muted)',
          maxWidth: 520,
          lineHeight: 1.65,
          marginBottom: 'clamp(36px, 5vw, 56px)',
        }}>
          RepoSignal pulls real signals from GitHub, Reddit, Hacker News, and Google Trends
          to tell you if your traction is real — and exactly who to reach next.
        </p>

        {/* CTAs */}
        <div style={{ maxWidth: 540 }}>
          <RepoInput />
          <div style={{ marginTop: 16 }}>
            <a
              href="/competitor"
              style={{
                fontFamily: 'var(--font-ibm-plex-mono)',
                fontSize: 12,
                color: 'var(--ink-muted)',
                textDecoration: 'none',
                letterSpacing: '0.02em',
                borderBottom: '1px solid var(--border)',
                paddingBottom: 1,
                transition: 'color 0.15s, border-color 0.15s',
              }}
            >
              or learn from a successful launch →
            </a>
          </div>
        </div>
      </section>

      {/* ── Rule ── */}
      <div style={{ borderTop: '1px solid var(--border)', maxWidth: 1040, margin: '0 auto', width: '100%' }} />

      {/* ── Problem statement ── */}
      <section className="problem-grid" style={{
        padding: 'clamp(32px, 6vw, 72px) clamp(16px, 5vw, 32px)',
        maxWidth: 1040,
        margin: '0 auto',
        width: '100%',
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: 'clamp(24px, 4vw, 64px)',
        alignItems: 'start',
      }}>
        <div>
          <div className="badge" style={{ marginBottom: 20 }}>The problem</div>
          <p
            className="display"
            style={{
              fontSize: 'clamp(22px, 3vw, 36px)',
              lineHeight: 1.25,
              letterSpacing: '-0.02em',
              color: 'var(--ink)',
            }}
          >
            Developers ship, get stars, get upvotes — and still have no idea if anyone genuinely cares or how to reach the people who do.
          </p>
        </div>
        <div style={{ paddingTop: 40 }}>
          <p style={{ fontSize: 15, color: 'var(--ink-muted)', lineHeight: 1.75, marginBottom: 24 }}>
            That uncertainty is the product we solve.
          </p>
          <p style={{ fontSize: 15, color: 'var(--ink-muted)', lineHeight: 1.75 }}>
            Not guesses. Not AI hallucinations about who might care. Real signals — from the communities where your actual users are already talking.
          </p>
        </div>
      </section>

      {/* ── Rule ── */}
      <div style={{ borderTop: '1px solid var(--border)', maxWidth: 1040, margin: '0 auto', width: '100%' }} />

      {/* ── Social proof (stated truth) ── */}
      <section style={{
        padding: 'clamp(32px, 6vw, 72px) clamp(16px, 5vw, 32px)',
        maxWidth: 1040,
        margin: '0 auto',
        width: '100%',
      }}>
        <p
          className="display-italic"
          style={{
            fontSize: 'clamp(28px, 4vw, 52px)',
            lineHeight: 1.15,
            letterSpacing: '-0.025em',
            color: 'var(--ink)',
            maxWidth: '28ch',
          }}
        >
          Stars are not signal.{' '}
          <span style={{ color: 'var(--ink-muted)' }}>Upvotes are not validation.</span>{' '}
          RepoSignal shows you what actually is.
        </p>
      </section>

      {/* ── Rule ── */}
      <div style={{ borderTop: '1px solid var(--border)', maxWidth: 1040, margin: '0 auto', width: '100%' }} />

      {/* ── Email capture ── */}
      <section style={{
        padding: 'clamp(32px, 6vw, 72px) clamp(16px, 5vw, 32px) clamp(48px, 10vw, 120px)',
        maxWidth: 1040,
        margin: '0 auto',
        width: '100%',
      }}>
        <label
          className="mono"
          style={{
            display: 'block',
            fontSize: 11,
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
            color: 'var(--ink-muted)',
            marginBottom: 16,
          }}
        >
          Get early access — we&apos;ll tell you when it&apos;s ready.
        </label>
        <form style={{ display: 'flex', maxWidth: 480 }}>
          <div className="repo-input-wrap" style={{ flex: 1 }}>
            <input
              type="email"
              placeholder="you@example.com"
              className="repo-input-field"
              style={{ fontSize: 13 }}
            />
            <button type="submit" className="repo-submit">
              Notify me
            </button>
          </div>
        </form>
      </section>

    </main>
  )
}
