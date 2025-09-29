import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export type CartItem = {
  id: string;
  name: string;
  price: number;
  quantity: number;
  notes?: string;
  variant?: {
    id: string;
    name: string;
    price: number;
  };
  extras?: Array<{
    id: string;
    name: string;
    price: number;
  }>;
}

type CartState = {
  items: CartItem[]
  add: (item: Omit<CartItem, 'quantity'> | CartItem, quantity?: number) => void
  remove: (id: string) => void
  removeByIndex: (index: number) => void
  updateQty: (id: string, quantity: number) => void
  updateQtyByIndex: (index: number, quantity: number) => void
  clear: () => void
}

export const useCartStore = create<CartState>()(
  persist(
    (set) => ({
      items: [],
      add: (item, quantity) =>
        set((state) => {
          const qtyToAdd = quantity ?? ('quantity' in item ? item.quantity : 1)
          
          // Create a unique identifier that includes variant and extras
          const itemKey = `${item.id}-${item.variant?.id || 'no-variant'}-${(item.extras || []).map(e => e.id).sort().join(',')}`
          const existing = state.items.find((i) => {
            const existingKey = `${i.id}-${i.variant?.id || 'no-variant'}-${(i.extras || []).map(e => e.id).sort().join(',')}`
            return existingKey === itemKey
          })
          
          if (existing) {
            return {
              items: state.items.map((i) => {
                const existingKey = `${i.id}-${i.variant?.id || 'no-variant'}-${(i.extras || []).map(e => e.id).sort().join(',')}`
                return existingKey === itemKey ? { ...i, quantity: i.quantity + qtyToAdd } : i
              }),
            }
          }
          const { quantity: _, ...itemWithoutQuantity } = item as CartItem
          return { items: [...state.items, { ...itemWithoutQuantity, quantity: qtyToAdd }] }
        }),
      remove: (id) => set((state) => ({ items: state.items.filter((i) => i.id !== id) })),
      removeByIndex: (index) => set((state) => ({ 
        items: state.items.filter((_, i) => i !== index) 
      })),
      updateQty: (id, quantity) =>
        set((state) => ({ items: state.items.map((i) => (i.id === id ? { ...i, quantity } : i)) })),
      updateQtyByIndex: (index, quantity) =>
        set((state) => ({ 
          items: state.items.map((item, i) => i === index ? { ...item, quantity } : item) 
        })),
      clear: () => set({ items: [] }),
    }),
    { name: 'cart' },
  ),
)

