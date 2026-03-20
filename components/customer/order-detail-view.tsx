"use client"

import { useEffect, useState } from "react"
import { cn } from "@/lib/utils"
import { UI } from "@/lib/theme"
import { formatCurrency, formatDate } from "@/lib/helpers/formatting"
import { getOrderSteps, getStatusMessage } from "@/lib/helpers/business-rules"
import { BadgeCheck, Check } from "lucide-react"
import { Separator } from "@/components/ui/separator"
import { Skeleton } from "@/components/ui/skeleton"
import { Row } from "@/components/shared"
import { PullToRefresh } from "@/components/PullToRefresh"
import { createSupabaseBrowser } from "@/lib/supabase/browser"
// @ts-expect-error -- canvas-confetti has no type declarations
import confetti from "canvas-confetti"
import type { Order, OrderStatus } from "@/types"

export function OrderDetailView({
  order,
  onGoOrders,
}: {
  order: Order | null
  onGoOrders: () => void
}) {
  const [currentOrder, setCurrentOrder] = useState(order)
  const [refreshing, setRefreshing] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [previousStatus, setPreviousStatus] = useState<string | null>(null)

  const refreshOrder = async () => {
    if (!currentOrder?.id) return
    setRefreshing(true)
    try {
      const supabase = createSupabaseBrowser()
      const { data, error } = await supabase
        .from("orders")
        .select("*")
        .eq("id", currentOrder.id)
        .single()
      if (!error && data) {
        setCurrentOrder(data as unknown as Order)
        setIsLoading(false)
      }
    } catch {
      // silent fail
    } finally {
      setRefreshing(false)
      setIsLoading(false)
    }
  }

  useEffect(() => {
    if (order) {
      const hasMinimalData = !!(order.id && (!order.items || !order.items.length))
      setIsLoading(hasMinimalData)
      setCurrentOrder(order)
      if (hasMinimalData) refreshOrder()
    }
  }, [order])

  // Confetti on status change to collected/delivered
  useEffect(() => {
    const isTerminal = currentOrder?.status === "collected" || currentOrder?.status === "delivered"
    const wasTerminal = previousStatus === "collected" || previousStatus === "delivered"
    if (isTerminal && previousStatus !== null && !wasTerminal) {
      confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } })
    }
    if (currentOrder?.status) setPreviousStatus(currentOrder.status)
  }, [currentOrder?.status, previousStatus])

  // Realtime subscription
  useEffect(() => {
    if (!currentOrder?.id) return
    const supabase = createSupabaseBrowser()
    const channel = supabase
      .channel(`order_${currentOrder.id}`)
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "orders",
          filter: `id=eq.${currentOrder.id}`,
        },
        (payload) => setCurrentOrder(payload.new as unknown as Order)
      )
      .subscribe()
    return () => { supabase.removeChannel(channel) }
  }, [currentOrder?.id])

  if (!currentOrder) {
    return (
      <section className="grid gap-4">
        <div className="text-center py-8">
          <div className={cn("text-sm", UI.muted)}>No order selected</div>
        </div>
      </section>
    )
  }

  const steps = getOrderSteps(currentOrder.status as OrderStatus, (currentOrder.order_type as any) || "collection")
  const info = getStatusMessage(currentOrder.status as OrderStatus)

  const orderTotals = (() => {
    // Prefer stored totals (trusted, computed at order creation time)
    if (currentOrder?.total_amount) {
      const total = currentOrder.total_amount
      const tax = currentOrder.tax_amount || 0
      const subtotal = +(total - tax).toFixed(2)
      const taxPercent = subtotal > 0 ? Math.round((tax / subtotal) * 100) : 15
      return { subtotal, tax, total, taxPercent }
    }
    // Fallback for legacy orders without stored totals
    if (!currentOrder?.items || !Array.isArray(currentOrder.items)) {
      return { subtotal: 0, tax: 0, total: 0, taxPercent: 15 }
    }
    const subtotal = currentOrder.items.reduce((sum, item: any) => {
      const itemPrice = item.variant?.price || item.price || 0
      const extrasPrice = (item.extras || []).reduce((s: number, e: any) => s + (e.price || 0), 0)
      return sum + (itemPrice + extrasPrice) * (item.quantity || 1)
    }, 0)
    const tax = subtotal * 0.15
    return { subtotal, tax, total: subtotal + tax, taxPercent: 15 }
  })()

  return (
    <PullToRefresh onRefresh={refreshOrder} disabled={refreshing} threshold={120} className="grid gap-4">
      <section className="grid gap-4">
        <div className="flex items-start justify-between">
          <div className="grid gap-1">
            <h2 className="text-xl font-semibold tracking-tight">
              Order #{currentOrder.order_number || currentOrder.id.slice(0, 8)}
            </h2>
            <p className="text-sm text-neutral-600">
              Placed on {formatDate(currentOrder.created_at)}
            </p>
          </div>
          {currentOrder.payment_status === "paid" && currentOrder.payment_method && currentOrder.payment_method !== "none" && (
            <span className="inline-flex items-center gap-1 text-xs font-medium text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-full mt-1">
              <Check className="h-3 w-3" />
              Paid
            </span>
          )}
        </div>

        {/* Progress */}
        <div className="rounded-xl border bg-card border-border p-4 shadow-sm">
          <div className="text-base font-semibold mb-2">Order Progress</div>
          <nav aria-label="Progress">
            <ol role="list" className="overflow-hidden">
              {steps.map((step, idx) => {
                const isLast = idx === steps.length - 1
                const isComplete = step.status === "complete"
                const isCurrent = step.status === "current"
                const connectorColor = isComplete ? "border-green-500" : "border-neutral-300"
                return (
                  <li key={step.name} className={cn(!isLast ? "pb-4" : "", "relative")}>
                    {!isLast && (
                      <div
                        aria-hidden="true"
                        className={cn("absolute top-4 left-4 -ml-px bottom-0 border-l border-dotted", connectorColor)}
                      />
                    )}
                    <div className="relative flex items-start">
                      <span aria-hidden="true" className="flex h-9 items-center">
                        {isComplete ? (
                          <span className="relative z-10 flex size-8 items-center justify-center rounded-full bg-green-500 border border-green-500">
                            <Check className="h-4 w-4 text-white" />
                          </span>
                        ) : isCurrent ? (
                          <span className="relative z-10 flex size-8 items-center justify-center rounded-full border-2 border-green-500 bg-white">
                            <span className="size-2.5 rounded-full bg-green-500" />
                          </span>
                        ) : (
                          <span className="relative z-10 flex size-8 items-center justify-center rounded-full border-2 border-neutral-300 bg-white">
                            <span className="size-2.5 rounded-full bg-transparent" />
                          </span>
                        )}
                      </span>
                      <span className="ml-4 flex min-w-0 flex-col">
                        <span
                          className={cn(
                            "text-sm font-medium",
                            isComplete ? "text-neutral-900" : isCurrent ? "text-green-600" : "text-neutral-500"
                          )}
                          aria-current={isCurrent ? "step" : undefined}
                        >
                          {step.name}
                        </span>
                        <span className="text-sm text-neutral-500">{step.description}</span>
                      </span>
                    </div>
                  </li>
                )
              })}
            </ol>
          </nav>
          <div className="mt-3 rounded-md border bg-muted/50 p-3 text-sm border-border">
            <div className="flex items-center gap-2">
              <BadgeCheck className="h-4 w-4 text-green-600" />
              <span>{info}</span>
            </div>
          </div>
        </div>

        {/* Order Items */}
        <div className="rounded-xl border bg-card border-border shadow-sm">
          <div className="p-4 grid gap-3">
            <div className="flex items-center justify-between">
              <div className="font-semibold">Order Items</div>
              {isLoading ? (
                <Skeleton className="h-4 w-16" />
              ) : (
                <div className="text-sm">{formatCurrency(orderTotals.total)}</div>
              )}
            </div>
            <Separator />
            {isLoading ? (
              <div className="space-y-3">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex justify-between items-center">
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-4 w-16" />
                  </div>
                ))}
              </div>
            ) : (
              <>
                {currentOrder.items?.map((item: any, index: number) => {
                  const itemPrice = item.variant?.price || item.price || 0
                  const extrasPrice = (item.extras || []).reduce((s: number, e: any) => s + (e.price || 0), 0)
                  const total = (itemPrice + extrasPrice) * (item.quantity || 1)
                  return (
                    <div key={index}>
                      <Row
                        label={`${item.quantity || 1}x ${item.name || "Item"}`}
                        value={formatCurrency(total)}
                      />
                      {item.variant && <div className="text-sm text-neutral-600 ml-4">Size: {item.variant.name}</div>}
                      {item.extras?.length > 0 && (
                        <div className="text-sm text-neutral-600 ml-4">
                          Extras: {item.extras.map((e: any) => e.name || e).join(", ")}
                        </div>
                      )}
                      {item.notes && <div className="text-sm text-neutral-600 ml-4">Note: {item.notes}</div>}
                    </div>
                  )
                })}
                <Separator />
                <Row label="Subtotal" value={formatCurrency(orderTotals.subtotal)} />
                <Row label={`Tax (${orderTotals.taxPercent}%)`} value={formatCurrency(orderTotals.tax)} />
                <Row
                  label={<span className="font-semibold">Total</span>}
                  value={<span className="font-semibold text-brand-dark">{formatCurrency(orderTotals.total)}</span>}
                />
              </>
            )}
          </div>
        </div>

        {/* Order Details */}
        <div className="rounded-xl border bg-card border-border shadow-sm">
          <div className="p-4 grid gap-2">
            <div className="font-semibold">Order Details</div>
            {isLoading ? (
              <div className="space-y-3">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex justify-between items-center">
                    <Skeleton className="h-4 w-20" />
                    <Skeleton className="h-4 w-32" />
                  </div>
                ))}
              </div>
            ) : (
              <>
                <Row label="Order ID" value={<span className="truncate block max-w-[200px]">{currentOrder.id}</span>} />
                <Row
                  label={currentOrder.order_type === "delivery" ? "Target Delivery Time" : "Pickup Time"}
                  value={currentOrder.pickup_time ? new Date(currentOrder.pickup_time).toLocaleString() : "Not set"}
                />
                <Row label="Status" value={<span className="text-neutral-800">{currentOrder.status}</span>} />
              </>
            )}
          </div>
        </div>

        {/* Dynamic Fulfilment Details */}
        {currentOrder.order_type !== "delivery" ? (
          <div className="rounded-xl border bg-card border-border mb-6 shadow-sm">
            <div className="p-4 grid gap-3">
              <div className="font-semibold">Collection Time</div>
              <div className="flex gap-2">
                {(() => {
                  const pickupTime = currentOrder.pickup_time
                  if (!pickupTime) return null
                  const now = new Date()
                  const pickup = new Date(pickupTime)
                  const diffMinutes = Math.round((pickup.getTime() - now.getTime()) / (1000 * 60))
                  let selectedOption: string | null = null
                  if (diffMinutes <= 20) selectedOption = "ASAP"
                  else if (diffMinutes <= 35) selectedOption = "30min"
                  else if (diffMinutes <= 50) selectedOption = "45min"
                  return ["ASAP", "30min", "45min"].map((opt) => (
                    <div
                      key={opt}
                      className={`px-3 py-2 rounded-md text-sm font-medium ${
                        selectedOption === opt
                          ? "bg-primary text-primary-foreground border-primary"
                          : "bg-muted text-muted-foreground border-border"
                      }`}
                    >
                      {opt === "ASAP" ? "15min" : opt}
                    </div>
                  ))
                })()}
              </div>
            </div>
          </div>
        ) : (
          <div className="rounded-xl border bg-card border-border mb-6 shadow-sm">
            <div className="p-4 grid gap-3 text-sm">
              <div className="font-semibold flex items-center justify-between">
                Delivery Details
                <span className="text-xs font-medium text-brand bg-brand/10 border border-brand/20 px-2.5 py-0.5 rounded-full">
                  Delivery
                </span>
              </div>
              <div className="grid gap-1">
                <div className="text-neutral-500">Address</div>
                <div className="text-neutral-900">{currentOrder.delivery_address || "No address provided"}</div>
              </div>
              {currentOrder.delivery_notes && (
                <div className="grid gap-1 pt-1 border-t border-neutral-100">
                  <div className="text-neutral-500">Delivery Notes</div>
                  <div className="text-neutral-900">{currentOrder.delivery_notes}</div>
                </div>
              )}
              {currentOrder.customer_phone && (
                <div className="grid gap-1 pt-1 border-t border-neutral-100">
                  <div className="text-neutral-500">Phone</div>
                  <div className="text-neutral-900">{currentOrder.customer_phone}</div>
                </div>
              )}
            </div>
          </div>
        )}
      </section>
    </PullToRefresh>
  )
}
