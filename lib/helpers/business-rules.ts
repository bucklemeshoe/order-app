// ── Business rules: tax, hours, order status ──

import type { WeeklyHours, OrderStep, OrderStatus, OrderType, CartItem, ExtrasMap } from "@/types"

const DAY_NAMES = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"] as const

/** Default tax rate (15% for South Africa) */
export const DEFAULT_TAX_RATE = 0.15

/** Calculate tax amount */
export function calculateTax(subtotal: number, taxRate: number = DEFAULT_TAX_RATE): number {
  return +(subtotal * taxRate).toFixed(2)
}

/** Calculate cart subtotal from cart items */
export function calculateSubtotal(items: CartItem[], extrasMap: ExtrasMap): number {
  return items.reduce((sum, item) => {
    const basePrice = item.variant?.price ?? item.product.price
    const extrasCost = item.extras.reduce((eSum, id) => {
      const extraName = Object.keys(extrasMap).find(name => extrasMap[name].id === id)
      const extra = extraName ? extrasMap[extraName] : null
      return extra ? eSum + extra.price : eSum
    }, 0)
    return sum + item.qty * (basePrice + extrasCost)
  }, 0)
}

/** Calculate full order totals (with optional delivery fee) */
export function calculateOrderTotals(
  items: CartItem[],
  extrasMap: ExtrasMap,
  taxRate: number = DEFAULT_TAX_RATE,
  deliveryFee: number = 0
) {
  const subtotal = calculateSubtotal(items, extrasMap)
  const tax = calculateTax(subtotal, taxRate)
  const total = +(subtotal + tax + deliveryFee).toFixed(2)
  return { subtotal, tax, total, deliveryFee }
}

/** Check if the store is currently open based on weekly hours config */
export function isBusinessOpen(weeklyHours: WeeklyHours | null | undefined): {
  isOpen: boolean
  closingTime: string | null
} {
  if (!weeklyHours) return { isOpen: true, closingTime: null }

  const now = new Date()
  const todayKey = DAY_NAMES[now.getDay()] as keyof WeeklyHours
  const todayHours = weeklyHours[todayKey]

  const isClosed = !todayHours || todayHours.open === "closed" || todayHours.close === "closed"
  if (isClosed) return { isOpen: false, closingTime: null }

  const currentHours = now.getHours().toString().padStart(2, "0")
  const currentMinutes = now.getMinutes().toString().padStart(2, "0")
  const currentTimeString = `${currentHours}:${currentMinutes}`

  const isOpen = currentTimeString >= todayHours.open && currentTimeString <= todayHours.close

  if (isOpen) {
    const time = new Date(`2000-01-01T${todayHours.close}:00`)
    const closingTime = time.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" })
    return { isOpen: true, closingTime }
  }

  return { isOpen: false, closingTime: null }
}

/** Map order status to pickup time offset in milliseconds */
export function getPickupTimeOffset(pickupTime: string): number {
  switch (pickupTime) {
    case "ASAP": return 15 * 60000
    case "30min": return 30 * 60000
    case "45min": return 45 * 60000
    default: return 0
  }
}

/** Convert pickup time selection to ISO string */
export function pickupTimeToISO(pickupTime: string): string {
  if (pickupTime === "ASAP" || pickupTime === "30min" || pickupTime === "45min") {
    return new Date(Date.now() + getPickupTimeOffset(pickupTime)).toISOString()
  }
  return new Date(pickupTime).toISOString()
}

/** Get order progress steps from a status + order type */
export function getOrderSteps(status: OrderStatus, orderType: OrderType = "collection"): OrderStep[] {
  const isDelivery = orderType === "delivery"

  const steps: OrderStep[] = [
    { name: "Order Received", description: "Your order has been received", status: "upcoming" },
    { name: "Preparing", description: "Your items are being prepared", status: "upcoming" },
    ...(isDelivery
      ? [
          { name: "Out for Delivery", description: "Your order is on the way", status: "upcoming" as const },
          { name: "Delivered", description: "Enjoy your order!", status: "upcoming" as const },
        ]
      : [
          { name: "Ready", description: "Your items are ready for collection", status: "upcoming" as const },
          { name: "Collected", description: "Enjoy your order!", status: "upcoming" as const },
        ]
    ),
  ]

  const completedStatus = isDelivery ? "delivered" : "collected"
  const stepMap: Record<string, number> = isDelivery
    ? { pending: 0, awaiting_payment: 0, paid: 0, preparing: 1, out_for_delivery: 2, delivered: 3 }
    : { pending: 0, awaiting_payment: 0, paid: 0, preparing: 1, ready: 2, collected: 3 }

  const stepIndex = stepMap[status] ?? 0

  if (status === completedStatus) {
    steps.forEach(s => { s.status = "complete" })
  } else {
    steps.forEach((s, i) => {
      if (i < stepIndex) s.status = "complete"
      else if (i === stepIndex) s.status = "current"
    })
  }

  return steps
}

/** Get status display message */
export function getStatusMessage(status: OrderStatus): string {
  switch (status) {
    case "pending": return "Your order has been received"
    case "awaiting_payment": return "Waiting for payment confirmation"
    case "paid": return "Payment received — preparing soon"
    case "preparing": return "Your items are being prepared"
    case "ready": return "Your items are ready for collection"
    case "out_for_delivery": return "Your order is on its way!"
    case "delivered": return "Your order has been delivered 🎉"
    case "collected": return "Enjoy your order! 🎉"
    case "cancelled": return "This order has been cancelled"
    default: return "Order updates will appear here."
  }
}

/** Allowed status transitions for admin (works for both order types) */
export const STATUS_TRANSITIONS: Record<OrderStatus, OrderStatus[]> = {
  pending: ["preparing", "awaiting_payment", "cancelled"],
  awaiting_payment: ["paid", "cancelled"],
  paid: ["preparing", "cancelled"],
  preparing: ["ready", "out_for_delivery", "cancelled"],
  ready: ["collected", "cancelled"],
  out_for_delivery: ["delivered", "cancelled"],
  collected: [],
  delivered: [],
  cancelled: [],
}

/** Get context-aware next actions for an order */
export function getNextActions(status: OrderStatus, orderType: OrderType = "collection"): OrderStatus[] {
  const all = STATUS_TRANSITIONS[status] || []
  if (orderType === "delivery") {
    // Filter out collection-specific statuses for delivery orders
    return all.filter(s => s !== "ready" && s !== "collected")
  }
  // Filter out delivery-specific statuses for collection orders
  return all.filter(s => s !== "out_for_delivery" && s !== "delivered")
}
