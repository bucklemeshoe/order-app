"use client"

import { cn } from "@/lib/utils"
import { UI } from "@/lib/theme"
import { formatCurrency } from "@/lib/helpers/formatting"
import { Clock3, MapPin, Phone, CreditCard, Truck, Store, AlertTriangle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Row } from "@/components/shared"
import type { CartItem, ExtrasMap, OrderType, PaymentMethod } from "@/types"

export function CheckoutView({
  grandTotal,
  onPlaceOrder,
  subtotal,
  tax,
  taxRate = 0.15,
  pickupTime,
  onPickupTimeChange,
  items = [],
  extrasMap = {},
  // Fulfilment
  orderType = "collection",
  onOrderTypeChange,
  deliveryAddress = "",
  onDeliveryAddressChange,
  deliveryNotes = "",
  onDeliveryNotesChange,
  customerPhone = "",
  onCustomerPhoneChange,
  deliveryFee = 0,
  collectionEnabled = true,
  deliveryEnabled = false,
  // Payment
  paymentMethod = "none",
  onPaymentMethodChange,
  yocoEnabled = false,
  snapscanEnabled = false,
}: {
  grandTotal: number
  onPlaceOrder: () => void
  subtotal: number
  tax: number
  taxRate?: number
  pickupTime: string
  onPickupTimeChange: (time: string) => void
  items?: CartItem[]
  extrasMap?: ExtrasMap
  orderType?: OrderType
  onOrderTypeChange?: (type: OrderType) => void
  deliveryAddress?: string
  onDeliveryAddressChange?: (v: string) => void
  deliveryNotes?: string
  onDeliveryNotesChange?: (v: string) => void
  customerPhone?: string
  onCustomerPhoneChange?: (v: string) => void
  deliveryFee?: number
  collectionEnabled?: boolean
  deliveryEnabled?: boolean
  paymentMethod?: PaymentMethod
  onPaymentMethodChange?: (m: PaymentMethod) => void
  yocoEnabled?: boolean
  snapscanEnabled?: boolean
}) {
  const isDelivery = orderType === "delivery"
  const bothEnabled = collectionEnabled && deliveryEnabled
  const neitherEnabled = !collectionEnabled && !deliveryEnabled

  // Dynamic "pay on" wording
  const payOnLabel = bothEnabled
    ? (isDelivery ? "Pay on Delivery" : "Pay on Collection")
    : collectionEnabled
      ? "Pay on Collection"
      : deliveryEnabled
        ? "Pay on Delivery"
        : "Pay on Arrival"

  // If neither mode is enabled, block checkout
  if (neitherEnabled) {
    return (
      <section className="grid gap-4">
        <div className={cn("rounded-xl border p-6 text-center", UI.surface, UI.border)}>
          <AlertTriangle className="h-8 w-8 text-amber-500 mx-auto mb-3" />
          <div className="text-base font-semibold mb-1">Ordering Unavailable</div>
          <p className={cn("text-sm", UI.muted)}>
            Ordering is currently unavailable. Please check back later.
          </p>
        </div>
      </section>
    )
  }

  return (
    <section className="grid gap-4">
      {/* Order Summary */}
      <div className={cn("rounded-xl border", UI.surface, UI.border)}>
        <div className="p-4 grid gap-3">
          <div className="text-base font-semibold">Order Summary</div>
          {items.length > 0 && (
            <>
              <div className="grid gap-2">
                {items.map((item, index) => {
                  const itemPrice = item.variant?.price || item.product.price || 0
                  const extrasPrice = (item.extras || []).reduce((sum, extraId) => {
                    const extra = extrasMap[extraId]
                    return sum + (extra?.price || 0)
                  }, 0)
                  const totalItemPrice = (itemPrice + extrasPrice) * item.qty
                  return (
                    <div key={`${item.product.id}-${item.variant?.id || "default"}-${item.extras.join(",")}-${index}`}>
                      <Row label={`${item.qty}x ${item.product.name}`} value={formatCurrency(totalItemPrice)} />
                      {item.variant && <div className="text-xs text-neutral-600 ml-4">Size: {item.variant.name}</div>}
                      {item.extras && item.extras.length > 0 && (
                        <div className="text-xs text-neutral-600 ml-4">
                          Extras: {item.extras.map((extraId) => extrasMap[extraId]?.name || extraId).join(", ")}
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
              <Separator />
            </>
          )}
          <div className="grid gap-2 text-sm">
            <Row label="Subtotal" value={formatCurrency(subtotal)} />
            <Row label={`Tax (${Math.round(taxRate * 100)}%)`} value={formatCurrency(tax)} />
            {isDelivery && deliveryFee > 0 && (
              <Row label="Delivery Fee" value={formatCurrency(deliveryFee)} />
            )}
          </div>
          <Separator />
          <Row
            label={<span className="font-semibold">Total</span>}
            value={<span className="font-semibold text-brand-dark">{formatCurrency(grandTotal)}</span>}
          />
        </div>
      </div>

      {/* Order Type — only show selector when BOTH are enabled */}
      {bothEnabled && (
        <div className={cn("rounded-xl border", UI.surface, UI.border)}>
          <div className="p-4 grid gap-3">
            <div className="flex items-center gap-2 font-medium">
              <Truck className="h-4 w-4 text-brand-dark" />
              Order Type
            </div>
            <div className="grid grid-cols-2 gap-2">
              {([
                { value: "collection" as const, label: "Collection", icon: Store },
                { value: "delivery" as const, label: "Delivery", icon: Truck },
              ]).map((opt) => (
                <Button
                  key={opt.value}
                  onClick={() => onOrderTypeChange?.(opt.value)}
                  variant={orderType === opt.value ? "default" : "outline"}
                  className="flex items-center justify-center gap-2 h-11 transition-all duration-200 active:scale-95 hover:shadow-sm"
                >
                  <opt.icon className="h-4 w-4" />
                  {opt.label}
                </Button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Delivery Details — shown when order is delivery (auto or selected) */}
      {isDelivery && (
        <div className={cn("rounded-xl border", UI.surface, UI.border)}>
          <div className="p-4 grid gap-3">
            <div className="flex items-center gap-2 font-medium">
              <MapPin className="h-4 w-4 text-brand-dark" />
              Delivery Details
            </div>
            <input
              type="text"
              placeholder="Delivery address *"
              value={deliveryAddress}
              onChange={(e) => onDeliveryAddressChange?.(e.target.value)}
              className="w-full px-3 py-2.5 rounded-md border border-input bg-background text-sm transition-all focus:outline-none focus:ring-2 focus:ring-brand/30 focus:border-brand"
            />
            <div className="flex items-center gap-2">
              <Phone className="h-4 w-4 text-muted-foreground" />
              <input
                type="tel"
                placeholder="Phone number *"
                value={customerPhone}
                onChange={(e) => onCustomerPhoneChange?.(e.target.value)}
                className="flex-1 px-3 py-2.5 rounded-md border border-input bg-background text-sm transition-all focus:outline-none focus:ring-2 focus:ring-brand/30 focus:border-brand"
              />
            </div>
            <textarea
              placeholder="Delivery notes (optional)"
              value={deliveryNotes}
              onChange={(e) => onDeliveryNotesChange?.(e.target.value)}
              rows={2}
              className="w-full px-3 py-2.5 rounded-md border border-input bg-background text-sm transition-all focus:outline-none focus:ring-2 focus:ring-brand/30 focus:border-brand resize-none"
            />
          </div>
        </div>
      )}

      {/* Collection Time — only for collection orders */}
      {!isDelivery && (
        <div className={cn("rounded-xl border", UI.surface, UI.border)}>
          <div className="p-4 grid gap-3">
            <div className="flex items-center gap-2 font-medium">
              <Clock3 className="h-4 w-4 text-brand-dark" />
              Collection Time
            </div>
            <p className={cn("text-sm", UI.muted)}>When would you like to collect your order?</p>
            <div className="flex gap-2">
              {(["ASAP", "30min", "45min"] as const).map((option) => {
                const labels: Record<string, string> = { "ASAP": "15min", "30min": "30min", "45min": "45min" }
                return (
                  <Button
                    key={option}
                    onClick={() => onPickupTimeChange(option)}
                    variant={pickupTime === option ? "default" : "outline"}
                    className="h-10 px-4 transition-all duration-200 active:scale-95 hover:shadow-sm"
                  >
                    {labels[option]}
                  </Button>
                )
              })}
            </div>
          </div>
        </div>
      )}

      {/* Payment Method */}
      {(yocoEnabled || snapscanEnabled) && (
        <div className={cn("rounded-xl border", UI.surface, UI.border)}>
          <div className="p-4 grid gap-3">
            <div className="flex items-center gap-2 font-medium">
              <CreditCard className="h-4 w-4 text-brand-dark" />
              Payment Method
            </div>
            <div className="grid gap-2">
              <Button
                onClick={() => onPaymentMethodChange?.("none")}
                variant={paymentMethod === "none" ? "default" : "outline"}
                className={cn("flex items-center justify-start gap-3 h-12 w-full transition-all duration-200 active:scale-[0.98]", paymentMethod !== "none" && "bg-muted hover:bg-muted/80 hover:shadow-sm")}
              >
                <Store className="h-4 w-4 shrink-0" />
                <span>{payOnLabel}</span>
              </Button>
              {yocoEnabled && (
                <Button
                  onClick={() => onPaymentMethodChange?.("yoco_link")}
                  variant={paymentMethod === "yoco_link" ? "default" : "outline"}
                  className={cn("flex items-center justify-start gap-3 h-12 w-full transition-all duration-200 active:scale-[0.98]", paymentMethod !== "yoco_link" && "bg-muted hover:bg-muted/80 hover:shadow-sm")}
                >
                  <CreditCard className="h-4 w-4 shrink-0" />
                  <span>Pay with Yoco</span>
                </Button>
              )}
              {snapscanEnabled && (
                <Button
                  onClick={() => onPaymentMethodChange?.("snapscan")}
                  variant={paymentMethod === "snapscan" ? "default" : "outline"}
                  className={cn("flex items-center justify-start gap-3 h-12 w-full transition-all duration-200 active:scale-[0.98]", paymentMethod !== "snapscan" && "bg-muted hover:bg-muted/80 hover:shadow-sm")}
                >
                  <CreditCard className="h-4 w-4 shrink-0" />
                  <span>Pay with SnapScan</span>
                </Button>
              )}
            </div>
          </div>
        </div>
      )}

      <div className="h-1" />

      {/* Place Order */}
      <div className="sticky bottom-0 z-10 bg-white pt-2 pb-4">
        <div className="absolute -top-10 left-0 right-0 h-10 bg-gradient-to-t from-white to-transparent pointer-events-none" />
        <Button
          className={cn(
            "w-full h-12 font-medium transition-all duration-300 shadow-md hover:shadow-lg active:scale-[0.98]",
            UI.accentBg
          )}
          size="lg"
          onClick={onPlaceOrder}
        >
          {"Place Order · " + formatCurrency(grandTotal)}
        </Button>
      </div>
    </section>
  )
}
