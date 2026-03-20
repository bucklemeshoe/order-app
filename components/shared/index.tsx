"use client"

import type React from "react"
import { cn } from "@/lib/utils"
import { STATUS_CONFIG } from "@/lib/theme"

export function IconButton({
  children,
  onClick,
  ariaLabel,
}: {
  children: React.ReactNode
  onClick?: () => void
  ariaLabel: string
}) {
  return (
    <button
      className={cn(
        "h-9 w-9 rounded-md border flex items-center justify-center",
        "bg-white hover:bg-neutral-50 transition-colors",
        "border-neutral-300 text-neutral-900"
      )}
      aria-label={ariaLabel}
      onClick={onClick}
    >
      {children}
    </button>
  )
}

export function Row({ label, value }: { label: React.ReactNode; value: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between text-sm">
      <div className="text-neutral-700">{label}</div>
      <div className="text-neutral-900">{value}</div>
    </div>
  )
}

export function StatusBadge({ status }: { status: string }) {
  const cfg = STATUS_CONFIG[status] || STATUS_CONFIG.pending
  return (
    <span
      className={cn(
        "px-2.5 py-1 rounded-full text-xs font-medium border",
        cfg.color,
        cfg.bg,
        cfg.border
      )}
    >
      {cfg.label}
    </span>
  )
}

export function EmptyState({
  icon,
  title,
  description,
  action,
}: {
  icon: React.ReactNode
  title: string
  description: string
  action?: React.ReactNode
}) {
  return (
    <div className="rounded-xl border p-8 text-center bg-white border-neutral-200">
      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-neutral-100 border border-neutral-200">
        {icon}
      </div>
      <div className="mt-4 text-lg font-semibold">{title}</div>
      <p className="mt-1 text-sm text-neutral-600">{description}</p>
      {action && <div className="mt-5">{action}</div>}
    </div>
  )
}

export function LoadingSpinner() {
  return (
    <div className="flex items-center justify-center py-12">
      <div className="h-8 w-8 animate-spin rounded-full border-4 border-neutral-200 border-t-brand" />
    </div>
  )
}
