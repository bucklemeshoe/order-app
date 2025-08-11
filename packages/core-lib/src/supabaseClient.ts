/**
 * Supabase client (env-only)
 * - Local dev: set VITE_SUPABASE_URL + VITE_SUPABASE_ANON_KEY in .env.local
 * - Cloud: set these in production/staging environment variables
 * No hardcoded fallbacks to prevent accidental deploys pointing to dev DB.
 */
import { createClient, type SupabaseClient } from '@supabase/supabase-js'

const url = (import.meta as any).env?.VITE_SUPABASE_URL as string | undefined
const anonKey = (import.meta as any).env?.VITE_SUPABASE_ANON_KEY as string | undefined

if (!url || !anonKey) {
  throw new Error(
    'Missing VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY — set in .env.local for local dev, or in cloud env for staging/prod.',
  )
}

export function createSupabaseClient(): SupabaseClient {
  return createClient(url, anonKey)
}

export const supabase = createSupabaseClient()

// Backward-compatible export for legacy code paths that injected an external JWT per request.
// This still uses env-only configuration for the base URL and anon key.
export function createSupabaseWithExternalAuth(
  getExternalToken: () => Promise<string | null>,
): SupabaseClient {
  const client = createClient(url, anonKey)
  // Attach Authorization header dynamically when token is available
  // @ts-expect-error: rest.fetch typing varies across versions
  client.rest.fetch = async (input: RequestInfo, init?: RequestInit) => {
    const token = await getExternalToken()
    const headers = new Headers(init?.headers)
    if (token) headers.set('Authorization', `Bearer ${token}`)
    return fetch(input as any, { ...init, headers })
  }
  return client
}


