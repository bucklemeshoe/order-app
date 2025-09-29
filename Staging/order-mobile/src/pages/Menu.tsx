import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useSupabase } from '../lib/useSupabase'
import { useCartStore } from '../store/cart'
import { useUnavailableStore } from '../store/unavailable'
import { IonContent, IonRefresher, IonRefresherContent, IonSpinner, IonToast, IonButton, IonChip } from '@ionic/react'
// Icons not needed for simplified menu
import ProductDetailModal, { type ExtraOption } from '../components/ProductDetailModal'
import { formatCurrency } from '../utils/format'

function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(' ')
}

interface Variant {
  id: string
  name: string
  price: number
}

interface MenuItem {
  id: string
  name: string
  description?: string
  price: number // Base price for backward compatibility
  category: string
  image_url?: string
  is_active: boolean
  extras?: string[] // Available extras for this item
  position?: number // Position within category for ordering
  variants?: Variant[] // Size/price combinations
  platforms?: string[] // Platforms where this item should be displayed
}

const categoryNames: Record<string, string> = {
  // Admin categories - exact match
  'Coffee': 'Coffees',
  'Lattes': 'Lattes',
  'Hot or Cold': 'Hot or Cold',
  'Milkshakes & Smoothies': 'Milkshakes & Smoothies',
  'Combos': 'Combos',
  'Extras': 'Extras',
  'Drinks': 'Drinks',
  'Specialty': 'Specialty',
  'Pastries': 'Pastries',
  'Food': 'Food',
  'Cold Drinks': 'Cold Drinks',
  // Legacy fallback for any old data
  coffee: 'Coffees',
  pastry: 'Pastries',
  food: 'Food',
  tea: 'Teas',
  cold: 'Cold Drinks',
  default: 'Items'
}

interface MenuPageProps {
  onShowUnavailableModal?: () => void
}

