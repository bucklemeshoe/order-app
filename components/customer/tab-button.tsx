"use client"

import type React from "react"
import { cn } from "@/lib/utils"

export function TabButton({
  label,
  icon,
  active,
  onClick,
  badge,
}: {
  label: string
  icon: React.ReactNode
  active?: boolean
  onClick: () => void
  badge?: number
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "relative inline-flex flex-col items-center justify-center gap-1.5 py-2",
        "text-neutral-400 hover:text-neutral-200 transition-all duration-200 active:scale-95",
        "min-h-[56px]",
        active && "text-white"
      )}
      aria-pressed={!!active}
      aria-current={active ? "page" : undefined}
    >
      <div className="relative">
        <div className={cn("transition-transform duration-200", active && "scale-110")}>
          {icon}
        </div>
        {badge ? (
          <span className="absolute -top-1.5 -right-1.5 h-5 min-w-5 px-1 rounded-full text-[10px] font-semibold text-white bg-brand flex items-center justify-center">
            {badge}
          </span>
        ) : null}
      </div>
      <span className={cn("text-[11px] font-medium transition-all duration-200", active && "font-semibold")}>
        {label}
      </span>
      <span
        className={cn(
          "absolute -bottom-0 left-1/2 -translate-x-1/2 h-1 w-8 rounded-full transition-all duration-200",
          active ? "bg-brand" : "bg-transparent"
        )}
        aria-hidden="true"
      />
    </button>
  )
}
