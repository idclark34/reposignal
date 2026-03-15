import type { Metadata } from 'next'

interface Props {
  params: Promise<{ owner: string; repo: string }>
  children: React.ReactNode
}

export async function generateMetadata({ params }: Omit<Props, 'children'>): Promise<Metadata> {
  const { owner, repo } = await params
  const title = `${owner}/${repo} — ForkPulse`
  const description = `Marketing intelligence report for ${owner}/${repo}. See who wants this project and how to reach them.`

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: [{ url: '/api/og', width: 1200, height: 630 }],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: ['/api/og'],
    },
  }
}

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
