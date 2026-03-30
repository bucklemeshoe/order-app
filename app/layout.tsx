import type { Metadata, Viewport } from 'next'
import { GeistMono } from 'geist/font/mono'
import { Poppins } from 'next/font/google'
import './globals.css'
import { Toaster } from '@/components/ui/toaster'
import { PWAOptimizer } from '@/components/PWAOptimizer'
import Script from 'next/script'

const poppins = Poppins({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-sans',
  weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900'],
})

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: 'cover',
  themeColor: '#F83D60',
}

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'https://oapp.co.za'),
  title: {
    default: 'O.App | Your Own Restaurant Ordering System',
    template: '%s | O.App'
  },
  icons: {
    icon: [
      { url: '/oapp_favicon.png', sizes: 'any' },
      { url: '/icon-192.png', type: 'image/png', sizes: '192x192' },
      { url: '/icon-512.png', type: 'image/png', sizes: '512x512' }
    ],
    apple: [
      { url: '/apple-touch-icon.png', sizes: '180x180' }
    ]
  },
  description: 'Stop paying 30% commissions to delivery apps. Let your customers order online, pay securely, and choose delivery or collection from your own beautifully branded digital storefront.',
  keywords: ['restaurant ordering system', 'food delivery app', 'south africa', 'zero commission delivery', 'snapscan integration', 'yoco integration', 'digital menu', 'hospitality tech'],
  authors: [{ name: 'MakeFriendlyApps' }],
  creator: 'MakeFriendlyApps',
  publisher: 'O.App',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    title: 'O.App | Your Own Restaurant Ordering System',
    description: 'Stop paying 30% to delivery apps. Get a zero-commission ordering system built just for your food business.',
    url: '/',
    siteName: 'O.App',
    images: [
      {
        url: '/images/family-sharing-food.png',
        width: 1200,
        height: 630,
        alt: 'O.App Restaurant Ordering System',
      },
    ],
    locale: 'en_ZA',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'O.App | Zero Commission Restaurant Ordering',
    description: 'Stop paying 30% to delivery apps. Get a zero-commission ordering system built just for your business.',
    images: ['/images/family-sharing-food.png'],
    creator: '@MakeFriendlyApps',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  generator: 'O.App',
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'O.App',
  },

}

import { WhatsAppWidget } from '@/components/WhatsAppWidget'

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${poppins.variable} scroll-smooth`}>
      <head>
        <style>{`
html {
  font-family: ${poppins.style.fontFamily};
  --font-sans: ${poppins.style.fontFamily};
  --font-heading: ${poppins.style.fontFamily};
  --font-mono: ${GeistMono.variable};
}
        `}</style>
      </head>
      <body>
        <PWAOptimizer />
        {children}
        <Toaster />
        <WhatsAppWidget />
      </body>
    </html>
  )
}
