"use client"

import { useMemo, useState } from "react"
import { Bell, Check, ChevronRight, Circle, CircleUserRound } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { cn } from "@/lib/utils"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

/**
 * Admin Dashboard (replicates the provided screenshot, adapted to our mobile styles)
 * Route: /admin
 */

type OrderStatus = "pending" | "preparing" | "ready" | "collected" | "cancelled"
type OrderItem = { name: string; qty: number; price: number }
type AdminOrder = {
  id: string
  placedAt: string
  pickupEta: string
  items: OrderItem[]
  total: number
  status: OrderStatus
}

const UI = {
  text: "text-neutral-900",
  muted: "text-neutral-600",
  border: "border-neutral-200",
  surface: "bg-white",
  surfaceAlt: "bg-neutral-50",
  accent: "text-yellow-600",
  accentBg: "bg-yellow-500",
}

export default function AdminPage() {
  const [tab, setTab] = useState<"active" | "completed" | "all">("active")
  const [orders, setOrders] = useState<AdminOrder[]>([
    {
      id: "c1c3e7b6",
      placedAt: "05:40 PM",
      pickupEta: "7m",
      items: [{ name: "Cappuccino", qty: 1, price: 5 }],
      total: 5,
      status: "preparing",
    },
    // You can add more demo orders here.
  ])

  const counts = useMemo(() => {
    const base = { total: orders.length, pending: 0, preparing: 0, ready: 0, collected: 0, cancelled: 0 }
    for (const o of orders) base[o.status as keyof typeof base] += 1
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

  function markReady(id: string) {
    setOrders((prev) => prev.map((o) => (o.id === id ? { ...o, status: "ready" } : o)))
  }

  function cancelOrder(id: string) {
    setOrders((prev) => prev.map((o) => (o.id === id ? { ...o, status: "cancelled" } : o)))
  }

  return (
    <main className={cn("min-h-[100dvh]", UI.surfaceAlt, UI.text)}>
      {/* Top nav (dark) */}
      <header className="sticky top-0 z-30 bg-neutral-900 text-white">
        <div className="mx-auto max-w-6xl px-4">
          <div className="flex items-center gap-4 py-3">
            <div className="text-sm font-medium">Order Admin</div>
            <span className="inline-flex items-center rounded-md bg-neutral-800 px-3 py-1 text-xs font-medium">
              Dashboard
            </span>
            <div className="ml-auto flex items-center gap-3">
              <button
                className="inline-flex h-8 w-8 items-center justify-center rounded-md hover:bg-white/10 transition-colors"
                aria-label="Notifications"
              >
                <Bell className="h-4 w-4" />
              </button>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button
                    className="inline-flex h-8 w-8 items-center justify-center rounded-full hover:bg-white/10 transition-colors"
                    aria-label="Profile menu"
                  >
                    <CircleUserRound className="h-5 w-5" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-40">
                  <DropdownMenuLabel>Profile</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onSelect={() => console.log("Settings")}>Settings</DropdownMenuItem>
                  <DropdownMenuItem onSelect={() => console.log("Sign out")}>Sign out</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </header>

      {/* Page content */}
      <div className="mx-auto max-w-6xl px-4 py-6 grid gap-6">
        {/* Header title and description */}
        <section className="grid gap-1">
          <h1 className="text-lg font-semibold tracking-tight">Order Management</h1>
          <p className={cn("text-sm", UI.muted)}>Monitor and manage all customer orders in real-time</p>
        </section>

        {/* Stat cards */}
        <section className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
          <StatCard label="Total Orders" value={counts.total} />
          <StatCard label="Pending" value={counts.pending} valueClass="text-yellow-600" />
          <StatCard label="Preparing" value={counts.preparing} valueClass="text-yellow-700" />
          <StatCard label="Ready" value={counts.ready} valueClass="text-green-600" />
          <StatCard label="Collected" value={counts.collected} valueClass="text-neutral-500" />
          <StatCard label="Cancelled" value={counts.cancelled} valueClass="text-red-600" />
        </section>

        {/* Tabs */}
        <section>
          <Tabs value={tab} onValueChange={(v) => setTab(v as any)}>
            <div className="flex items-center justify-end">
              <TabsList className="bg-transparent p-0 flex gap-4">
                <TabsTrigger
                  value="active"
                  className="rounded-full border border-neutral-200 data-[state=active]:bg-neutral-900 data-[state=active]:text-white data-[state=active]:border-neutral-900 px-3 py-1.5 text-xs"
                >
                  Active Orders
                </TabsTrigger>
                <TabsTrigger
                  value="completed"
                  className="rounded-full border border-neutral-200 data-[state=active]:bg-neutral-900 data-[state=active]:text-white data-[state=active]:border-neutral-900 px-3 py-1.5 text-xs"
                >
                  Completed
                </TabsTrigger>
                <TabsTrigger
                  value="all"
                  className="rounded-full border border-neutral-200 data-[state=active]:bg-neutral-900 data-[state=active]:text-white data-[state=active]:border-neutral-900 px-3 py-1.5 text-xs"
                >
                  All Orders
                </TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="active" className="mt-4">
              <OrdersBoard
                pending={groups.pending}
                preparing={groups.preparing}
                ready={groups.ready}
                onMarkReady={markReady}
                onCancel={cancelOrder}
              />
            </TabsContent>

            <TabsContent value="completed" className="mt-4">
              <EmptyOrGrid
                title="Completed Orders"
                description="Orders that were collected or cancelled."
                orders={completedOrders}
              />
            </TabsContent>

            <TabsContent value="all" className="mt-4">
              <EmptyOrGrid title="All Orders" description="All orders regardless of status." orders={orders} />
            </TabsContent>
          </Tabs>
        </section>
      </div>
    </main>
  )
}

/* Components */

function StatCard({ label, value, valueClass }: { label: string; value: number | string; valueClass?: string }) {
  return (
    <div className={cn("rounded-xl border p-3", UI.surface, UI.border)}>
      <div className="text-xs text-neutral-500">{label}</div>
      <div className={cn("mt-1 text-xl font-semibold text-neutral-900", valueClass)}>{value}</div>
    </div>
  )
}

function OrdersBoard({
  pending,
  preparing,
  ready,
  onMarkReady,
  onCancel,
}: {
  pending: AdminOrder[]
  preparing: AdminOrder[]
  ready: AdminOrder[]
  onMarkReady: (id: string) => void
  onCancel: (id: string) => void
}) {
  return (
    <section className="grid gap-6">
      <div className="grid gap-1">
        <h2 className="text-base font-semibold tracking-tight">Orders Board</h2>
        <p className={cn("text-xs", UI.muted)}>Live updates</p>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 items-start">
        {/* Pending */}
        <Column
          color="text-yellow-600"
          title={`Pending (${pending.length})`}
          emptyText="No pending orders"
          orders={pending}
          onMarkReady={onMarkReady}
          onCancel={onCancel}
        />
        {/* Preparing */}
        <Column
          color="text-orange-600"
          title={`Preparing (${preparing.length})`}
          emptyText="No orders in preparation"
          orders={preparing}
          onMarkReady={onMarkReady}
          onCancel={onCancel}
        />
        {/* Ready */}
        <Column
          color="text-green-600"
          title={`Ready (${ready.length})`}
          emptyText="No ready orders"
          orders={ready}
          onMarkReady={onMarkReady}
          onCancel={onCancel}
        />
      </div>
    </section>
  )
}

function Column({
  color,
  title,
  emptyText,
  orders,
  onMarkReady,
  onCancel,
}: {
  color: string
  title: string
  emptyText: string
  orders: AdminOrder[]
  onMarkReady: (id: string) => void
  onCancel: (id: string) => void
}) {
  return (
    <div className="grid gap-3">
      <div className="flex items-center gap-2">
        <Circle className={cn("h-2.5 w-2.5", color)} />
        <div className="font-medium">{title}</div>
      </div>
      <div className="rounded-xl border p-2 sm:p-3 min-h-[320px] flex flex-col gap-3 border-neutral-200 bg-white">
        {orders.length === 0 ? (
          <div className={cn("text-sm italic px-1 py-1", UI.muted)}>{emptyText}</div>
        ) : (
          orders.map((o) => <OrderCard key={o.id} order={o} onMarkReady={onMarkReady} onCancel={onCancel} />)
        )}
      </div>
    </div>
  )
}

function OrderCard({
  order,
  onMarkReady,
  onCancel,
}: { order: AdminOrder; onMarkReady: (id: string) => void; onCancel: (id: string) => void }) {
  const isPreparing = order.status === "preparing"
  return (
    <div className={cn("rounded-lg border", UI.border, UI.surface)}>
      <div className="p-3 sm:p-4">
        <div className="flex items-start justify-between">
          <div className="grid gap-0.5">
            <div className="text-sm font-semibold">{`Order #${order.id}`}</div>
            <div className={cn("text-xs", UI.muted)}>{order.placedAt}</div>
          </div>
          <span
            className={cn(
              "rounded-full px-2 py-0.5 text-[10px] font-medium border",
              order.status === "preparing"
                ? "bg-amber-50 text-amber-700 border-amber-200"
                : order.status === "ready"
                  ? "bg-green-50 text-green-700 border-green-200"
                  : order.status === "pending"
                    ? "bg-yellow-50 text-yellow-700 border-yellow-200"
                    : order.status === "collected"
                      ? "bg-neutral-100 text-neutral-700 border-neutral-200"
                      : "bg-red-50 text-red-700 border-red-200",
            )}
          >
            {order.status}
          </span>
        </div>

        <div className="mt-3 grid gap-2 text-sm">
          <div className="flex items-center justify-between">
            <div className="font-medium">Pickup:</div>
            <div className="text-neutral-700">{order.pickupEta}</div>
          </div>
          <div>
            <div className="font-medium">Items:</div>
            <ul className="mt-1 grid gap-1">
              {order.items.map((it, i) => (
                <li key={i} className="flex items-center justify-between text-sm">
                  <span className="text-neutral-800">
                    {it.qty}x {it.name}
                  </span>
                  <span className="text-neutral-900">{`$${(it.price * it.qty).toFixed(2)}`}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="flex items-center justify-between border-t border-neutral-200 pt-2">
            <div className="font-medium">Total:</div>
            <div className="font-semibold text-neutral-900">{`$${order.total.toFixed(2)}`}</div>
          </div>
        </div>

        <div className="mt-3 grid grid-cols-2 gap-2">
          <Button
            className={cn(
              "h-9 rounded-md text-sm font-medium",
              isPreparing
                ? "bg-green-600 hover:bg-green-700 text-white"
                : "bg-neutral-200 text-neutral-700 hover:bg-neutral-300",
            )}
            onClick={() => isPreparing && onMarkReady(order.id)}
            disabled={!isPreparing}
          >
            {isPreparing ? "Mark Ready" : "Ready"}
          </Button>
          <Button
            className="h-9 rounded-md text-sm font-medium bg-red-600 hover:bg-red-700 text-white"
            onClick={() => onCancel(order.id)}
          >
            Cancel
          </Button>
        </div>
      </div>
    </div>
  )
}

function EmptyOrGrid({ title, description, orders }: { title: string; description: string; orders: AdminOrder[] }) {
  if (orders.length === 0) {
    return (
      <div className={cn("rounded-xl border p-8 text-center", UI.surface, UI.border)}>
        <div className="mx-auto inline-flex h-8 w-8 items-center justify-center rounded-full bg-neutral-100 text-neutral-600">
          <Check className="h-4 w-4" />
        </div>
        <div className="mt-2 text-sm font-medium">{title}</div>
        <p className={cn("text-xs mt-1", UI.muted)}>{description}</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {orders.map((o) => (
        <div key={o.id} className={cn("rounded-xl border p-3", UI.surface, UI.border)}>
          <div className="flex items-center justify-between">
            <div className="text-sm font-semibold">{`Order #${o.id}`}</div>
            <ChevronRight className="h-4 w-4 text-neutral-400" />
          </div>
          <div className={cn("mt-1 text-xs", UI.muted)}>{o.placedAt}</div>
        </div>
      ))}
    </div>
  )
}
