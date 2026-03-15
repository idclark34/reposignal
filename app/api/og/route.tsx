// app/api/og/route.tsx
import { ImageResponse } from 'next/og'
import { NextRequest } from 'next/server'

export const runtime = 'edge'

const companies = [
  {
    slug: 'resend',
    name: 'Resend',
    move: 'Shipped OSS tool before the paid API',
    tag: '0 → 10k in 48hrs',
  },
  {
    slug: 'notion',
    name: 'Notion',
    move: 'Stayed in private beta for 2 years',
    tag: 'Demand through scarcity',
  },
  {
    slug: 'linear',
    name: 'Linear',
    move: 'Waitlist driven by design screenshots alone',
    tag: 'Product as marketing',
  },
  {
    slug: 'rewind',
    name: 'Rewind',
    move: 'Launched with a single viral demo video',
    tag: '1M views before launch',
  },
]

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const slug = searchParams.get('company')

  const featured = companies.find((c) => c.slug === slug)
  const grid = featured
    ? [featured, ...companies.filter((c) => c.slug !== slug).slice(0, 2)]
    : companies.slice(0, 3)

  return new ImageResponse(
    (
      <div
        style={{
          width: '1200px',
          height: '630px',
          background: '#f0ede8',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          padding: '52px 64px',
          fontFamily: 'sans-serif',
        }}
      >
        {/* Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '32px' }}>
          <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#6366f1' }} />
          <span style={{ fontSize: '14px', fontWeight: 600, color: '#999', letterSpacing: '0.04em' }}>
            ForkPulse
          </span>
        </div>

        {/* Headline */}
        <div style={{ display: 'flex', flexDirection: 'column', marginBottom: '40px' }}>
          <span style={{ fontSize: '80px', fontWeight: 800, color: '#111', lineHeight: 1.05, letterSpacing: '-0.03em' }}>
            The moves that built
          </span>
          <span style={{ fontSize: '80px', fontWeight: 800, color: '#6366f1', lineHeight: 1.05, letterSpacing: '-0.03em' }}>
            real products.
          </span>
        </div>

        {/* Cards */}
        <div style={{ display: 'flex', gap: '16px' }}>
          {grid.map((company) => (
            <div
              key={company.slug}
              style={{
                flex: 1,
                background: '#ffffff',
                border: '1px solid #e2e2e2',
                borderRadius: '12px',
                padding: '20px 22px',
                display: 'flex',
                flexDirection: 'column',
                gap: '6px',
              }}
            >
              <span style={{ fontSize: '18px', fontWeight: 700, color: '#111' }}>
                {company.name}
              </span>
              <span style={{ fontSize: '15px', color: '#666', lineHeight: 1.4 }}>
                {company.move}
              </span>
              <span style={{ fontSize: '14px', color: '#6366f1', fontWeight: 600, marginTop: '4px' }}>
                {company.tag}
              </span>
            </div>
          ))}
        </div>
      </div>
    ),
    { width: 1200, height: 630 }
  )
}
