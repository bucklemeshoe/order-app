import { useState, useEffect } from 'react'
import { useRealtimeOrders } from '@order-app/lib'
import { useNotificationsStore } from '../store/notifications'
import { useSupabase } from '../lib/useSupabase'
import { useTaxCalculations } from '../hooks/useSettings'
// Link component not needed for vanilla app
import { IonContent, IonCard, IonCardContent, IonButton, IonIcon, IonSpinner, IonBadge, IonSegment, IonSegmentButton, IonLabel } from '@ionic/react'
import { timeOutline } from 'ionicons/icons'
import { formatCurrency, formatDateTime } from '../utils/format'
import { getStatusBadgeColor as getStatusBadgeColorUtil, getStatusMessage as getStatusMessageUtil, isCurrentStatus, isPastStatus } from '../utils/status'

// Order interface defined by useRealtimeOrders hook

function OrdersPageDemo() {
  const supabase = useSupabase()
  const demoUserId = 'demo-user-123' // Vanilla app uses consistent demo user
  const { orders, loading, lastEvent } = useRealtimeOrders(supabase, { userId: demoUserId })
  const addNotification = useNotificationsStore((s) => s.add)

  // Orders are now working correctly!

  useEffect(() => {
    if (!lastEvent) return
    const { type, order } = lastEvent
    if (type === 'INSERT') {
      addNotification({ title: 'Order placed', message: `Order #${order.order_number || order.id.slice(0,8)} created` })
    } else if (type === 'UPDATE') {
      addNotification({ title: 'Order update', message: `Order #${order.order_number || order.id.slice(0,8)} is now ${order.status}` })
    }
  }, [lastEvent, addNotification])

  return <OrdersList loading={loading} orders={orders} />
}

// Removed OrdersPageAuthed since vanilla app doesn't need authentication

export function OrdersPage() {
  return <OrdersPageDemo />
}

function OrdersList({ loading, orders }: { loading: boolean; orders: any[] }) {
  const [selectedTab, setSelectedTab] = useState<'current' | 'past'>('current')
  const { calculateTotal } = useTaxCalculations()

  // Filter orders into current and past
  const currentOrders = orders.filter(order => isCurrentStatus(order.status))
  const pastOrders = orders.filter(order => isPastStatus(order.status))

  const displayedOrders = selectedTab === 'current' ? currentOrders : pastOrders

  // Using status utilities from utils/status

  const getStatusMessage = getStatusMessageUtil
  const getStatusBadgeColor = getStatusBadgeColorUtil

  if (loading) {
    return (
      <IonContent className="ion-padding">
        <div className="space-y-4 pt-12">
          <h1 className="text-2xl font-bold text-gray-900">My Orders</h1>
          <div className="flex justify-center py-8">
            <IonSpinner name="crescent" color="warning" />
          </div>
        </div>
      </IonContent>
    )
  }

  return (
    <IonContent className="ion-padding">
      <div className="space-y-4 pt-12">
        <h1 className="text-xl font-semibold ui-heading">My Orders</h1>
        

        
        {/* Segment Tabs */}
        <IonSegment 
          value={selectedTab} 
          onIonChange={(e) => setSelectedTab(e.detail.value as 'current' | 'past')}
        >
          <IonSegmentButton value="current">
            <IonLabel>
              Current ({currentOrders.length})
            </IonLabel>
          </IonSegmentButton>
          <IonSegmentButton value="past">
            <IonLabel>
              Past ({pastOrders.length})
            </IonLabel>
          </IonSegmentButton>
        </IonSegment>
        
        {displayedOrders.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-neutral-400 text-6xl mb-4">☕</div>
              <h2 className="text-xl font-semibold text-neutral-900 mb-2">
              {selectedTab === 'current' ? 'No current orders' : 'No past orders'}
            </h2>
              <p className="text-neutral-600 mb-6">
              {selectedTab === 'current' 
                ? 'Start by browsing our delicious menu!' 
                : 'Your completed and cancelled orders will appear here.'
              }
            </p>
            {selectedTab === 'current' && (
              <IonButton 
                routerLink="/menu"
                color="warning"
                fill="solid"
              >
                Browse Menu
              </IonButton>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            {displayedOrders.map((order) => (
              <IonCard key={order.id} routerLink={`/orders/${order.id}`} button className="ui-card">
                <IonCardContent>
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <h3 className="font-semibold ui-heading">
                        Order #{order.order_number || order.id.slice(0, 8)}
                      </h3>
                      <p className="text-sm ui-muted flex items-center gap-1">
                        <IonIcon icon={timeOutline} className="text-xs" />
                        {formatDateTime(order.created_at)}
                      </p>
                    </div>
                     <IonBadge color={getStatusBadgeColor(order.status)}>
                      {order.status}
                    </IonBadge>
                  </div>
                  
                  <div className="text-sm ui-muted mb-2">
                    {getStatusMessage(order.status)}
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="text-sm ui-muted">
                      {order.items.length} item{order.items.length !== 1 ? 's' : ''}
                    </div>
                    <div className="font-semibold ui-heading">
                      {formatCurrency(calculateTotal(order.items))}
                    </div>
                  </div>

                  {(order.status === 'ready' || order.status === 'preparing') && (
                    <div className="mt-3 p-2 bg-yellow-50 border border-yellow-200 rounded text-sm text-neutral-900">
                      {order.status === 'ready' 
                        ? '🎉 Your order is ready for pickup!'
                        : order.collection_time_minutes && order.estimated_ready_at
                          ? (() => {
                              const now = new Date()
                              const readyTime = new Date(order.estimated_ready_at)
                              const remainingMs = readyTime.getTime() - now.getTime()
                              const remainingMinutes = Math.max(0, Math.ceil(remainingMs / (1000 * 60)))
                              return remainingMinutes > 0 
                                ? `👨‍🍳 Order ready for collection in ${remainingMinutes} minutes`
                                : '🎉 Your order should be ready!'
                            })()
                          : '👨‍🍳 Your order is being prepared...'
                      }
                    </div>
                  )}
                </IonCardContent>
              </IonCard>
            ))}
          </div>
        )}
      </div>
    </IonContent>
  )
}