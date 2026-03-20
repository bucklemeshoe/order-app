import { createSupabaseBrowser } from "@/lib/supabase/browser"
import type { CartItem, ExtrasMap, Order, OrderType, PaymentMethod } from "@/types"

// ── Types for order creation ──
interface CreateOrderInput {
  items: CartItem[]
  pickupTime: string   // ISO string
  extrasMap: ExtrasMap
  // Delivery & payment
  orderType?: OrderType
  deliveryAddress?: string
  deliveryNotes?: string
  customerPhone?: string
  paymentMethod?: PaymentMethod
}

interface CreateOrderResult {
  id: string
  order_number: number
  total_amount: number
  payment_method: PaymentMethod
}

// Columns to select on all order queries
const ORDER_COLUMNS = `
  id, user_id, items, status, pickup_time, created_at, order_number,
  total_amount, tax_amount,
  order_type, delivery_address, delivery_notes, customer_phone,
  payment_method, payment_status, payment_reference, delivery_fee,
  payment_link, payment_provider, payment_provider_id,
  payment_requested_at, payment_paid_at,
  user:users(id, name, email, phone)
`

/**
 * Create an order with TRUSTED server-side pricing.
 *
 * SECURITY: Prices are re-fetched from the database — client-side
 * cart prices are NEVER trusted for total calculation.
 */
