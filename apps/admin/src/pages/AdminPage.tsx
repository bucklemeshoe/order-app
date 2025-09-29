"use client"

import { useMemo, useState, useEffect } from "react"
import { Check, ChevronRight, Circle, Clock, AlertTriangle } from "lucide-react"
import { createSupabaseClient } from '@order-app/lib'
import {
  Button as BaseButton,
  Tabs as BaseTabs,
  TabsContent as BaseTabsContent,
  TabsList as BaseTabsList,
  TabsTrigger as BaseTabsTrigger,
  Card as BaseCard,
  CardContent as BaseCardContent,
  CardHeader as BaseCardHeader,
  CardTitle as BaseCardTitle,
  Dialog as BaseDialog,
  DialogContent as BaseDialogContent,
  DialogHeader as BaseDialogHeader,
  DialogTitle as BaseDialogTitle,
  DialogDescription as BaseDialogDescription,
  DialogFooter as BaseDialogFooter,
  Badge as BaseBadge,
  cn
} from "@order-app/design-system"
import { withInspector } from "../lib/inspector"

// Create inspectable versions of components
const Button = withInspector(BaseButton, 'Button', '@order-app/design-system')
const Tabs = withInspector(BaseTabs, 'Tabs', '@order-app/design-system')
const TabsContent = withInspector(BaseTabsContent, 'TabsContent', '@order-app/design-system')
const TabsList = withInspector(BaseTabsList, 'TabsList', '@order-app/design-system')
const TabsTrigger = withInspector(BaseTabsTrigger, 'TabsTrigger', '@order-app/design-system')
const Card = withInspector(BaseCard, 'Card', '@order-app/design-system')
const CardContent = withInspector(BaseCardContent, 'CardContent', '@order-app/design-system')
const CardHeader = withInspector(BaseCardHeader, 'CardHeader', '@order-app/design-system')
const CardTitle = withInspector(BaseCardTitle, 'CardTitle', '@order-app/design-system')
const Dialog = withInspector(BaseDialog, 'Dialog', '@order-app/design-system')
const DialogContent = withInspector(BaseDialogContent, 'DialogContent', '@order-app/design-system')
const DialogHeader = withInspector(BaseDialogHeader, 'DialogHeader', '@order-app/design-system')
const DialogTitle = withInspector(BaseDialogTitle, 'DialogTitle', '@order-app/design-system')
const DialogDescription = withInspector(BaseDialogDescription, 'DialogDescription', '@order-app/design-system')
const DialogFooter = withInspector(BaseDialogFooter, 'DialogFooter', '@order-app/design-system')
const Badge = withInspector(BaseBadge, 'Badge', '@order-app/design-system')

type OrderStatus = "pending" | "preparing" | "ready" | "collected" | "cancelled"
type OrderItem = { name: string; qty: number; price: number }
type AdminOrder = {
  id: string
  order_number?: number
  placedAt: string
  pickupEta: string
  items: OrderItem[]
  total: number
  status: OrderStatus
  collection_time_minutes?: number
  estimated_ready_at?: string
}



