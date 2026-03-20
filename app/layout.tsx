import type { Metadata } from 'next'
import { GeistSans } from 'geist/font/sans'
import { GeistMono } from 'geist/font/mono'
import './globals.css'
import { Toaster } from '@/components/ui/toaster'
import { PWAOptimizer } from '@/components/PWAOptimizer'

export const metadata: Metadata = {
  title: 'O App - Order & Delivery',
  description: 'Order your favorite items and track your orders in real-time',
  generator: 'O App',
  manifest: '/manifest.json',
  themeColor: '#F83D60',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'O App',
  },
  icons: {
    icon: '/favicon.ico',
    apple: '/O_App_logo_transparent.png',
  },
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 1,
    userScalable: false,
    viewportFit: 'cover',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <head>
        <style>{`
html {
  font-family: ${GeistSans.style.fontFamily};
  --font-sans: ${GeistSans.variable};
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
