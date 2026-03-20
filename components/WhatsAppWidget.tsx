"use client"

import Script from 'next/script'
import { usePathname } from 'next/navigation'

export function WhatsAppWidget() {
  const pathname = usePathname()
  
  // Hide on admin backend and order PWA routes
  if (pathname?.startsWith('/admin') || pathname?.startsWith('/order')) {
    return null
  }

  return (
    <>
      {/* Elfsight WhatsApp Chat | OrderApp Whatsapp */}
      <Script src="https://elfsightcdn.com/platform.js" strategy="lazyOnload" />
      <div className="elfsight-app-04bb6332-b43b-4085-8938-cf931886c598" data-elfsight-app-lazy></div>
    </>
  )
}
