"use client"

import { useEffect, useMemo, useState } from "react"
import Image from "next/image"
import { cn } from "@/lib/utils"
import { UI } from "@/lib/theme"
import { createSupabaseBrowser } from "@/lib/supabase/browser"
import { getUserOrders, getMenuItems, getExtrasMap } from "@/lib/api"
import { getSetting } from "@/lib/api/settings"
import { createOrder, confirmPayment, deletePendingOrder } from "@/lib/api/orders"
import { getCurrentUser } from "@/lib/api/users"
import { isAppUnavailable, getWeeklyHours, getTaxRate } from "@/lib/api/settings"
import { useCartStore } from "@/store/cart"
import { useToast } from "@/components/ui/use-toast"
import { calculateSubtotal, calculateTax, isBusinessOpen, pickupTimeToISO } from "@/lib/helpers/business-rules"
import { formatCurrency } from "@/lib/helpers/formatting"
import { Skeleton } from "@/components/ui/skeleton"
import { Button } from "@/components/ui/button"
import {
  ChevronLeft,
  CircleUserRound,
  Clock3,
  Coffee,
  CreditCard,
  Home,
  Loader2,
  ReceiptText,
  ShoppingCart,
  QrCode,
  ExternalLink,
  CheckCircle2
} from "lucide-react"
import { useNativeDragToClose } from "@/hooks/useNativeDragToClose"
import { useSwipeGesture } from "@/hooks/useSwipeGesture"

// Customer components
import { MenuView } from "@/components/customer/menu-view"
import { ProductDetail } from "@/components/customer/product-detail"
import { CartView, EmptyCartView } from "@/components/customer/cart-view"
import { CheckoutView } from "@/components/customer/checkout-view"
import { OrdersView } from "@/components/customer/orders-view"
import { OrderDetailView } from "@/components/customer/order-detail-view"
import { ProfileView, type AccountSection } from "@/components/customer/profile-view"
import { TabButton } from "@/components/customer/tab-button"

import type { Product, Variant, ExtrasMap, Order, WeeklyHours, OrderType, PaymentMethod } from "@/types"

type View = "menu" | "product" | "cart" | "cart-empty" | "checkout" | "orders" | "order-detail" | "profile" | "yoco-payment" | "snapscan-payment" | "order-placed"

