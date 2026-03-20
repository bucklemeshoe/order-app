"use client"

import { create } from "zustand"
import { persist } from "zustand/middleware"
import type { CartItem, Product, Variant, ExtrasMap } from "@/types"

interface CartState {
  items: CartItem[]
  addItem: (product: Product, qty: number, extras: string[], variant?: Variant | null) => void
  adjustQty: (index: number, delta: number) => void
  removeItem: (index: number) => void
  clearCart: () => void
}

function arraysEqual(a: string[], b: string[]): boolean {
  if (a.length !== b.length) return false
  const set = new Set(a)
  return b.every(x => set.has(x))
}

export const useCartStore = create<CartState>()(
  persist(
    (set) => ({
      items: [],

      addItem: (product, qty, extras, variant) => {
        set((state) => {
          const idx = state.items.findIndex(
            (x) =>
              x.product.id === product.id &&
              arraysEqual(x.extras, extras) &&
              x.variant?.id === (variant?.id ?? undefined)
          )
          if (idx > -1) {
            const copy = [...state.items]
            copy[idx] = { ...copy[idx], qty: copy[idx].qty + qty }
            return { items: copy }
          }
          return {
            items: [
              ...state.items,
              { product, qty, extras, variant: variant ?? undefined },
            ],
          }
        })
      },

      adjustQty: (index, delta) => {
        set((state) => {
          const newItems = [...state.items]
          if (newItems[index]) {
            newItems[index] = {
              ...newItems[index],
              qty: Math.max(1, newItems[index].qty + delta),
            }
          }
          return { items: newItems.filter((ci) => ci.qty > 0) }
        })
      },

      removeItem: (index) => {
        set((state) => ({
          items: state.items.filter((_, i) => i !== index),
        }))
      },

      clearCart: () => set({ items: [] }),
    }),
    {
      name: "order-app-cart",
    }
  )
)
