import { useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useRealtimeOrder } from '@order-app/lib'
import { useSupabase } from '../lib/useSupabase'
import { useTaxCalculations } from '../hooks/useSettings'
import { IonContent, IonCard, IonCardContent, IonButton, IonIcon, IonBadge, IonSpinner } from '@ionic/react'
import { arrowBackOutline } from 'ionicons/icons'
import { formatCurrency, formatDateTime } from '../utils/format'
import { getStatusBadgeColor as getStatusBadgeColorUtil } from '../utils/status'

// Order interface defined in useRealtimeOrder hook

export function OrderDetailsPage() {
  const { orderId } = useParams()
  const supabase = useSupabase()
  const { settings, calculateSubtotal, calculateTax, calculateTotal } = useTaxCalculations()
  // Use real-time order hook for this specific order
  const userId = 'demo-user-123' // Vanilla app uses demo user
  const { order, loading, error } = useRealtimeOrder(supabase, orderId, userId)
  
  // Handle errors gracefully
  if (error) {
    console.error('Order details error:', error)
  }

  const getStatusStep = (currentStatus: string) => {
    const steps = ['pending', 'preparing', 'ready', 'collected']
    return steps.indexOf(currentStatus)
  }

  // Using formatDateTime from utils instead

  const getEstimatedTime = (status: string, createdAt: string, collectionTimeMinutes?: number, estimatedReadyAt?: string) => {
    const created = new Date(createdAt)
    const now = new Date()

    switch (status) {
      case 'pending':
        return 'Starting preparation soon...'
      case 'preparing':
        if (collectionTimeMinutes && estimatedReadyAt) {
          const readyTime = new Date(estimatedReadyAt)
          const remainingMs = readyTime.getTime() - now.getTime()
          const remainingMinutes = Math.max(0, Math.ceil(remainingMs / (1000 * 60)))
          
          if (remainingMinutes > 0) {
            return `Order ready for collection in ${remainingMinutes} minutes`
          } else {
            return 'Almost ready!'
          }
        } else {
          // No collection time set - show generic message
          return 'Your order is being prepared...'
        }
      case 'ready':
        return 'Ready for pickup now! 🎉'
      case 'collected':
        return 'Order completed'
      case 'cancelled':
        return 'Order was cancelled'
      default:
        return ''
    }
  }

  // Using getStatusBadgeColorUtil from utils instead

  if (loading) {
    return (
      <IonContent className="ion-padding">
        <div className="space-y-6 mt-10">
          <div className="text-center">
            <IonSpinner name="crescent" color="warning" />
            <h1 className="text-2xl font-bold text-gray-900 mt-4">Loading order details...</h1>
          </div>
        </div>
      </IonContent>
    )
  }

  if (error) {
    return (
      <IonContent className="ion-padding">
        <div className="space-y-6 mt-10 text-center">
          <h1 className="text-2xl font-bold text-gray-900">Order Not Found</h1>
          <p className="text-gray-600">The order you're looking for doesn't exist or you don't have permission to view it.</p>
          <Link to="/orders">
            <IonButton color="warning">
              <IonIcon icon={arrowBackOutline} slot="start" />
              Back to Orders
            </IonButton>
          </Link>
        </div>
      </IonContent>
    )
  }

  if (!order) {
    // Graceful fallback: toast-like banner + redirect after short delay
    useEffect(() => {
      const id = setTimeout(() => {
        window.location.replace('/orders')
      }, 1200)
      return () => clearTimeout(id)
    }, [])

    return (
      <IonContent className="ion-padding">
        <div className="text-center py-16 space-y-6 mt-10">
          <IonCard color="warning">
            <IonCardContent>
              <div className="text-center text-white font-medium">
                Order not found. Redirecting to your orders…
              </div>
            </IonCardContent>
          </IonCard>
          <IonButton 
            routerLink="/orders"
            color="warning"
            fill="solid"
            size="large"
          >
            Go to Orders
          </IonButton>
        </div>
      </IonContent>
    )
  }

  const currentStep = getStatusStep(order.status)
  const steps = [
    { key: 'pending', label: 'Order Received', icon: '📝' },
    { key: 'preparing', label: 'Preparing', icon: '👨‍🍳' },
    { key: 'ready', label: 'Ready', icon: '✅' },
    { key: 'collected', label: 'Collected', icon: '🎉' }
  ]

  return (
    <IonContent className="ion-padding">
      <div className="space-y-6 mt-10">
      {/* Header */}
      <div className="space-y-3">
        <IonButton 
          routerLink="/orders"
          fill="clear"
          color="warning"
          size="small"
        >
          <IonIcon icon={arrowBackOutline} slot="start" />
          Back to Orders
        </IonButton>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Order #{order.order_number || order.id.slice(0, 8)}
          </h1>
          <p className="text-gray-600">
            Placed on {formatDateTime(order.created_at)}
          </p>
        </div>
      </div>

      {/* Status Progress */}
      {order.status !== 'cancelled' && (
        <IonCard>
          <IonCardContent>
            <h2 className="text-lg font-semibold mb-6 text-gray-900">Order Progress</h2>
          
          <div className="relative">
            <div className="flex justify-between mb-6">
              {steps.map((step, index) => (
                <div key={step.key} className="flex flex-col items-center flex-1">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center text-xl border-2 transition-all duration-300 ${
                    index <= currentStep 
                      ? 'bg-gradient-to-br from-green-400 to-emerald-500 border-green-500 text-white shadow-lg scale-110'
                      : 'bg-gray-100 border-gray-300 text-gray-400'
                  }`}>
                    {step.icon}
                  </div>
                  <span className={`text-xs mt-2 font-medium text-center ${
                    index <= currentStep 
                      ? 'text-green-700'
                      : 'text-gray-400'
                  }`}>
                    {step.label}
                  </span>
                </div>
              ))}
            </div>
            
            {/* Progress Line */}
            <div className="absolute top-6 left-6 right-6 h-1 bg-gray-200 rounded-full -z-10">
              <div 
                className="h-full bg-gradient-to-r from-green-400 to-emerald-500 rounded-full transition-all duration-1000 ease-out"
                style={{ width: `${(currentStep / (steps.length - 1)) * 100}%` }}
              ></div>
            </div>
          </div>

          <div className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-200">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
                <span className="text-white text-sm">⏱️</span>
              </div>
              <p className="text-blue-700 font-medium">
                {getEstimatedTime(order.status, order.created_at, order.collection_time_minutes, order.estimated_ready_at)}
              </p>
            </div>
          </div>
          </IonCardContent>
        </IonCard>
      )}

      {/* Cancelled Status */}
      {order.status === 'cancelled' && (
        <IonCard color="danger">
          <IonCardContent>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                <span className="text-red-600 text-2xl">❌</span>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white">Order Cancelled</h3>
                <p className="text-red-100">This order has been cancelled and will not be prepared.</p>
              </div>
            </div>
          </IonCardContent>
        </IonCard>
      )}

      {/* Order Items */}
      <IonCard>
        <IonCardContent>
          <h2 className="text-lg font-semibold mb-4 text-gray-900">Order Items</h2>
        
        <div className="space-y-3">
          {order.items.map((item, index) => (
            <div key={index} className="py-2">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <span className="font-medium text-gray-900">
                    {item.quantity}x {item.name}
                    {item.variant && (
                      <span className="text-gray-600"> ({item.variant.name})</span>
                    )}
                  </span>
                  {item.extras && item.extras.length > 0 && (
                    <div className="ml-4 mt-1">
                      {item.extras.map((extra: any, extraIndex: number) => (
                        <div key={extraIndex} className="text-sm text-gray-600">
                          + {extra.name}
                        </div>
                      ))}
                    </div>
                  )}
                  {item.description && (
                    <p className="text-sm text-gray-600 mt-1">{item.description}</p>
                  )}
                </div>
                <span className="font-semibold text-gray-900">
                  {formatCurrency(item.price * item.quantity)}
                </span>
              </div>
            </div>
          ))}
        </div>

        <div className="border-t border-gray-200 pt-4 mt-4 space-y-2">
          <div className="flex justify-between text-gray-600">
            <span>Subtotal</span>
            <span>{formatCurrency(calculateSubtotal(order.items))}</span>
          </div>
          {settings.taxesEnabled && (
            <div className="flex justify-between text-gray-600">
              <span>Tax ({(settings.taxRate * 100).toFixed(1)}%)</span>
              <span>{formatCurrency(calculateTax(calculateSubtotal(order.items)))}</span>
            </div>
          )}
          <div className="border-t border-gray-200 pt-2">
            <div className="flex justify-between items-center font-semibold text-lg">
              <span className="text-gray-900">Total</span>
              <span className="text-amber-600">
                {formatCurrency(calculateTotal(order.items))}
              </span>
            </div>
          </div>
        </div>
        </IonCardContent>
      </IonCard>

      {/* Order Details */}
      <IonCard>
        <IonCardContent>
          <h2 className="text-lg font-semibold mb-4 text-gray-900">Order Details</h2>
          
          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">Order ID</span>
              <span className="font-mono text-gray-900">{order.id}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Status</span>
              <IonBadge color={getStatusBadgeColorUtil(order.status)}>
                {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
              </IonBadge>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Pickup Time</span>
              <span className="text-gray-900">{formatDateTime(order.pickup_time)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Location Sharing</span>
              <span className="text-gray-900">{order.share_location ? 'Enabled' : 'Disabled'}</span>
            </div>
          </div>
        </IonCardContent>
      </IonCard>
      </div>
    </IonContent>
  )
}