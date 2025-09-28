// deno-lint-ignore-file no-explicit-any
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

type OrderItem = { menu_item_id: string; quantity: number; notes?: string }
type CreateOrderPayload = {
  user_id: string
  items: OrderItem[]
  pickup_time: string
  share_location?: boolean
  // Optional PostGIS point (either GeoJSON-like object or WKT string)
  current_location?: any
}

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
}

async function handler(req: Request): Promise<Response> {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  if (req.method !== 'POST') {
    return new Response('Method Not Allowed', { 
      status: 405,
      headers: corsHeaders
    })
  }

  const supabaseUrl = Deno.env.get('SUPABASE_URL')!
  const serviceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!

  const supabase = createClient(supabaseUrl, serviceKey, {
    auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false },
  })

  try {
    const payload = (await req.json()) as CreateOrderPayload

    if (!payload || !Array.isArray(payload.items) || payload.items.length === 0) {
      return Response.json({ error: 'Invalid payload' }, { 
        status: 400,
        headers: corsHeaders
      })
    }

    // Vanilla app: use provided user_id from payload
    let userId = payload.user_id
    
    // No JWT validation needed for vanilla app
    console.log('Using user_id from payload for vanilla app:', userId)

    // Basic validation for vanilla app
    for (const it of payload.items) {
      if (it.quantity <= 0) {
        return Response.json({ error: 'Invalid quantity' }, { 
          status: 400,
          headers: corsHeaders
        })
      }
    }

    // Get next order number atomically
    const { data: orderNumberData, error: orderNumberError } = await supabase
      .from('app_settings')
      .select('value')
      .eq('key', 'current_order_number')
      .single()

    if (orderNumberError) {
      console.error('Failed to get order number:', orderNumberError)
      return Response.json({ error: 'Failed to generate order number' }, { 
        status: 500,
        headers: corsHeaders
      })
    }

    const currentOrderNumber = parseInt(String(orderNumberData.value || '1001'))
    const nextOrderNumber = currentOrderNumber + 1

    // Insert order with sequential number
    const { data, error } = await supabase
      .from('orders')
      .insert({
        user_id: userId,
        items: payload.items,
        pickup_time: payload.pickup_time,
        share_location: Boolean(payload.share_location),
        // Only set current_location if provided
        ...(payload.current_location ? { current_location: payload.current_location } : {}),
        status: 'pending',
        order_number: currentOrderNumber,
      })
      .select('id, order_number')
      .single()

    // Update next order number if insert was successful
    if (!error) {
      await supabase
        .from('app_settings')
        .update({ value: nextOrderNumber })
        .eq('key', 'current_order_number')
    }

    if (error) return Response.json({ error: error.message }, { 
      status: 400,
      headers: corsHeaders
    })
    return Response.json({ id: data.id }, { 
      status: 200,
      headers: corsHeaders
    })
  } catch (e) {
    return Response.json({ error: (e as Error).message }, { 
      status: 400,
      headers: corsHeaders
    })
  }
}

// Use Deno serve pattern
Deno.serve(handler)

