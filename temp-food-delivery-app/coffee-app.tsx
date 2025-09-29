"use client"

import type React from "react"
import { useEffect, useMemo, useState } from "react"
import Image from "next/image"
import {
  BadgeCheck,
  CalendarClock,
  Check,
  ChevronLeft,
  CircleUserRound,
  Clock3,
  Home,
  ListChecks,
  MapPin,
  Minus,
  Plus,
  ReceiptText,
  ShoppingCart,
  Trash2,
  Coffee,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { CardFooter } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { cn } from "@/lib/utils"

type View = "menu" | "product" | "cart" | "cart-empty" | "checkout" | "orders" | "order-detail" | "profile"
type Category = "All Items" | "Coffee" | "Food" | "Pastry"

type Product = {
  id: string
  name: string
  description: string
  price: number
  image: string
  category: Category
}

type CartItem = {
  product: Product
  qty: number
  extras: string[]
  note?: string
}

const UI = {
  // Palette: black/greys/white + one yellow accent
  text: "text-neutral-900",
  muted: "text-neutral-600",
  subtle: "text-neutral-500",
  border: "border-neutral-200",
  surface: "bg-white",
  surfaceAlt: "bg-neutral-50",
  accentBg: "bg-yellow-500",
  accentText: "text-yellow-600",
}

const products: Product[] = [
  {
    id: "americano",
    name: "Americano",
    description: "Espresso with hot water",
    price: 4.0,
    image: "/coffee-cup.png",
    category: "Coffee",
  },
  {
    id: "cappuccino",
    name: "Cappuccino",
    description: "Equal parts espresso, steamed milk, and foam",
    price: 5.0,
    image: "/frothy-cappuccino.png",
    category: "Coffee",
  },
  {
    id: "cold-brew",
    name: "Cold Brew",
    description: "Smooth and less acidic cold coffee",
    price: 4.5,
    image: "/iced-coffee-refreshment.png",
    category: "Coffee",
  },
  {
    id: "espresso",
    name: "Espresso",
    description: "Rich and bold single shot",
    price: 3.5,
    image: "/espresso-shot.png",
    category: "Coffee",
  },
]

const extrasList = [
  { id: "extra-shot", label: "Extra shot", price: 5.0 },
  { id: "oat-milk", label: "Oat milk", price: 6.0 },
  { id: "caramel-syrup", label: "Caramel syrup", price: 4.0 },
  { id: "large-size", label: "Large size", price: 10.0 },
]

export default function CoffeeApp() {
  const [view, setView] = useState<View>("menu")
  const [category, setCategory] = useState<Category>("All Items")
  const [activeProduct, setActiveProduct] = useState<Product | null>(null)
  const [count, setCount] = useState(1)
  const [selectedExtras, setSelectedExtras] = useState<string[]>([])
  const [shareLocation, setShareLocation] = useState(false)
  const [cart, setCart] = useState<CartItem[]>([])
  const [ordersTab, setOrdersTab] = useState<"current" | "past">("current")

  const filtered = useMemo(() => {
    if (category === "All Items") return products
    return products.filter((p) => p.category === category)
  }, [category])

  const subtotal = cart.reduce((sum, item) => {
    const extrasCost = item.extras.reduce((eSum, id) => {
      const e = extrasList.find((x) => x.id === id)
      return e ? eSum + e.price : eSum
    }, 0)
    return sum + item.qty * (item.product.price + extrasCost)
  }, 0)
  const taxRate = 0.085
  const tax = +(subtotal * taxRate).toFixed(2)
  const total = +(subtotal + tax).toFixed(2)

  function navTo(v: View) {
    setView(v)
  }
  function openProduct(p: Product) {
    setActiveProduct(p)
    setCount(1)
    setSelectedExtras([])
    setView("product")
  }
  function arraysEqual(a: string[], b: string[]) {
    if (a.length !== b.length) return false
    const set = new Set(a)
    return b.every((x) => set.has(x))
  }
  function toggleExtra(id: string) {
    setSelectedExtras((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]))
  }
  function addToCart() {
    if (!activeProduct) return
    setCart((prev) => {
      const idx = prev.findIndex((x) => x.product.id === activeProduct.id && arraysEqual(x.extras, selectedExtras))
      if (idx > -1) {
        const copy = [...prev]
        copy[idx] = { ...copy[idx], qty: copy[idx].qty + count }
        return copy
      }
      return [...prev, { product: activeProduct, qty: count, extras: selectedExtras }]
    })
    setView("cart")
  }
  function adjustItemQty(id: string, delta: number) {
    setCart((prev) =>
      prev
        .map((ci) => (ci.product.id === id ? { ...ci, qty: Math.max(1, ci.qty + delta) } : ci))
        .filter((ci) => ci.qty > 0),
    )
  }
  function removeItem(id: string) {
    setCart((prev) => prev.filter((ci) => ci.product.id !== id))
  }
  function clearCart() {
    setCart([])
    setView("cart-empty")
  }
  function placeOrder() {
    setCart([])
    setView("order-detail")
  }

  // Keep views in sync if items are removed manually.
  useEffect(() => {
    if (view === "cart" && cart.length === 0) {
      setView("cart-empty")
    }
  }, [cart.length, view])

  const header = useMemo(() => {
    switch (view) {
      case "menu":
        return { title: "Menu", showBack: false }
      case "product":
        return { title: "", showBack: true, backTo: "menu" as View }
      case "cart":
        // Only show "Your Cart" when there are items.
        return { title: "Your Cart", showBack: false }
      case "cart-empty":
        return { title: "Cart", showBack: false }
      case "checkout":
        return { title: "", showBack: true, backTo: "cart" as View }
      case "orders":
        return { title: "My Orders", showBack: false }
      case "order-detail":
        return { title: "", showBack: true, backTo: "orders" as View }
      case "profile":
        return { title: "My Profile", showBack: false }
      default:
        return { title: "Coffee App", showBack: false }
    }
  }, [view, activeProduct])

  return (
    <main
      className={cn("w-full min-h-[100dvh] flex items-start justify-center", UI.surfaceAlt, UI.text)}
      style={{ paddingTop: "env(safe-area-inset-top)", paddingBottom: "env(safe-area-inset-bottom)" }}
      aria-label="Coffee App Minimal"
    >
      <div className="w-full max-w-sm mx-auto relative">
        {/* Top bar: minimal, no shadow */}
        <header className={cn("sticky top-0 z-20", UI.surface, "border-b", UI.border)}>
          <div className="flex items-center gap-2 px-4 py-2">
            {header.showBack ? (
              <button
                onClick={() => navTo((header as any).backTo)}
                className="inline-flex items-center gap-1 text-sm text-neutral-700 hover:text-neutral-900 transition-colors"
                aria-label="Go back"
              >
                <ChevronLeft className="h-4 w-4" />
                <span>Back</span>
              </button>
            ) : null}
            {header.title ? <h1 className="text-lg font-semibold tracking-tight">{header.title}</h1> : null}
            <div className="ml-auto flex items-center gap-2">
              <CircleUserRound className={cn("h-5 w-5", UI.accentText)} />
            </div>
          </div>
        </header>

        {/* Content */}
        <div className="px-4 py-4 pb-24 grid gap-4">
          {view === "menu" && (
            <MenuView
              products={filtered}
              category={category}
              onCategoryChange={setCategory}
              onOpenProduct={openProduct}
            />
          )}

          {view === "product" && activeProduct && (
            <ProductView
              product={activeProduct}
              qty={count}
              onQtyChange={setCount}
              selectedExtras={selectedExtras}
              onToggleExtra={toggleExtra}
              onAdd={addToCart}
            />
          )}

          {view === "cart" && cart.length > 0 && (
            <CartView
              items={cart}
              onAdjustQty={adjustItemQty}
              onRemove={removeItem}
              onClear={clearCart}
              subtotal={subtotal}
              tax={tax}
              total={total}
              onCheckout={() => setView("checkout")}
            />
          )}

          {view === "cart-empty" && <EmptyCartPage onBrowseMenu={() => setView("menu")} />}

          {view === "checkout" && (
            <CheckoutView
              total={subtotal}
              grandTotal={total}
              shareLocation={shareLocation}
              onShareToggle={setShareLocation}
              onPlaceOrder={placeOrder}
            />
          )}

          {view === "orders" && (
            <OrdersView tab={ordersTab} onTabChange={setOrdersTab} onOpenDetail={() => setView("order-detail")} />
          )}

          {view === "order-detail" && <OrderDetailView onGoOrders={() => setView("orders")} />}

          {view === "profile" && <ProfileView />}
        </div>

        {/* Bottom tab bar: minimal with accent dot */}
        <nav
          className={cn(
            "fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-sm",
            UI.surface,
            "border-t",
            UI.border,
            "backdrop-blur",
          )}
          style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
          aria-label="Primary"
        >
          <div className="grid grid-cols-4 items-center justify-between px-2 py-1.5 text-xs">
            <TabButton
              label="Menu"
              icon={<Home className="h-5 w-5" />}
              active={view === "menu" || view === "product"}
              onClick={() => setView("menu")}
            />
            <TabButton
              label="Cart"
              icon={<ShoppingCart className="h-5 w-5" />}
              active={view === "cart" || view === "cart-empty" || view === "checkout"}
              onClick={() => setView(cart.length === 0 ? "cart-empty" : "cart")}
              badge={cart.length > 0 ? cart.length : undefined}
            />
            <TabButton
              label="Orders"
              icon={<ReceiptText className="h-5 w-5" />}
              active={view === "orders" || view === "order-detail"}
              onClick={() => setView("orders")}
            />
            <TabButton
              label="Profile"
              icon={<ListChecks className="h-5 w-5" />}
              active={view === "profile"}
              onClick={() => setView("profile")}
            />
          </div>
        </nav>
      </div>
    </main>
  )
}

