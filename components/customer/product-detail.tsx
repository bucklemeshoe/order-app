"use client"

import { cn } from "@/lib/utils"
import { UI } from "@/lib/theme"
import { formatCurrency } from "@/lib/helpers/formatting"
import { Check, Minus, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { IconButton } from "@/components/shared"
import type { Product, Variant, ExtrasMap } from "@/types"

export function ProductDetail({
  product,
  qty,
  onQtyChange,
  selectedExtras,
  onToggleExtra,
  onAdd,
  extrasMap,
  selectedVariant,
  onVariantChange,
}: {
  product: Product
  qty: number
  onQtyChange: (n: number) => void
  selectedExtras: string[]
  onToggleExtra: (id: string) => void
  onAdd: () => void
  extrasMap: ExtrasMap
  selectedVariant: Variant | null
  onVariantChange: (variant: Variant | null) => void
}) {
  const availableExtras = product.extras?.map((name) => extrasMap[name]).filter(Boolean) || []
  const currentPrice = selectedVariant?.price ?? product.price
  const extrasCost = selectedExtras.reduce(
    (sum, id) => sum + (availableExtras.find((e) => e.id === id)?.price ?? 0),
    0
  )
  const total = currentPrice + extrasCost

  return (
    <section className="grid gap-4">
      {/* Size Selection */}
      {product.variants && product.variants.length > 1 && (
        <div className="grid gap-2">
          <h3 className="text-lg font-semibold">Size</h3>
          <div className="grid grid-cols-2 gap-2">
            {product.variants.map((variant) => {
              const isSelected = selectedVariant?.id === variant.id
              return (
                <button
                  key={variant.id}
                  onClick={() => onVariantChange(variant)}
                  className={cn(
                    "p-3 rounded-md border-2 transition-all duration-200 active:scale-95 text-center shadow-sm",
                    isSelected
                      ? "border-brand bg-brand/5 text-foreground shadow-md"
                      : "border-border bg-background text-muted-foreground hover:border-brand/40 hover:shadow"
                  )}
                >
                  <div className="font-semibold">{variant.name}</div>
                  <div className="text-sm font-medium text-brand">
                    {formatCurrency(variant.price)}
                  </div>
                </button>
              )
            })}
          </div>
        </div>
      )}

      {/* Extras */}
      {availableExtras.length > 0 && (
        <div className="grid gap-2">
          <h3 className="text-lg font-semibold">Extras</h3>
          <div className={cn("rounded-xl border", UI.surface, UI.border)}>
            {availableExtras.map((e, i) => {
              const checked = selectedExtras.includes(e.id)
              return (
                <div key={e.id}>
                  <button
                    onClick={() => onToggleExtra(e.id)}
                    aria-pressed={checked}
                    className={cn(
                      "w-full flex items-center justify-between px-3 py-3 text-sm transition-all duration-200 hover:bg-neutral-50 active:bg-neutral-100",
                      checked ? "bg-neutral-50/80" : ""
                    )}
                  >
                    <div className="flex items-center gap-2">
                      <span
                        className={cn(
                          "inline-flex h-4 w-4 items-center justify-center rounded-full border",
                          checked ? "border-neutral-900 bg-neutral-900 text-white" : "border-neutral-300"
                        )}
                        aria-hidden="true"
                      >
                        {checked ? <Check className="h-3 w-3" /> : null}
                      </span>
                      <span className="text-neutral-800">{e.name}</span>
                    </div>
                    <span className="font-medium text-brand-dark">{formatCurrency(e.price)}</span>
                  </button>
                  {i < availableExtras.length - 1 && <Separator />}
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* Quantity */}
      <div className="grid gap-2">
        <h3 className="text-lg font-semibold text-center">Quantity</h3>
        <div className="flex items-center justify-center gap-3">
          <IconButton ariaLabel="Decrease quantity" onClick={() => onQtyChange(Math.max(1, qty - 1))}>
            <Minus className="h-4 w-4" />
          </IconButton>
          <div className="w-10 text-center text-lg font-semibold tabular-nums">{qty}</div>
          <IconButton ariaLabel="Increase quantity" onClick={() => onQtyChange(qty + 1)}>
            <Plus className="h-4 w-4" />
          </IconButton>
        </div>
      </div>

      <div className="h-4" />

      {/* Add to Cart Button */}
      <div className="sticky bottom-0 z-10 bg-white pt-2 pb-4">
        <div className="absolute -top-10 left-0 right-0 h-10 bg-gradient-to-t from-background to-transparent pointer-events-none" />
        <Button
          className={cn(
            "w-full h-12 font-medium transition-all duration-300 shadow-md hover:shadow-lg active:scale-[0.98]",
            UI.accentBg
          )}
          size="lg"
          onClick={onAdd}
        >
          {"Add " + qty + "x to Cart · " + formatCurrency(total * qty)}
        </Button>
      </div>
    </section>
  )
}
