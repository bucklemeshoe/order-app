/**
 * Yoco API Client
 *
 * Server-side only. NEVER import this file from client components.
 * Uses the Yoco Checkout API to create hosted checkout sessions.
 *
 * API reference: https://developer.yoco.com
 */

const YOCO_API_BASE = "https://payments.yoco.com/api"

export interface YocoCheckoutInput {
  amountInCents: number
  currency?: string  // default ZAR
  successUrl: string
  cancelUrl: string
  failureUrl?: string
  metadata?: Record<string, string>
}

export interface YocoCheckoutResult {
  id: string
  redirectUrl: string
}

/**
 * Create a Yoco checkout session.
 * This calls the Yoco API server-side with the business's secret key.
 *
 * @param secretKey - The business's Yoco secret key (sk_test_* or sk_live_*)
 * @param input - Checkout parameters
 * @returns The checkout ID and redirect URL
 */
export async function createYocoCheckout(
  secretKey: string,
  input: YocoCheckoutInput
): Promise<YocoCheckoutResult> {
  const {
    amountInCents,
    currency = "ZAR",
    successUrl,
    cancelUrl,
    failureUrl,
    metadata,
  } = input

  if (amountInCents <= 0) {
    throw new Error("Amount must be greater than zero")
  }

  const body: Record<string, any> = {
    amount: amountInCents,
    currency,
    successUrl,
    cancelUrl,
  }

  if (failureUrl) body.failureUrl = failureUrl
  if (metadata) body.metadata = metadata

  const response = await fetch(`${YOCO_API_BASE}/checkouts`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${secretKey}`,
    },
    body: JSON.stringify(body),
  })

  if (!response.ok) {
    const errorText = await response.text().catch(() => "Unknown error")
    throw new Error(
      `Yoco API error (${response.status}): ${errorText}`
    )
  }

  const data = await response.json()

  return {
    id: data.id,
    redirectUrl: data.redirectUrl,
  }
}