/* Views */

function HeroBanner() {
  return (
    <div
      className={cn(
        "relative h-[35vh] min-h-[200px] max-h-[360px] rounded-xl overflow-hidden border",
        UI.surface,
        UI.border,
      )}
      aria-label="Promotional hero banner"
    >
      <Image
        src={"/placeholder.svg?height=720&width=1280&query=coffee%20shop%20hero%20banner"}
        alt="Coffee shop hero banner"
        fill
        sizes="(max-width: 640px) 100vw, 640px"
        className="object-cover"
        priority
      />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/25 via-black/10 to-transparent" />
      <div className="absolute bottom-3 left-3 inline-flex items-center gap-2 rounded-full bg-white/85 px-2.5 py-1 text-xs text-neutral-900 border border-neutral-200 backdrop-blur">
        <span>Hero banner placeholder</span>
      </div>
    </div>
  )
}

function MenuView({
  products,
  category,
  onCategoryChange,
  onOpenProduct,
}: {
  products: Product[]
  category: Category
  onCategoryChange: (c: Category) => void
  onOpenProduct: (p: Product) => void
}) {
  const cats: Category[] = ["All Items", "Coffee", "Food", "Pastry"]
  return (
    <section className="grid gap-4">
      <HeroBanner />
      <div className="flex items-center gap-2 justify-center">
        {cats.map((c) => {
          const active = c === category
          return (
            <button
              key={c}
              onClick={() => onCategoryChange(c)}
              aria-pressed={active}
              className={cn(
                "px-3 py-1.5 rounded-full text-sm transition-colors border",
                active
                  ? "bg-neutral-900 text-white border-neutral-900"
                  : "bg-white text-neutral-700 border-neutral-200 hover:bg-neutral-50",
              )}
            >
              {c}
            </button>
          )
        })}
      </div>

      <ul className="grid gap-2">
        {products.map((p) => (
          <li key={p.id}>
            <button
              onClick={() => onOpenProduct(p)}
              className={cn(
                "w-full text-left rounded-xl border p-3",
                "bg-white hover:bg-neutral-50 transition-colors",
                "border-neutral-200",
              )}
              aria-label={`Open ${p.name}`}
            >
              <div className="flex items-center gap-3">
                <div className="h-14 w-14 rounded-lg overflow-hidden bg-neutral-100 border border-neutral-200 shrink-0">
                  <Image
                    src={p.image || "/placeholder.svg"}
                    alt={p.name}
                    width={56}
                    height={56}
                    className="h-14 w-14 object-cover"
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="text-[15px] font-medium">{p.name}</div>
                  <div className={cn("text-sm line-clamp-2", UI.muted)}>{p.description}</div>
                </div>
                <div className={cn("text-sm font-semibold ml-2", UI.accentText)}>{"R" + p.price.toFixed(2)}</div>
              </div>
            </button>
          </li>
        ))}
      </ul>
    </section>
  )
}

