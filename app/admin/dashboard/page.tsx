"use client"

import { useEffect, useMemo, useState } from "react"
import { Loader2, DollarSign, ShoppingBag, Clock, TrendingUp, RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { getAllOrders } from "@/lib/api/orders"
import { formatCurrency } from "@/lib/helpers/formatting"
import { createSupabaseBrowser } from "@/lib/supabase/browser"
import {
  AdminPage,
  AdminHeader,
} from "@/components/admin/admin-ui"
import type { Order } from "@/types"



export default function AdminDashboardPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)

  async function loadOrders(showSpinner = true) {
    if (showSpinner) setRefreshing(true)
    try {
      const data = await getAllOrders()
      setOrders(data)
    } catch (err) {
      console.error("Failed to load orders:", err)
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  useEffect(() => { loadOrders(false) }, [])

  // Realtime
  useEffect(() => {
    const supabase = createSupabaseBrowser()
    const channel = supabase
      .channel("dashboard-orders")
      .on("postgres_changes", { event: "*", schema: "public", table: "orders" }, () => loadOrders(false))
      .subscribe()
    return () => { supabase.removeChannel(channel) }
  }, [])

  const terminalStatuses = new Set(["collected", "delivered", "cancelled"])
  const activeOrders = orders.filter((o) => !terminalStatuses.has(o.status))

  const todayRevenue = useMemo(() => {
    const today = new Date().toISOString().split("T")[0]
    return orders
      .filter((o) => o.created_at.startsWith(today) && o.status !== "cancelled")
      .reduce((sum, o) => sum + (o.total_amount || 0), 0)
  }, [orders])

  const todayOrdersCount = useMemo(() => {
    const today = new Date().toISOString().split("T")[0]
    return orders.filter((o) => o.created_at.startsWith(today)).length
  }, [orders])

  const completedTodayCount = useMemo(() => {
    const today = new Date().toISOString().split("T")[0]
    return orders.filter((o) => o.created_at.startsWith(today) && ["collected", "delivered"].includes(o.status)).length
  }, [orders])

  return (
    <AdminPage>
      <AdminHeader
        title="Dashboard"
        description="Overview of your store performance"
        actions={
          <Button
            onClick={() => loadOrders()}
            variant="outline"
            size="sm"
            className="border-border text-muted-foreground hover:bg-accent transition-all active:scale-[0.98]"
            disabled={refreshing}
          >
            <RefreshCw className={cn("h-3.5 w-3.5 mr-1.5", refreshing && "animate-spin")} />
            Refresh
          </Button>
        }
      />

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          <div className="rounded-xl border border-border bg-card p-4 relative overflow-hidden shadow-sm group hover:border-foreground/20 transition-colors">
            <div className="absolute top-0 right-0 p-4 -mr-2 -mt-2 pointer-events-none opacity-5 dark:opacity-10 group-hover:scale-110 transition-transform">
              <ShoppingBag className="w-16 h-16 text-foreground" />
            </div>
            <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground mb-2">
              <div className="p-1.5 rounded-md bg-foreground/5 text-foreground">
                <ShoppingBag className="w-4 h-4" />
              </div>
              Today's Orders
            </div>
            <div className="text-3xl font-bold text-foreground tracking-tight">{todayOrdersCount}</div>
          </div>
          
          <div className="rounded-xl border border-border bg-card p-4 relative overflow-hidden shadow-sm group hover:border-brand/40 transition-colors">
            <div className="absolute top-0 right-0 p-4 -mr-2 -mt-2 pointer-events-none opacity-5 dark:opacity-10 group-hover:scale-110 transition-transform">
              <DollarSign className="w-16 h-16 text-foreground" />
            </div>
            <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground mb-2">
              <div className="p-1.5 rounded-md bg-brand/10 text-brand">
                <DollarSign className="w-4 h-4" />
              </div>
              Today's Revenue
            </div>
            <div className="text-3xl font-bold text-brand tracking-tight">
              {formatCurrency(todayRevenue)}
            </div>
          </div>

          <div className="rounded-xl border border-border bg-card p-4 relative overflow-hidden shadow-sm group hover:border-amber-500/40 transition-colors">
            <div className="absolute top-0 right-0 p-4 -mr-2 -mt-2 pointer-events-none opacity-5 dark:opacity-10 group-hover:scale-110 transition-transform">
              <Clock className="w-16 h-16 text-amber-500" />
            </div>
            <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground mb-2">
              <div className="p-1.5 rounded-md bg-amber-500/10 text-amber-500">
                <Clock className="w-4 h-4" />
              </div>
              Active Orders
            </div>
            <div className="text-3xl font-bold text-amber-500 tracking-tight">
              {activeOrders.length}
            </div>
          </div>

          <div className="rounded-xl border border-border bg-card p-4 relative overflow-hidden shadow-sm group hover:border-emerald-500/40 transition-colors">
            <div className="absolute top-0 right-0 p-4 -mr-2 -mt-2 pointer-events-none opacity-[0.03] dark:opacity-5 group-hover:scale-110 transition-transform">
              <TrendingUp className="w-16 h-16 text-emerald-500" />
            </div>
            <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground mb-2">
              <div className="p-1.5 rounded-md bg-emerald-500/10 text-emerald-600">
                <TrendingUp className="w-4 h-4" />
              </div>
              Completed Today
            </div>
            <div className="text-3xl font-bold text-emerald-600 tracking-tight">
              {completedTodayCount}
            </div>
          </div>
        </div>
      )}
    </AdminPage>
  )
}
