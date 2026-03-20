/**
 * Payment Link Generation API
 *
 * POST — Creates a Yoco payment link for a specific order.
 * Authenticated users only; verifies order ownership.
 */

import { NextRequest, NextResponse } from "next/server"
import { createSupabaseServer } from "@/lib/supabase/server"
import { generatePaymentLink } from "@/lib/payments"

export async function POST(request: NextRequest) {
  try {
    const supabase = await createSupabaseServer()

    // 1. Authenticate user
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
    }

    // 2. Parse body
    const body = await request.json()
    const { orderId } = body

    if (!orderId || typeof orderId !== "string") {
      return NextResponse.json({ error: "orderId is required" }, { status: 400 })
    }

    // 3. Determine base URL for success/cancel redirects
    const origin = request.headers.get("origin") || request.nextUrl.origin

    // 4. Generate payment link (server-side, trusted)
    const result = await generatePaymentLink(orderId, user.id, origin)

    // 5. Return only safe, frontend-consumable data
    return NextResponse.json({
      paymentUrl: result.paymentUrl,
      amount: result.amount,
    })
  } catch (err: any) {
    const status = err.message?.includes("Unauthorized") ? 403
      : err.message?.includes("not found") ? 404
      : err.message?.includes("not enabled") || err.message?.includes("not configured") ? 422
      : 500

    return NextResponse.json({ error: err.message }, { status })
  }
}
