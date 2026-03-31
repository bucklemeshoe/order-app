"use client"

import Script from 'next/script'
import { usePathname } from 'next/navigation'

export function WhatsAppWidget() {
  const pathname = usePathname()
  
  // Hide on admin backend, order PWA, and auth routes
  const isHidden = pathname?.startsWith('/admin') || pathname?.startsWith('/order') || pathname?.startsWith('/auth')

  if (isHidden) {
    // Force-hide any Elfsight-injected elements via CSS (the external script may inject DOM after React unmount)
    return (
      <style>{`
        .elfsight-app-04bb6332-b43b-4085-8938-cf931886c598,
        [class*="elfsight"] { display: none !important; }
      `}</style>
    )
  }

  return (
    <>
      {/* Elfsight WhatsApp Chat | OrderApp Whatsapp */}
      <Script src="https://elfsightcdn.com/platform.js" strategy="lazyOnload" />
      <div className="elfsight-app-04bb6332-b43b-4085-8938-cf931886c598" data-elfsight-app-lazy></div>
    </>
  )
}
