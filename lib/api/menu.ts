import { createSupabaseBrowser } from "@/lib/supabase/browser"
import type { Product } from "@/types"

/**
 * Get all active menu items, sorted by category + position
 */
export async function getMenuItems(): Promise<Product[]> {
  const supabase = createSupabaseBrowser()
  const { data, error } = await supabase
    .from("menu_items")
    .select("*")
    .eq("is_active", true)
    .order("category", { ascending: true })
    .order("position", { ascending: true })
    .order("name", { ascending: true })

  if (error) throw new Error(`Failed to fetch menu: ${error.message}`)

  return (data || []).map((item: any) => ({
    id: item.id,
    name: item.name,
    description: item.description || "",
    price: item.price,
    image: item.image_url || null,
    category: item.category || "Coffee",
    extras: item.extras || [],
    variants: item.variants || [],
    position: item.position,
    is_featured: item.is_featured || false,
  }))
}

/**
 * Get all menu items including inactive (admin)
 */
export async function getAllMenuItems(): Promise<any[]> {
  const supabase = createSupabaseBrowser()
  const { data, error } = await supabase
    .from("menu_items")
    .select("*")
    .order("category", { ascending: true })
    .order("position", { ascending: true })

  if (error) throw new Error(`Failed to fetch menu items: ${error.message}`)
  return data || []
}

/**
 * Create a menu item (admin)
 */
export async function createMenuItem(item: {
  name: string
  category: string
  description?: string
  price: number
  image_url?: string
  is_active?: boolean
  variants?: any[]
  extras?: any[]
  position?: number
}): Promise<any> {
  const supabase = createSupabaseBrowser()
  const { data, error } = await supabase
    .from("menu_items")
    .insert(item)
    .select()
    .single()

  if (error) throw new Error(`Failed to create menu item: ${error.message}`)
  return data
}

/**
 * Update a menu item (admin)
 */
export async function updateMenuItem(
  id: string,
  updates: Record<string, any>
): Promise<any> {
  const supabase = createSupabaseBrowser()
  const { data, error } = await supabase
    .from("menu_items")
    .update(updates)
    .eq("id", id)
    .select()
    .single()

  if (error) throw new Error(`Failed to update menu item: ${error.message}`)
  return data
}

/**
 * Delete a menu item (admin)
 */
export async function deleteMenuItem(id: string): Promise<void> {
  const supabase = createSupabaseBrowser()
  const { error } = await supabase.from("menu_items").delete().eq("id", id)
  if (error) throw new Error(`Failed to delete menu item: ${error.message}`)
}

/**
 * Get extras from menu_items where category = "Extras"
 */
export async function getExtrasMap(): Promise<Record<string, { id: string; name: string; price: number }>> {
  const supabase = createSupabaseBrowser()
  const { data, error } = await supabase
    .from("menu_items")
    .select("name, price")
    .eq("category", "Extras")
    .eq("is_active", true)

  if (error) return {}

  const map: Record<string, { id: string; name: string; price: number }> = {}
  data?.forEach((extra: any) => {
    map[extra.name] = {
      id: extra.name.toLowerCase().replace(/\s+/g, "_"),
      name: extra.name,
      price: extra.price,
    }
  })
  return map
}
