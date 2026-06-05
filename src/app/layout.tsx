import type { Metadata } from 'next'
import { Anton, Archivo, Cormorant } from 'next/font/google'
import { Analytics } from '@vercel/analytics/react'
import { SpeedInsights } from '@vercel/speed-insights/next'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import './globals.css'

const anton = Anton({ weight: '400', subsets: ['latin'], variable: '--font-anton' })
const archivo = Archivo({
  subsets: ['latin'],
  variable: '--font-archivo',
  weight: ['400', '500', '600', '700', '800'],
})
const cormorant = Cormorant({
  subsets: ['latin'],
  variable: '--font-cormorant',
  weight: ['400', '500', '600'],
  style: ['normal', 'italic'],
})

export const metadata: Metadata = {
  metadataBase: new URL('https://www.meatfreaks.co.uk'),
  title: {
    default: 'Meat Freaks — UK-Wide BBQ Event Catering',
    template: '%s · Meat Freaks',
  },
  description:
    'Real fire, real smoke, low & slow BBQ catering for festivals, weddings, corporate events and parties across the UK.',
  openGraph: {
    type: 'website',
    locale: 'en_GB',
    url: 'https://www.meatfreaks.co.uk',
    siteName: 'Meat Freaks',
    images: [{ url: '/assets/cook-smoke.jpg', width: 1200, height: 630 }],
  },
  twitter: { card: 'summary_large_image' },
  icons: { icon: '/assets/favicon.png' },
}

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'FoodEstablishment',
  name: 'Meat Freaks',
  description: 'UK-wide BBQ event catering',
  url: 'https://www.meatfreaks.co.uk',
  telephone: '07916635610',
  email: 'meatfreaksltd@gmail.com',
  areaServed: 'GB',
  sameAs: ['https://www.instagram.com/meatfreaks1/'],
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-GB" className={`${anton.variable} ${archivo.variable} ${cormorant.variable}`}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body>
        <Header />
        {children}
        <Footer />
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  )
}
