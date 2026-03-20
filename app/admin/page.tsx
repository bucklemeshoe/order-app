"use client"

import { useEffect, useMemo, useState, type DragEvent } from "react"
import { Loader2, RefreshCw, Check, ChevronRight, ChevronDown, X, Truck, MapPin, Phone, CreditCard, LayoutList, Columns3, ShoppingBag, Archive, Clock, AlertTriangle, ArrowLeft, CalendarDays, Zap, DollarSign, ListOrdered, CheckCircle2, XCircle, Maximize2, Minimize2, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogClose } from "@/components/ui/dialog"
import { cn } from "@/lib/utils"
import { format, parseISO } from "date-fns"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { createSupabaseBrowser } from "@/lib/supabase/browser"
import { getAllOrders, updateOrderStatus, adminMarkPaid, archiveOrder as apiArchiveOrder, archiveOrdersByDate } from "@/lib/api/orders"
import { getAllSettings } from "@/lib/api/settings"
import { formatCurrency, formatDateTime } from "@/lib/helpers/formatting"
import { getNextActions } from "@/lib/helpers/business-rules"
import type { Order, OrderStatus, OrderType, WeeklyHours, DayHours } from "@/types"
import { STATUS_CONFIG } from "@/lib/theme"
import {
  AdminPage,
  AdminHeader,
  AdminCard,
} from "@/components/admin/admin-ui"

// ── Status styling ──


const NEXT_ACTION_LABELS: Record<string, string> = {
  pending: "Start Preparing",
  awaiting_payment: "Mark as Paid",
  paid: "Start Preparing",
  preparing: "Mark Ready",
  ready: "Mark Collected",
  out_for_delivery: "Mark Delivered",
}



