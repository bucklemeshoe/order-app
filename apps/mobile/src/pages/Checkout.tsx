import { useState, useCallback } from 'react'
import { useSupabase } from '../lib/useSupabase'
import { useCartStore } from '../store/cart'
import { useTaxCalculations } from '../hooks/useSettings'
import { LocationSharing } from '../components/LocationSharing'
import { locationToPostGIS } from '@order-app/lib'
import { IonContent, IonCard, IonCardContent, IonButton, IonIcon, IonSelect, IonSelectOption, IonItem, IonLabel, IonNote, IonSpinner } from '@ionic/react'
import { checkmarkCircleOutline, alertCircleOutline, timeOutline, arrowBackOutline } from 'ionicons/icons'

export default function CheckoutPage() {
  const supabase = useSupabase()
  const { items, clear } = useCartStore()
  const { settings, calculateSubtotal, calculateTax, calculateTotal } = useTaxCalculations()
  
  // Vanilla app uses a demo user - no authentication needed
  const user = { id: 'demo-user-123', name: 'Demo User', email: 'demo@example.com' }
  const [pickupTime, setPickupTime] = useState<string>('ASAP')
  const [shareLocation, setShareLocation] = useState(false)
  const [currentLocation, setCurrentLocation] = useState<{ latitude: number; longitude: number } | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  async function submitOrder() {
    setSubmitting(true)
    setError(null)
    setSuccess(null)
    try {
      if (items.length === 0) throw new Error('Cart is empty')

      // Ensure profile row exists (with better error handling)
      const { error: userError } = await supabase
        .from('users')
        .upsert({ 
          id: user.id, 
          email: user.email,
          name: user.name
        }, { onConflict: 'id' })
        .select()

      if (userError) {
        console.error('User upsert error:', userError)
        throw new Error(`Failed to create user profile: ${userError.message}`)
      }

      const isLocalDev = import.meta.env.VITE_SUPABASE_EXTERNAL_JWT === 'false'
      
      if (isLocalDev) {
        // Local development: Insert order directly via Supabase client
        const orderData: any = {
          user_id: user.id,
          items: items.map((i) => ({ 
            menu_item_id: i.id,
            quantity: i.quantity,
            name: i.name,
            price: i.price,
            variant: i.variant,
            extras: i.extras
          })),
          pickup_time: pickupTime === 'ASAP' ? new Date(Date.now() + 15 * 60000).toISOString() : new Date(pickupTime).toISOString(), // 15 min from now for ASAP
          share_location: shareLocation
          // Note: status has default 'pending', no need to specify
        }

        // Add location if sharing is enabled
        if (shareLocation && currentLocation) {
          orderData.current_location = locationToPostGIS(currentLocation.latitude, currentLocation.longitude)
        }

        // Get next order number for local development
        const { data: orderNumberData, error: orderNumberError } = await supabase
          .from('app_settings')
          .select('value')
          .eq('key', 'current_order_number')
          .single()

        if (orderNumberError) {
          console.error('Failed to get order number:', orderNumberError)
          throw new Error('Failed to generate order number')
        }

        const currentOrderNumber = parseInt(String(orderNumberData.value || '1001'))
        const nextOrderNumber = currentOrderNumber + 1

        // Add order number to order data
        orderData.order_number = currentOrderNumber

        console.log('Creating order with data:', orderData)

        const { data: order, error } = await supabase
          .from('orders')
          .insert(orderData)
          .select()
          .single()

        // Update next order number if insert was successful
        if (!error) {
          await supabase
            .from('app_settings')
            .update({ value: nextOrderNumber })
            .eq('key', 'current_order_number')
        }

        if (error) {
          console.error('Order insert error:', error)
          throw new Error(`Failed to create order: ${error.message}`)
        }
        setSuccess(`Order placed! Order #${order.order_number} Status: ${order.status}`)
        clear()
        
        // Redirect to order details after 2 seconds
        setTimeout(() => {
          window.location.href = `/orders/${order.id}`
        }, 2000)
      } else {
        // Cloud/production: Use Edge Function
        const payload = {
          user_id: user.id,
          items: items.map((i) => ({ 
            menu_item_id: i.id, 
            quantity: i.quantity,
            name: i.name,
            price: i.price,
            variant: i.variant,
            extras: i.extras
          })),
          pickup_time: pickupTime === 'ASAP' ? new Date().toISOString() : new Date(pickupTime).toISOString(),
          share_location: shareLocation,
        }

        const functionsUrl = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/create_order`
        
        // For vanilla app, use anon key instead of JWT
        const authToken = import.meta.env.VITE_SUPABASE_ANON_KEY
        
        const resp = await fetch(functionsUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${authToken}`,
          },
          body: JSON.stringify(payload),
        })
        const json = await resp.json()
        if (!resp.ok) throw new Error(json.error ?? 'Failed to create order')
        setSuccess(`Order placed. ID: ${json.id}`)
        clear()
      }
    } catch (e: any) {
      setError(e?.message ?? 'Failed to create order')
    } finally {
      setSubmitting(false)
    }
  }

  const handleLocationChange = useCallback((enabled: boolean, location?: { latitude: number; longitude: number }) => {
    setShareLocation(enabled)
    setCurrentLocation(location || null)
  }, [])

  return (
    <IonContent className="ion-padding">
      <div className="space-y-6 mt-10">
        {/* Header */}
        <div className="space-y-3">
          <IonButton 
            routerLink="/cart"
            fill="clear"
            color="warning"
            size="small"
            aria-label="Back to Cart"
          >
            <IonIcon icon={arrowBackOutline} slot="start" />
            Back to Cart
          </IonButton>
          <div className="text-center space-y-2">
            <h1 className="text-3xl font-bold text-gray-900">Checkout</h1>
            <p className="text-gray-600">Complete your order details</p>
          </div>
        </div>

        {/* Order Summary */}
        <IonCard>
          <IonCardContent>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Order Summary</h2>
            <div className="space-y-3">
              {items.map((item, index) => (
                <div key={`${item.id}-${index}`}>
                  <div className="flex justify-between items-center">
                    <div className="flex-1">
                      <span className="text-gray-900 font-medium">{item.quantity}x {item.name}</span>
                      {item.variant && (
                        <span className="text-gray-600"> ({item.variant.name})</span>
                      )}
                      {item.extras && item.extras.length > 0 && (
                        <div className="ml-4 mt-1">
                          {item.extras.map((extra, extraIndex) => (
                            <div key={extraIndex} className="text-sm text-gray-600">
                              + {extra.name}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                    <span className="font-semibold text-gray-900">R{(item.price * item.quantity).toFixed(2)}</span>
                  </div>
                </div>
              ))}
              <div className="border-t pt-2 mt-2 space-y-2">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span>R{calculateSubtotal(items).toFixed(2)}</span>
                </div>
                {settings.taxesEnabled && (
                  <div className="flex justify-between text-gray-600">
                    <span>Tax ({(settings.taxRate * 100).toFixed(1)}%)</span>
                    <span>R{calculateTax(calculateSubtotal(items)).toFixed(2)}</span>
                  </div>
                )}
                <div className="border-t border-gray-200 pt-2">
                  <div className="flex justify-between items-center font-bold text-lg">
                    <span className="text-gray-900">Total</span>
                    <span className="text-amber-600">R{calculateTotal(items).toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>
          </IonCardContent>
        </IonCard>

        {/* Pickup Time */}
        <IonCard>
          <IonCardContent>
            <IonItem lines="none" className="--padding-start: 0">
              <IonIcon icon={timeOutline} color="warning" slot="start" />
              <IonLabel>
                <h3 className="text-lg font-semibold text-gray-900">Pickup Time</h3>
                <p className="text-gray-600">When would you like to collect your order?</p>
              </IonLabel>
            </IonItem>
            
            <IonSelect
              value={pickupTime}
              placeholder="Select pickup time"
              onIonChange={(e) => setPickupTime((e as any).detail.value)}
              className="mt-3"
            >
              <IonSelectOption value="ASAP">ASAP (15 minutes)</IonSelectOption>
              <IonSelectOption value={new Date(Date.now() + 15 * 60 * 1000).toISOString()}>In 15 minutes</IonSelectOption>
              <IonSelectOption value={new Date(Date.now() + 30 * 60 * 1000).toISOString()}>In 30 minutes</IonSelectOption>
            </IonSelect>
          </IonCardContent>
        </IonCard>

        {/* Location Sharing */}
        <IonCard>
          <IonCardContent>
            <LocationSharing 
              onLocationChange={handleLocationChange}
              initialEnabled={shareLocation}
            />
          </IonCardContent>
        </IonCard>

        {/* Submit Button */}
        <div className="space-y-4">
          <IonButton
            expand="block"
            size="large"
            color="warning"
            onClick={submitOrder}
            disabled={submitting || items.length === 0}
          >
            {submitting ? (
              <>
                <IonSpinner name="crescent" />
                <span className="ml-2">Submitting Order...</span>
              </>
            ) : (
              <>
                <IonIcon icon={checkmarkCircleOutline} slot="start" />
                Place Order - R{items.reduce((sum, i) => sum + i.price * i.quantity, 0).toFixed(2)}
              </>
            )}
          </IonButton>

          {items.length === 0 && (
            <IonNote className="text-center block">
              Your cart is empty. Add items from the menu to continue.
            </IonNote>
          )}
        </div>

        {/* Error Message */}
        {error && (
          <IonCard color="danger">
            <IonCardContent>
              <div className="flex items-center space-x-2">
                <IonIcon icon={alertCircleOutline} color="light" />
                <span className="text-white font-medium">{error}</span>
              </div>
            </IonCardContent>
          </IonCard>
        )}

        {/* Success Message */}
        {success && (
          <IonCard color="success">
            <IonCardContent>
              <div className="flex items-center space-x-2">
                <IonIcon icon={checkmarkCircleOutline} color="light" />
                <span className="text-white font-medium">{success}</span>
              </div>
            </IonCardContent>
          </IonCard>
        )}
      </div>
    </IonContent>
  )
}

