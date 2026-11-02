import type { Metadata } from 'next'
import { Inter, Instrument_Serif, JetBrains_Mono, Playfair_Display } from 'next/font/google'
import { Analytics } from '@/components/Analytics'
import './globals.css'
import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import { StarCursor } from '@/components/StarCursor'
import { siteConfig } from '@/lib/config'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })
const display = Instrument_Serif({ weight: '400', style: ['normal', 'italic'], subsets: ['latin'], variable: '--font-display' })
const mono = JetBrains_Mono({ weight: ['400', '500'], subsets: ['latin'], variable: '--font-mono' })
const playfair = Playfair_Display({ weight: ['700'], style: ['normal', 'italic'], subsets: ['latin'], variable: '--font-playfair' })


export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: siteConfig.title,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: siteConfig.url,
    title: siteConfig.title,
    description: siteConfig.description,
    siteName: siteConfig.name,
    images: [{ url: '/opengraph-image', width: 1200, height: 630, alt: siteConfig.title }],
  },
  twitter: {
    card: 'summary_large_image',
    images: ['/opengraph-image'],
    title: siteConfig.title,
    description: siteConfig.description,
  },
  robots: {
    index: true,
    follow: true,
  },
  icons: {
    icon: '/favicon.png',
    apple: '/favicon.png',
  },
}

const personSchema = {
  '@context': 'https://schema.org',
  '@type': 'Person',
  name: siteConfig.name,
  jobTitle: 'Design Engineer',
  description: siteConfig.description,
  url: siteConfig.url,
  alumniOf: {
    '@type': 'CollegeOrUniversity',
    name: 'University of Washington',
  },
  knowsAbout: [
    'Design Engineering',
    'AI-native products',
    'Interaction Design',
    'Design Systems',
    'React',
    'TypeScript',
    'React Native',
  ],
  sameAs: [siteConfig.linkedin, siteConfig.medium, siteConfig.twitter],
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${display.variable} ${mono.variable} ${playfair.variable}`}
    >
      <body className="min-h-screen bg-background font-sans antialiased">
        <Analytics />
        {/* Person schema — plain script so it ships in the server-rendered HTML */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema) }}
        />
        <StarCursor />
        <div className="relative flex min-h-screen flex-col">
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
        </div>
      </body>
    </html>
  )
}