export async function createOrder(input: CreateOrderInput): Promise<CreateOrderResult> {
  const supabase = createSupabaseBrowser()
  const {
    items, pickupTime,
    orderType = "collection",
    deliveryAddress, deliveryNotes, customerPhone,
    paymentMethod = "none",
  } = input

  if (items.length === 0) throw new Error("Cart is empty")

  // 1. Authenticate user
  const { data: { user }, error: authError } = await supabase.auth.getUser()
  if (authError || !user) throw new Error("You must be logged in to place an order")

  // 2. Validate delivery fields
  if (orderType === "delivery") {
    if (!deliveryAddress?.trim()) throw new Error("Delivery address is required")
    if (!customerPhone?.trim()) throw new Error("Phone number is required for delivery")
  }

  // 3. Validate fulfilment mode against settings (server-side enforcement)
  const { data: fulfilmentSettings } = await supabase
    .from("app_settings")
    .select("key, value")
    .in("key", ["collection_enabled", "delivery_enabled"])

  const fulfilmentMap: Record<string, any> = {}
  ;(fulfilmentSettings || []).forEach((s: any) => { fulfilmentMap[s.key] = s.value })

  const collectionEnabled = fulfilmentMap.collection_enabled === true || fulfilmentMap.collection_enabled === "true"
  const deliverySettingEnabled = fulfilmentMap.delivery_enabled === true || fulfilmentMap.delivery_enabled === "true"

  // Default: collection is enabled if setting doesn't exist yet
  const isCollectionAllowed = fulfilmentMap.collection_enabled !== undefined ? collectionEnabled : true
  const isDeliveryAllowed = deliverySettingEnabled

  if (orderType === "collection" && !isCollectionAllowed) {
    throw new Error("Collection orders are currently unavailable")
  }
  if (orderType === "delivery" && !isDeliveryAllowed) {
    throw new Error("Delivery orders are currently unavailable")
  }

  // 4. Fetch authoritative prices from DB
  const productIds = [...new Set(items.map((ci) => ci.product.id))]
  const { data: dbProducts, error: menuError } = await supabase
    .from("menu_items")
    .select("id, name, price, variants, extras, is_active")
    .in("id", productIds)

  if (menuError || !dbProducts) throw new Error("Failed to verify menu prices")

  // Fetch extras items for trusted pricing
  const { data: dbExtras } = await supabase
    .from("menu_items")
    .select("id, name, price")
    .eq("category", "Extras")
    .eq("is_active", true)

  const extrasLookup = new Map(
    (dbExtras || []).map((e: any) => [e.name.toLowerCase().replace(/\s+/g, "_"), e])
  )
  ;(dbExtras || []).forEach((e: any) => { extrasLookup.set(e.name, e) })

  // 5. Fetch tax rate + delivery fee from settings
  const { data: settings } = await supabase
    .from("app_settings")
    .select("key, value")
    .in("key", ["tax_rate", "delivery_fee"])

  const settingsMap: Record<string, any> = {}
  ;(settings || []).forEach((s: any) => { settingsMap[s.key] = s.value })

  const taxRate = parseFloat(String(settingsMap.tax_rate ?? "0.15"))
  const deliveryFee = orderType === "delivery"
    ? parseFloat(String(settingsMap.delivery_fee ?? "0"))
    : 0

  // 5. Build line items with TRUSTED prices from DB
  const lineItems = items.map((ci) => {
    const dbProduct = dbProducts.find((p: any) => p.id === ci.product.id)
    if (!dbProduct) throw new Error(`Product "${ci.product.name}" is no longer available`)
    if (!dbProduct.is_active) throw new Error(`Product "${dbProduct.name}" is currently unavailable`)

    let trustedPrice = dbProduct.price
    let trustedVariant = null
    if (ci.variant && Array.isArray(dbProduct.variants)) {
      const dbVariant = dbProduct.variants.find((v: any) => v.id === ci.variant!.id)
      if (dbVariant) {
        trustedPrice = dbVariant.price
        trustedVariant = { id: dbVariant.id, name: dbVariant.name, price: dbVariant.price }
      }
    }

    const trustedExtras = (ci.extras || []).map((extraKey) => {
      const dbExtra = extrasLookup.get(extraKey) || extrasLookup.get(extraKey.toLowerCase().replace(/\s+/g, "_"))
      return dbExtra
        ? { name: dbExtra.name, price: dbExtra.price }
        : { name: extraKey, price: 0 }
    })
    const extrasCost = trustedExtras.reduce((sum, e) => sum + e.price, 0)

    return {
      product_id: dbProduct.id,
      name: dbProduct.name,
      price: +(trustedPrice + extrasCost).toFixed(2),
      quantity: ci.qty,
      extras: trustedExtras,
      variant: trustedVariant,
    }
  })

  // 6. Calculate totals from trusted data
  const subtotal = lineItems.reduce(
    (sum, item) => sum + item.price * item.quantity, 0
  )
  const taxAmount = +(subtotal * taxRate).toFixed(2)
  const totalAmount = +(subtotal + taxAmount + deliveryFee).toFixed(2)

  // Determine initial status
  const initialStatus = paymentMethod !== "none" ? "awaiting_payment" : "pending"

  // 7. Insert order
  const { data: order, error: orderError } = await supabase
    .from("orders")
    .insert({
      user_id: user.id,
      items: lineItems,
      pickup_time: pickupTime,
      status: initialStatus,
      total_amount: totalAmount,
      tax_amount: taxAmount,
      order_type: orderType,
      delivery_address: deliveryAddress || null,
      delivery_notes: deliveryNotes || null,
      customer_phone: customerPhone || null,
      payment_method: paymentMethod,
      payment_status: "pending",
      delivery_fee: deliveryFee,
    })
    .select("id, order_number, total_amount, payment_method")
    .single()

  if (orderError) throw new Error(`Failed to create order: ${orderError.message}`)

  // 8. Insert order_items rows
  const orderItemsPayload = lineItems.map((item) => ({
    order_id: order.id,
    product_id: item.product_id,
    name: item.name,
    price: item.price,
    quantity: item.quantity,
    extras: item.extras,
    variant: item.variant,
  }))

  const { error: itemsError } = await supabase
    .from("order_items")
    .insert(orderItemsPayload)

  if (itemsError) {
    await supabase.from("orders").delete().eq("id", order.id)
    throw new Error(`Failed to create order items: ${itemsError.message}`)
  }

  return {
    id: order.id,
    order_number: order.order_number,
    total_amount: order.total_amount,
    payment_method: order.payment_method,
  }
}

/**
 * Delete a pending order when a user cancels checkout
 */
export async function deletePendingOrder(orderId: string): Promise<void> {
  const supabase = createSupabaseBrowser()
  // Only delete if it's still awaiting_payment
  const { error } = await supabase.from("orders").delete().eq("id", orderId).eq("status", "awaiting_payment")
  if (error) {
    console.error("Failed to delete pending order:", error)
  }
}

