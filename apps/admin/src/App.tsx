import { Route, Routes } from 'react-router-dom'
import { useMemo } from 'react'
import { createSupabaseClient } from '@order-app/lib'
import AdminPage from './pages/AdminPage'
import { useRealtimeOrders } from '@order-app/lib'
import AdminLayout from './layout/AdminLayout'
import { ToastProvider } from './coffee-menu/components/toast'
import MenuPage from './pages/Menu'
import Settings from './pages/Settings'

function App() {
  // Vanilla admin uses basic Supabase client - external auth can be added in client-specific apps
  const supabase = useMemo(() => createSupabaseClient(), [])

  const { orders, loading, error } = useRealtimeOrders(supabase)

  const updateOrderStatus = async (orderId: string, newStatus: string, collectionTime?: number) => {
    if (!supabase) return
    try {
      const updateData: any = { status: newStatus }
      
      // If collection time is provided and we're starting to prepare, try to add it to database
      // (This will gracefully fail and fallback if columns don't exist)
      if (newStatus === 'preparing' && collectionTime) {
        updateData.collection_time_minutes = collectionTime
        updateData.estimated_ready_at = new Date(Date.now() + collectionTime * 60 * 1000).toISOString()
      }
      
      const { error } = await supabase
        .from('orders')
        .update(updateData)
        .eq('id', orderId)
      
      if (error) {
        // If error is due to missing collection time columns, try without them
        if (error.message?.includes('collection_time_minutes') || error.message?.includes('estimated_ready_at')) {
          console.warn('Collection time columns not found, updating status only:', error.message)
          
          // Retry with just status update
          const { error: retryError } = await supabase
            .from('orders')
            .update({ status: newStatus })
            .eq('id', orderId)
          
          if (retryError) throw retryError
          
          // Show info to user (timer still works in admin interface)
          console.log(`Order status updated to ${newStatus}. Timer will work in admin interface.`)
        } else {
          throw error
        }
      } else {
        // Success - show confirmation if collection time was set
        if (newStatus === 'preparing' && collectionTime) {
          console.log(`Order ${orderId} started preparing with ${collectionTime} minute collection time`)
        }
      }
      
      // Realtime subscription will update the UI
    } catch (err) {
      console.error('Error updating order status:', err)
      alert('Failed to update order status')
    }
  }

  return (
    <div className="min-h-dvh bg-white text-zinc-900">
      <ToastProvider>
        <Routes>
          <Route
            path="/*"
            element={
              <AdminLayout>
                <Routes>
                  <Route
                    index
                    element={
                      supabase ? (
                        <AdminPage
                          orders={(orders || []).map(o => ({
                            id: o.id,
                            order_number: o.order_number,
                            placedAt: new Date(o.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                            pickupEta: o.pickup_time ?? '-',
                            items: Array.isArray(o.items) ? o.items.map((it: any) => ({ 
                              name: it.name ?? 'Item', 
                              qty: it.qty ?? it.quantity ?? 1, 
                              quantity: it.qty ?? it.quantity ?? 1,
                              price: Number(it.price ?? 0) 
                            })) : [],
                            total: Array.isArray(o.items) ? o.items.reduce((sum: number, it: any) => sum + Number((it.price ?? 0)) * Number((it.qty ?? it.quantity ?? 1)), 0) : 0,
                            status: o.status as any,
                            collection_time_minutes: o.collection_time_minutes,
                            estimated_ready_at: o.estimated_ready_at,
                          }))}
                          loading={loading}
                          error={error}
                          onUpdateStatus={(id: string, status: string, collectionTime?: number) => updateOrderStatus(id, status, collectionTime)}
                        />
                      ) : (
                        <div className="flex justify-center py-12">
                          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-zinc-900"></div>
                        </div>
                      )
                    }
                  />
                  <Route path="/menu" element={<MenuPage />} />
                  <Route path="/settings" element={<Settings />} />
                </Routes>
              </AdminLayout>
            }
          />
        </Routes>
      </ToastProvider>
    </div>
  )
}

export default App