function ProductView({
  product,
  qty,
  onQtyChange,
  selectedExtras,
  onToggleExtra,
  onAdd,
}: {
  product: Product
  qty: number
  onQtyChange: (n: number) => void
  selectedExtras: string[]
  onToggleExtra: (id: string) => void
  onAdd: () => void
}) {
  const extrasCost = selectedExtras.reduce((sum, id) => sum + (extrasList.find((e) => e.id === id)?.price ?? 0), 0)
  const total = product.price + extrasCost

  return (
    <section className="grid gap-4">
      <div className={cn("rounded-xl border p-4", UI.surface, UI.border)}>
        <div className="h-44 w-full rounded-lg overflow-hidden bg-neutral-100 border border-neutral-200">
          <Image
            src={"/placeholder.svg?height=176&width=336&query=coffee%20product%20image"}
            alt={product.name}
            width={672}
            height={352}
            className="w-full h-full object-cover"
          />
        </div>
      </div>

      <div className="grid place-items-center gap-1">
        <h2 className="text-xl font-semibold">{product.name}</h2>
        <p className={cn("text-sm", UI.muted)}>{product.description}</p>
        <div className={cn("text-2xl font-bold", UI.accentText)}>{"R" + product.price.toFixed(2)}</div>
      </div>

      <div className="grid gap-2">
        <h3 className="text-lg font-semibold">Extras</h3>
        <div className={cn("rounded-xl border", UI.surface, UI.border)}>
          {extrasList.map((e, i) => {
            const checked = selectedExtras.includes(e.id)
            return (
              <div key={e.id}>
                <button
                  onClick={() => onToggleExtra(e.id)}
                  aria-pressed={checked}
                  className={cn(
                    "w-full flex items-center justify-between px-3 py-3 text-sm transition-colors",
                    checked ? "bg-neutral-50" : "",
                  )}
                >
                  <div className="flex items-center gap-2">
                    <span
                      className={cn(
                        "inline-flex h-4 w-4 items-center justify-center rounded-full border",
                        checked ? "border-neutral-900 bg-neutral-900 text-white" : "border-neutral-300",
                      )}
                      aria-hidden="true"
                    >
                      {checked ? <Check className="h-3 w-3" /> : null}
                    </span>
                    <span className="text-neutral-800">{e.label}</span>
                  </div>
                  <span className={cn("font-medium", UI.accentText)}>{"R" + e.price.toFixed(2)}</span>
                </button>
                {i < extrasList.length - 1 && <Separator className="" />}
              </div>
            )
          })}
        </div>
      </div>

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

      <div className="h-1" />

      <div className="sticky bottom-[4.25rem] z-10">
        <Button
          className={cn(
            "w-full h-10 rounded-full font-medium transition-colors",
            UI.accentBg,
            "text-neutral-900 hover:bg-yellow-600 hover:text-white",
          )}
          onClick={onAdd}
        >
          {"+ Add " + qty + "x to Cart · R" + (total * qty).toFixed(2)}
        </Button>
      </div>
    </section>
  )
}