export default function AdminPage({
  orders = [],
  loading = false,
  error = null,
  onUpdateStatus,
}: {
  orders?: AdminOrder[]
  loading?: boolean
  error?: string | null
  onUpdateStatus?: (id: string, status: string, collectionTime?: number) => void
}) {
  const [tab, setTab] = useState<"active" | "completed" | "all">("active")

  const counts = useMemo(() => {
    const base = { total: orders.length, pending: 0, preparing: 0, ready: 0, collected: 0, cancelled: 0 }
    for (const o of orders) (base as any)[o.status] += 1
    return base
  }, [orders])

  const activeOrders = orders.filter((o) => o.status === "pending" || o.status === "preparing" || o.status === "ready")
  const completedOrders = orders.filter((o) => o.status === "collected" || o.status === "cancelled")
  const shownOrders = tab === "active" ? activeOrders : tab === "completed" ? completedOrders : orders

  const groups: Record<"pending" | "preparing" | "ready", AdminOrder[]> = {
    pending: shownOrders.filter((o) => o.status === "pending"),
    preparing: shownOrders.filter((o) => o.status === "preparing"),
    ready: shownOrders.filter((o) => o.status === "ready"),
  }



  return (
    <div className="grid gap-6">
        <section className="grid gap-1">
          <h1 className="text-lg font-semibold tracking-tight text-foreground">Order Management</h1>
          <p className="text-sm text-muted-foreground">Monitor and manage all customer orders in real-time</p>
        </section>
        <section className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
          <StatCard label="Total Orders" value={counts.total} />
          <StatCard label="Pending" value={counts.pending} valueClass="text-yellow-600" />
          <StatCard label="Preparing" value={counts.preparing} valueClass="text-yellow-700" />
          <StatCard label="Ready" value={counts.ready} valueClass="text-green-600" />
          <StatCard label="Collected" value={counts.collected} valueClass="text-neutral-500" />
          <StatCard label="Cancelled" value={counts.cancelled} valueClass="text-red-600" />
        </section>
        <section>
          <Tabs value={tab} onValueChange={(v) => setTab(v as any)}>
            <div className="flex items-center justify-end">
              <TabsList>
                <TabsTrigger value="active">Active Orders</TabsTrigger>
                <TabsTrigger value="completed">Completed</TabsTrigger>
                <TabsTrigger value="all">All Orders</TabsTrigger>
              </TabsList>
            </div>
            <TabsContent value="active" className="mt-4">
              <OrdersBoard pending={groups.pending} preparing={groups.preparing} ready={groups.ready} onStatusUpdate={onUpdateStatus} />
            </TabsContent>
            <TabsContent value="completed" className="mt-4">
              <EmptyOrGrid title="Completed Orders" description="Orders that were collected or cancelled." orders={completedOrders} />
            </TabsContent>
            <TabsContent value="all" className="mt-4">
              <EmptyOrGrid title="All Orders" description="All orders regardless of status." orders={orders} />
            </TabsContent>
          </Tabs>
        </section>
    </div>
  )
}

// Create StatCard as a proper React component with inspector support
const StatCard = withInspector(
  ({ label, value, valueClass }: { label: string; value: number | string; valueClass?: string }) => {
    return (
      <Card>
        <CardContent className="p-3 text-center">
          <div className="text-xs text-muted-foreground">{label}</div>
          <div className={cn("mt-1 text-xl font-semibold text-foreground", valueClass)}>{value}</div>
        </CardContent>
      </Card>
    )
  },
  'StatCard',
  'AdminPage.tsx (local component)',
  'apps/admin/src/pages/AdminPage.tsx',
  112
)

