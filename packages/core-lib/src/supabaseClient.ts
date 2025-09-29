/**
 * Supabase client (env-only)
 * - Local dev: set VITE_SUPABASE_URL + VITE_SUPABASE_ANON_KEY in .env.local
 * - Cloud: set these in production/staging environment variables
 * No hardcoded fallbacks to prevent accidental deploys pointing to dev DB.
 */
import { createClient, type SupabaseClient } from '@supabase/supabase-js'

export function createSupabaseClient(): SupabaseClient {
  const url = (import.meta as any).env?.VITE_SUPABASE_URL as string | undefined
  const anonKey = (import.meta as any).env?.VITE_SUPABASE_ANON_KEY as string | undefined
  if (!url || !anonKey) {
    throw new Error(
      'Missing VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY — set in .env.local for local dev, or in cloud env for staging/prod.',
    )
  }
  return createClient(url as string, anonKey as string, {
    auth: {
      storageKey: 'order-app-auth', // Unique storage key to avoid conflicts
      persistSession: true,
      detectSessionInUrl: false
    }
  })
}

// Vanilla apps use the basic client without external auth
// For client-specific apps that need external auth, they can implement their own auth layer


