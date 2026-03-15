export interface OGCompany {
  slug: string
  name: string
  keyMove: string
  growthTag: string
}

export const OG_COMPANIES: OGCompany[] = [
  {
    slug: 'resend',
    name: 'Resend',
    keyMove: 'Shipped OSS tool before the paid API',
    growthTag: '0 → 10k in 48hrs',
  },
  {
    slug: 'notion',
    name: 'Notion',
    keyMove: 'Stayed in private beta for 2 years',
    growthTag: 'Demand through scarcity',
  },
  {
    slug: 'linear',
    name: 'Linear',
    keyMove: 'Waitlist driven by design screenshots alone',
    growthTag: 'Product as marketing',
  },
  {
    slug: 'rewind',
    name: 'Rewind',
    keyMove: 'Launched with a single viral demo video',
    growthTag: '1M views before launch',
  },
]

const DEFAULT_SLUGS = ['resend', 'notion', 'linear']

/**
 * Returns 3 companies for the OG image grid.
 * If a valid slug is provided, that company appears first.
 */
export function getDisplayCompanies(slug?: string | null): OGCompany[] {
  const featured = slug ? OG_COMPANIES.find(c => c.slug === slug) : null
  if (!featured) {
    return DEFAULT_SLUGS.map(s => OG_COMPANIES.find(c => c.slug === s)!)
  }
  const rest = DEFAULT_SLUGS.filter(s => s !== slug)
  return [featured, ...rest.map(s => OG_COMPANIES.find(c => c.slug === s)!)]
}
