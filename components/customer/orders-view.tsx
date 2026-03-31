"use client"

import { cn } from "@/lib/utils"
import { UI } from "@/lib/theme"
import { formatCurrency, formatDate } from "@/lib/helpers/formatting"
import { RefreshCw, Coffee, History } from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { StatusBadge } from "@/components/shared"
import type { Order } from "@/types"

function calculateTotal(order: Order): number {
  if (order.total_amount) return order.total_amount
  // Legacy fallback for orders without stored totals
  const subtotal = (order.items || []).reduce((sum, item: any) => {
    const itemPrice = item.variant?.price || item.price || 0
    const extrasPrice = (item.extras || []).reduce((s: number, e: any) => s + (e.price || 0), 0)
    return sum + (itemPrice + extrasPrice) * (item.quantity || 1)
  }, 0)
  return +(subtotal + subtotal * 0.15).toFixed(2)
}

export function OrdersView({
  tab,
  onTabChange,
  onOpenDetail,
  orders,
  loading,
  onRefresh,
}: {
  tab: "current" | "past"
  onTabChange: (t: "current" | "past") => void
  onOpenDetail: (order: Order) => void
  orders: Order[]
  loading: boolean
  onRefresh: () => void
}) {
  const currentOrders = orders.filter(
    (o) =>
      o.status === "pending" ||
      o.status === "awaiting_payment" ||
      o.status === "paid" ||
      o.status === "preparing" ||
      o.status === "ready" ||
      o.status === "out_for_delivery"
  )
  const pastOrders = orders.filter(
    (o) =>
      o.status === "collected" ||
      o.status === "delivered" ||
      o.status === "cancelled"
  )

  if (loading) {
    return (
      <section className="grid gap-4">
        <div className="flex items-center justify-between">
          <Skeleton className="h-6 w-20" />
          <Skeleton className="h-4 w-16" />
        </div>
        <div className="grid grid-cols-2 gap-2">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
        </div>
        <div className="grid gap-2">
          {[1, 2].map((i) => (
            <div key={i} className="rounded-xl border p-4">
              <div className="flex items-center justify-between mb-2">
                <Skeleton className="h-5 w-24" />
                <Skeleton className="h-6 w-16 rounded-full" />
              </div>
              <Skeleton className="h-4 w-20 mb-1" />
              <Skeleton className="h-4 w-32" />
            </div>
          ))}
        </div>
      </section>
    )
  }

  const renderOrder = (order: Order) => (
    <button
      key={order.id}
      className={cn(
        "rounded-xl border p-4 text-left w-full transition-all duration-200 active:scale-[0.98] active:shadow-sm",
        "bg-card text-card-foreground border-border hover:bg-accent/50 hover:shadow-md hover:border-brand/40"
      )}
      onClick={() => onOpenDetail(order)}
      aria-label={`Open order ${order.order_number || order.id.slice(0, 8)}`}
    >
      <div className="flex items-center justify-between">
        <div className="font-medium">Order #{order.order_number || order.id.slice(0, 8)}</div>
        <StatusBadge status={order.status} />
      </div>
      <div className={cn("mt-1 text-sm", UI.muted)}>{formatDate(order.created_at)}</div>
      <div className="mt-1 text-sm text-muted-foreground">
        Pickup: {order.pickup_time ? new Date(order.pickup_time).toLocaleString() : "Not set"}
      </div>
      <div className="mt-1 text-sm text-foreground">
        {order.items?.length || 0} items • {formatCurrency(calculateTotal(order))}
      </div>
    </button>
  )

  return (
    <section className="grid gap-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Orders</h2>
        {loading && (
          <div className="flex items-center gap-2 text-sm text-neutral-600">
            <RefreshCw className="h-4 w-4 animate-spin" />
            Refreshing...
          </div>
        )}
      </div>

      <Tabs value={tab} onValueChange={(v) => onTabChange(v as "current" | "past")}>
        <TabsList className="grid grid-cols-2 w-full">
          <TabsTrigger value="current">Current ({currentOrders.length})</TabsTrigger>
          <TabsTrigger value="past">Past ({pastOrders.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="current" className="mt-3 grid gap-2">
          {currentOrders.length === 0 ? (
            <div className={cn("rounded-xl border p-8 text-center", UI.surface, UI.border)}>
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-brand/10">
                <Coffee className="h-8 w-8 text-brand" />
              </div>
              <div className="mt-4 text-lg font-semibold">No current orders</div>
              <p className={cn("mt-1 text-sm", UI.muted)}>
                When you place an order, it will appear here.
              </p>
            </div>
          ) : (
            currentOrders.map(renderOrder)
          )}
        </TabsContent>

        <TabsContent value="past" className="mt-3 grid gap-2">
          {pastOrders.length === 0 ? (
            <div className={cn("rounded-xl border p-8 text-center", UI.surface, UI.border)}>
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-brand/10">
                <History className="h-8 w-8 text-brand" />
              </div>
              <div className="mt-4 text-lg font-semibold">No past orders</div>
              <p className={cn("mt-1 text-sm", UI.muted)}>
                Your completed and cancelled orders will show up here.
              </p>
            </div>
          ) : (
            pastOrders.map(renderOrder)
          )}
        </TabsContent>
      </Tabs>
    </section>
  )
}