export default function MenuPage({ onShowUnavailableModal }: MenuPageProps) {
  const navigate = useNavigate()
  const supabase = useSupabase()
  const add = useCartStore((s) => s.add)
  const { isUnavailable } = useUnavailableStore()
  const [items, setItems] = useState<MenuItem[]>([])
  const [extrasMap, setExtrasMap] = useState<Record<string, ExtraOption>>({})
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [addingToCart, setAddingToCart] = useState<string | null>(null)
  const [showToast, setShowToast] = useState(false)
  const [toastMessage, setToastMessage] = useState('')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState<MenuItem | null>(null)

  const loadExtras = async () => {
    try {
      const { data, error } = await supabase
        .from('menu_items')
        .select('name, price')
        .eq('category', 'Extras')
        .eq('is_active', true)

      if (error) throw error
      
      const extrasMap: Record<string, ExtraOption> = {}
      data?.forEach((extra: any) => {
        extrasMap[extra.name] = {
          id: extra.name.toLowerCase().replace(/\s+/g, '_'),
          name: extra.name,
          price: extra.price
        }
      })
      setExtrasMap(extrasMap)
    } catch (e: any) {
      console.error('Failed to load extras:', e)
    }
  }

  const loadMenu = async () => {
    try {
      const { data, error } = await supabase
        .from('menu_items')
        .select('*, variants')
        .eq('is_active', true)
        .order('category', { ascending: true })
        .order('position', { ascending: true })
        .order('name', { ascending: true })

      if (error) throw error
      
      // Two-level filtering:
      // 1. Database query above already filtered for is_active = true (Available toggle)
      // 2. Now filter available items by platform (Platform checkboxes)
      const filteredItems = (data || []).filter((item: any) => {
        // Only show items that explicitly include "Mobile App" in their platforms array
        return item.platforms && Array.isArray(item.platforms) && item.platforms.includes("Mobile App")
      })
      
      setItems(filteredItems)
      // Initialize selected category to the first available if none selected or invalid
      const categoriesFromData = Array.from(new Set((filteredItems || []).map((i: any) => i.category)))
      setSelectedCategory((prev) => (prev && categoriesFromData.includes(prev) ? prev : (categoriesFromData[0] ?? null)))
    } catch (e: any) {
      setError(e?.message ?? 'Failed to load menu')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    const loadData = async () => {
      await Promise.all([loadMenu(), loadExtras()])
    }
    loadData()
  }, [])

  // Add to cart functionality moved to product modal

  const handleRefresh = async (event: CustomEvent) => {
    await Promise.all([loadMenu(), loadExtras()])
    event.detail.complete()
  }

  const openProductModal = (product: MenuItem) => {
    setSelectedProduct(product)
    setIsModalOpen(true)
  }

  const getItemExtras = (item: MenuItem | null): ExtraOption[] => {
    if (!item || !item.extras || item.extras.length === 0) {
      return [] // No extras for this item
    }
    
    return item.extras
      .map(extraName => extrasMap[extraName])
      .filter(Boolean) // Remove any undefined entries
  }

  const closeProductModal = () => {
    setIsModalOpen(false)
    setSelectedProduct(null)
  }

  const handleModalAddToCart = async (quantity: number, extras: ExtraOption[], instructions: string, variant?: Variant) => {
    if (!selectedProduct) return
    
    // Check if app is unavailable - show modal
    if (isUnavailable) {
      closeProductModal()
      if (onShowUnavailableModal) {
        onShowUnavailableModal()
      }
      return
    }
    
    setAddingToCart(selectedProduct.id)
    try {
      // Calculate total price including extras
      const basePrice = variant?.price ?? selectedProduct.price
      const extrasPrice = extras.reduce((sum, extra) => sum + extra.price, 0)
      const totalPrice = basePrice + extrasPrice
      
      // Add single item with extras included
      add({ 
        id: selectedProduct.id, 
        name: selectedProduct.name, 
        price: totalPrice, // Include extras in the price
        quantity: quantity, // Add all quantity at once
        notes: instructions,
        variant: variant,
        extras: extras.map(extra => ({
          id: extra.id,
          name: extra.name,
          price: extra.price
        }))
      })
      const variantText = variant ? ` (${variant.name})` : ''
      const extrasText = extras.length ? ` with ${extras.map(e => e.name).join(', ')}` : ''
      setToastMessage(`${quantity}x ${selectedProduct.name}${variantText}${extrasText} added to cart!`)
      setShowToast(true)
      closeProductModal()
    } finally {
      setAddingToCart(null)
    }
  }

  const groupedItems = items.reduce((acc, item) => {
    if (!acc[item.category]) {
      acc[item.category] = []
    }
    acc[item.category].push(item)
    return acc
  }, {} as Record<string, MenuItem[]>)

  const categories = Object.keys(groupedItems)
  const categoryItems = selectedCategory ? (groupedItems[selectedCategory] || []) : []

  if (loading) {
    return (
      <IonContent className="ion-padding">
        <div className="py-16 text-center space-y-6 pt-12">
          <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-amber-100 to-orange-100">
            <span className="text-4xl">☕</span>
          </div>
          <div className="space-y-2">
            <h2 className="text-2xl font-bold text-gray-900">Loading Menu</h2>
            <p className="text-gray-600">Loading our delicious offerings...</p>
          </div>
          <IonSpinner name="crescent" color="warning" />
        </div>
      </IonContent>
    )
  }

  if (error) {
    return (
      <IonContent className="ion-padding">
        <div className="py-16 text-center space-y-4 pt-12">
          <h2 className="text-2xl font-bold text-gray-900">Menu Unavailable</h2>
          <p className="text-red-600">{error}</p>
          <IonButton color="warning" onClick={loadMenu}>Try Again</IonButton>
        </div>
      </IonContent>
    )
  }

  return (
    <IonContent className="ion-padding">
      <IonRefresher slot="fixed" onIonRefresh={handleRefresh}>
        <IonRefresherContent />
      </IonRefresher>

      <div className="space-y-6 pt-12">
        {/* Hero Banner */}
        <div className="relative h-[35vh] min-h-[200px] max-h-[360px] rounded-xl overflow-hidden border bg-white border-neutral-200">
          <img
            src={"/placeholder.svg"}
            alt="Coffee shop hero banner"
            className="absolute inset-0 h-full w-full object-cover"
          />
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/25 via-black/10 to-transparent" />
          <div className="absolute bottom-3 left-3 inline-flex items-center gap-2 rounded-full bg-white/85 px-2.5 py-1 text-xs text-neutral-900 border border-neutral-200 backdrop-blur">
            <span>Hero banner placeholder</span>
          </div>
        </div>

        {/* Category Filter (horizontal scrollable IonChip pills) */}
        <div className="-mx-4 px-4">
          <div className="overflow-x-auto no-scrollbar">
            <div className="flex gap-2 w-max pr-4 whitespace-nowrap">
              {categories.map((c) => {
                const active = selectedCategory === c
                const label = categoryNames[c] || c
                return (
                  <IonChip
                    key={c}
                    onClick={() => setSelectedCategory(c)}
                    aria-pressed={active as any}
                    className={cn(
                      'h-8 px-3 rounded-full text-sm transition-colors border border-solid select-none',
                      active
                        ? 'bg-neutral-900 text-white border-neutral-900'
                        : 'bg-white text-neutral-700 border-neutral-200 hover:bg-neutral-50',
                    )}
                  >
                    {label}
                  </IonChip>
                )
              })}
            </div>
          </div>
        </div>
      
        {/* Menu Items - only show selected category */}
        <div className="space-y-3">
          {categoryItems.map((item) => (
            <div
              key={item.id}
              className="rounded-2xl border border-neutral-200 bg-white p-3 shadow-sm transition-all duration-200 hover:shadow-md cursor-pointer"
              onClick={() => openProductModal(item)}
            >
              <div className="flex items-center gap-3">
                {/* Image */}
                <div className="h-14 w-14 rounded-lg overflow-hidden bg-neutral-100 border border-neutral-200 shrink-0">
                  <img
                    src={item.image_url || '/placeholder.svg'}
                    alt={item.name}
                    className="h-14 w-14 object-cover"
                  />
                </div>

                {/* Text */}
                <div className="min-w-0 flex-1">
                  <div className="text-[15px] font-semibold text-neutral-900 truncate">{item.name}</div>
                  {item.description && (
                    <div className="text-sm text-neutral-600 line-clamp-2 mt-1">{item.description}</div>
                  )}
                </div>

                {/* Price */}
                <div className="shrink-0 ml-2">
                  <div className="text-sm font-bold text-yellow-600">
                    {formatCurrency(item.price)}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {items.length === 0 && !loading && (
          <div className="py-12 text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-zinc-100">
              <span className="text-2xl text-zinc-400">🍽️</span>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No items available</h3>
            <p className="text-gray-600">Check back later for our delicious offerings!</p>
          </div>
        )}
      </div>

      <IonToast
        isOpen={showToast}
        onDidDismiss={() => setShowToast(false)}
        message={toastMessage}
        duration={2000}
        color="success"
        position="top"
      />

      <ProductDetailModal 
        isOpen={isModalOpen}
        product={selectedProduct}
        adding={!!(selectedProduct && addingToCart === selectedProduct.id)}
        onDismiss={closeProductModal}
        onAdd={handleModalAddToCart}
        extras={getItemExtras(selectedProduct)}
      />
    </IonContent>
  )
}