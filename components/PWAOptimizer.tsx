"use client"

import { useEffect } from 'react'
import { usePathname } from 'next/navigation'

export function PWAOptimizer() {
  const pathname = usePathname()
  const isAdmin = pathname?.startsWith('/admin')

  useEffect(() => {
    // Skip all PWA optimizations on admin pages
    if (isAdmin) return

    // Add pwa-mobile class to body for customer pages
    document.body.classList.add('pwa-mobile')

    // Disable mouse wheel scrolling for PWA
    function disableMouseWheel(e: WheelEvent) {
      if (e.type === 'wheel') {
        e.preventDefault()
        e.stopPropagation()
        return false
      }
    }
    
    // Disable context menu on mobile
    function disableContextMenu(e: Event) {
      e.preventDefault()
      return false
    }
    
    // Disable drag and drop
    function disableDragDrop(e: Event) {
      e.preventDefault()
      return false
    }
    
    document.addEventListener('wheel', disableMouseWheel, { passive: false })
    document.addEventListener('contextmenu', disableContextMenu)
    document.addEventListener('dragstart', disableDragDrop)
    document.addEventListener('drop', disableDragDrop)
    
    // Prevent zoom on double tap (iOS)
    let lastTouchEnd = 0
    function preventDoubleTabZoom(event: TouchEvent) {
      const now = new Date().getTime()
      if (now - lastTouchEnd <= 300) {
        event.preventDefault()
      }
      lastTouchEnd = now
    }
    document.addEventListener('touchend', preventDoubleTabZoom, false)
    
    // Service Worker Registration
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js')
        .then(function(registration) {
          console.log('SW registered: ', registration)
        })
        .catch(function(registrationError) {
          console.log('SW registration failed: ', registrationError)
        })
    }
    
    return () => {
      document.body.classList.remove('pwa-mobile')
      document.removeEventListener('wheel', disableMouseWheel)
      document.removeEventListener('contextmenu', disableContextMenu)
      document.removeEventListener('dragstart', disableDragDrop)
      document.removeEventListener('drop', disableDragDrop)
      document.removeEventListener('touchend', preventDoubleTabZoom)
    }
  }, [isAdmin])

  return null
}
