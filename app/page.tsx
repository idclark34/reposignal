import RepoInput from '@/components/RepoInput'

const EXAMPLES = [
  ['vercel', 'next.js'],
  ['supabase', 'supabase'],
  ['trpc', 'trpc'],
  ['shadcn-ui', 'ui'],
]

export default function Home() {
  return (
    <main style={{ background: 'var(--bg)', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>

      {/* ── Top bar ── */}
      <header style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '16px 32px',
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
        flex: 1,
        display: 'grid',
        gridTemplateColumns: '1fr',
        alignItems: 'center',
        padding: '40px 32px 0',
      }}>
        <div style={{ maxWidth: 960, margin: '0 auto', width: '100%' }}>

          {/* The big heading — dominates mobile */}
          <h1
            className="display-italic"
            style={{
              fontSize: 'clamp(64px, 11vw, 120px)',
              lineHeight: 0.93,
              letterSpacing: '-0.03em',
              color: 'var(--ink)',
              marginBottom: 'clamp(32px, 5vw, 56px)',
              maxWidth: '14ch',
            }}
          >
            Marketing
            <br />
            intelligence
            <br />
            <span style={{ color: 'var(--accent)' }}>from real</span>
            <br />
            data.
          </h1>

          {/* Sub-copy */}
          <p style={{
            fontSize: 16,
            color: 'var(--ink-muted)',
            maxWidth: 440,
            lineHeight: 1.65,
            marginBottom: 32,
          }}>
            Drop any GitHub repo. We pull signals from GitHub, Reddit, Hacker News,
            and Google Trends — then produce grounded recommendations. No hallucinations.
          </p>

          {/* Input */}
          <div style={{ maxWidth: 520, marginBottom: 32 }}>
            <RepoInput />
          </div>

          {/* Examples */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap' }}>
            <span className="mono" style={{ fontSize: 10, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--ink-faint)' }}>
              Try →
            </span>
            {EXAMPLES.map(([owner, name]) => (
              <a
                key={`${owner}/${name}`}
                href={`/dashboard/${owner}/${name}`}
                className="mono"
                style={{
                  fontSize: 12,
                  color: 'var(--ink-muted)',
                  textDecoration: 'none',
                  borderBottom: '1px solid var(--border)',
                  paddingBottom: 2,
                  transition: 'color 0.15s, border-color 0.15s',
                }}
                onMouseEnter={undefined}
              >
                {owner}/{name}
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* ── Data source strip ── */}
      <footer style={{
        borderTop: '1px solid var(--border)',
        display: 'grid',
        gridTemplateColumns: 'repeat(4, 1fr)',
        marginTop: 64,
      }}>
        {[
          { src: 'GitHub API',      desc: 'Repo metadata, commits, issues, README' },
          { src: 'Reddit API',      desc: 'Community discussions + pain phrases' },
          { src: 'HN Algolia',      desc: 'Stories, Show HN, comment themes' },
          { src: 'Google Trends',   desc: 'Search interest + related queries' },
        ].map((item, i) => (
          <div
            key={item.src}
            style={{
              padding: '24px 24px',
              borderRight: i < 3 ? '1px solid var(--border)' : 'none',
            }}
          >
            <div className="badge" style={{ marginBottom: 8 }}>{item.src}</div>
            <p style={{ fontSize: 12, color: 'var(--ink-muted)', lineHeight: 1.5 }}>{item.desc}</p>
          </div>
        ))}
      </footer>
    </main>
  )
}
