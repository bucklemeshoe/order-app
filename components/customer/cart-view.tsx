"use client"

import Image from "next/image"
import { cn } from "@/lib/utils"
import { UI } from "@/lib/theme"
import { formatCurrency } from "@/lib/helpers/formatting"
import { Minus, Plus, Trash2, Coffee } from "lucide-react"
import { Button } from "@/components/ui/button"
import { CardFooter } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { IconButton, Row } from "@/components/shared"
import type { CartItem } from "@/types"

export function CartView({
  items,
  onAdjustQty,
  onRemove,
  onClear,
  subtotal,
  tax,
  total,
  onCheckout,
  onAddMoreItems,
  isStoreOpen = true,
}: {
  items: CartItem[]
  onAdjustQty: (index: number, delta: number) => void
  onRemove: (index: number) => void
  onClear: () => void
  subtotal: number
  tax: number
  total: number
  onCheckout: () => void
  onAddMoreItems: () => void
  isStoreOpen?: boolean
}) {
  return (
    <section className="grid gap-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Your Cart</h2>
        <Button
          variant="ghost"
          size="sm"
          className="text-destructive hover:text-destructive hover:bg-destructive/10 -mr-2"
          onClick={onClear}
        >
          <Trash2 className="h-4 w-4 mr-1" />
          Clear
        </Button>
      </div>

      <div className="grid gap-2">
        {items.map((ci, index) => (
          <div
            key={`${ci.product.id}-${ci.variant?.id || "default"}-${ci.extras.join(",")}-${index}`}
            className={cn("rounded-xl border p-3 transition-all duration-300 hover:shadow-md hover:border-brand/30", UI.surface, UI.border)}
          >
            <div className="flex items-start gap-3">
              <div className="h-12 w-12 rounded-md overflow-hidden bg-neutral-100 border border-neutral-200 shrink-0 flex items-center justify-center">
                {ci.product.image && !ci.product.image.includes("placeholder") ? (
                  <Image
                    src={ci.product.image}
                    alt={ci.product.name}
                    width={48}
                    height={48}
                    className="h-12 w-12 object-cover"
                  />
                ) : (
                  <Coffee className="h-5 w-5 text-amber-400/60" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium">{ci.product.name}</div>
                {ci.variant && <div className="text-xs text-neutral-600">{ci.variant.name}</div>}
                <div className="text-xs text-brand-dark">
                  {formatCurrency(ci.variant?.price ?? ci.product.price)} each
                </div>
                {ci.extras.length > 0 && (
                  <div className="mt-2 space-y-1">
                    <div className="text-xs font-medium text-neutral-700">Extras:</div>
                    {ci.extras.map((extra, idx) => (
                      <div key={idx} className={cn("text-xs", UI.muted)}>
                        • {extra}
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <div className="flex items-center gap-1 shrink-0 ml-auto flex-col">
                <div className="flex items-center gap-2">
                  <IconButton ariaLabel="Decrease" onClick={() => onAdjustQty(index, -1)}>
                    <Minus className="h-4 w-4" />
                  </IconButton>
                  <div className="w-6 text-center tabular-nums text-sm font-medium">{ci.qty}</div>
                  <IconButton ariaLabel="Increase" onClick={() => onAdjustQty(index, 1)}>
                    <Plus className="h-4 w-4" />
                  </IconButton>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 text-destructive hover:text-destructive hover:bg-destructive/10 w-full mt-1"
                  onClick={() => onRemove(index)}
                >
                  <Trash2 className="h-4 w-4 mr-1.5" />
                  Remove
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Order Summary */}
      <div className={cn("rounded-xl border", UI.surface, UI.border)}>
        <div className="p-4 grid gap-3">
          <div className="text-base font-semibold">Order Summary</div>
          <div className="grid gap-2 text-sm">
            <Row label="Subtotal" value={formatCurrency(subtotal)} />
            <Row label="Tax (15%)" value={formatCurrency(tax)} />
          </div>
          <Separator />
          <Row
            label={<span className="font-semibold">Total</span>}
            value={<span className="font-semibold text-brand-dark">{formatCurrency(total)}</span>}
          />
        </div>
        <CardFooter className="p-4 pt-0 grid gap-2">
          <Button
            className="w-full h-11 transition-all duration-300 shadow-md hover:shadow-lg active:scale-[0.98]"
            onClick={isStoreOpen ? onCheckout : undefined}
            disabled={!isStoreOpen}
          >
            {isStoreOpen ? "Proceed to Checkout" : "Store Closed — Cannot Checkout"}
          </Button>
          <Button
            className="w-full h-11"
            variant="outline"
            onClick={onAddMoreItems}
          >
            Add More Items
          </Button>
        </CardFooter>
      </div>
    </section>
  )
}

export function EmptyCartView({ onBrowseMenu }: { onBrowseMenu: () => void }) {
  return (
    <section className="grid gap-6 py-6">
      <div className="mt-4" />
      <div className={cn("rounded-xl border p-8 text-center", UI.surface, UI.border)}>
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-neutral-100 border border-neutral-200">
          <Coffee className="h-8 w-8 text-brand-dark" />
        </div>
        <div className="mt-4 text-lg font-semibold">Your cart is empty</div>
        <p className={cn("mt-1 text-sm", UI.muted)}>
          Browse the menu and add items to get started.
        </p>
        <div className="mt-5">
          <Button
            className="h-10 px-6 transition-all duration-300 shadow-md hover:shadow-lg active:scale-[0.98]"
            onClick={onBrowseMenu}
          >
            Browse Menu
          </Button>
        </div>
      </div>
      <div className="mb-12" />
    </section>
  )
}
