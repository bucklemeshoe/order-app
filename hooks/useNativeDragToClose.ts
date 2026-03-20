"use client"

import { useCallback, useRef, useState, useEffect } from 'react'

interface NativeDragToCloseOptions {
  onClose: () => void
  threshold?: number
  enabled?: boolean
}

export function useNativeDragToClose({
  onClose,
  threshold = 100,
  enabled = true
}: NativeDragToCloseOptions) {
  const [dragDistance, setDragDistance] = useState(0)
  const startY = useRef(0)
  const isDragging = useRef(false)
  const elementRef = useRef<HTMLDivElement>(null)

  const handleTouchStart = useCallback((e: TouchEvent) => {
    if (!enabled || e.touches.length !== 1) return
    
    startY.current = e.touches[0].clientY
    isDragging.current = true
    setDragDistance(0)
  }, [enabled])

  const handleTouchMove = useCallback((e: TouchEvent) => {
    if (!enabled || !isDragging.current || e.touches.length !== 1) return
    
    const currentY = e.touches[0].clientY
    const distance = Math.max(0, currentY - startY.current)
    setDragDistance(distance)
    
    // Only prevent default when actually dragging down significantly
    if (distance > 20) {
      e.preventDefault()
    }
  }, [enabled])

  const handleTouchEnd = useCallback(() => {
    if (!enabled || !isDragging.current) return
    
    if (dragDistance > threshold) {
      onClose()
    }
    
    setDragDistance(0)
    isDragging.current = false
  }, [enabled, dragDistance, threshold, onClose])

  // Use native event listeners to avoid React's passive event limitation
  useEffect(() => {
    const element = elementRef.current
    if (!element || !enabled) return

    element.addEventListener('touchstart', handleTouchStart, { passive: false })
    element.addEventListener('touchmove', handleTouchMove, { passive: false })
    element.addEventListener('touchend', handleTouchEnd, { passive: false })

    return () => {
      element.removeEventListener('touchstart', handleTouchStart)
      element.removeEventListener('touchmove', handleTouchMove)
      element.removeEventListener('touchend', handleTouchEnd)
    }
  }, [enabled, handleTouchStart, handleTouchMove, handleTouchEnd])

  return {
    elementRef,
    dragDistance,
    isDragging: isDragging.current
  }
}