function CartView({
  items,
  onAdjustQty,
  onRemove,
  onClear,
  subtotal,
  tax,
  total,
  onCheckout,
}: {
  items: CartItem[]
  onAdjustQty: (id: string, delta: number) => void
  onRemove: (id: string) => void
  onClear: () => void
  subtotal: number
  tax: number
  total: number
  onCheckout: () => void
}) {
  return (
    <section className="grid gap-4">
      {/* Keep Clear only on non-empty cart */}
      <div className="flex items-center justify-end">
        <button className="inline-flex items-center gap-1 text-sm text-red-600 hover:text-red-700" onClick={onClear}>
          <Trash2 className="h-4 w-4" />
          <span>Clear</span>
        </button>
      </div>

      <div className="grid gap-2">
        {items.map((ci) => (
          <div key={ci.product.id} className={cn("rounded-xl border p-3", UI.surface, UI.border)}>
            <div className="flex items-start gap-3">
              <div className="h-12 w-12 rounded-md overflow-hidden bg-neutral-100 border border-neutral-200 shrink-0">
                <Image
                  src={ci.product.image || "/placeholder.svg"}
                  alt={ci.product.name}
                  width={48}
                  height={48}
                  className="h-12 w-12 object-cover"
                />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium">{ci.product.name}</div>
                <div className={cn("text-xs", UI.accentText)}>{"R" + ci.product.price.toFixed(2)} each</div>
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
              <div className="flex items-center gap-2 shrink-0">
                <IconButton ariaLabel="Decrease" onClick={() => onAdjustQty(ci.product.id, -1)}>
                  <Minus className="h-4 w-4" />
                </IconButton>
                <div className="w-6 text-center tabular-nums">{ci.qty}</div>
                <IconButton ariaLabel="Increase" onClick={() => onAdjustQty(ci.product.id, 1)}>
                  <Plus className="h-4 w-4" />
                </IconButton>
                <button
                  className="text-red-600 hover:text-red-700"
                  aria-label="Remove item"
                  onClick={() => onRemove(ci.product.id)}
                >
                  <Trash2 className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className={cn("rounded-xl border", UI.surface, UI.border)}>
        <div className="p-4 grid gap-3">
          <div className="text-base font-semibold">Order Summary</div>
          <div className="grid gap-2 text-sm">
            <Row label="Subtotal" value={"R" + subtotal.toFixed(2)} />
            <Row label="Tax (8.5%)" value={"R" + tax.toFixed(2)} />
          </div>
          <Separator />
          <Row
            label={<span className="font-semibold">Total</span>}
            value={<span className={cn("font-semibold", UI.accentText)}>{"R" + total.toFixed(2)}</span>}
          />
        </div>
        <CardFooter className="p-4 pt-0 grid gap-2">
          <Button
            className={cn(
              "w-full h-10 rounded-full font-medium transition-colors",
              UI.accentBg,
              "text-neutral-900 hover:bg-yellow-600 hover:text-white",
            )}
            onClick={onCheckout}
          >
            Proceed to Checkout
          </Button>
          <Button className="w-full h-10 rounded-full font-medium border-neutral-300 bg-transparent" variant="outline">
            Add More Items
          </Button>
        </CardFooter>
      </div>
    </section>
  )
}

function EmptyCartPage({ onBrowseMenu }: { onBrowseMenu: () => void }) {
  return (
    <section className="grid gap-6 py-6">
      <div className="mt-4" />
      <div className={cn("rounded-xl border p-8 text-center", UI.surface, UI.border)}>
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-neutral-100 border border-neutral-200">
          <Coffee className={cn("h-8 w-8", UI.accentText)} />
        </div>
        <div className="mt-4 text-lg font-semibold">Your cart is empty</div>
        <p className={cn("mt-1 text-sm", UI.muted)}>Browse the menu and add items to get started.</p>
        <div className="mt-5">
          <Button
            className={cn(
              "h-10 rounded-full font-medium",
              UI.accentBg,
              "text-neutral-900 hover:bg-yellow-600 hover:text-white",
            )}
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

function CheckoutView({
  total,
  grandTotal,
  shareLocation,
  onShareToggle,
  onPlaceOrder,
}: {
  total: number
  grandTotal: number
  shareLocation: boolean
  onShareToggle: (b: boolean) => void
  onPlaceOrder: () => void
}) {
  return (
    <section className="grid gap-4">
      <h2 className="text-xl font-semibold">Checkout</h2>
      <div className={cn("rounded-xl border", UI.surface, UI.border)}>
        <div className="p-4 grid gap-3">
          <div className="text-base font-semibold">Order Summary</div>
          <Row label="Items" value={"R" + total.toFixed(2)} />
          <Separator />
          <Row
            label={<span className="font-semibold">Total</span>}
            value={<span className={cn("font-semibold", UI.accentText)}>{"R" + grandTotal.toFixed(2)}</span>}
          />
        </div>
      </div>

      <div className={cn("rounded-xl border", UI.surface, UI.border)}>
        <div className="p-4 grid gap-2">
          <div className="flex items-center gap-2 font-medium">
            <Clock3 className={cn("h-4 w-4", UI.accentText)} />
            Pickup Time
          </div>
          <p className={cn("text-sm", UI.muted)}>When would you like to collect your order?</p>
          <div className="inline-flex items-center gap-2 text-sm">
            <span className="font-medium">ASAP (15 minutes)</span>
            <CalendarClock className="h-4 w-4 text-neutral-500" />
          </div>
        </div>
      </div>

      <div
        className={cn(
          "rounded-xl border",
          shareLocation ? "bg-yellow-50 border-yellow-200 text-neutral-900" : "bg-neutral-900 text-neutral-100",
        )}
      >
        <div className="p-4 grid gap-2">
          <div className="flex items-center gap-2 font-medium">
            <MapPin className={cn("h-4 w-4", shareLocation ? "text-yellow-700" : "text-yellow-50")} />
            <span>Share Location</span>
          </div>
          <p className={cn("text-sm", shareLocation ? "text-neutral-700" : "text-neutral-300")}>
            Help us notify you when you&apos;re nearby for pickup
          </p>
          <div className="flex items-center justify-end">
            <Switch checked={shareLocation} onCheckedChange={onShareToggle} aria-label="Toggle share location" />
          </div>
        </div>
      </div>

      <div className="h-1" />

      <div className="sticky bottom-[4.25rem] z-10">
        <Button
          className={cn(
            "w-full h-10 rounded-full font-medium transition-colors",
            UI.accentBg,
            "text-neutral-900 hover:bg-yellow-600 hover:text-white",
          )}
          onClick={onPlaceOrder}
        >
          <BadgeCheck className="h-4 w-4 mr-2" />
          {"Place Order · R" + grandTotal.toFixed(2)}
        </Button>
      </div>
    </section>
  )
}

function OrdersView({
  tab,
  onTabChange,
  onOpenDetail,
}: {
  tab: "current" | "past"
  onTabChange: (t: "current" | "past") => void
  onOpenDetail: () => void
}) {
  return (
    <section className="grid gap-4">
      <Tabs value={tab} onValueChange={(v) => onTabChange(v as any)}>
        <TabsList className="grid grid-cols-2 w-full">
          <TabsTrigger value="current">Current (1)</TabsTrigger>
          <TabsTrigger value="past">Past (7)</TabsTrigger>
        </TabsList>

        <TabsContent value="current" className="mt-3 grid gap-2">
          <button
            className={cn("rounded-xl border p-4 text-left", UI.surface, UI.border, "hover:bg-neutral-50")}
            onClick={onOpenDetail}
            aria-label="Open current order"
          >
            <div className="flex items-center justify-between">
              <div className="font-medium">Order #9408bc1d</div>
              <span
                className="px-2 py-0.5 rounded-full text-xs font-semibold bg-yellow-500 text-neutral-900 border border-yellow-500"
                aria-label="Status: preparing"
              >
                preparing
              </span>
            </div>
            <div className={cn("mt-1 text-sm", UI.muted)}>10 Aug, 15:24</div>

            <div className="mt-2 inline-flex items-center gap-2 rounded-md border border-yellow-200 bg-yellow-50 px-3 py-2 text-sm text-neutral-900">
              <Clock3 className="h-4 w-4 text-yellow-600" />
              <span className="font-medium">Your order is being prepared</span>
            </div>
          </button>
        </TabsContent>

        <TabsContent value="past" className="mt-3 grid gap-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className={cn("rounded-xl border p-4", UI.surface, UI.border)}>
              <div className="flex items-center justify-between">
                <div className="font-medium">Order #{Math.random().toString(16).slice(2, 10)}</div>
                <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-neutral-900 border border-yellow-300">
                  collected
                </span>
              </div>
              <div className={cn("mt-1 text-sm", UI.muted)}>10 Aug, 15:0{i}</div>
              <div className="mt-1 text-sm">Order completed — enjoy!</div>
            </div>
          ))}
        </TabsContent>
      </Tabs>
    </section>
  )
}

function OrderDetailView({ onGoOrders }: { onGoOrders: () => void }) {
  type StepStatus = "complete" | "current" | "upcoming"
  type Step = { name: string; description: string; status: StepStatus }

  const steps: Step[] = [
    { name: "Order Received", description: "We’ve received your order.", status: "complete" },
    { name: "Preparing", description: "Your items are being prepared.", status: "current" },
    { name: "Ready", description: "We’ll notify you when it’s ready for pickup.", status: "upcoming" },
    { name: "Collected", description: "Enjoy your order!", status: "upcoming" },
  ]

  const activeIdx = Math.max(
    0,
    steps.findIndex((s) => s.status === "current"),
  )

  const info =
    steps[activeIdx]?.status === "current"
      ? steps[activeIdx]?.description
      : steps.findLast?.((s) => s.status === "complete")?.description || "Order updates will appear here."

  return (
    <section className="grid gap-4">
      <div className="grid gap-1">
        <h2 className="text-xl font-semibold tracking-tight">Order #10e54ed6</h2>
        <p className="text-sm text-neutral-600">Placed on 10 Aug, 15:07</p>
      </div>

      <div className="rounded-xl border bg-white border-neutral-200 p-4">
        <div className="text-base font-semibold mb-2">Order Progress</div>

        <nav aria-label="Progress">
          <ol role="list" className="overflow-hidden">
            {steps.map((step, stepIdx) => {
              const isLast = stepIdx === steps.length - 1
              const isComplete = step.status === "complete"
              const isCurrent = step.status === "current"
              const connectorColor = isComplete ? "border-green-500" : "border-neutral-300"

              return (
                <li key={step.name} className={cn(!isLast ? "pb-4" : "", "relative")}>
                  {!isLast ? (
                    <div
                      aria-hidden="true"
                      className={cn("absolute top-4 left-4 -ml-px bottom-0 border-l border-dotted", connectorColor)}
                    />
                  ) : null}

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
                          isComplete ? "text-neutral-900" : isCurrent ? "text-green-600" : "text-neutral-500",
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

        <div className="mt-3 rounded-md border bg-white p-3 text-sm border-neutral-200">
          <div className="flex items-center gap-2">
            <BadgeCheck className="h-4 w-4 text-green-600" />
            <span>{info}</span>
          </div>
        </div>
      </div>

      <div className="rounded-xl border bg-white border-neutral-200">
        <div className="p-4 grid gap-3">
          <div className="flex items-center justify-between">
            <div className="font-semibold">Order Items</div>
            <div className="text-sm">R10.00</div>
          </div>
          <Separator />
          <Row label="2x Cappuccino" value="R10.00" />
          <Separator />
          <Row
            label={<span className="font-semibold">Total</span>}
            value={<span className="font-semibold text-yellow-600">R10.00</span>}
          />
        </div>
      </div>

      <div className="rounded-xl border bg-white border-neutral-200">
        <div className="p-4 grid gap-2">
          <div className="font-semibold">Order Details</div>
          <Row label="Order ID" value="10e54ed6–59bc–4c6d–ae89–d507e2e7ed37" />
          <Row label="Status" value={<span className="text-neutral-800">preparing</span>} />
        </div>
      </div>

      <div className="sticky bottom-[4.25rem] z-10">
        <Button
          className={cn(
            "w-full h-10 rounded-full font-medium transition-colors",
            UI.accentBg,
            "text-neutral-900 hover:bg-yellow-600 hover:text-white",
          )}
          onClick={onGoOrders}
        >
          Go to Orders
        </Button>
      </div>
    </section>
  )
}

function ProfileView() {
  return (
    <section className="grid gap-4">
      <div className={cn("rounded-xl border", UI.surface, UI.border)}>
        <div className="p-4 grid gap-4">
          <Field label="Email">
            <Input defaultValue="demo@example.com" className="h-10" />
          </Field>
          <Field label="Full name">
            <Input defaultValue="Demo User" className="h-10" />
          </Field>
          <Field label="Phone">
            <Input placeholder="e.g. 071 234 5678" className="h-10" />
          </Field>
          <Field label="Dietary preferences">
            <Input placeholder="e.g. Oat milk, no sugar" className="h-10" />
          </Field>
        </div>
        <CardFooter className="p-4 pt-0">
          <Button
            className={cn(
              "w-full h-10 rounded-full font-medium transition-colors",
              UI.accentBg,
              "text-neutral-900 hover:bg-yellow-600 hover:text-white",
            )}
          >
            <BadgeCheck className="h-4 w-4 mr-2" />
            Save Profile
          </Button>
        </CardFooter>
      </div>
    </section>
  )
}

/* UI helpers */

function TabButton({
  label,
  icon,
  active,
  onClick,
  badge,
}: {
  label: string
  icon: React.ReactNode
  active?: boolean
  onClick: () => void
  badge?: number
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "relative inline-flex flex-col items-center justify-center gap-1",
        "text-neutral-700 hover:text-neutral-900 transition-colors",
      )}
      aria-pressed={!!active}
      aria-current={active ? "page" : undefined}
    >
      <div className="relative">
        {icon}
        {badge ? (
          <span className="absolute -top-1.5 -right-1.5 h-4 min-w-4 px-1 rounded-full text-[10px] font-semibold text-white bg-neutral-900">
            {badge}
          </span>
        ) : null}
      </div>
      <span className="text-[11px]">{label}</span>
      <span
        className={cn(
          "absolute -bottom-1 left-1/2 -translate-x-1/2 h-0.5 w-4 rounded-full",
          active ? "bg-yellow-500" : "bg-transparent",
        )}
        aria-hidden="true"
      />
    </button>
  )
}

function IconButton({
  children,
  onClick,
  ariaLabel,
}: {
  children: React.ReactNode
  onClick?: () => void
  ariaLabel: string
}) {
  return (
    <button
      className={cn(
        "h-9 w-9 rounded-md border flex items-center justify-center",
        "bg-white hover:bg-neutral-50 transition-colors",
        "border-neutral-300 text-neutral-900",
      )}
      aria-label={ariaLabel}
      onClick={onClick}
    >
      {children}
    </button>
  )
}

function Row({ label, value }: { label: React.ReactNode; value: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between text-sm">
      <div className="text-neutral-700">{label}</div>
      <div className="text-neutral-900">{value}</div>
    </div>
  )
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="grid gap-2">
      <Label className="text-sm text-neutral-700">{label}</Label>
      {children}
    </div>
  )
}
