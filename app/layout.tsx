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
  title: 'ForkPulse',
  description: 'Marketing intelligence from your GitHub repository.',
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
