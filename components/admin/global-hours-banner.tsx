"use client"

import { useEffect, useState } from "react"
import { AlertCircle } from "lucide-react"
import type { WeeklyHours } from "@/types"

import { getWeeklyHours } from "@/lib/api/settings"

export function GlobalHoursBanner() {
  const [weeklyHours, setWeeklyHours] = useState<WeeklyHours | null>(null)
  const [isOutsideHours, setIsOutsideHours] = useState(false)
  const [nextOpenLabel, setNextOpenLabel] = useState<string>("")

  // Fetch settings
  useEffect(() => {
    async function init() {
      try {
        const wh = await getWeeklyHours()
        if (wh) {
          console.log("[GlobalHoursBanner] weekly hours =>", wh)
          setWeeklyHours(wh)
        }
      } catch (err) {
        console.error("Failed to load hours for banner", err)
      }
    }
    init()
  }, [])

  function computeHoursState(wh: WeeklyHours) {
    const dayKeys: (keyof WeeklyHours)[] = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"]
    const dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]
    const now = new Date()
    const todayKey = dayKeys[now.getDay()]
    const todayHours = wh[todayKey]

    if (!todayHours || todayHours.open === "closed" || todayHours.close === "closed") {
      setIsOutsideHours(true)
      // Find next open day
      for (let i = 1; i <= 7; i++) {
        const nextIndex = (now.getDay() + i) % 7
        const nextH = wh[dayKeys[nextIndex]]
        if (nextH && nextH.open !== "closed") {
          setNextOpenLabel(`${dayNames[nextIndex]} at ${nextH.open}`)
          return
        }
      }
      setNextOpenLabel("")
      return
    }

    const [oh, om] = todayHours.open.split(":").map(Number)
    const [ch, cm] = todayHours.close.split(":").map(Number)
    const openMin = oh * 60 + om
    const closeMin = ch * 60 + cm
    const nowMin = now.getHours() * 60 + now.getMinutes()

    if (nowMin < openMin || nowMin >= closeMin) {
      setIsOutsideHours(true)
      if (nowMin < openMin) {
        setNextOpenLabel(`Today at ${todayHours.open}`)
      } else {
        // Past close, find tomorrow
        for (let i = 1; i <= 7; i++) {
          const nextIndex = (now.getDay() + i) % 7
          const nextH = wh[dayKeys[nextIndex]]
          if (nextH && nextH.open !== "closed") {
            setNextOpenLabel(`${dayNames[nextIndex]} at ${nextH.open}`)
            return
          }
        }
      }
    } else {
      setIsOutsideHours(false)
    }
  }

  // Recompute every minute
  useEffect(() => {
    if (!weeklyHours) return
    computeHoursState(weeklyHours)
    const timer = setInterval(() => computeHoursState(weeklyHours), 60_000)
    return () => clearInterval(timer)
  }, [weeklyHours])

  // if (!isOutsideHours) return null

  if (!weeklyHours) {
    return (
      <div className="w-full bg-slate-500/10 border-b border-slate-500/20 px-4 py-2 flex items-center justify-center shrink-0 z-50">
        <span className="text-sm font-medium text-slate-800 dark:text-slate-400 truncate animate-pulse">
          Syncing operating status...
        </span>
      </div>
    )
  }

  if (isOutsideHours) {
    return (
      <div className="w-full bg-amber-500/15 border-b border-amber-500/20 px-4 py-2 flex items-center justify-center shrink-0 z-50">
        <AlertCircle className="h-4 w-4 text-amber-600 dark:text-amber-500 mr-2 shrink-0" />
        <span className="text-sm font-medium text-amber-800 dark:text-amber-400 truncate">
          The store is currently closed. {nextOpenLabel ? `Opens next: ${nextOpenLabel}.` : ""}
        </span>
      </div>
    )
  }

  return (
    <div className="w-full bg-emerald-500/10 border-b border-emerald-500/20 px-4 py-2 flex items-center justify-center shrink-0 z-50">
      <div className="h-2 w-2 rounded-full bg-emerald-500 mr-2 shrink-0 animate-pulse" />
      <span className="text-sm font-medium text-emerald-800 dark:text-emerald-400 truncate">
        The store is open and accepting orders.
      </span>
    </div>
  )
}
