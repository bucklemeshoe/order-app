/**
 * Payment Provider Abstraction
 *
 * Server-side only. Provides a high-level function to generate
 * a payment link for an order, abstracting provider-specific logic.
 */

import { createSupabaseServer } from "@/lib/supabase/server"
import { createYocoCheckout } from "./yoco"

export interface PaymentLinkResult {
  paymentUrl: string
  paymentProviderId: string
  amount: number
}

/**
 * Generate a payment link for an order.
 *
 * 1. Verifies the order exists and belongs to the requesting user
 * 2. Checks Yoco is enabled and credentials exist
 * 3. Reuses existing link if one is already generated
 * 4. Creates a Yoco checkout with the trusted order total
 * 5. Stores payment metadata on the order
 *
 * @param orderId - The order to generate a link for
 * @param userId - The authenticated user requesting payment
 * @param baseUrl - The app's base URL for success/cancel redirects
 */
export async function generatePaymentLink(
  orderId: string,
  userId: string,
  baseUrl: string
): Promise<PaymentLinkResult> {
  const supabase = await createSupabaseServer()

  // 1. Fetch the order with trusted data
  const { data: order, error: orderError } = await supabase
    .from("orders")
    .select("id, user_id, total_amount, payment_method, payment_status, payment_link, payment_provider_id, order_number")
    .eq("id", orderId)
    .single()

  if (orderError || !order) {
    throw new Error("Order not found")
  }

  // 2. Verify the user owns this order
  if (order.user_id !== userId) {
    throw new Error("Unauthorized: you do not own this order")
  }

  // 3. Verify payment method is Yoco
  if (order.payment_method !== "yoco_link") {
    throw new Error("This order does not use Yoco payment")
  }

  // 4. Check if already paid
  if (order.payment_status === "paid") {
    throw new Error("This order has already been paid")
  }

  // 5. Reuse existing payment link if available
  if (order.payment_link && order.payment_provider_id) {
    return {
      paymentUrl: order.payment_link,
      paymentProviderId: order.payment_provider_id,
      amount: order.total_amount,
    }
  }

  // 6. Verify Yoco is enabled
  const { data: yocoSetting } = await supabase
    .from("app_settings")
    .select("value")
    .eq("key", "yoco_enabled")
    .single()

  const yocoEnabled = yocoSetting?.value === true || yocoSetting?.value === "true"
  if (!yocoEnabled) {
    throw new Error("Yoco payments are not enabled")
  }

  // 7. Fetch Yoco credentials (admin-only table, accessed via server client)
  const { data: credentials, error: credError } = await supabase
    .from("payment_credentials")
    .select("secret_key, environment")
    .eq("provider", "yoco")
    .single()

  if (credError || !credentials?.secret_key) {
    throw new Error("Yoco is not configured. Please contact the business.")
  }

  // 8. Create Yoco checkout with TRUSTED order total
  const amountInCents = Math.round(order.total_amount * 100)
  const orderRef = order.order_number ? `Order #${order.order_number}` : `Order ${orderId.slice(0, 8)}`

  const checkout = await createYocoCheckout(credentials.secret_key, {
    amountInCents,
    currency: "ZAR",
    successUrl: `${baseUrl}/?payment=success&orderId=${orderId}`,
    cancelUrl: `${baseUrl}/?payment=cancelled&orderId=${orderId}`,
    failureUrl: `${baseUrl}/?payment=failed&orderId=${orderId}`,
    metadata: {
      orderId,
      orderNumber: String(order.order_number || ""),
      description: orderRef,
    },
  })

  // 9. Store payment metadata on the order
  const { error: updateError } = await supabase
    .from("orders")
    .update({
      payment_link: checkout.redirectUrl,
      payment_provider: "yoco",
      payment_provider_id: checkout.id,
      payment_requested_at: new Date().toISOString(),
    })
    .eq("id", orderId)

  if (updateError) {
    // Link was created but we failed to save it — return it anyway
    console.error("Failed to save payment metadata:", updateError.message)
  }

  return {
    paymentUrl: checkout.redirectUrl,
    paymentProviderId: checkout.id,
    amount: order.total_amount,
  }
}
