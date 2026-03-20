// ── Shared types for Order App ──

export type OrderStatus =
  | "pending"
  | "awaiting_payment"
  | "paid"
  | "preparing"
  | "ready"
  | "collected"
  | "out_for_delivery"
  | "delivered"
  | "cancelled"

export type OrderType = "collection" | "delivery"
export type PaymentMethod = "none" | "yoco_link" | "snapscan"
export type PaymentStatus = "pending" | "paid" | "failed"

export type Variant = {
  id: string
  name: string
  price: number
}

export type Product = {
  id: string
  name: string
  description: string
  price: number
  image: string
  category: string
  extras?: string[]
  variants?: Variant[]
  position?: number
  is_featured?: boolean
}

export type CartItem = {
  product: Product
  qty: number
  extras: string[]
  note?: string
  variant?: Variant
}

export type ExtraItem = {
  id: string
  name: string
  price: number
}

export type ExtrasMap = Record<string, ExtraItem>

export type Order = {
  id: string
  user_id: string
  items: OrderLineItem[]
  status: OrderStatus
  pickup_time: string
  created_at: string
  order_number: number | null
  total_amount?: number
  tax_amount?: number
  // Delivery & payment fields
  order_type: OrderType
  delivery_address?: string
  delivery_notes?: string
  customer_phone?: string
  customer_name?: string | null
  payment_method: PaymentMethod
  payment_status: PaymentStatus
  payment_reference?: string
  delivery_fee?: number
  payment_link?: string
  payment_provider?: string
  payment_provider_id?: string
  payment_requested_at?: string
  payment_paid_at?: string
  user?: {
    id: string
    name: string | null
    email: string | null
    phone: string | null
  }
}

export type OrderLineItem = {
  menu_item_id: string
  name?: string
  quantity: number
  notes?: string
  price?: number
  variant?: Variant
  extras?: string[] | ExtraItem[]
}

export type AppSettings = {
  tax_rate: number
  taxes_enabled: boolean
  app_unavailable: boolean
  weekly_hours: WeeklyHours | null
  collection_enabled: boolean
  delivery_enabled: boolean
  delivery_fee: number
  yoco_enabled: boolean
  snapscan_enabled: boolean
  snapscan_link: string
}

export type DayHours = {
  open: string    // "08:00" or "closed"
  close: string   // "17:00" or "closed"
}

export type WeeklyHours = {
  monday: DayHours
  tuesday: DayHours
  wednesday: DayHours
  thursday: DayHours
  friday: DayHours
  saturday: DayHours
  sunday: DayHours
}

export type StepStatus = "complete" | "current" | "upcoming"

export type OrderStep = {
  name: string
  description: string
  status: StepStatus
}

export type UserProfile = {
  id: string
  email: string
  name: string
  phone: string
  dietary_prefs: string
}
