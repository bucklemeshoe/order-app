import { useMemo } from 'react'
import { createSupabaseClient } from '@order-app/lib'

// Global singleton to avoid multiple clients
let globalMockClient: any = null

// Vanilla app only uses basic Supabase client - external auth can be added in client-specific apps
export function useSupabase() {
  return useMemo(() => {
    if (!globalMockClient) {
      globalMockClient = createSupabaseClient()
    }
    return globalMockClient
  }, [])
}

