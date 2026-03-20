'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Button } from '@/components/ui/button'

export function HeaderAction() {
  const pathname = usePathname()
  
  // If we are already on the request-setup page, disable the button
  const isRequestSetup = pathname === '/request-setup'
  
  return (
    <Button 
      asChild={!isRequestSetup}
      disabled={isRequestSetup}
      className={`transition-all bg-zinc-900 text-white hover:bg-zinc-800 rounded-full font-medium px-6 py-5 shadow-sm ${!isRequestSetup ? 'active:scale-[0.98]' : ''}`}
    >
      {isRequestSetup ? (
        <span>Request Setup</span>
      ) : (
        <Link href="/request-setup">Request Setup</Link>
      )}
    </Button>
  )
}
