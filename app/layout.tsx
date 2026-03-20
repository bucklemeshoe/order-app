import type { Metadata, Viewport } from 'next'
import { GeistMono } from 'geist/font/mono'
import { Poppins } from 'next/font/google'
import './globals.css'
import { Toaster } from '@/components/ui/toaster'
import { PWAOptimizer } from '@/components/PWAOptimizer'

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
  title: 'O App - Order & Delivery',
  description: 'Order your favorite items and track your orders in real-time',
  generator: 'O App',
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'O App',
  },
  icons: {
    icon: '/favicon.ico',
    apple: '/O_App_logo_transparent.png',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${poppins.variable}`}>
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
      </body>
    </html>
  )
}
