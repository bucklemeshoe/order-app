"use client"

import React, { useState, ReactNode } from "react"
import { RefreshCw } from "lucide-react"

interface PullToRefreshProps {
  children: ReactNode
  onRefresh: () => Promise<void> | void
  disabled?: boolean
  threshold?: number
  className?: string
}

export function PullToRefresh({ 
  children, 
  onRefresh, 
  disabled = false, 
  threshold = 100,
  className = ""
}: PullToRefreshProps) {
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [pullDistance, setPullDistance] = useState(0)
  const [startY, setStartY] = useState(0)
  const [isPulling, setIsPulling] = useState(false)

  const handleTouchStart = (e: React.TouchEvent) => {
    if (disabled || isRefreshing) return
    
    setStartY(e.touches[0].clientY)
    setIsPulling(true)
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isPulling || disabled || isRefreshing) return
    
    const currentY = e.touches[0].clientY
    const distance = Math.max(0, currentY - startY)
    setPullDistance(distance)
  }

  const handleTouchEnd = async () => {
    if (disabled || isRefreshing) return
    
    if (pullDistance > threshold) {
      setIsRefreshing(true)
      try {
        await onRefresh()
      } catch (error) {
        console.error('Pull to refresh failed:', error)
      } finally {
        setIsRefreshing(false)
      }
    }
    
    setPullDistance(0)
    setIsPulling(false)
  }

  return (
    <div
      className={className}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      style={{
        transform: `translateY(${Math.min(pullDistance, threshold)}px)`,
        transition: pullDistance === 0 ? 'transform 0.3s ease-out' : 'none'
      }}
    >
      {/* Pull to refresh indicator */}
      {pullDistance > 0 && (
        <div 
          className="flex items-center justify-center py-3 -mt-4 mb-4"
          style={{ 
            opacity: Math.min(pullDistance / threshold, 1)
          }}
        >
          {pullDistance > threshold ? (
            <div className="flex items-center gap-2 text-green-600 font-medium">
              <RefreshCw className="h-5 w-5 animate-spin" />
              Release to refresh
            </div>
          ) : (
            <div className="flex items-center gap-2 text-neutral-600">
              <RefreshCw className="h-5 w-5" />
              Pull to refresh
            </div>
          )}
        </div>
      )}

      {children}
    </div>
  )
}
