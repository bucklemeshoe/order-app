import { createSupabaseBrowser } from "@/lib/supabase/browser"

export interface UserProfile {
  id: string
  email: string
  name: string
  phone: string | null
  dietary_prefs: string | null
  delivery_address: string | null
  delivery_notes: string | null
  role: string
}

const FULL_SELECT = "id, email, name, phone, dietary_prefs, delivery_address, delivery_notes, role"
const SAFE_SELECT = "id, email, name, phone, dietary_prefs, role"

/**
 * Get the current authenticated user's profile
 */
export async function getCurrentUser(): Promise<UserProfile | null> {
  const supabase = createSupabaseBrowser()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null

  let { data, error } = await supabase
    .from("users")
    .select(FULL_SELECT)
    .eq("id", user.id)
    .single()

  if (error) {
    const fallback = await supabase
      .from("users")
      .select(SAFE_SELECT)
      .eq("id", user.id)
      .single()
      
    if (fallback.error) {
       // If the row doesn't exist (PGRST116), self-heal the database
       if (fallback.error.code === 'PGRST116') {
         const autoProfile = {
           id: user.id,
           email: user.email || '',
           name: user.user_metadata?.name || user.email?.split('@')[0] || 'User',
           role: 'customer'
         };
         await supabase.from("users").insert(autoProfile);
         return {
           ...autoProfile,
           phone: null,
           dietary_prefs: null,
           delivery_address: null,
           delivery_notes: null
         } as UserProfile;
       }
       return null;
    }
    return { ...fallback.data, delivery_address: null, delivery_notes: null } as UserProfile
  }
  return data as UserProfile
}

/**
 * Update the current user's profile
 */
export async function updateProfile(updates: {
  name?: string
  phone?: string
  dietary_prefs?: string
  delivery_address?: string
  delivery_notes?: string
}): Promise<UserProfile> {
  const supabase = createSupabaseBrowser()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error("Not authenticated")

  const { data, error } = await supabase
    .from("users")
    .update(updates)
    .eq("id", user.id)
    .select(FULL_SELECT)
    .single()

  if (error) {
    // Fallback: strip new columns and retry
    const { delivery_address, delivery_notes, ...safeUpdates } = updates
    const fallback = await supabase
      .from("users")
      .update(safeUpdates)
      .eq("id", user.id)
      .select(SAFE_SELECT)
      .single()
    if (fallback.error) throw new Error(`Failed to update profile: ${fallback.error.message}`)
    return { ...fallback.data, delivery_address: null, delivery_notes: null } as UserProfile
  }
  return data as UserProfile
}

/**
 * Sign out the current user
 */
export async function signOut(): Promise<void> {
  const supabase = createSupabaseBrowser()
  await supabase.auth.signOut()
}

/**
 * Check if current user is admin
 */
export async function isAdmin(): Promise<boolean> {
  const profile = await getCurrentUser()
  return profile?.role === "admin"
}