// Create AcceptingOrdersBadge component
const AcceptingOrdersBadge = withInspector(
  () => {
    const [closingTime, setClosingTime] = useState<string | null>(null)
    const [isLoading, setIsLoading] = useState(true)
    const [appUnavailable, setAppUnavailable] = useState(false)
    
    useEffect(() => {
      const fetchBusinessHours = async () => {
        try {
          const supabase = createSupabaseClient()
          const currentTime = new Date()
          
          console.log('🕐 Admin checking business hours at:', currentTime.toString())
          
          // Check if app is manually set to unavailable
          const { data: unavailableData } = await supabase
            .from('app_settings')
            .select('value')
            .eq('key', 'app_unavailable')
            .single()
          
          if (unavailableData?.value === true) {
            setAppUnavailable(true)
            setIsLoading(false)
            return
          }
          
          // Get both special hours and weekly hours
          const { data: specialHoursData } = await supabase
            .from('app_settings')
            .select('value')
            .eq('key', 'special_hours')
            .single()
            
          const { data: weeklyData } = await supabase
            .from('app_settings')
            .select('value')
            .eq('key', 'weekly_hours')
            .single()
          
          const todayString = currentTime.toISOString().split('T')[0]
          const specialHours = specialHoursData?.value && Array.isArray(specialHoursData.value) ? specialHoursData.value : []
          const weeklyHours = weeklyData?.value
          
          // Check if today has special hours
          const todaySpecial = specialHours.find((special: any) => special.date === todayString)
          
          let isCurrentlyOpen = false
          let endTime = ''
          
          if (todaySpecial) {
            // Using special hours
            endTime = todaySpecial.endTime
            
            // Check if we're currently within special hours
            const currentHours = currentTime.getHours().toString().padStart(2, '0')
            const currentMinutes = currentTime.getMinutes().toString().padStart(2, '0')
            const currentTimeString = `${currentHours}:${currentMinutes}`
            
            isCurrentlyOpen = currentTimeString >= todaySpecial.startTime && currentTimeString <= todaySpecial.endTime
            
            console.log('📅 Using special hours:', {
              current: currentTimeString,
              start: todaySpecial.startTime,
              end: todaySpecial.endTime,
              isOpen: isCurrentlyOpen
            })
            
          } else if (weeklyHours) {
            // Using regular weekly hours
            const dayNames = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday']
            const todayKey = dayNames[currentTime.getDay()]
            const todayHours = weeklyHours[todayKey]
            
            if (todayHours && todayHours.enabled) {
              endTime = todayHours.endTime
              
              // Check if we're currently within business hours
              const currentHours = currentTime.getHours().toString().padStart(2, '0')
              const currentMinutes = currentTime.getMinutes().toString().padStart(2, '0')
              const currentTimeString = `${currentHours}:${currentMinutes}`
              
              isCurrentlyOpen = currentTimeString >= todayHours.startTime && currentTimeString <= todayHours.endTime
              
              console.log('📊 Using weekly hours:', {
                day: todayKey,
                current: currentTimeString,
                start: todayHours.startTime,
                end: todayHours.endTime,
                enabled: todayHours.enabled,
                isOpen: isCurrentlyOpen
              })
            } else {
              // Day is disabled
              setClosingTime('Closed today')
              setAppUnavailable(false)
              setIsLoading(false)
              return
            }
          } else {
            // Default fallback
            endTime = '17:00'
            isCurrentlyOpen = true // Assume open as fallback
          }
          
          // If we're outside business hours, show as closed
          if (!isCurrentlyOpen) {
            setAppUnavailable(true) // This will show as "Orders Unavailable"
            setIsLoading(false)
            return
          }
          
          // We're open - show closing time
          const time = new Date(`2000-01-01T${endTime}:00`)
          setClosingTime(time.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' }))
          setAppUnavailable(false)
          
        } catch (err) {
          console.warn('Could not fetch business hours:', err)
          // Default fallback - assume open
          const time = new Date(`2000-01-01T17:00:00`)
          setClosingTime(time.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' }))
          setAppUnavailable(false)
        } finally {
          setIsLoading(false)
        }
      }
      
      fetchBusinessHours()
      
      // Refresh every 10 seconds to keep the status accurate
      const interval = setInterval(fetchBusinessHours, 10000)
      return () => clearInterval(interval)
    }, [])
    
    if (isLoading) {
      return (
        <Badge variant="live" className="gap-1.5">
          <span className="h-1.5 w-1.5 bg-green-500 rounded-full"></span>
          Live Updates
        </Badge>
      )
    }
    
    if (appUnavailable) {
      return (
        <Badge variant="cancelled" className="gap-1.5">
          <span className="h-1.5 w-1.5 bg-red-500 rounded-full"></span>
          Orders Unavailable
        </Badge>
      )
    }
    
    if (closingTime === 'Closed today') {
      return (
        <Badge variant="collected" className="gap-1.5">
          <span className="h-1.5 w-1.5 bg-gray-500 rounded-full"></span>
          Closed Today
        </Badge>
      )
    }
    
    return (
      <Badge variant="live" className="gap-1.5">
        <span className="h-1.5 w-1.5 bg-green-500 rounded-full"></span>
        Accepting Orders until {closingTime}
      </Badge>
    )
  },
  'AcceptingOrdersBadge',
  'AdminPage.tsx (local component)',
  'apps/admin/src/pages/AdminPage.tsx',
  130
)

// Create OrdersBoard as a proper React component with inspector support
const OrdersBoard = withInspector(
  ({ pending, preparing, ready, onStatusUpdate }: { pending: AdminOrder[]; preparing: AdminOrder[]; ready: AdminOrder[]; onStatusUpdate?: (id: string, status: string, collectionTime?: number) => void }) => {
    return (
      <section className="grid gap-6">
        <div className="flex items-center gap-2">
          <h2 className="text-base font-semibold tracking-tight text-foreground">Orders Board</h2>
          <AcceptingOrdersBadge />
        </div>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 items-start">
          <Column color="text-yellow-600" title={`Pending (${pending.length})`} emptyText="No pending orders" orders={pending} onStatusUpdate={onStatusUpdate} />
          <Column color="text-orange-600" title={`Preparing (${preparing.length})`} emptyText="No orders in preparation" orders={preparing} onStatusUpdate={onStatusUpdate} />
          <Column color="text-green-600" title={`Ready (${ready.length})`} emptyText="No ready orders" orders={ready} onStatusUpdate={onStatusUpdate} />
        </div>
      </section>
    )
  },
  'OrdersBoard',
  'AdminPage.tsx (local component)',
  'apps/admin/src/pages/AdminPage.tsx',
  130
)

// Create TimerHeader as a proper React component with inspector support
const TimerHeader = withInspector(
  ({ isPreparing, getStoredTimer, remainingTime }: { 
    isPreparing: boolean; 
    getStoredTimer: () => any; 
    remainingTime: string | null 
  }) => {
    const storedTimer = getStoredTimer()
    
    if (isPreparing && storedTimer && remainingTime) {
      return (
        <div className={`border-l border-t border-r border-b px-3 py-2 rounded-t-lg ${
          remainingTime === "Ready!" 
            ? "bg-green-50 border-green-200" 
            : "bg-orange-50 border-orange-200"
        }`}>
          <div className={`flex items-center gap-2 ${
            remainingTime === "Ready!" 
              ? "text-green-700" 
              : "text-orange-700"
          }`}>
            {remainingTime === "Ready!" ? (
              <Check className="h-4 w-4" />
            ) : (
              <Clock className="h-4 w-4" />
            )}
            <span className="text-sm font-medium">
              {remainingTime === "Ready!" ? "Ready for pickup!" : `Ready in ${remainingTime}`}
            </span>
          </div>
        </div>
      )
    }
    
    return null
  },
  'TimerHeader',
  'AdminPage.tsx (local component)',
  'apps/admin/src/pages/AdminPage.tsx',
  153
)

// Create Column as a proper React component with inspector support
const Column = withInspector(
  ({ color, title, emptyText, orders, onStatusUpdate }: { color: string; title: string; emptyText: string; orders: AdminOrder[]; onStatusUpdate?: (id: string, status: string, collectionTime?: number) => void }) => {
    return (
      <div className="grid gap-3">
        <div className="flex items-center gap-2">
          <Circle className={cn("h-2.5 w-2.5", color)} />
          <div className="font-medium text-foreground">{title}</div>
        </div>
        <Card className="p-2 sm:p-3 min-h-[320px] flex flex-col gap-3">
          {orders.length === 0 ? (
            <div className="text-sm italic px-1 py-1 text-muted-foreground">{emptyText}</div>
          ) : (
            orders.map((o) => <OrderCard key={o.id} order={o} onStatusUpdate={onStatusUpdate} />)
          )}
        </Card>
      </div>
    )
  },
  'Column',
  'AdminPage.tsx (local component)',
  'apps/admin/src/pages/AdminPage.tsx',
  153
)

// Create OrderCard as a proper React component with inspector support  
const OrderCard = withInspector(
  ({ order, onStatusUpdate }: { order: AdminOrder; onStatusUpdate?: (id: string, status: string, collectionTime?: number) => void }) => {
  const [selectedCollectionTime, setSelectedCollectionTime] = useState<number | null>(null)
  const [showCancelConfirm, setShowCancelConfirm] = useState(false)
  const [remainingTime, setRemainingTime] = useState<string | null>(null)
  const isPending = order.status === "pending"
  const isPreparing = order.status === "preparing"
  const isReady = order.status === "ready"
  const isTerminal = order.status === 'collected' || order.status === 'cancelled'

  // Use localStorage to persist timer data across re-renders
  const getTimerKey = (orderId: string) => `timer_${orderId}`
  
  // Get stored timer data
  const getStoredTimer = () => {
    try {
      const stored = localStorage.getItem(getTimerKey(order.id))
      return stored ? JSON.parse(stored) : null
    } catch {
      return null
    }
  }

  // Store timer data
  const storeTimer = (collectionTime: number, startTime: Date) => {
    const timerData = {
      collectionTime,
      startTime: startTime.toISOString(),
      orderId: order.id
    }
    localStorage.setItem(getTimerKey(order.id), JSON.stringify(timerData))
  }

  // When order becomes preparing, store the timer data (fallback)
  useEffect(() => {
    if (isPreparing && selectedCollectionTime && !getStoredTimer()) {
      storeTimer(selectedCollectionTime, new Date())
    }
  }, [isPreparing, selectedCollectionTime, order.id])

  // Countdown timer logic for preparing orders
  useEffect(() => {
    const storedTimer = getStoredTimer()
    
    if (!isPreparing || !storedTimer) {
      setRemainingTime(null)
      return
    }

    const { collectionTime, startTime } = storedTimer
    const startDate = new Date(startTime)

    const updateTimer = () => {
      const now = new Date()
      const readyTime = new Date(startDate.getTime() + collectionTime * 60 * 1000)
      const diffMs = readyTime.getTime() - now.getTime()
      
      if (diffMs <= 0) {
        setRemainingTime("Ready!")
        // Clean up localStorage
        localStorage.removeItem(getTimerKey(order.id))
        // Auto-trigger "Mark Ready" when timer reaches zero
        if (onStatusUpdate) {
          onStatusUpdate(order.id, 'ready')
        }
        return
      }
      
      const totalSeconds = Math.ceil(diffMs / 1000)
      const minutes = Math.floor(totalSeconds / 60)
      const seconds = totalSeconds % 60
      
      setRemainingTime(`${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`)
    }

    // Update immediately
    updateTimer()
    
    // Update every second
    const interval = setInterval(updateTimer, 1000)
    
    return () => clearInterval(interval)
  }, [isPreparing, order.id, onStatusUpdate])
  
  const getNextActions = (currentStatus: string) => {
    switch (currentStatus) {
      case 'pending':
        return [
          { label: 'Start Preparing', status: 'preparing', color: 'bg-orange-600 hover:bg-orange-700' },
          { label: 'Cancel', status: 'cancelled', color: 'bg-red-600 hover:bg-red-700' }
        ]
      case 'preparing':
        return [
          { label: 'Mark Ready', status: 'ready', color: 'bg-green-600 hover:bg-green-700' },
          { label: 'Cancel', status: 'cancelled', color: 'bg-red-600 hover:bg-red-700' }
        ]
      case 'ready':
        return [
          { label: 'Mark Collected', status: 'collected', color: 'bg-gray-600 hover:bg-gray-700' }
        ]
      default:
        return []
    }
  }
  
  const nextActions = getNextActions(order.status)
  return (
    <Card className="border">
      <TimerHeader 
        isPreparing={isPreparing}
        getStoredTimer={getStoredTimer}
        remainingTime={remainingTime}
      />
      <CardContent className="p-3 sm:p-4">
        <div className="flex items-start justify-between">
          <div className="grid gap-0.5">
            <div className="text-sm font-semibold text-foreground">{order.order_number ? `Order #${order.order_number}` : `Order #${order.id.slice(0, 8)}`}</div>
            <div className="text-xs text-muted-foreground">{order.placedAt}</div>
          </div>
          <Badge variant={order.status as any}>
            {order.status}
          </Badge>
        </div>
        <div className="mt-3 grid gap-2 text-sm">
          <div className="flex items-center justify-between"><div className="font-medium text-foreground">Pickup:</div><div className="text-muted-foreground">{order.pickupEta}</div></div>
          <div>
            <div className="font-medium text-foreground">Items:</div>
            <ul className="mt-1 grid gap-1">
              {order.items.map((it, i) => (
                <li key={i} className="flex items-center justify-between text-sm"><span className="text-foreground">{it.qty}x {it.name}</span><span className="text-foreground">{`R${(it.price * it.qty).toFixed(2)}`}</span></li>
              ))}
            </ul>
          </div>
          <div className="flex items-center justify-between border-t border-border pt-2">
            <div className="font-medium text-foreground">Total:</div>
            <div className="font-semibold text-foreground">R{order.total.toFixed(2)}</div>
          </div>
        </div>

        {/* Collection Time Selection - only show for pending orders */}
        {isPending && (
          <div className="mt-3 pt-3 border-t border-border">
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Collection Time:</label>
              <div className="flex space-x-2">
                {[15, 30, 45].map((minutes) => (
                  <button
                    key={minutes}
                    onClick={() => setSelectedCollectionTime(minutes)}
                    className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                      selectedCollectionTime === minutes
                        ? 'bg-blue-600 text-white'
                        : 'bg-muted text-muted-foreground hover:bg-muted/80'
                    }`}
                  >
                    {minutes}min
                  </button>
                ))}
              </div>
              {selectedCollectionTime && (
                <p className="text-xs text-muted-foreground">
                  ⏱️ {selectedCollectionTime} minute countdown will start when preparing
                </p>
              )}
            </div>
          </div>
        )}
        <div className="mt-3 grid grid-cols-2 gap-2">
          <Button
            variant={isPending || isPreparing || isReady ? "default" : "secondary"}
            size="sm"
            onClick={() => {
              if (isPending) {
                // Store timer data BEFORE status change
                if (selectedCollectionTime) {
                  storeTimer(selectedCollectionTime, new Date())
                }
                // Include collection time when starting to prepare
                onStatusUpdate?.(order.id, 'preparing', selectedCollectionTime || undefined)
              }
              else if (isPreparing) onStatusUpdate?.(order.id, 'ready')
              else if (isReady) onStatusUpdate?.(order.id, 'collected')
            }}
            disabled={isTerminal}
          >
            {isPending ? "Start Preparing" : isPreparing ? "Mark Ready" : isReady ? "Mark Collected" : "Ready"}
          </Button>
          {!isTerminal && (
            <Button
              variant="destructive"
              size="sm"
              onClick={() => setShowCancelConfirm(true)}
            >
              Cancel
            </Button>
          )}
        </div>
      </CardContent>
      
      {/* Cancel Confirmation Modal */}
      <Dialog open={showCancelConfirm} onOpenChange={setShowCancelConfirm}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-red-600" />
              Cancel Order?
            </DialogTitle>
            <DialogDescription>
              Are you sure you want to cancel this order? This action cannot be undone and the customer will be notified.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowCancelConfirm(false)}>
              Keep Order
            </Button>
            <Button 
              variant="destructive" 
              onClick={() => {
                onStatusUpdate?.(order.id, 'cancelled')
                setShowCancelConfirm(false)
              }}
            >
              Yes, Cancel Order
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  )
  },
  'OrderCard',
  'AdminPage.tsx (local component)',
  'apps/admin/src/pages/AdminPage.tsx',
  165
)

// Create EmptyOrGrid as a proper React component with inspector support
const EmptyOrGrid = withInspector(
  ({ title, description, orders }: { title: string; description: string; orders: AdminOrder[] }) => {
    if (orders.length === 0) {
      return (
        <Card className="p-8 text-center">
          <div className="mx-auto inline-flex h-8 w-8 items-center justify-center rounded-full bg-muted text-muted-foreground"><Check className="h-4 w-4" /></div>
          <div className="mt-2 text-sm font-medium text-foreground">{title}</div>
          <p className="text-xs mt-1 text-muted-foreground">{description}</p>
        </Card>
      )
    }
    return (
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {orders.map((o) => (
          <Card key={o.id} className="p-3">
            <div className="flex items-center justify-between"><div className="text-sm font-semibold text-foreground">{`Order #${o.id}`}</div><ChevronRight className="h-4 w-4 text-muted-foreground" /></div>
            <div className="mt-1 text-xs text-muted-foreground">{o.placedAt}</div>
          </Card>
        ))}
      </div>
    )
  },
  'EmptyOrGrid',
  'AdminPage.tsx (local component)',
  'apps/admin/src/pages/AdminPage.tsx',
  273
)

