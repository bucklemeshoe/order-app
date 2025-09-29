"use client"

import type { MenuItem } from "../types/menu"
import { createSupabaseClient } from '@order-app/lib'

// Singleton Supabase client to avoid multiple instances
let supabaseClient: ReturnType<typeof createSupabaseClient> | null = null

function getSupabaseClient() {
  if (!supabaseClient) {
    supabaseClient = createSupabaseClient()
  }
  return supabaseClient
}

// Database schema mapping
interface DatabaseMenuItem {
  id: string
  name: string
  category: string
  description?: string
  price: number
  image_url?: string
  is_active: boolean
  created_at: string
  variants: Array<{
    id: string
    name: string
    price: number
  }>
  extras: string[] // Array of extra item names
  platforms: string[] // Platforms where item should be displayed
  tags?: string[] // Array of tag strings (optional until column exists)
  position: number // Position within category for ordering
}

// Convert admin MenuItem to database format
function toDatabase(item: MenuItem): Omit<DatabaseMenuItem, 'id' | 'created_at'> {
  // Use the first variant's price as the main price, or 0 if no variants
  const mainPrice = item.variants?.[0]?.price || 0
  
  const dbItem: any = {
    name: item.name,
    category: item.category, // Store exact admin category name
    price: mainPrice,
    is_active: item.available,
    variants: item.variants || [],
    extras: item.extras || [],
    platforms: item.platforms || [],
    tags: item.tags || [], // Add tags to database save
    position: item.position || 0
  }
  
  // Only include description if it has a value
  if (item.description && item.description.trim()) {
    dbItem.description = item.description
  }
  
  // Use placeholder image if no image provided
  if (item.imageUrl && item.imageUrl.trim()) {
    dbItem.image_url = item.imageUrl
  } else {
    dbItem.image_url = '/placeholder.svg'
  }
  
  return dbItem
}

// Convert database item to admin MenuItem format
function fromDatabase(dbItem: DatabaseMenuItem): MenuItem {
  // Don't show placeholder image in admin form - show empty for editing
  const imageUrl = dbItem.image_url === '/placeholder.svg' ? '' : dbItem.image_url

  // Use the exact category from database (no mapping needed anymore)
  const adminCategory = dbItem.category

  return {
    id: dbItem.id,
    name: dbItem.name,
    category: adminCategory as any,
    description: dbItem.description,
    imageUrl: imageUrl,
    available: dbItem.is_active,
    variants: dbItem.variants || [
      {
        id: `${dbItem.id}-default`,
        name: "Regular",
        price: dbItem.price
      }
    ],
    tags: dbItem.tags || [], // Load tags from database
    platforms: dbItem.platforms || [],
    extras: dbItem.extras || [],
    position: dbItem.position || 0
  }
}

// Note: No category mapping needed anymore - we store exact admin categories in database

export async function loadItems(): Promise<MenuItem[]> {
  try {
    const supabase = getSupabaseClient()
    
    const { data, error } = await supabase
      .from('menu_items')
      .select('*')
      .order('category', { ascending: true })
      .order('position', { ascending: true })
      .order('name', { ascending: true })

    if (error) {
      console.error('Failed to load menu items from database:', error)
      throw error
    }

    // Convert database items to admin format and add positions
    const items = (data || []).map((dbItem, index) => {
      const item = fromDatabase(dbItem)
      // Set position based on order
      item.position = index
      return item
    })

    return items
  } catch (error) {
    console.error('Error loading items:', error)
    return []
  }
}

export async function saveItem(item: MenuItem): Promise<MenuItem> {
  try {
    const supabase = getSupabaseClient()
    const dbData = toDatabase(item)
    
    // No category mapping needed - store exact admin category

    let result
    
    if (item.id && !item.id.startsWith('temp_')) {
      // Update existing item
      const { data, error } = await supabase
        .from('menu_items')
        .update(dbData)
        .eq('id', item.id)
        .select()
        .single()

      if (error) {
        // If tags column doesn't exist, try saving without it
        if (error.message?.includes('tags')) {
          console.warn('Tags column not found, saving without tags field')
          const { tags, ...dbDataWithoutTags } = dbData
          const { data: retryData, error: retryError } = await supabase
            .from('menu_items')
            .update(dbDataWithoutTags)
            .eq('id', item.id)
            .select()
            .single()
          if (retryError) throw retryError
          result = retryData
        } else {
          throw error
        }
      } else {
        result = data
      }
    } else {
      // Create new item
      const { data, error } = await supabase
        .from('menu_items')
        .insert(dbData)
        .select()
        .single()

      if (error) {
        // If tags column doesn't exist, try saving without it
        if (error.message?.includes('tags')) {
          console.warn('Tags column not found, saving without tags field')
          const { tags, ...dbDataWithoutTags } = dbData
          const { data: retryData, error: retryError } = await supabase
            .from('menu_items')
            .insert(dbDataWithoutTags)
            .select()
            .single()
          if (retryError) throw retryError
          result = retryData
        } else {
          throw error
        }
      } else {
        result = data
      }
    }
    return fromDatabase(result)
  } catch (error) {
    console.error('Error saving item:', error)
    throw error
  }
}

export async function deleteItem(id: string): Promise<void> {
  try {
    const supabase = getSupabaseClient()
    
    const { error } = await supabase
      .from('menu_items')
      .delete()
      .eq('id', id)

    if (error) throw error
  } catch (error) {
    console.error('Error deleting item:', error)
    throw error
  }
}

export async function toggleItemAvailability(id: string, available: boolean): Promise<void> {
  try {
    const supabase = getSupabaseClient()
    
    const { error } = await supabase
      .from('menu_items')
      .update({ is_active: available })
      .eq('id', id)

    if (error) throw error
  } catch (error) {
    console.error('Error toggling item availability:', error)
    throw error
  }
}

export async function updateItemPositions(updates: Array<{ id: string; position: number }>): Promise<void> {
  try {
    const supabase = getSupabaseClient()
    
    // Update positions in batch
    const promises = updates.map(({ id, position }) =>
      supabase
        .from('menu_items')
        .update({ position })
        .eq('id', id)
    )
    
    const results = await Promise.all(promises)
    
    // Check for any errors
    const errors = results.filter(result => result.error)
    if (errors.length > 0) {
      throw new Error(`Failed to update positions: ${errors.map(e => e.error?.message).join(', ')}`)
    }
  } catch (error) {
    console.error('Failed to update item positions:', error)
    throw error
  }
}

// For now, keep the existing localStorage functions as fallback
export { applyReorderByIds } from './storage'