/**
 * Confirm payment (customer self-service)
 */
export async function confirmPayment(orderId: string, reference?: string): Promise<void> {
  const supabase = createSupabaseBrowser()
  const updates: any = { 
    payment_status: "paid",
    status: "pending" // transition out of awaiting_payment to standard prep queue
  }
  if (reference) updates.payment_reference = reference

  const { error } = await supabase
    .from("orders")
    .update(updates)
    .eq("id", orderId)

  if (error) throw new Error(`Failed to confirm payment: ${error.message}`)
}

/**
 * Get orders for the current authenticated user
 */
export async function getUserOrders(): Promise<Order[]> {
  const supabase = createSupabaseBrowser()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return []

  const { data, error } = await supabase
    .from("orders")
    .select(ORDER_COLUMNS)
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })

  if (error) throw new Error(`Failed to fetch orders: ${error.message}`)
  return (data || []) as unknown as Order[]
}

/**
 * Get a single order by ID (for order detail view)
 */
export async function getOrder(orderId: string): Promise<Order | null> {
  const supabase = createSupabaseBrowser()
  const { data, error } = await supabase
    .from("orders")
    .select(ORDER_COLUMNS)
    .eq("id", orderId)
    .single()

  if (error) return null
  return data as unknown as Order
}

/**
 * Get all orders (admin only — RLS enforces access)
 */
export async function getAllOrders(includeArchived = false): Promise<Order[]> {
  const supabase = createSupabaseBrowser()
  let query = supabase
    .from("orders")
    .select(ORDER_COLUMNS)
    .order("created_at", { ascending: false })

  if (!includeArchived) {
    query = query.eq("archived", false)
  }

  const { data, error } = await query
  if (error) throw new Error(`Failed to fetch orders: ${error.message}`)
  return (data || []) as unknown as Order[]
}

/**
 * Update order status (admin only)
 */
export async function updateOrderStatus(
  orderId: string,
  status: string,
  payment_status?: string
): Promise<void> {
  const supabase = createSupabaseBrowser()
  const payload: any = { status }
  if (payment_status) payload.payment_status = payment_status
  
  const { error } = await supabase
    .from("orders")
    .update(payload)
    .eq("id", orderId)

  if (error) throw new Error(`Failed to update order: ${error.message}`)
}

/**
 * Admin: mark order as paid
 */
export async function adminMarkPaid(orderId: string): Promise<void> {
  const supabase = createSupabaseBrowser()
  const { error } = await supabase
    .from("orders")
    .update({ payment_status: "paid", status: "paid" })
    .eq("id", orderId)

  if (error) throw new Error(`Failed to mark as paid: ${error.message}`)
}

/**
 * Get archived orders only (admin)
 */
export async function getArchivedOrders(): Promise<Order[]> {
  const supabase = createSupabaseBrowser()
  const { data, error } = await supabase
    .from("orders")
    .select(ORDER_COLUMNS)
    .eq("archived", true)
    .order("created_at", { ascending: false })

  if (error) throw new Error(`Failed to fetch archived orders: ${error.message}`)
  return (data || []) as unknown as Order[]
}

/**
 * Archive a single order (admin)
 */
export async function archiveOrder(orderId: string): Promise<void> {
  const supabase = createSupabaseBrowser()
  const { error } = await supabase
    .from("orders")
    .update({ archived: true })
    .eq("id", orderId)

  if (error) throw new Error(`Failed to archive order: ${error.message}`)
}

/**
 * Archive all completed orders for a given date (admin)
 */
export async function archiveOrdersByDate(dateStr: string): Promise<number> {
  const supabase = createSupabaseBrowser()
  const dayStart = `${dateStr}T00:00:00`
  const dayEnd = `${dateStr}T23:59:59`

  const { data, error } = await supabase
    .from("orders")
    .update({ archived: true })
    .in("status", ["collected", "delivered", "cancelled"])
    .gte("created_at", dayStart)
    .lte("created_at", dayEnd)
    .eq("archived", false)
    .select("id")

  if (error) throw new Error(`Failed to archive orders: ${error.message}`)
  return data?.length || 0
}