export default function AdminOrdersPage() {
  const [view, setView] = useState<"list" | "kanban">("list")
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [dragOverColumn, setDragOverColumn] = useState<OrderStatus | null>(null)
  const [draggedStatus, setDraggedStatus] = useState<OrderStatus | null>(null)
  const [draggedOrderId, setDraggedOrderId] = useState<string | null>(null)
  const [page, setPage] = useState<"landing" | "today" | "history">("landing")
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null)
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  const [isLoaded, setIsLoaded] = useState(false)
  const [collectionEnabled, setCollectionEnabled] = useState(true)
  const [deliveryEnabled, setDeliveryEnabled] = useState(true)
  const [showArchived, setShowArchived] = useState(false)
  const [cancelOrderId, setCancelOrderId] = useState<string | null>(null)
  const [showCashupDialog, setShowCashupDialog] = useState(false)
  const [weeklyHours, setWeeklyHours] = useState<WeeklyHours | null>(null)
  const [isOutsideHours, setIsOutsideHours] = useState(false)
  const [todayCloseTime, setTodayCloseTime] = useState<string | null>(null)
  
  const isEarlyCashup = useMemo(() => {
    if (!todayCloseTime || todayCloseTime === "closed" || !showCashupDialog) return false
    const now = new Date()
    const [ch, cm] = todayCloseTime.split(":").map(Number)
    const closeMin = ch * 60 + cm
    const nowMin = now.getHours() * 60 + now.getMinutes()
    return nowMin < closeMin
  }, [todayCloseTime, showCashupDialog])
  const [nextOpenLabel, setNextOpenLabel] = useState<string>("")
  const [historyDate, setHistoryDate] = useState(() => new Date().toISOString().slice(0, 10))
  const [archivedOrders, setArchivedOrders] = useState<Order[]>([])
  const [loadingArchived, setLoadingArchived] = useState(false)
  const [cashedUpTime, setCashedUpTime] = useState<Date | null>(null)

  const KANBAN_COLUMNS = useMemo(() => {
    const cols: OrderStatus[] = ["awaiting_payment", "pending", "preparing"]
    if (collectionEnabled) cols.push("ready")
    if (deliveryEnabled) cols.push("out_for_delivery")
    if (collectionEnabled) cols.push("collected")
    if (deliveryEnabled) cols.push("delivered")
    return cols
  }, [collectionEnabled, deliveryEnabled])

  const PILL_STATUSES = useMemo(() => {
    const cols: OrderStatus[] = ["awaiting_payment", "pending", "preparing"]
    if (collectionEnabled) cols.push("ready")
    if (deliveryEnabled) cols.push("out_for_delivery")
    if (collectionEnabled) cols.push("collected")
    if (deliveryEnabled) cols.push("delivered")
    cols.push("cancelled")
    return cols
  }, [collectionEnabled, deliveryEnabled])

  // Sync view + page preference with localStorage
  useEffect(() => {
    const savedView = localStorage.getItem("adminOrdersView")
    if (savedView === "list" || savedView === "kanban") setView(savedView)

    const savedPage = localStorage.getItem("adminOrdersPage")
    if (savedPage === "landing" || savedPage === "today" || savedPage === "history") setPage(savedPage)

    setIsLoaded(true)
  }, [])

  useEffect(() => {
    if (isLoaded) localStorage.setItem("adminOrdersView", view)
  }, [view, isLoaded])

  useEffect(() => {
    if (isLoaded) localStorage.setItem("adminOrdersPage", page)
  }, [page, isLoaded])

  async function loadOrders(showSpinner = true) {
    if (showSpinner) setRefreshing(true)
    try {
      const [data, settingsData] = await Promise.all([
         getAllOrders(),
         getAllSettings()
      ])
      
      const settingsMap = settingsData.reduce((acc, curr) => {
         acc[curr.key] = curr.value
         return acc
      }, {} as Record<string, any>)

      const isCollectionOn = settingsMap.collection_enabled === undefined ? true : (settingsMap.collection_enabled === true || settingsMap.collection_enabled === "true")
      const isDeliveryOn = settingsMap.delivery_enabled === undefined ? false : (settingsMap.delivery_enabled === true || settingsMap.delivery_enabled === "true")
      
      setCollectionEnabled(isCollectionOn)
      setDeliveryEnabled(isDeliveryOn)

      // Weekly hours for countdown + outside-hours banner
      if (settingsMap.weekly_hours) {
        const wh = settingsMap.weekly_hours as WeeklyHours
        setWeeklyHours(wh)
        computeHoursState(wh)
      }

      // Filter local view dynamically to scrub out orders of a disabled type since the Kanban won't have lanes for them
      let filteredOrders = data
      if (!isCollectionOn) filteredOrders = filteredOrders.filter(o => o.order_type !== "collection")
      if (!isDeliveryOn) filteredOrders = filteredOrders.filter(o => o.order_type !== "delivery")
      
      setOrders(filteredOrders)
    } catch (err) {
      console.error("Failed to load orders:", err)
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  function computeHoursState(wh: WeeklyHours) {
    const dayKeys: (keyof WeeklyHours)[] = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"]
    const now = new Date()
    const todayKey = dayKeys[now.getDay()]
    const todayHours = wh[todayKey]

    if (!todayHours || todayHours.open === "closed" || todayHours.close === "closed") {
      setIsOutsideHours(true)
      setTodayCloseTime(null)
      // Find next open day
      for (let i = 1; i <= 7; i++) {
        const nextKey = dayKeys[(now.getDay() + i) % 7]
        const nextH = wh[nextKey]
        if (nextH && nextH.open !== "closed") {
          const dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]
          setNextOpenLabel(`${dayNames[(now.getDay() + i) % 7]} at ${nextH.open}`)
          return
        }
      }
      setNextOpenLabel("")
      return
    }

    const [oh, om] = todayHours.open.split(":").map(Number)
    const [ch, cm] = todayHours.close.split(":").map(Number)
    const openMin = oh * 60 + om
    const closeMin = ch * 60 + cm
    const nowMin = now.getHours() * 60 + now.getMinutes()

    if (nowMin < openMin || nowMin >= closeMin) {
      setIsOutsideHours(true)
      if (nowMin < openMin) {
        setNextOpenLabel(`Today at ${todayHours.open}`)
      } else {
        // Past close, find tomorrow
        for (let i = 1; i <= 7; i++) {
          const nextKey = dayKeys[(now.getDay() + i) % 7]
          const nextH = wh[nextKey]
          if (nextH && nextH.open !== "closed") {
            const dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]
            setNextOpenLabel(`${dayNames[(now.getDay() + i) % 7]} at ${nextH.open}`)
            return
          }
        }
      }
    } else {
      setIsOutsideHours(false)
      setTodayCloseTime(todayHours.close)
    }
  }

  // Recompute hours state every minute
  useEffect(() => {
    if (!weeklyHours) return
    const timer = setInterval(() => computeHoursState(weeklyHours), 60_000)
    return () => clearInterval(timer)
  }, [weeklyHours])

  useEffect(() => { loadOrders(false) }, [])

  // Load archived orders for selected date
  async function loadArchivedByDate(dateStr: string) {
    setLoadingArchived(true)
    try {
      const supabase = createSupabaseBrowser()
      const dayStart = `${dateStr}T00:00:00`
      const dayEnd = `${dateStr}T23:59:59`
      const { data, error } = await supabase
        .from('orders')
        .select('*, items:order_items(*), user:users!orders_user_id_fkey(id, name, email, phone)')
        .eq('archived', true)
        .gte('created_at', dayStart)
        .lte('created_at', dayEnd)
        .order('created_at', { ascending: false })
      if (!error && data) setArchivedOrders(data as unknown as Order[])
    } catch {}
    setLoadingArchived(false)
  }

  useEffect(() => {
    if (page === 'history') loadArchivedByDate(historyDate)
  }, [page, historyDate])

  // Realtime subscription
  useEffect(() => {
    const supabase = createSupabaseBrowser()
    const channel = supabase
      .channel("admin-orders")
      .on("postgres_changes", { event: "*", schema: "public", table: "orders" }, () => loadOrders(false))
      .subscribe()
    return () => { supabase.removeChannel(channel) }
  }, [])

  // ── Computed data ──
  const counts = useMemo(() => {
    const base: Record<string, number> = { total: orders.length }
    for (const s of PILL_STATUSES) base[s] = 0
    for (const o of orders) {
      if (o.status in base) base[o.status] += 1
    }
    return base
  }, [orders, PILL_STATUSES])

  const terminalStatuses = new Set(["collected", "delivered", "cancelled"])
  const activeOrders = orders.filter(o => !["collected", "delivered", "cancelled", "archived"].includes(o.status))
  const completedOrders = orders.filter(o => ["collected", "delivered"].includes(o.status))

  // ── Status transitions ──
  async function advanceStatus(id: string, order: Order) {
    const nextStatuses = getNextActions(order.status, order.order_type || "collection")
    if (nextStatuses.length === 0) return

    // For awaiting_payment, use adminMarkPaid
    if (order.status === "awaiting_payment") {
      const prev = order.status
      setOrders((p) => p.map((o) => (o.id === id ? { ...o, status: "paid" as OrderStatus, payment_status: "paid" as any } : o)))
      try {
        await adminMarkPaid(id)
      } catch {
        setOrders((p) => p.map((o) => (o.id === id ? { ...o, status: prev } : o)))
      }
      return
    }

    const next = nextStatuses[0]
    const needsPaymentMark = (next === "delivered" || next === "collected") && order.payment_status !== "paid"

    setOrders((prev) => prev.map((o) => (o.id === id ? { ...o, status: next, ...(needsPaymentMark ? { payment_status: "paid" as any } : {}) } : o)))
    try {
      await updateOrderStatus(id, next, needsPaymentMark ? "paid" : undefined)
    } catch {
      setOrders((prev) => prev.map((o) => (o.id === id ? { ...order } : o)))
    }
  }

  function requestCancelOrder(id: string) {
    setCancelOrderId(id)
  }

  async function confirmCancelOrder() {
    if (!cancelOrderId) return
    const id = cancelOrderId
    setCancelOrderId(null)
    const prev = orders.find((o) => o.id === id)?.status
    setOrders((p) => p.map((o) => (o.id === id ? { ...o, status: "cancelled" as OrderStatus } : o)))
    try {
      await updateOrderStatus(id, "cancelled")
    } catch {
      if (prev) setOrders((p) => p.map((o) => (o.id === id ? { ...o, status: prev } : o)))
    }
  }

  // To maintain compatibility with existing child components without rewriting them all
  const cancelOrder = requestCancelOrder

  async function moveToStatus(orderId: string, newStatus: OrderStatus) {
    const order = orders.find(o => o.id === orderId)
    if (!order || order.status === newStatus) return
    const needsPaymentMark = (newStatus === "delivered" || newStatus === "collected") && order.payment_status !== "paid"
    
    setOrders(p => p.map(o => o.id === orderId ? { ...o, status: newStatus, ...(needsPaymentMark ? { payment_status: "paid" as any } : {}) } : o))
    try {
      await updateOrderStatus(orderId, newStatus, needsPaymentMark ? "paid" : undefined)
    } catch {
      setOrders(p => p.map(o => o.id === orderId ? { ...order } : o))
    }
  }

  async function archiveSingleOrder(orderId: string) {
    setOrders(p => p.filter(o => o.id !== orderId))
    try {
      await apiArchiveOrder(orderId)
    } catch {
      loadOrders(false)
    }
  }

  function handleCashupDay() {
    setShowCashupDialog(true)
  }

  async function confirmCashupDay() {
    setShowCashupDialog(false)
    
    // Archive ALL orders currently on the board
    const toArchive = [...orders]
    
    // Optimistic update
    setOrders([])
    setCashedUpTime(new Date())
    
    for (const o of toArchive) {
      apiArchiveOrder(o.id).catch(console.error)
    }
  }

  // ── Drag & drop ──
  function handleDragStart(e: DragEvent, order: Order) {
    e.dataTransfer.setData("text/plain", order.id)
    e.dataTransfer.effectAllowed = "move"
    setDraggedStatus(order.status)
    // small timeout so the ghost image doesn't capture the opacity change immediately on some browsers
    setTimeout(() => setDraggedOrderId(order.id), 0)
  }

  function handleDragEnd(e: DragEvent) {
    setDragOverColumn(null)
    setDraggedStatus(null)
    setDraggedOrderId(null)
  }

  function handleDrop(e: DragEvent, targetStatus: OrderStatus) {
    e.preventDefault()
    setDragOverColumn(null)
    setDraggedStatus(null)
    setDraggedOrderId(null)
    const orderId = e.dataTransfer.getData("text/plain")
    if (orderId) moveToStatus(orderId, targetStatus)
  }

  function handleDragOver(e: DragEvent, status: OrderStatus) {
    e.preventDefault()
    e.dataTransfer.dropEffect = "move"
    if (draggedStatus === status) {
      if (dragOverColumn) setDragOverColumn(null)
      return
    }
    if (dragOverColumn !== status) setDragOverColumn(status)
  }

  function handleDragLeave(e: DragEvent) {
    if (!e.currentTarget.contains(e.relatedTarget as Node)) {
      setDragOverColumn(null)
    }
  }

  if (!isLoaded) {
    return (
      <AdminPage className="flex h-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </AdminPage>
    )
  }

  return (
    <AdminPage className="flex flex-col h-full">

      {/* ═══════════════════ LANDING VIEW ═══════════════════ */}
      {page === "landing" && (
        <>
          <AdminHeader
            title="Orders"
            description="Manage today's orders or browse order history"
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-2xl">
            {/* Today Card */}
            <button
              onClick={() => setPage("today")}
              className="group relative rounded-2xl border border-border bg-card p-6 text-left transition-all hover:shadow-lg hover:border-brand/40 hover:bg-muted/30 active:scale-[0.99] overflow-hidden flex flex-col h-full"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-brand/5 rounded-full -mr-16 -mt-16 blur-xl group-hover:bg-brand/10 transition-colors pointer-events-none" />
              <div className="relative z-10 flex-1 flex flex-col">
                <div className="flex items-center gap-3 mb-4">
                  <div className="h-12 w-12 rounded-xl bg-brand/10 flex items-center justify-center group-hover:bg-brand/20 group-hover:scale-110 transition-all shrink-0">
                    <Zap className="h-6 w-6 text-brand" />
                  </div>
                  <div>
                    <div className="text-lg font-bold text-foreground group-hover:text-brand transition-colors">Today</div>
                    <div className="text-xs text-muted-foreground font-medium">Live order management</div>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed flex-1">
                  Monitor incoming orders, advance statuses, and manage today's workflow in real-time.
                </p>
                
                <div className="mt-4 flex items-center gap-2">
                  {orders.length > 0 ? (
                    <>
                      <span className="text-xs font-medium text-brand bg-brand/10 px-2.5 py-1 rounded-full border border-brand/20 shadow-sm">
                        {activeOrders.length} active
                      </span>
                      {completedOrders.length > 0 && (
                        <span className="text-xs font-medium text-emerald-600 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20 shadow-sm">
                          {completedOrders.length} completed
                        </span>
                      )}
                    </>
                  ) : (
                    <span className="text-xs font-medium text-muted-foreground bg-muted px-2.5 py-1 rounded-full border border-border shadow-sm">
                      Start taking orders
                    </span>
                  )}
                </div>
              </div>
            </button>

            {/* History Card */}
            <button
              onClick={() => setPage("history")}
              className="group relative rounded-2xl border border-border bg-card p-6 text-left transition-all hover:shadow-lg hover:border-purple-500/40 hover:bg-muted/30 active:scale-[0.99] overflow-hidden flex flex-col h-full"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/5 rounded-full -mr-16 -mt-16 blur-xl group-hover:bg-purple-500/10 transition-colors pointer-events-none" />
              <div className="relative z-10 flex-1 flex flex-col">
                <div className="flex items-center gap-3 mb-4">
                  <div className="h-12 w-12 rounded-xl bg-purple-500/10 flex items-center justify-center group-hover:bg-purple-500/20 group-hover:scale-110 transition-all shrink-0">
                    <CalendarDays className="h-6 w-6 text-purple-500" />
                  </div>
                  <div>
                    <div className="text-lg font-bold text-foreground group-hover:text-purple-500 transition-colors">History</div>
                    <div className="text-xs text-muted-foreground font-medium">Daily order log</div>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed flex-1">
                  Browse past orders by date, view daily summaries, revenue, and order details.
                </p>

                <div className="mt-4 flex items-center gap-2">
                  <span className="text-xs font-medium text-purple-500 bg-purple-500/10 px-2.5 py-1 rounded-full border border-purple-500/20 shadow-sm">
                    View archives
                  </span>
                </div>
              </div>
            </button>
          </div>
        </>
      )}

      {/* ═══════════════════ TODAY VIEW ═══════════════════ */}
      {page === "today" && (
        <>
          {/* Header */}
          <AdminHeader
            title="Today's Orders"
            description="Live order management"
            onBack={() => setPage("landing")}
            actions={
              <>
                <LiveClock closeTime={todayCloseTime} cashedUpTime={cashedUpTime} />
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
                {orders.length > 0 && (
                  <Button
                    onClick={handleCashupDay}
                    variant="outline"
                    size="sm"
                    className="border-border text-muted-foreground hover:bg-accent transition-all active:scale-[0.98]"
                  >
                    <Archive className="h-3.5 w-3.5 mr-1.5" />
                    Cashup Day
                  </Button>
                )}
              </>
            }
          />

          {loading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : (
            <>
              {/* Outside operating hours banner */}

              {/* Filters and Toggle */}
              <div
                className={cn(
                  "flex flex-col flex-1 min-h-0",
                  isFullscreen ? "fixed inset-0 z-50 bg-background p-6 md:p-8" : ""
                )}
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide pe-4">
                    {PILL_STATUSES.map((status) => {
                      const cfg = STATUS_CONFIG[status]
                      const c = counts[status] || 0
                      if (c === 0 && !["pending", "preparing", "ready", "cancelled"].includes(status)) return null
                      return (
                        <div key={status} className={cn("inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border whitespace-nowrap", cfg.color, cfg.bg, cfg.border)}>
                          <span className={cn("h-1.5 w-1.5 rounded-full", cfg.dot)} />
                          {cfg.label}
                          <span className="opacity-70">{c}</span>
                        </div>
                      )
                    })}
                  </div>

                  <div className="flex items-center gap-2 shrink-0 hidden sm:flex">
                    {isFullscreen && (
                      <div className="flex items-center gap-2 mr-2 border-r border-border pr-4">
                        <LiveClock closeTime={todayCloseTime} cashedUpTime={cashedUpTime} />
                        <Button
                          onClick={() => loadOrders()}
                          variant="outline"
                          size="sm"
                          className="h-9 border-border text-muted-foreground hover:bg-accent transition-all active:scale-[0.98]"
                          disabled={refreshing}
                        >
                          <RefreshCw className={cn("h-3.5 w-3.5 mr-1.5", refreshing && "animate-spin")} />
                          Refresh
                        </Button>
                      </div>
                    )}
                    <div className="flex items-center rounded-lg border border-border bg-card p-0.5">
                      <button
                        onClick={() => setView("list")}
                        className={cn(
                          "flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-colors",
                          view === "list" ? "bg-brand text-white" : "text-muted-foreground hover:text-foreground"
                        )}
                      >
                        <LayoutList className="h-3.5 w-3.5" />
                        List
                      </button>
                      <button
                        onClick={() => setView("kanban")}
                        className={cn(
                          "flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-colors",
                          view === "kanban" ? "bg-brand text-white" : "text-muted-foreground hover:text-foreground"
                        )}
                      >
                        <Columns3 className="h-3.5 w-3.5" />
                        Board
                      </button>
                    </div>

                    <Button
                      variant="outline"
                      size="icon"
                      className="h-9 w-9 border-border text-muted-foreground hover:text-foreground transition-all shrink-0 bg-card rounded-lg flex items-center justify-center p-0"
                      onClick={() => setIsFullscreen(!isFullscreen)}
                      title={isFullscreen ? "Exit Fullscreen" : "Enter Fullscreen"}
                    >
                      {isFullscreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>

                {/* ──── KANBAN VIEW ──── */}
              {view === "kanban" ? (
                <div className="flex gap-4 mt-4 overflow-x-auto pb-4 flex-1 min-h-0">
                  {KANBAN_COLUMNS.map((status) => {
                    const cfg = STATUS_CONFIG[status]
                    const columnOrders = orders.filter(o => o.status === status)
                    return (
                      <div
                        key={status}
                        className="flex flex-col rounded-xl border border-border bg-card min-h-[400px] min-w-[220px] max-w-[350px] flex-1 transition-colors"
                        onDragOver={(e) => handleDragOver(e, status)}
                        onDragLeave={handleDragLeave}
                        onDrop={(e) => handleDrop(e, status)}
                      >
                        <div className={cn("flex items-center justify-between px-3 py-2.5 border-t-[3px] border-b border-b-border rounded-t-xl bg-muted/30", cfg.topBorder)}>
                          <div className="flex items-center gap-2">
                            <span className={cn("h-2 w-2 rounded-full", cfg.dot)} />
                            <span className={cn("text-xs font-semibold", cfg.color)}>{cfg.label}</span>
                          </div>
                          <span className={cn("text-xs font-medium px-2 py-0.5 rounded-full bg-background", cfg.color, cfg.border, "border")}>{columnOrders.length}</span>
                        </div>
                        <div className="flex-1 p-2 pb-10 space-y-2 overflow-y-auto min-h-0 relative">
                          {columnOrders.length === 0 && dragOverColumn !== status ? (
                            <div className="flex items-center justify-center h-20 text-xs text-muted-foreground">
                              Drop orders here
                            </div>
                          ) : (
                            <>
                              {columnOrders.map(order => (
                                <div
                                  key={order.id}
                                  draggable
                                  onDragStart={(e) => handleDragStart(e, order)}
                                  onDragEnd={handleDragEnd}
                                  onClick={() => setSelectedOrder(order)}
                                  className={cn(
                                    "rounded-lg border border-border bg-background p-3 cursor-grab transition-all group",
                                    draggedOrderId === order.id ? "rotate-2 scale-[1.02] opacity-60 shadow-xl cursor-grabbing ring-1 ring-border" : "hover:shadow-md active:cursor-grabbing"
                                  )}
                                >
                                  <div className="flex items-center justify-between mb-1.5">
                                    <span className="text-sm font-bold text-foreground">#{order.order_number || "—"}</span>
                                    <span className="text-sm font-semibold text-brand">{formatCurrency(order.total_amount || 0)}</span>
                                  </div>
                                  <div className="flex items-center gap-1 mb-2 flex-wrap">
                                    {order.order_type === "delivery" ? (
                                      <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-medium bg-sky-100 text-sky-700 dark:bg-sky-500/20 dark:text-sky-400">
                                        <Truck className="h-2.5 w-2.5" />Delivery
                                    </span>
                                  ) : (
                                    <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-medium bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-400">
                                      <ShoppingBag className="h-2.5 w-2.5" />Collect
                                    </span>
                                  )}
                                  {order.payment_method && order.payment_method !== "none" && (
                                    <span className={cn(
                                      "inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-medium",
                                      order.payment_status === "paid"
                                        ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400"
                                        : "bg-purple-100 text-purple-700 dark:bg-purple-500/20 dark:text-purple-400"
                                    )}>
                                      <CreditCard className="h-2.5 w-2.5" />
                                      {order.payment_status === "paid" ? "Paid" : "Unpaid"}
                                    </span>
                                  )}
                                </div>
                                <div className="space-y-0.5 mb-1.5">
                                  {(order.items || []).slice(0, 2).map((item: any, idx: number) => (
                                    <div key={idx} className="text-xs text-muted-foreground truncate">
                                      {item.quantity || 1}x {item.name}
                                    </div>
                                  ))}
                                  {(order.items || []).length > 2 && (
                                    <div className="text-xs text-muted-foreground opacity-60">+{(order.items as any[]).length - 2} more</div>
                                  )}
                                </div>
                                <div className="text-[10px] text-muted-foreground">{formatDateTime(order.created_at)}</div>
                              </div>
                            ))}
                            {dragOverColumn === status && (
                              <div className="rounded-lg border-2 border-dashed border-border bg-muted/20 min-h-[100px] flex items-center justify-center text-xs text-muted-foreground font-medium animate-in fade-in zoom-in-95 duration-200 pointer-events-none">
                                Drop here to move
                              </div>
                            )}
                            </>
                          )}
                        </div>
                      </div>
                    )
                  })}
                </div>
              ) : (
                /* ──── LIST VIEW ──── */
                <div className="mt-4 grid gap-3 pb-8">
                  {activeOrders.length === 0 ? (
                    <div className="text-center py-16 text-muted-foreground text-sm">
                      No active orders to display
                    </div>
                  ) : (
                    activeOrders.map((order) => (
                      <OrderCard
                        key={order.id}
                        order={order}
                        expanded={expandedOrder === order.id}
                        onToggle={() => setExpandedOrder(expandedOrder === order.id ? null : order.id)}
                        onAdvance={() => advanceStatus(order.id, order)}
                        onCancel={() => cancelOrder(order.id)}
                        onArchive={() => archiveSingleOrder(order.id)}
                      />
                    ))
                  )}
                </div>
              )}
              </div>
            </>
          )}
        </>
      )}

      {/* ═══════════════════ HISTORY VIEW ═══════════════════ */}
      {page === "history" && (
        <>
          <AdminHeader
            title="Order History"
            description="Browse past orders by date"
            onBack={() => setPage("landing")}
          />

          {/* Date picker row */}
          <div className="flex items-center gap-3 mb-6 bg-card border border-border rounded-xl p-2 max-w-fit shadow-sm">
            <label className="text-sm font-medium text-muted-foreground pl-2">Date:</label>
            <Popover>
              <PopoverTrigger asChild>
                <div
                  className={cn(
                    "flex items-center gap-2 rounded-md border-none bg-muted/50 hover:bg-muted px-3 py-1.5 text-sm text-foreground focus:ring-2 focus:ring-brand focus:outline-none transition-colors cursor-pointer w-[200px] justify-between",
                    !historyDate && "text-muted-foreground"
                  )}
                >
                  {historyDate ? format(parseISO(historyDate), "PP") : <span>Pick a date</span>}
                  <CalendarDays className="h-4 w-4 opacity-50" />
                </div>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={historyDate ? parseISO(historyDate) : undefined}
                  onSelect={(date) => {
                    if (date) {
                      setHistoryDate(format(date, "yyyy-MM-dd"))
                    }
                  }}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
            <div className="w-px h-5 bg-border mx-1" />
            <button
              onClick={() => setHistoryDate(new Date().toISOString().slice(0, 10))}
              className="px-3 py-1.5 rounded-md text-xs font-semibold text-brand hover:bg-brand/10 transition-colors active:scale-95"
            >
              Today
            </button>
          </div>

          {loadingArchived ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            </div>
          ) : archivedOrders.length === 0 ? (
            <div className="text-center py-20 text-muted-foreground text-sm">
              No orders found for {new Date(historyDate + 'T00:00:00').toLocaleDateString('en-ZA', { day: 'numeric', month: 'long', year: 'numeric' })}
            </div>
          ) : (
            <>
              {/* Daily summary cards */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
                <div className="rounded-xl border border-border bg-card p-4 relative overflow-hidden shadow-sm group hover:border-foreground/20 transition-colors">
                  <div className="absolute top-0 right-0 p-4 -mr-2 -mt-2 pointer-events-none opacity-5 dark:opacity-10 group-hover:scale-110 transition-transform">
                    <ListOrdered className="w-16 h-16 text-foreground" />
                  </div>
                  <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground mb-2">
                    <div className="p-1.5 rounded-md bg-foreground/5 text-foreground">
                      <ListOrdered className="w-4 h-4" />
                    </div>
                    Total Orders
                  </div>
                  <div className="text-3xl font-bold text-foreground tracking-tight">{archivedOrders.length}</div>
                </div>
                
                <div className="rounded-xl border border-border bg-card p-4 relative overflow-hidden shadow-sm group hover:border-brand/40 transition-colors">
                  <div className="absolute top-0 right-0 p-4 -mr-2 -mt-2 pointer-events-none opacity-5 dark:opacity-10 group-hover:scale-110 transition-transform">
                    <DollarSign className="w-16 h-16 text-foreground" />
                  </div>
                  <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground mb-2">
                    <div className="p-1.5 rounded-md bg-brand/10 text-brand">
                      <DollarSign className="w-4 h-4" />
                    </div>
                    Revenue
                  </div>
                  <div className="text-3xl font-bold text-brand tracking-tight">
                    {formatCurrency(archivedOrders.reduce((sum, o) => sum + (o.total_amount || 0), 0))}
                  </div>
                </div>

                <div className="rounded-xl border border-border bg-card p-4 relative overflow-hidden shadow-sm group hover:border-emerald-500/40 transition-colors">
                  <div className="absolute top-0 right-0 p-4 -mr-2 -mt-2 pointer-events-none opacity-[0.03] dark:opacity-5 group-hover:scale-110 transition-transform">
                    <CheckCircle2 className="w-16 h-16 text-emerald-500" />
                  </div>
                  <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground mb-2">
                    <div className="p-1.5 rounded-md bg-emerald-500/10 text-emerald-600">
                      <CheckCircle2 className="w-4 h-4" />
                    </div>
                    Completed
                  </div>
                  <div className="text-3xl font-bold text-emerald-600 tracking-tight">
                    {archivedOrders.filter(o => ['collected', 'delivered'].includes(o.status)).length}
                  </div>
                </div>

                <div className="rounded-xl border border-border bg-card p-4 relative overflow-hidden shadow-sm group hover:border-red-500/40 transition-colors">
                  <div className="absolute top-0 right-0 p-4 -mr-2 -mt-2 pointer-events-none opacity-[0.03] dark:opacity-5 group-hover:scale-110 transition-transform">
                    <XCircle className="w-16 h-16 text-red-500" />
                  </div>
                  <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground mb-2">
                    <div className="p-1.5 rounded-md bg-red-500/10 text-red-500">
                      <XCircle className="w-4 h-4" />
                    </div>
                    Cancelled
                  </div>
                  <div className="text-3xl font-bold text-red-500 tracking-tight">
                    {archivedOrders.filter(o => o.status === 'cancelled').length}
                  </div>
                </div>
              </div>

              {/* Order list */}
              <div className="grid gap-3 pb-10">
                {archivedOrders.map((order) => (
                  <OrderCard
                    key={order.id}
                    order={order}
                    expanded={expandedOrder === order.id}
                    onToggle={() => setExpandedOrder(expandedOrder === order.id ? null : order.id)}
                    onAdvance={() => {}}
                    onCancel={() => {}}
                  />
                ))}
              </div>
            </>
          )}
        </>
      )}

      {/* Kanban/List Details Dialog */}
      <Dialog open={!!selectedOrder} onOpenChange={(open) => !open && setSelectedOrder(null)}>
        <DialogContent showCloseButton={false} className="max-w-none sm:max-w-none w-full h-[100dvh] max-h-none rounded-none border-none p-0 flex flex-col overflow-hidden bg-background !m-0 !translate-x-0 !translate-y-0 inset-0 !top-0 !left-0 !right-0 !bottom-0 sm:zoom-in-100 data-[state=closed]:zoom-out-100 duration-200">
          <DialogHeader className="px-6 py-4 border-b border-border bg-background shrink-0 flex flex-row items-center justify-between shadow-sm z-10">
            <div className="flex items-center gap-2">
              <DialogTitle className="text-xl">Order #{selectedOrder?.order_number || "—"}</DialogTitle>
              <DialogDescription className="sr-only">Order detail view</DialogDescription>
            </div>
            <DialogClose className="rounded-full h-8 w-8 flex items-center justify-center hover:bg-muted text-muted-foreground hover:text-foreground transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2">
              <X className="h-5 w-5" />
              <span className="sr-only">Close</span>
            </DialogClose>
          </DialogHeader>
          {selectedOrder && (
            <div className="overflow-y-auto flex-1 w-full bg-background">
              <div className="w-full max-w-6xl mx-auto py-2 md:py-4 px-4 md:px-6 lg:px-8 flex flex-col min-h-full">
                <OrderDetailContent
                  order={selectedOrder}
                  onAdvance={() => { advanceStatus(selectedOrder.id, selectedOrder); setSelectedOrder(null) }}
                  onCancel={() => { const id = selectedOrder.id; setSelectedOrder(null); cancelOrder(id) }}
                  onArchive={() => { archiveSingleOrder(selectedOrder.id); setSelectedOrder(null) }}
                />
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
      {/* Cancel Order Dialog */}
      <Dialog open={!!cancelOrderId} onOpenChange={(open: boolean) => !open && setCancelOrderId(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Cancel Order</DialogTitle>
            <DialogDescription>
              Are you sure you want to cancel this order? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end gap-3 mt-4">
            <Button variant="outline" onClick={() => setCancelOrderId(null)}>No, Keep Order</Button>
            <Button variant="destructive" onClick={confirmCancelOrder}>Yes, Cancel Order</Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Cashup Dialog */}
      <Dialog open={showCashupDialog} onOpenChange={setShowCashupDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{isEarlyCashup ? "Cashup Early?" : "Cashup Day"}</DialogTitle>
            <DialogDescription>
              {isEarlyCashup 
                ? `You are scheduled to close at ${todayCloseTime}. Cashing up now will clear the board early. Are you sure?`
                : "Are you sure you want to Cashup the day? This will clear all remaining orders from the board and move them to History."}
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end gap-3 mt-4">
            <Button variant="outline" onClick={() => setShowCashupDialog(false)}>Cancel</Button>
            <Button onClick={confirmCashupDay}>Confirm Cashup</Button>
          </div>
        </DialogContent>
      </Dialog>
    </AdminPage>
  )
}

// ── Components ──



function OrderCard({ order, expanded, onToggle, onAdvance, onCancel, onArchive }: {
  order: Order
  expanded: boolean
  onToggle: () => void
  onAdvance: () => void
  onCancel: () => void
  onArchive?: () => void
}) {
  const nextActions = getNextActions(order.status, order.order_type || "collection")
  const canAdvance = nextActions.length > 0
  const canCancel = !["collected", "delivered", "cancelled"].includes(order.status)
  const cfg = STATUS_CONFIG[order.status] || STATUS_CONFIG.pending
  const isDelivery = order.order_type === "delivery"

  return (
    <AdminCard className="p-0 overflow-hidden">
      {/* Header row */}
      <button onClick={onToggle} className="w-full flex items-center justify-between p-4 hover:bg-accent/50 active:bg-accent transition-colors">
        <div className="flex items-center gap-3 text-left">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold text-foreground">Order #{order.order_number || "—"}</span>
              {isDelivery ? (
                <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-medium bg-sky-100 text-sky-700 dark:bg-sky-500/20 dark:text-sky-400">
                  <Truck className="h-2.5 w-2.5" />Delivery
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-medium bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-400">
                  <ShoppingBag className="h-2.5 w-2.5" />Collect
                </span>
              )}
              {order.payment_method && order.payment_method !== "none" && (
                <span className={cn(
                  "inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-medium",
                  order.payment_status === "paid"
                    ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400"
                    : "bg-purple-100 text-purple-700 dark:bg-purple-500/20 dark:text-purple-400"
                )}>
                  <CreditCard className="h-2.5 w-2.5" />
                  {order.payment_status === "paid" ? "Paid" : "Unpaid"}
                </span>
              )}
            </div>
            <div className="text-xs text-muted-foreground mt-0.5">{formatDateTime(order.created_at)}</div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-sm font-medium text-foreground">
            {formatCurrency(order.total_amount || 0)}
          </span>
          <span className={cn("px-2.5 py-1 rounded-full text-xs font-medium border", cfg.color, cfg.bg, cfg.border)}>
            {cfg.label}
          </span>
          {onArchive && ["collected", "delivered", "cancelled"].includes(order.status) && (
            <button
              onClick={(e) => { e.stopPropagation(); onArchive() }}
              className="p-1 rounded-md hover:bg-accent text-muted-foreground transition-colors"
              title="Archive this order"
            >
              <Archive className="h-3.5 w-3.5" />
            </button>
          )}
          <ChevronRight className={cn("h-4 w-4 text-muted-foreground transition-transform", expanded && "rotate-90")} />
        </div>
      </button>

      {/* Expanded detail */}
      {expanded && (
        <div className="border-t border-border bg-muted/30">
          <OrderDetailContent order={order} onAdvance={onAdvance} onCancel={onCancel} onArchive={onArchive} />
        </div>
      )}
    </AdminCard>
  )
}



function OrderDetailContent({ order, onAdvance, onCancel, onArchive }: {
  order: Order
  onAdvance: () => void
  onCancel: () => void
  onArchive?: () => void
}) {
  const [showTotalBreakdown, setShowTotalBreakdown] = useState(false)
  const nextActions = getNextActions(order.status, order.order_type || "collection")
  const canAdvance = nextActions.length > 0
  const canCancel = !["collected", "delivered", "cancelled"].includes(order.status)
  const isDelivery = order.order_type === "delivery"

  const displayPhone = order.user?.phone || order.customer_phone
  const displayName = order.user?.name || "Guest"

  return (
    <div className="flex flex-col md:flex-row gap-6 md:gap-8 text-left p-5 md:p-8 flex-1">
      {/* Left Column: All Content */}
      <div className="flex-1 flex flex-col gap-6 min-w-0">
        
        {/* Top Info Cards in Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Customer Info */}
          <div className="rounded-xl border border-border/70 overflow-hidden bg-card shadow-sm flex flex-col">
            <div className="bg-muted/30 p-2.5 flex gap-2 items-center border-b border-border/70">
              <User className="h-4 w-4 text-foreground/70" />
              <div className="text-xs font-semibold text-foreground tracking-wide uppercase">Customer Details</div>
            </div>
            <div className="p-4 flex-1">
              <div className="text-sm font-medium text-foreground">{displayName}</div>
              {displayPhone && (
                <div className="flex items-center gap-2 text-sm text-foreground mt-2">
                  <Phone className="h-3.5 w-3.5 text-muted-foreground flex-shrink-0" />
                  {displayPhone}
                </div>
              )}
              {order.user?.email && (
                <div className="text-sm text-muted-foreground mt-1 lowercase">{order.user.email}</div>
              )}
            </div>
          </div>

          {/* Delivery info */}
          {isDelivery && (
            <div className="rounded-xl border border-border/70 overflow-hidden bg-card shadow-sm flex flex-col">
              <div className="bg-muted/30 p-2.5 flex gap-2 items-center border-b border-border/70">
                <Truck className="h-4 w-4 text-sky-500" />
                <div className="text-xs font-semibold text-foreground tracking-wide uppercase">Delivery Details</div>
              </div>
              <div className="p-4 flex-1">
                {order.delivery_address && (
                  <div className="flex items-start gap-2 text-sm text-foreground mb-2">
                    <MapPin className="h-3.5 w-3.5 mt-0.5 text-sky-500 flex-shrink-0" />
                    <span className="leading-tight">{order.delivery_address}</span>
                  </div>
                )}
                {order.delivery_notes && (
                  <div className="text-xs text-muted-foreground mt-2 italic bg-muted/40 p-2 rounded-md">Note: {order.delivery_notes}</div>
                )}
                {order.delivery_fee != null && order.delivery_fee > 0 && (
                  <div className="text-sm text-muted-foreground mt-3 border-t border-border/40 pt-3">
                    Delivery fee: <span className="font-medium text-foreground ml-1">{formatCurrency(order.delivery_fee)}</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Payment info */}
          <div className="rounded-xl border border-border/70 overflow-hidden bg-card shadow-sm flex flex-col">
            <div className="bg-muted/30 p-2.5 flex gap-2 items-center border-b border-border/70">
              <CreditCard className="h-4 w-4 text-purple-500" />
              <div className="text-xs font-semibold text-foreground tracking-wide uppercase">Payment Details</div>
            </div>
            <div className="p-4 flex-1">
              <div className="flex items-center justify-between text-sm mb-3">
                <span className="text-muted-foreground">Method:</span>
                <span className="capitalize font-medium text-foreground">{order.payment_method === "none" || !order.payment_method ? "Payment on Delivery" : order.payment_method}</span>
              </div>
              
              {order.payment_method !== "none" && order.payment_method && (
                <div className="flex items-center justify-between text-sm border-t border-border/40 pt-3">
                  <span className="text-muted-foreground">Status:</span>
                  <span className={cn("font-medium", order.payment_status === "paid" ? "text-emerald-600 dark:text-emerald-400" : "text-amber-600 dark:text-amber-400")}>
                    {order.payment_status === "paid" ? "Paid ✓" : "Pending"}
                  </span>
                </div>
              )}

              {order.payment_provider_id && (
                <div className="text-xs text-muted-foreground font-mono mt-3 pt-3 border-t border-border/40 break-all">
                  ID: {order.payment_provider_id}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Items */}
        <div className="rounded-xl border border-border/70 overflow-hidden bg-card shadow-sm flex-shrink-0 mt-2">
          <div className="bg-muted/30 p-3 flex gap-2 items-center border-b border-border/70">
            <ShoppingBag className="h-4 w-4 text-foreground/70" />
            <div className="text-xs font-semibold text-foreground tracking-wide uppercase">Order Items</div>
          </div>
          <div className="p-2 sm:p-4">
            <div className="grid divide-y divide-border/40">
              {(order.items || []).map((item: any, idx: number) => (
                <div key={idx} className="flex items-center justify-between text-base py-3 px-2 hover:bg-muted/20 transition-colors rounded-md">
                  <div className="text-foreground flex items-baseline">
                    <span className="text-muted-foreground w-8 font-medium">{item.quantity || 1}x</span>
                    <span className="font-medium">{item.name}</span>
                    {item.variant && <span className="text-muted-foreground ml-2 text-sm">({item.variant.name})</span>}
                  </div>
                  <div className="text-foreground font-medium whitespace-nowrap ml-4">
                    {formatCurrency((item.price || 0) * (item.quantity || 1))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {order.pickup_time && !isDelivery && (
          <div className="flex items-center justify-center p-4 rounded-xl bg-amber-500/10 text-amber-700 dark:text-amber-400 text-sm font-medium border border-amber-500/20">
            <Clock className="h-5 w-5 mr-3" />
            Scheduled Pickup: {new Date(order.pickup_time).toLocaleString()}
          </div>
        )}

        {order.total_amount != null && (
          <div className="flex flex-col p-5 mt-auto rounded-xl bg-muted/40 border border-border/70 transition-all overflow-hidden relative">
            <button 
              onClick={() => setShowTotalBreakdown(!showTotalBreakdown)}
              className="flex items-center justify-between w-full text-left"
            >
              <span className="font-medium text-foreground text-lg flex items-center gap-2">
                Total 
                <span className="text-muted-foreground font-normal text-sm hidden sm:inline-block">(incl. tax{isDelivery && order.delivery_fee ? " + delivery" : ""})</span>
              </span>
              <div className="flex items-center gap-3">
                <span className="text-2xl font-bold tracking-tight text-foreground">{formatCurrency(order.total_amount)}</span>
                <ChevronDown className={cn("h-5 w-5 text-muted-foreground transition-transform", showTotalBreakdown && "rotate-180")} />
              </div>
            </button>
            
            {showTotalBreakdown && (
              <div className="pt-4 mt-4 border-t border-border/40 flex flex-col gap-2.5 text-sm text-muted-foreground animate-in slide-in-from-top-2 fade-in">
                <div className="flex justify-between items-center">
                  <span className="font-medium">Subtotal</span>
                  <span className="text-foreground">{formatCurrency((order.total_amount || 0) - (order.tax_amount || 0) - (order.delivery_fee || 0))}</span>
                </div>
                {order.delivery_fee != null && order.delivery_fee > 0 && (
                  <div className="flex justify-between items-center">
                    <span className="font-medium">Delivery Fee</span>
                    <span className="text-foreground">{formatCurrency(order.delivery_fee)}</span>
                  </div>
                )}
                {order.tax_amount != null && order.tax_amount > 0 && (
                  <div className="flex justify-between items-center">
                    <span className="font-medium">Tax</span>
                    <span className="text-foreground">{formatCurrency(order.tax_amount)}</span>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Right Column: Only Actions */}
      <div className="w-full md:w-56 lg:w-64 flex flex-col gap-3 flex-shrink-0 md:border-l border-border/40 md:pl-6 lg:pl-8 pt-4 md:pt-0">
        <div className="text-xs font-semibold text-muted-foreground tracking-wide uppercase mb-2 hidden md:block">Actions</div>
        {canAdvance && (
          <Button
            onClick={(e) => { e.stopPropagation(); onAdvance() }}
            className="w-full bg-primary text-primary-foreground hover:bg-primary/90 font-medium transition-all shadow-sm active:scale-[0.98] py-7 text-base rounded-xl"
          >
            <Check className="h-5 w-5 mr-2" />
            {NEXT_ACTION_LABELS[order.status] || "Advance Status"}
          </Button>
        )}
        {canCancel && (
          <Button
            onClick={(e) => { e.stopPropagation(); onCancel() }}
            variant="outline"
            className="w-full border-border text-foreground hover:bg-destructive/10 hover:text-destructive hover:border-destructive/30 transition-all active:scale-[0.98] py-7 text-base rounded-xl"
          >
            <X className="h-5 w-5 mr-2" />
            Cancel Order
          </Button>
        )}
        {["collected", "delivered", "cancelled"].includes(order.status) && onArchive && (
          <Button
            onClick={(e) => { e.stopPropagation(); onArchive() }}
            variant="outline"
            className="w-full border-border text-foreground hover:bg-accent hover:text-foreground transition-all active:scale-[0.98] py-7 text-base rounded-xl mt-auto"
          >
            <Archive className="h-5 w-5 mr-2" />
            Archive
          </Button>
        )}
      </div>
    </div>
  )
}

function LiveClock({ closeTime, cashedUpTime }: { closeTime?: string | null, cashedUpTime?: Date | null }) {
  const [now, setNow] = useState<Date | null>(cashedUpTime || null)

  useEffect(() => {
    if (cashedUpTime) {
      setNow(cashedUpTime)
      return
    }
    setNow(new Date())
    const timer = setInterval(() => setNow(new Date()), 1000)
    return () => clearInterval(timer)
  }, [cashedUpTime])

  if (!now) {
    return <div className="h-9 px-3 w-[160px] rounded-lg border border-border bg-card hidden sm:block" />
  }

  // Compute countdown
  let countdownEl: React.ReactNode = null
  if (cashedUpTime) {
    countdownEl = <span className="ml-2 font-bold text-emerald-500 hidden sm:inline-block">• Cashed Up</span>
  } else if (closeTime && closeTime !== "closed") {
    const [ch, cm] = closeTime.split(":").map(Number)
    const closeMin = ch * 60 + cm
    const nowMin = now.getHours() * 60 + now.getMinutes()
    const diff = closeMin - nowMin
    if (diff > 0) {
      const h = Math.floor(diff / 60)
      const m = diff % 60
      const label = h > 0 ? `${h}h ${m}m` : `${m}m`
      const urgency = diff <= 15 ? "text-red-500" : diff <= 60 ? "text-amber-500" : "text-emerald-500"
      countdownEl = (
        <span className={cn("ml-2 font-semibold", urgency)}>• closes {label}</span>
      )
    }
  }

  return (
    <div className="flex items-center justify-center px-3 h-9 rounded-lg border border-border bg-card text-xs font-medium text-muted-foreground whitespace-nowrap hidden sm:flex">
      {now.toLocaleDateString("en-ZA", { day: "numeric", month: "short", year: "numeric" })} •{" "}
      {now.toLocaleTimeString("en-ZA", { hour: "2-digit", minute: "2-digit", second: "2-digit" })}
      {countdownEl}
    </div>
  )
}
