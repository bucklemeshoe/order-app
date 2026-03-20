"use client"

import { useCallback, useRef } from 'react'

interface SwipeGestureOptions {
  onSwipeLeft?: () => void
  onSwipeRight?: () => void
  onSwipeUp?: () => void
  onSwipeDown?: () => void
  threshold?: number
  preventDefault?: boolean
}

export function useSwipeGesture({
  onSwipeLeft,
  onSwipeRight,
  onSwipeUp,
  onSwipeDown,
  threshold = 50,
  preventDefault = true
}: SwipeGestureOptions) {
  const startX = useRef(0)
  const startY = useRef(0)
  const isDragging = useRef(false)

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    if (e.touches.length !== 1) return
    
    // Check if the touch is on the header area (first 60px from top)
    const touchY = e.touches[0].clientY
    if (touchY < 60) {
      return // Don't handle swipe gestures on the header area
    }
    
    startX.current = e.touches[0].clientX
    startY.current = e.touches[0].clientY
    isDragging.current = true
  }, [])

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    if (!isDragging.current || e.touches.length !== 1) return
    
    if (preventDefault) {
      e.preventDefault()
    }
  }, [preventDefault])

  const handleTouchEnd = useCallback((e: React.TouchEvent) => {
    if (!isDragging.current || e.changedTouches.length !== 1) return
    
    const endX = e.changedTouches[0].clientX
    const endY = e.changedTouches[0].clientY
    
    const deltaX = endX - startX.current
    const deltaY = endY - startY.current
    
    const absDeltaX = Math.abs(deltaX)
    const absDeltaY = Math.abs(deltaY)
    
    // Only trigger if the swipe is more horizontal than vertical
    if (absDeltaX > absDeltaY && absDeltaX > threshold) {
      if (deltaX > 0 && onSwipeRight) {
        onSwipeRight()
      } else if (deltaX < 0 && onSwipeLeft) {
        onSwipeLeft()
      }
    } else if (absDeltaY > absDeltaX && absDeltaY > threshold) {
      if (deltaY > 0 && onSwipeDown) {
        onSwipeDown()
      } else if (deltaY < 0 && onSwipeUp) {
        onSwipeUp()
      }
    }
    
    isDragging.current = false
  }, [threshold, onSwipeLeft, onSwipeRight, onSwipeUp, onSwipeDown])

  return {
    onTouchStart: handleTouchStart,
    onTouchMove: handleTouchMove,
    onTouchEnd: handleTouchEnd
  }
}
