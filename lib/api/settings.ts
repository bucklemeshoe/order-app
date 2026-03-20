import { createSupabaseBrowser } from "@/lib/supabase/browser"
import type { WeeklyHours } from "@/types"

/**
 * Get a setting value by key
 */
export async function getSetting(key: string): Promise<any> {
  const supabase = createSupabaseBrowser()
  const { data, error } = await supabase
    .from("app_settings")
    .select("value")
    .eq("key", key)
    .single()

  if (error) return null
  return data?.value
}

/**
 * Get the tax rate from settings
 */
export async function getTaxRate(): Promise<number> {
  const value = await getSetting("tax_rate")
  return parseFloat(String(value ?? "0.15"))
}

/**
 * Get weekly business hours
 */
export async function getWeeklyHours(): Promise<WeeklyHours | null> {
  return await getSetting("weekly_hours")
}

/**
 * Check if the app is marked unavailable
 */
export async function isAppUnavailable(): Promise<boolean> {
  const value = await getSetting("app_unavailable")
  return value === true || value === "true"
}

/**
 * Update a setting (admin only)
 */
export async function updateSetting(key: string, value: any): Promise<void> {
  const supabase = createSupabaseBrowser()
  const { error } = await supabase
    .from("app_settings")
    .update({ value, updated_at: new Date().toISOString() })
    .eq("key", key)

  if (error) throw new Error(`Failed to update setting: ${error.message}`)
}

/**
 * Get all settings (admin)
 */
export async function getAllSettings(): Promise<any[]> {
  const supabase = createSupabaseBrowser()
  const { data, error } = await supabase
    .from("app_settings")
    .select("*")
    .order("key", { ascending: true })

  if (error) throw new Error(`Failed to fetch settings: ${error.message}`)
  return data || []
}
