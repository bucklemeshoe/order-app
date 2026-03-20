"use client"

import { useCallback, useRef, useState } from 'react'

interface DragToCloseOptions {
  onClose: () => void
  threshold?: number
}

export function useDragToClose({
  onClose,
  threshold = 100
}: DragToCloseOptions) {
  const [dragDistance, setDragDistance] = useState(0)
  const startY = useRef(0)
  const isDragging = useRef(false)

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    if (e.touches.length !== 1) return
    
    startY.current = e.touches[0].clientY
    isDragging.current = true
    setDragDistance(0)
  }, [])

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    if (!isDragging.current || e.touches.length !== 1) return
    
    const currentY = e.touches[0].clientY
    const distance = Math.max(0, currentY - startY.current)
    setDragDistance(distance)
    
    // Don't call preventDefault - React touch events are passive
    // Let the browser handle scrolling naturally
  }, [])

  const handleTouchEnd = useCallback(() => {
    if (!isDragging.current) return
    
    if (dragDistance > threshold) {
      onClose()
    }
    
    setDragDistance(0)
    isDragging.current = false
  }, [dragDistance, threshold, onClose])

  return {
    onTouchStart: handleTouchStart,
    onTouchMove: handleTouchMove,
    onTouchEnd: handleTouchEnd,
    dragDistance,
    isDragging: isDragging.current
  }
}