export default function OrderApp() {
  const { toast } = useToast()
  const cart = useCartStore((s) => s.items)
  const addToCart = useCartStore((s) => s.addItem)
  const adjustQty = useCartStore((s) => s.adjustQty)
  const removeItem = useCartStore((s) => s.removeItem)
  const clearCart = useCartStore((s) => s.clearCart)

  // View state
  const [view, setView] = useState<View>("menu")
  const [category, setCategory] = useState("All Items")
  const [activeProduct, setActiveProduct] = useState<Product | null>(null)
  const [count, setCount] = useState(1)
  const [selectedExtras, setSelectedExtras] = useState<string[]>([])
  const [selectedVariant, setSelectedVariant] = useState<Variant | null>(null)
  const [pickupTime, setPickupTime] = useState("ASAP")

  // Delivery & payment state
  const [orderType, setOrderType] = useState<OrderType>("collection")
  const [deliveryAddress, setDeliveryAddress] = useState("")
  const [deliveryNotes, setDeliveryNotes] = useState("")
  const [customerPhone, setCustomerPhone] = useState("")
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("none")
  const [collectionEnabled, setCollectionEnabled] = useState(true)
  const [deliveryEnabled, setDeliveryEnabled] = useState(false)
  const [deliveryFee, setDeliveryFee] = useState(0)
  const [yocoEnabled, setYocoEnabled] = useState(false)
  const [snapscanEnabled, setSnapscanEnabled] = useState(false)
  const [ordersTab, setOrdersTab] = useState<"current" | "past">("current")
  const [orders, setOrders] = useState<Order[]>([])
  const [ordersLoading, setOrdersLoading] = useState(false)
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  const [profileSection, setProfileSection] = useState<AccountSection>("menu")

  // Data state
  const [products, setProducts] = useState<Product[]>([])
  const [extrasMap, setExtrasMap] = useState<ExtrasMap>({})
  const [loading, setLoading] = useState(true)
  const [loadError, setLoadError] = useState(false)
  const [isStoreOpen, setIsStoreOpen] = useState(true)
  const [closingTime, setClosingTime] = useState<string | null>(null)
  const [isProductSliding, setIsProductSliding] = useState(false)
  const [isCheckoutSliding, setIsCheckoutSliding] = useState(false)
  const [taxRate, setTaxRate] = useState(0.15)

  // Payment states
  const [yocoPaymentOrderId, setYocoPaymentOrderId] = useState<string | null>(null)
  const [yocoPaymentOrderNumber, setYocoPaymentOrderNumber] = useState<number | null>(null)
  const [yocoPaymentAmount, setYocoPaymentAmount] = useState<number>(0)
  const [yocoPaymentUrl, setYocoPaymentUrl] = useState<string | null>(null)
  const [yocoPaymentLoading, setYocoPaymentLoading] = useState(false)
  const [yocoPaymentError, setYocoPaymentError] = useState<string | null>(null)

  // SnapScan states
  const [snapscanPaymentOrderId, setSnapscanPaymentOrderId] = useState<string | null>(null)
  const [snapscanPaymentOrderNumber, setSnapscanPaymentOrderNumber] = useState<number | null>(null)
  const [snapscanPaymentAmount, setSnapscanPaymentAmount] = useState<number>(0)
  const [snapscanPaymentLink, setSnapscanPaymentLink] = useState("")
  const [snapscanBaseLink, setSnapscanBaseLink] = useState("")

  // Navigation history
  const [viewHistory, setViewHistory] = useState<View[]>(["menu"])
  const [skipHistoryUpdate, setSkipHistoryUpdate] = useState(false)

  const handleSwipeRight = () => {
    if (viewHistory.length > 1) {
      const previousView = viewHistory[viewHistory.length - 2]
      setViewHistory((prev) => prev.slice(0, -1))
      setView(previousView)
    }
  }

  useEffect(() => {
    if (skipHistoryUpdate) { setSkipHistoryUpdate(false); return }
    setViewHistory((prev) => {
      if (prev[prev.length - 1] !== view) return [...prev, view]
      return prev
    })
  }, [view, skipHistoryUpdate])

  const swipeHandlers = useSwipeGesture({
    onSwipeRight: handleSwipeRight,
    threshold: 80,
    preventDefault: false,
  })

  const productDragToClose = useNativeDragToClose({
    onClose: () => setView("menu"),
    threshold: 100,
    enabled: view === "product",
  })

  // ── Data loading (via lib/api) ──
  const checkBusinessHours = async () => {
    try {
      const unavailable = await isAppUnavailable()
      if (unavailable) { setIsStoreOpen(false); setClosingTime(null); return }

      const weeklyData = await getWeeklyHours()
      const result = isBusinessOpen(weeklyData as WeeklyHours | null)
      setIsStoreOpen(result.isOpen)
      setClosingTime(result.closingTime)
    } catch {
      setIsStoreOpen(true)
      setClosingTime(null)
    }
  }

  const loadExtras = async () => {
    try {
      const map = await getExtrasMap()
      setExtrasMap(map)
    } catch {}
  }

  const loadOrders = async () => {
    setOrdersLoading(true)
    try {
      const data = await getUserOrders()
      setOrders(data)
    } catch {
      setOrders([])
    } finally {
      setOrdersLoading(false)
    }
  }

  useEffect(() => {
    async function loadProducts() {
      try {
        const items = await getMenuItems()
        setProducts(items)
        setLoadError(items.length === 0)
      } catch {
        setProducts([])
        setLoadError(true)
      } finally {
        setLoading(false)
      }
    }
    async function loadTaxRate() {
      try {
        const rate = await getTaxRate()
        setTaxRate(rate)
      } catch { /* keep default 0.15 */ }
    }
    async function loadFulfilmentAndPaymentSettings() {
      try {
        const [colEnabled, delEnabled, delFee, yoco, snapscan, snapscanUrlReq] = await Promise.all([
          getSetting("collection_enabled"),
          getSetting("delivery_enabled"),
          getSetting("delivery_fee"),
          getSetting("yoco_enabled"),
          getSetting("snapscan_enabled"),
          getSetting("snapscan_link"),
        ])
        let isColEnabled = colEnabled === true || colEnabled === "true" || colEnabled === undefined
        let isDelEnabled = delEnabled === true || delEnabled === "true"

        // Enforce mutually exclusive rule. If both somehow are true, fallback to collection.
        if (isColEnabled && isDelEnabled) {
          isDelEnabled = false
        }

        setCollectionEnabled(isColEnabled)
        setDeliveryEnabled(isDelEnabled)
        setDeliveryFee(parseFloat(String(delFee ?? "0")))
        setYocoEnabled(yoco === true || yoco === "true")
        setSnapscanEnabled(snapscan === true || snapscan === "true")
        setSnapscanBaseLink(String(snapscanUrlReq || ""))
        // Auto-set orderType based on enabled modes
        if (!isColEnabled && isDelEnabled) setOrderType("delivery")
        else if (isColEnabled && !isDelEnabled) setOrderType("collection")
        // If both enabled, default stays "collection"
      } catch { /* keep defaults */ }
    }
    async function loadUserProfile() {
      try {
        const user = await getCurrentUser()
        if (user) {
          if (user.delivery_address) setDeliveryAddress(user.delivery_address)
          if (user.delivery_notes) setDeliveryNotes(user.delivery_notes)
          if (user.phone) setCustomerPhone(user.phone)
        }
      } catch { /* no profile, fields stay empty */ }
    }
    Promise.all([loadProducts(), loadExtras(), loadTaxRate(), loadFulfilmentAndPaymentSettings(), loadUserProfile()])
  }, [])

  useEffect(() => {
    if (products.length > 0 && !loading) setCategory("All Items")
  }, [products.length, loading])

  useEffect(() => {
    if (products.length > 0 && category !== "All Items" && !products.some((p) => p.category === category))
      setCategory("All Items")
  }, [products, category])

  useEffect(() => { checkBusinessHours(); const id = setInterval(checkBusinessHours, 60000); return () => clearInterval(id) }, [])

  useEffect(() => { if (isProductSliding && view === "product") { const t = setTimeout(() => setIsProductSliding(false), 300); return () => clearTimeout(t) } }, [isProductSliding, view])
  useEffect(() => { if (isCheckoutSliding && view === "checkout") { const t = setTimeout(() => setIsCheckoutSliding(false), 300); return () => clearTimeout(t) } }, [isCheckoutSliding, view])

  // Realtime subscription for customer's orders
  useEffect(() => {
    const supabase = createSupabaseBrowser()
    let userId: string | null = null
    
    // Get current user ID to filter relevant events
    supabase.auth.getSession().then(({ data: { session } }) => {
      userId = session?.user?.id || null
    })

    const channel = supabase
      .channel("customer-orders-sync")
      .on("postgres_changes", { event: "*", schema: "public", table: "orders" }, (payload: any) => {
        const record = payload.new || payload.old
        // Only reload if the changed order belongs to this user, or if we can't determine owner
        if (!userId || !record || record.user_id === userId) {
          loadOrders()
        }
      })
      .subscribe()
    return () => { supabase.removeChannel(channel) }
  }, [])

  // ── Derived state ──
  const filtered = useMemo(() => {
    const result = category === "All Items" ? products : products.filter((p) => p.category === category)
    return result.sort((a, b) => {
      if (a.category === b.category) {
        const ap = a.position ?? 0
        const bp = b.position ?? 0
        if (ap !== bp) return ap - bp
        return a.name.localeCompare(b.name)
      }
      return a.category.localeCompare(b.category)
    })
  }, [category, products])

  const subtotal = calculateSubtotal(cart, extrasMap)
  const tax = calculateTax(subtotal, taxRate)

  // ── Actions ──
  function openProduct(p: Product) {
    setActiveProduct(p)
    setCount(1)
    setSelectedExtras([])
    setSelectedVariant(p.variants && p.variants.length > 0 ? p.variants[0] : null)
    setIsProductSliding(true)
    setView("product")
  }

  function handleAddToCart() {
    if (!activeProduct) return
    addToCart(activeProduct, count, selectedExtras, selectedVariant)
    setView("cart")
  }

  function toggleExtra(id: string) {
    setSelectedExtras((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]))
  }

  function openCheckout() { setIsCheckoutSliding(true); setView("checkout") }

  // Calculated total including delivery fee
  const effectiveDeliveryFee = orderType === "delivery" ? deliveryFee : 0
  const total = +(subtotal + tax + effectiveDeliveryFee).toFixed(2)

  async function placeOrder() {
    if (cart.length === 0) {
      toast({ title: "Cart is Empty", description: "Please add some items first.", variant: "destructive" })
      return
    }

    // Auth gate — must be signed in to place an order
    const supabase = createSupabaseBrowser()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      toast({ title: "Sign In Required", description: "Please sign in to place your order.", variant: "destructive" })
      window.location.href = "/auth/login"
      return
    }

    try {
      const result = await createOrder({
        items: cart,
        pickupTime: pickupTimeToISO(pickupTime),
        extrasMap,
        orderType,
        deliveryAddress: orderType === "delivery" ? deliveryAddress : undefined,
        deliveryNotes: orderType === "delivery" ? deliveryNotes : undefined,
        customerPhone: orderType === "delivery" ? customerPhone : undefined,
        paymentMethod,
      })

      // If payment method is Yoco, generate payment link
      if (result.payment_method === "yoco_link") {
        setYocoPaymentOrderId(result.id)
        setYocoPaymentOrderNumber(result.order_number)
        setYocoPaymentAmount(result.total_amount)
        setYocoPaymentLoading(true)
        setYocoPaymentError(null)
        setView("yoco-payment")

        try {
          const res = await fetch("/api/payments/create-link", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ orderId: result.id }),
          })
          const data = await res.json()
          if (!res.ok) {
            setYocoPaymentError(data.error || "Failed to create payment link")
          } else {
            clearCart()
            setOrderType("collection")
            setDeliveryAddress("")
            setDeliveryNotes("")
            setCustomerPhone("")
            setPaymentMethod("none")

            setYocoPaymentUrl(data.paymentUrl)
            setYocoPaymentAmount(data.amount)
          }
        } catch {
          setYocoPaymentError("Failed to connect to payment service")
        } finally {
          setYocoPaymentLoading(false)
        }
        return
      }

      // If payment method is SnapScan, generate dynamic link and show payment screen
      if (result.payment_method === "snapscan") {
        if (!snapscanBaseLink) {
          toast({ title: "Payment Configuration Error", description: "SnapScan is missing its link configuration. Please choose a different payment method.", variant: "destructive" })
          return
        }

        const amount_in_cents = Math.round(result.total_amount * 100)
        const separator = snapscanBaseLink.includes("?") ? "&" : "?"
        const completeSnapscanLink = `${snapscanBaseLink}${separator}amount=${amount_in_cents}&id=${result.order_number}&strict=true`

        // Save generated link and reference to the order table directly
        const supabase = createSupabaseBrowser()
        await supabase
          .from("orders")
          .update({
            payment_link: completeSnapscanLink,
            payment_reference: result.order_number.toString(),
          })
          .eq("id", result.id)

        setSnapscanPaymentOrderId(result.id)
        setSnapscanPaymentOrderNumber(result.order_number)
        setSnapscanPaymentAmount(result.total_amount)
        setSnapscanPaymentLink(completeSnapscanLink)
        
        setView("snapscan-payment")
        return
      }

      clearCart()
      setOrderType("collection")
      setDeliveryAddress("")
      setDeliveryNotes("")
      setCustomerPhone("")
      setPaymentMethod("none")

      toast({ title: "Order Placed Successfully! 🎉", description: `Order #${result.order_number} placed!`, duration: 5000 })
      await loadOrders()
      setViewHistory(["menu", "orders"])
      setSelectedOrder({ id: result.id, order_number: result.order_number } as unknown as Order)
      setSkipHistoryUpdate(true)
      setView("order-detail")
    } catch (error) {
      toast({
        title: "Failed to Place Order",
        description: error instanceof Error ? error.message : "Unknown error",
        variant: "destructive",
      })
    }
  }

  // ── Side effects ──
  useEffect(() => { if (view === "orders" || view === "order-detail") loadOrders() }, [view])
  const handleOrdersNavigation = () => { loadOrders(); setView("orders") }
  useEffect(() => { if (view === "cart" && cart.length === 0) setView("cart-empty") }, [cart.length, view])

  const header = useMemo(() => {
    switch (view) {
      case "menu": return { title: "Menu", showBack: false }
      case "product": return { title: "", showBack: false }
      case "cart": return { title: "Your Cart", showBack: false }
      case "cart-empty": return { title: "Cart", showBack: false }
      case "checkout": return { title: "", showBack: false }
      case "yoco-payment": return { title: "", showBack: false }
      case "orders": return { title: "My Orders", showBack: false }
      case "order-detail": return { title: "", showBack: true, backTo: "orders" as View }
      case "profile": return { title: "Account", showBack: false }
      case "order-placed": return { title: "", showBack: false }
      default: return { title: "Order App", showBack: false }
    }
  }, [view])

  // ── Render ──
  if (loading) {
    return (
      <main className="w-full min-h-[100dvh] flex items-center justify-center bg-brand relative overflow-hidden"
        style={{ paddingTop: "env(safe-area-inset-top)", paddingBottom: "env(safe-area-inset-bottom)" }}>
        {/* Scattered food emoji background */}
        <div className="absolute inset-0 pointer-events-none select-none" aria-hidden="true">
          {[
            { emoji: "🍕", top: "4%",  left: "8%",   size: "2.2rem", rotate: "-15deg" },
            { emoji: "☕", top: "8%",  right: "12%",  size: "1.8rem", rotate: "20deg" },
            { emoji: "🍔", top: "18%", left: "75%",   size: "2.5rem", rotate: "-8deg" },
            { emoji: "🧁", top: "15%", left: "25%",   size: "1.6rem", rotate: "30deg" },
            { emoji: "🍩", top: "28%", right: "8%",   size: "2rem",   rotate: "-25deg" },
            { emoji: "🍟", top: "35%", left: "5%",    size: "1.7rem", rotate: "12deg" },
            { emoji: "🥤", top: "3%",  left: "50%",   size: "1.9rem", rotate: "-20deg" },
            { emoji: "🍰", top: "70%", left: "10%",   size: "2.3rem", rotate: "18deg" },
            { emoji: "🌮", top: "75%", right: "15%",  size: "2rem",   rotate: "-12deg" },
            { emoji: "🥐", top: "60%", left: "80%",   size: "1.8rem", rotate: "25deg" },
            { emoji: "🍦", top: "85%", left: "30%",   size: "2.1rem", rotate: "-30deg" },
            { emoji: "🥗", top: "90%", right: "10%",  size: "1.7rem", rotate: "10deg" },
            { emoji: "🍜", top: "55%", left: "3%",    size: "1.9rem", rotate: "-5deg" },
            { emoji: "🧃", top: "45%", right: "5%",   size: "1.6rem", rotate: "22deg" },
            { emoji: "🍪", top: "50%", left: "88%",   size: "1.5rem", rotate: "-18deg" },
            { emoji: "🥞", top: "92%", left: "70%",   size: "2rem",   rotate: "8deg" },
            { emoji: "🍿", top: "40%", left: "18%",   size: "1.8rem", rotate: "-22deg" },
            { emoji: "🥨", top: "65%", left: "55%",   size: "1.6rem", rotate: "15deg" },
          ].map((item, i) => (
            <span
              key={i}
              className="absolute opacity-55"
              style={{
                top: item.top,
                left: item.left,
                right: (item as any).right,
                fontSize: item.size,
                transform: `rotate(${item.rotate})`,
              }}
            >
              {item.emoji}
            </span>
          ))}
        </div>
        {/* Center content */}
        <div className="relative z-10 flex flex-col items-center gap-6">
          <div className="flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-white/80 animate-bounce" style={{ animationDelay: "0ms" }} />
            <div className="h-2 w-2 rounded-full bg-white/80 animate-bounce" style={{ animationDelay: "150ms" }} />
            <div className="h-2 w-2 rounded-full bg-white/80 animate-bounce" style={{ animationDelay: "300ms" }} />
          </div>
        </div>
      </main>
    )
  }

  return (
    <main className={cn("w-full min-h-[100dvh] flex items-start justify-center", UI.surfaceAlt, UI.text)}
      style={{ paddingTop: "env(safe-area-inset-top)", paddingBottom: "env(safe-area-inset-bottom)" }}>
      <div className="w-full max-w-md mx-auto relative pt-14">
        {/* Header */}
        <header className={cn("fixed top-0 left-0 right-0 z-20", UI.surface, "border-b", UI.border)}>
          <div className="flex items-center justify-between px-4 h-14">
            <div className="w-24 flex items-center">
              {view === "profile" && profileSection !== "menu" ? (
                <button onClick={() => setProfileSection("menu")} className="inline-flex items-center gap-0 text-sm text-black transition-colors py-1 rounded-full p-2 -ml-2 active:bg-neutral-100">
                  <ChevronLeft className="h-5 w-5 -ml-1" /><span className="text-sm font-medium">Account</span>
                </button>
              ) : header.showBack && (
                <button onClick={() => setView((header as any).backTo)} className="inline-flex items-center gap-0.5 text-sm text-neutral-700 hover:text-neutral-900 transition-colors py-1">
                  <ChevronLeft className="h-4 w-4" /><span className="text-xs">Back</span>
                </button>
              )}
            </div>
            <div className="flex-1 flex items-center justify-center">
              <Image src="/O_App_logo_transparent.png" alt="O App Logo" width={40} height={40} className="object-contain" />
            </div>
            <div className="w-24 flex items-center justify-end">
              <button onClick={() => setView(cart.length === 0 ? "cart-empty" : "cart")} className="relative p-2 hover:bg-neutral-100 rounded-lg transition-all duration-200 active:scale-95">
                <ShoppingCart className="h-5 w-5 text-neutral-700" />
                {cart.length > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 h-5 min-w-5 px-1 rounded-full text-[10px] font-semibold text-white bg-brand flex items-center justify-center shadow-sm">
                    {cart.length}
                  </span>
                )}
              </button>
            </div>
          </div>
        </header>

        {/* Closed Banner */}
        {!isStoreOpen && ["menu", "product", "cart", "cart-empty", "checkout"].includes(view) && (
          <div className="mx-4 mt-4 rounded-xl border bg-red-50 border-red-200 p-4">
            <div className="flex items-center gap-3">
              <div className="flex-shrink-0">
                <div className="h-10 w-10 rounded-full bg-red-100 flex items-center justify-center">
                  <Clock3 className="h-5 w-5 text-brand" />
                </div>
              </div>
              <div className="flex-1">
                <h3 className="text-sm font-semibold text-red-900">We&apos;re Currently Closed</h3>
                <p className="text-xs text-red-700 mt-0.5">Sorry, please check back tomorrow</p>
              </div>
            </div>
          </div>
        )}

        {/* Content */}
        <div className="px-4 py-4 pb-28 grid gap-4" {...(view === "order-detail" ? swipeHandlers : {})}>
          {view === "menu" && (
            <MenuView
              products={products}
              filteredProducts={filtered}
              category={category}
              onCategoryChange={setCategory}
              onOpenProduct={openProduct}
            />
          )}
          {view === "cart" && cart.length > 0 && (
            <CartView
              items={cart}
              onAdjustQty={adjustQty}
              onRemove={removeItem}
              onClear={() => { clearCart(); setView("cart-empty") }}
              subtotal={subtotal}
              tax={tax}
              total={total}
              onCheckout={openCheckout}
              onAddMoreItems={() => setView("menu")}
              isStoreOpen={isStoreOpen}
            />
          )}
          {view === "cart-empty" && <EmptyCartView onBrowseMenu={() => setView("menu")} />}
          {view === "orders" && (
            <OrdersView
              tab={ordersTab}
              onTabChange={setOrdersTab}
              onOpenDetail={(order) => { setSelectedOrder(order); setView("order-detail") }}
              orders={orders}
              loading={ordersLoading}
              onRefresh={loadOrders}
            />
          )}
          {view === "order-detail" && <OrderDetailView order={selectedOrder} onGoOrders={handleOrdersNavigation} />}
          {view === "profile" && <ProfileView section={profileSection} setSection={setProfileSection} />}

          {/* Yoco Payment Screen */}
          {view === "yoco-payment" && (
            <div className="fixed inset-0 z-[100] flex justify-center bg-white/80 backdrop-blur-md animate-in slide-in-from-bottom-8 duration-300">
              <div className="w-full max-w-md bg-white shadow-2xl h-full flex flex-col items-center justify-center px-6 text-center overflow-y-auto">
                {/* Header */}
                <div className="mb-8 mt-10">
                  <div className="h-16 w-16 rounded-2xl bg-brand/10 flex items-center justify-center mx-auto mb-4">
                    <CreditCard className="h-8 w-8 text-brand" />
                  </div>
                  <h2 className="text-xl font-bold text-neutral-900">Complete Payment</h2>
                  {yocoPaymentOrderNumber && (
                    <p className="text-sm text-neutral-500 mt-1">Order #{yocoPaymentOrderNumber}</p>
                  )}
                </div>

                {/* Amount */}
                <div className="rounded-xl border border-neutral-200 bg-neutral-50 p-6 mb-6 w-full">
                  <p className="text-xs uppercase tracking-wider text-neutral-500 mb-1">Amount Due</p>
                  <p className="text-3xl font-bold text-neutral-900">{formatCurrency(yocoPaymentAmount)}</p>
                  <p className="text-xs text-neutral-400 mt-2">Payment via Yoco</p>
                </div>

                {/* Loading state */}
                {yocoPaymentLoading && (
                  <div className="flex flex-col items-center gap-3 py-6">
                    <Loader2 className="h-6 w-6 animate-spin text-brand" />
                    <p className="text-sm text-neutral-500">Creating payment link...</p>
                  </div>
                )}

                {/* Error state */}
                {yocoPaymentError && !yocoPaymentLoading && (
                  <div className="mb-4 w-full">
                    <div className="rounded-lg border border-red-200 bg-red-50 p-4 mb-4">
                      <p className="text-sm text-red-700">{yocoPaymentError}</p>
                    </div>
                    <Button
                      className="w-full h-11 shadow-sm transition-all active:scale-[0.98]"
                      onClick={async () => {
                        if (!yocoPaymentOrderId) return
                        setYocoPaymentLoading(true)
                        setYocoPaymentError(null)
                        try {
                          const res = await fetch("/api/payments/create-link", {
                            method: "POST",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({ orderId: yocoPaymentOrderId }),
                          })
                          const data = await res.json()
                          if (!res.ok) {
                            setYocoPaymentError(data.error || "Failed to create payment link")
                          } else {
                            clearCart()
                            setOrderType("collection")
                            setDeliveryAddress("")
                            setDeliveryNotes("")
                            setCustomerPhone("")
                            setPaymentMethod("none")

                            setYocoPaymentUrl(data.paymentUrl)
                            setYocoPaymentAmount(data.amount)
                          }
                        } catch {
                          setYocoPaymentError("Failed to connect to payment service")
                        } finally {
                          setYocoPaymentLoading(false)
                        }
                      }}
                    >
                      Retry
                    </Button>
                  </div>
                )}

                {/* Success state — pay button */}
                {yocoPaymentUrl && !yocoPaymentLoading && !yocoPaymentError && (
                  <div className="grid w-full gap-3 mt-4">
                    <Button 
                      className="w-full h-12 text-base font-bold transition-all duration-300 shadow-md hover:shadow-lg active:scale-[0.98]"
                      onClick={() => { window.open(yocoPaymentUrl, "_blank") }}
                    >
                      <CreditCard className="h-4 w-4 mr-2" />
                      Pay with Yoco
                    </Button>
                    
                    <div className="pt-6 border-t border-neutral-100 mt-2 w-full">
                       <p className="text-xs text-neutral-500 mb-4">Once you have completed the payment on Yoco, click below.</p>
                       <Button 
                         variant="outline" 
                         className="w-full h-12 transition-all duration-200 active:scale-[0.98] hover:bg-neutral-50"
                         onClick={async () => {
                           if (yocoPaymentOrderId) {
                              await confirmPayment(yocoPaymentOrderId, yocoPaymentOrderNumber?.toString())
                           }
                           // Clear cart strictly on success
                           clearCart()
                           setOrderType("collection")
                           setDeliveryAddress("")
                           setDeliveryNotes("")
                           setCustomerPhone("")
                           setPaymentMethod("none")
                           setView("order-placed")
                         }}
                       >
                         I have paid successfully
                       </Button>
                    </div>
                  </div>
                )}

                <button 
                  onClick={async () => {
                    if (yocoPaymentOrderId) {
                      await deletePendingOrder(yocoPaymentOrderId)
                      setYocoPaymentOrderId(null)
                      setYocoPaymentOrderNumber(null)
                    }
                    setView("checkout")
                  }} 
                  className="mt-8 text-sm font-medium text-neutral-500 hover:text-neutral-900 transition-colors mb-10"
                >
                  Cancel payment
                </button>
              </div>
            </div>
          )}

          {/* SnapScan Payment Screen */}
          {view === "snapscan-payment" && (
            <div className="fixed inset-0 z-[100] flex justify-center bg-white/80 backdrop-blur-md animate-in slide-in-from-bottom-8 duration-300">
              <div className="w-full max-w-md bg-white shadow-2xl h-full flex flex-col items-center justify-center px-6 text-center overflow-y-auto">
                {/* Header */}
                <div className="mb-8 mt-10">
                  <div className="h-16 w-16 rounded-2xl bg-[#00A1DF]/10 flex items-center justify-center mx-auto mb-4">
                    <QrCode className="h-8 w-8 text-[#00A1DF]" />
                  </div>
                  <h2 className="text-xl font-bold text-neutral-900">SnapScan Payment</h2>
                  {snapscanPaymentOrderNumber && (
                    <p className="text-sm text-neutral-500 mt-1">Order #{snapscanPaymentOrderNumber}</p>
                  )}
                </div>

                {/* Amount */}
                <div className="rounded-xl border border-neutral-200 bg-neutral-50 p-6 mb-8 w-full">
                  <p className="text-xs uppercase tracking-wider text-neutral-500 mb-1">Amount Due</p>
                  <p className="text-3xl font-bold text-neutral-900">{formatCurrency(snapscanPaymentAmount)}</p>
                  <p className="text-xs text-neutral-400 mt-2">Payment via SnapScan</p>
                </div>

                <div className="grid w-full gap-4">
                  <Button 
                    className="w-full h-12 text-base font-bold transition-all duration-300 shadow-md hover:shadow-lg active:scale-[0.98]"
                    style={{ backgroundColor: '#00A1DF', color: 'white' }}
                    onClick={() => { window.open(snapscanPaymentLink, "_blank") }}
                  >
                    Open SnapScan App
                    <ExternalLink className="h-4 w-4 ml-2" />
                  </Button>
                  
                  <div className="pt-6 border-t border-neutral-100 mt-2 w-full">
                      <p className="text-xs text-neutral-500 mb-4">Once you have scanned and paid, click below.</p>
                      <Button 
                        variant="outline" 
                        className="w-full h-12 transition-all duration-200 active:scale-[0.98] hover:bg-neutral-50"
                        onClick={async () => {
                          try {
                            await confirmPayment(snapscanPaymentOrderId as string, snapscanPaymentOrderNumber?.toString())
                            // Clear cart strictly on success
                            clearCart()
                            setOrderType("collection")
                            setDeliveryAddress("")
                            setDeliveryNotes("")
                            setCustomerPhone("")
                            setPaymentMethod("none")
                            setView("order-placed")
                          } catch (err) {
                            toast({ title: "Failed to confirm payment", variant: "destructive", description: (err as Error).message })
                          }
                        }}
                      >
                        I have paid successfully
                      </Button>
                  </div>
                </div>

                <button 
                  onClick={async () => {
                    if (snapscanPaymentOrderId) {
                      await deletePendingOrder(snapscanPaymentOrderId)
                      setSnapscanPaymentOrderId(null)
                      setSnapscanPaymentOrderNumber(null)
                    }
                    setView("checkout")
                  }} 
                  className="mt-8 text-sm font-medium text-neutral-500 hover:text-neutral-900 transition-colors mb-10"
                >
                  Cancel payment
                </button>
              </div>
            </div>
          )}

          {/* Order Placed Screen */}
          {view === "order-placed" && (
            <div className="fixed inset-0 z-[100] flex justify-center bg-brand/5 backdrop-blur-md animate-in zoom-in-95 duration-500">
              <div className="w-full max-w-md bg-white shadow-2xl h-full flex flex-col items-center justify-center px-6 text-center relative overflow-hidden">
                {/* Flying money emojis */}
                <div className="absolute inset-0 pointer-events-none overflow-hidden select-none" aria-hidden="true">
                   <div className="animate-bounce absolute top-20 left-10 text-4xl leading-none">💸</div>
                   <div className="animate-bounce absolute top-40 right-12 text-5xl leading-none" style={{ animationDelay: '200ms' }}>💰</div>
                   <div className="animate-bounce absolute top-10 right-20 text-3xl leading-none" style={{ animationDelay: '100ms' }}>💵</div>
                   <div className="animate-bounce absolute bottom-40 left-20 text-5xl leading-none" style={{ animationDelay: '300ms' }}>💸</div>
                   <div className="animate-bounce absolute bottom-20 right-10 text-4xl leading-none" style={{ animationDelay: '150ms' }}>🪙</div>
                   <div className="animate-bounce absolute top-1/2 left-4 text-3xl leading-none" style={{ animationDelay: '400ms' }}>🤑</div>
                </div>

                <div className="relative z-10 p-8 rounded-3xl bg-white shadow-xl shadow-brand/10 border border-brand/20">
                  <div className="h-20 w-20 rounded-full bg-brand/10 flex items-center justify-center mx-auto mb-6">
                    <CheckCircle2 className="h-10 w-10 text-brand" />
                  </div>
                  <h2 className="text-3xl font-extrabold text-neutral-900 mb-2">Order Placed!</h2>
                  <p className="text-neutral-500 mb-8 max-w-[250px] mx-auto text-sm">We've received your order and payment confirmation. Thank you!</p>
                  
                  <Button 
                    className="w-full h-12 text-base font-bold transition-all duration-300 shadow-md hover:shadow-lg active:scale-[0.98]"
                    onClick={() => {
                      const orderId = yocoPaymentOrderId || snapscanPaymentOrderId;
                      const orderNumber = yocoPaymentOrderNumber || snapscanPaymentOrderNumber;
                      if (orderId) {
                        setSelectedOrder({ id: orderId, order_number: orderNumber } as unknown as Order)
                        setViewHistory(["menu", "orders"])
                        setSkipHistoryUpdate(true)
                        setView("order-detail")
                      } else {
                        handleOrdersNavigation()
                      }
                    }}
                  >
                    My order
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Product Detail Slide-up Panel */}
        {view === "product" && activeProduct && (
          <>
            <div className={cn("fixed inset-0 bg-black/20 z-30", isProductSliding && "animate-in fade-in duration-300")} onClick={() => setView("menu")} />
            <div
              className={cn("fixed left-1/2 w-full max-w-md z-40 bg-white rounded-t-2xl shadow-2xl overflow-y-auto", isProductSliding && "slide-up-enter")}
              style={{ top: "56px", bottom: "0px", transform: `translateX(-50%) translateY(${Math.min(productDragToClose.dragDistance, 100)}px)`, transition: productDragToClose.dragDistance === 0 ? "transform 0.3s ease-out" : "none" }}
            >
              <div className="pb-28">
                <div ref={productDragToClose.elementRef}>
                  <div className="py-4 px-4 flex items-center justify-between">
                    <button onClick={() => setView("menu")} className="inline-flex items-center gap-1 text-sm text-neutral-700 hover:text-neutral-900 transition-all duration-200 active:scale-95 py-1">
                      <ChevronLeft className="h-4 w-4" /><span className="text-xs">Back</span>
                    </button>
                    <div className={cn("w-12 h-1 rounded-full transition-all duration-200", productDragToClose.dragDistance > 50 ? "bg-neutral-600 w-16" : "bg-neutral-300")} />
                    <div className="w-12" />
                  </div>
                  <div className="px-4 pb-0">
                    <div className={cn("rounded-xl border p-4", UI.surface, UI.border)}>
                      <div className="h-44 w-full rounded-lg overflow-hidden bg-neutral-100 border border-neutral-200 flex items-center justify-center">
                        {activeProduct.image && !activeProduct.image.includes("placeholder") ? (
                          <Image src={activeProduct.image} alt={activeProduct.name} width={672} height={352} className="w-full h-full object-cover" />
                        ) : (
                          <div className="flex flex-col items-center gap-2 text-neutral-400">
                            <Coffee className="h-12 w-12 text-amber-300/50" />
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="grid place-items-center gap-1 mt-4">
                      <h2 className="text-xl font-semibold">{activeProduct.name}</h2>
                      <p className={cn("text-sm", UI.muted)}>{activeProduct.description}</p>
                      <div className="text-2xl font-bold text-brand-dark">{formatCurrency(selectedVariant?.price ?? activeProduct.price)}</div>
                    </div>
                  </div>
                </div>
                <div className="px-4">
                  <ProductDetail
                    product={activeProduct}
                    qty={count}
                    onQtyChange={setCount}
                    selectedExtras={selectedExtras}
                    onToggleExtra={toggleExtra}
                    onAdd={handleAddToCart}
                    extrasMap={extrasMap}
                    selectedVariant={selectedVariant}
                    onVariantChange={setSelectedVariant}
                  />
                </div>
              </div>
            </div>
          </>
        )}

        {/* Checkout Slide-up Modal */}
        {view === "checkout" && (
          <>
            <div className={cn("fixed inset-0 bg-black/40 z-30", isCheckoutSliding && "animate-in fade-in duration-300")} onClick={() => setView("cart")} />
            <div className={cn("fixed left-1/2 w-full max-w-md z-40 bg-white shadow-2xl flex flex-col", isCheckoutSliding && "slide-up-enter")}
              style={{ bottom: "0px", height: "100vh", transform: "translateX(-50%)" }}>
              <div className="flex items-center justify-between p-4 border-b border-neutral-200 flex-shrink-0">
                <button onClick={() => setView("cart")} className="inline-flex items-center gap-1 text-sm text-neutral-700 hover:text-neutral-900 transition-colors py-1">
                  <ChevronLeft className="h-4 w-4" /><span className="text-xs">Back</span>
                </button>
                <h2 className="text-lg font-semibold">Checkout</h2>
                <div className="w-12" />
              </div>
              <div className="flex-1 overflow-y-auto px-4 pt-4 pb-0">
                <CheckoutView
                  grandTotal={total}
                  onPlaceOrder={placeOrder}
                  subtotal={subtotal}
                  tax={tax}
                  taxRate={taxRate}
                  pickupTime={pickupTime}
                  onPickupTimeChange={setPickupTime}
                  items={cart}
                  extrasMap={extrasMap}
                  orderType={orderType}
                  onOrderTypeChange={setOrderType}
                  deliveryAddress={deliveryAddress}
                  onDeliveryAddressChange={setDeliveryAddress}
                  deliveryNotes={deliveryNotes}
                  onDeliveryNotesChange={setDeliveryNotes}
                  customerPhone={customerPhone}
                  onCustomerPhoneChange={setCustomerPhone}
                  deliveryFee={effectiveDeliveryFee}
                  collectionEnabled={collectionEnabled}
                  deliveryEnabled={deliveryEnabled}
                  paymentMethod={paymentMethod}
                  onPaymentMethodChange={setPaymentMethod}
                  yocoEnabled={yocoEnabled}
                  snapscanEnabled={snapscanEnabled}
                />
              </div>
            </div>
          </>
        )}

        {/* Bottom Navigation */}
        <nav className={cn("fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md", "bg-neutral-900 border-t border-neutral-800", "backdrop-blur-lg shadow-lg")}
          style={{ paddingBottom: "max(12px, env(safe-area-inset-bottom))" }}>
          <div className="grid grid-cols-3 items-center justify-between px-4 pt-2 text-xs">
            <TabButton label="Menu" icon={<Home className="h-5 w-5" />} active={view === "menu" || view === "product"} onClick={() => setView("menu")} />
            <TabButton label="Orders" icon={<ReceiptText className="h-5 w-5" />} active={view === "orders" || view === "order-detail"} onClick={handleOrdersNavigation} />
            <TabButton label="Account" icon={<CircleUserRound className="h-5 w-5" />} active={view === "profile"} onClick={() => setView("profile")} />
          </div>
        </nav>
      </div>
    </main>
  )
}
