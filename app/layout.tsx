import type { Metadata } from 'next'
import { Geist } from 'next/font/google'
import { Plus_Jakarta_Sans } from 'next/font/google'
import { IBM_Plex_Mono } from 'next/font/google'
import './globals.css'
import Providers from './providers'

const geist = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
})

const jakarta = Plus_Jakarta_Sans({
  variable: '--font-jakarta',
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
})

const ibmPlexMono = IBM_Plex_Mono({
  variable: '--font-ibm-plex-mono',
  weight: ['300', '400', '500', '600'],
  subsets: ['latin'],
})

export const metadata: Metadata = {
  metadataBase: new URL('https://forkpulse.app'),
  title: 'ForkPulse — Find the audience for your GitHub repo',
  description: 'ForkPulse maps Reddit discussions, HN threads, and GitHub signals to show you exactly who wants your project — and where to reach them.',
  openGraph: {
    type: 'website',
    url: 'https://forkpulse.app',
    title: 'ForkPulse — Find the audience for your GitHub repo',
    description: 'ForkPulse maps Reddit discussions, HN threads, and GitHub signals to show you exactly who wants your project — and where to reach them.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ForkPulse — Find the audience for your GitHub repo',
    description: 'ForkPulse maps Reddit discussions, HN threads, and GitHub signals to show you exactly who wants your project — and where to reach them.',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${geist.variable} ${jakarta.variable} ${ibmPlexMono.variable}`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
