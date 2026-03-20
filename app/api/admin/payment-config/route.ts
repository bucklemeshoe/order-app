/**
 * Admin Payment Config API
 *
 * GET  — Returns masked credentials + environment (admin only)
 * POST — Saves/updates Yoco credentials (admin only)
 */

import { NextRequest, NextResponse } from "next/server"
import { createSupabaseServer } from "@/lib/supabase/server"

function maskKey(key: string): string {
  if (!key || key.length < 8) return "****"
  return key.slice(0, 7) + "****" + key.slice(-4)
}

async function verifyAdmin(supabase: any): Promise<string | null> {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null
  const { data: profile } = await supabase
    .from("users")
    .select("role")
    .eq("id", user.id)
    .single()
  if (profile?.role !== "admin") return null
  return user.id
}

export async function GET() {
  try {
    const supabase = await createSupabaseServer()
    const adminId = await verifyAdmin(supabase)
    if (!adminId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { data, error } = await supabase
      .from("payment_credentials")
      .select("provider, secret_key, public_key, environment")
      .eq("provider", "yoco")
      .single()

    if (error || !data) {
      return NextResponse.json({
        provider: "yoco",
        hasSecretKey: false,
        maskedSecretKey: null,
        publicKey: null,
        environment: "test",
      })
    }

    return NextResponse.json({
      provider: "yoco",
      hasSecretKey: !!data.secret_key,
      maskedSecretKey: data.secret_key ? maskKey(data.secret_key) : null,
      publicKey: data.public_key || null,
      environment: data.environment || "test",
    })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createSupabaseServer()
    const adminId = await verifyAdmin(supabase)
    if (!adminId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { secretKey, publicKey, environment } = body

    if (!secretKey || typeof secretKey !== "string") {
      return NextResponse.json({ error: "Secret key is required" }, { status: 400 })
    }

    // Upsert credentials
    const { error } = await supabase
      .from("payment_credentials")
      .upsert(
        {
          provider: "yoco",
          secret_key: secretKey,
          public_key: publicKey || null,
          environment: environment || "test",
          updated_at: new Date().toISOString(),
        },
        { onConflict: "provider" }
      )

    if (error) {
      return NextResponse.json({ error: `Failed to save: ${error.message}` }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      maskedSecretKey: maskKey(secretKey),
    })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
