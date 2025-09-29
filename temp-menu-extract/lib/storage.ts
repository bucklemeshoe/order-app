"use client"

import type { MenuItem } from "@/types/menu"
import { seedItems, dummyImages } from "./data"

const KEY = "coffee-menu-items-v2"

function backfillFirstFiveImages(items: MenuItem[]): MenuItem[] {
  const next = items.map((it, idx) => {
    if (idx < dummyImages.length && (!it.imageUrl || it.imageUrl.trim() === "")) {
      return { ...it, imageUrl: dummyImages[idx] }
    }
    return it
  })
  return next
}

function backfillPositions(items: MenuItem[]): MenuItem[] {
  const byCat = new Map<string, number>()
  return items.map((it) => {
    if (typeof it.position === "number") return it
    const n = byCat.get(it.category) ?? 0
    byCat.set(it.category, n + 1)
    return { ...it, position: n }
  })
}

export function loadItems(): MenuItem[] {
  if (typeof window === "undefined") return backfillPositions(backfillFirstFiveImages(seedItems))
  try {
    const raw = window.localStorage.getItem(KEY)
    if (!raw) {
      const initial = backfillPositions(backfillFirstFiveImages(seedItems))
      window.localStorage.setItem(KEY, JSON.stringify(initial))
      return initial
    }
    const parsed = JSON.parse(raw) as MenuItem[]
    const withImages = backfillFirstFiveImages(Array.isArray(parsed) ? parsed : seedItems)
    const withPositions = backfillPositions(withImages)
    // persist any backfills so they stick
    if (JSON.stringify(withPositions) !== raw) {
      window.localStorage.setItem(KEY, JSON.stringify(withPositions))
    }
    return withPositions
  } catch {
    return backfillPositions(backfillFirstFiveImages(seedItems))
  }
}

export function saveItems(items: MenuItem[]) {
  if (typeof window === "undefined") return
  try {
    window.localStorage.setItem(KEY, JSON.stringify(items))
  } catch {
    // ignore
  }
}

/**
 * Reorder helper:
 * - orderedIds: array of item ids in the desired order for the current filtered view
 * - baseItems: all items
 * We update the position per-category based on the order in orderedIds.
 */
export function applyReorderByIds(baseItems: MenuItem[], orderedIds: string[]): MenuItem[] {
  const idToItem = new Map(baseItems.map((i) => [i.id, i] as const))
  // Build per-category new order from the orderedIds sequence
  const perCatOrder = new Map<string, string[]>()
  for (const id of orderedIds) {
    const it = idToItem.get(id)
    if (!it) continue
    const arr = perCatOrder.get(it.category) ?? []
    arr.push(id)
    perCatOrder.set(it.category, arr)
  }
  // Create updated items with new positions for those categories
  const updated = baseItems.map((it) => {
    const arr = perCatOrder.get(it.category)
    if (!arr) return it
    const idx = arr.indexOf(it.id)
    if (idx === -1) return it
    return { ...it, position: idx }
  })
  return updated
}
