import { useState, useEffect } from 'react'
import { useSupabase } from '../lib/useSupabase'
import { useCartStore } from '../store/cart'
import { useUnavailableStore } from '../store/unavailable'
import { IonContent, IonRefresher, IonRefresherContent, IonSpinner, IonToast, IonChip, IonButton } from '@ionic/react'
// Icons not needed for simplified menu
import ProductDetailModal, { type ExtraOption } from '../components/ProductDetailModal'
import { formatCurrency } from '../utils/format'

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
  const supabase = useSupabase()
  const add = useCartStore((s) => s.add)
  const { isUnavailable } = useUnavailableStore()
  const [items, setItems] = useState<MenuItem[]>([])
  const [extrasMap, setExtrasMap] = useState<Record<string, ExtraOption>>({})
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
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

  const categories = ['all', ...Object.keys(groupedItems)]
  const displayItems = selectedCategory === 'all' ? groupedItems : { [selectedCategory]: groupedItems[selectedCategory] || [] }

  if (loading) {
    return (
      <IonContent className="ion-padding">
        <div className="py-16 text-center space-y-6 mt-10">
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
        <div className="py-16 text-center space-y-4 mt-10">
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

      <div className="space-y-6 mt-10">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold text-gray-900">Menu</h1>
          <p className="text-gray-600">Discover our delicious offerings</p>
        </div>

        {/* Category Filter */}
        <div className="flex justify-center">
          <div className="flex gap-2 overflow-x-auto pb-2 px-4">
            {categories.map((category) => (
              <IonChip
                key={category}
                color={selectedCategory === category ? 'warning' : 'medium'}
                onClick={() => setSelectedCategory(category)}
                className="cursor-pointer whitespace-nowrap"
              >
                {category === 'all' ? 'All Items' : (categoryNames[category] || category)}
              </IonChip>
            ))}
          </div>
        </div>
      
      {/* Menu Items */}
      <div className="space-y-6">
        {Object.entries(displayItems).map(([category, categoryItems]) => (
          <div key={category} className="space-y-4">
            {selectedCategory === 'all' && (
              <h2 className="text-xl font-bold text-gray-900 mb-3">
                {categoryNames[category] || categoryNames.default}
              </h2>
            )}
            
            <div className="space-y-3">
              {categoryItems.map((item) => (
                <div 
                  key={item.id} 
                  className="rounded-2xl border border-zinc-950/10 bg-white p-4 shadow-sm transition-all duration-200 hover:shadow-md cursor-pointer"
                  onClick={() => openProductModal(item)}
                >
                  <div className="flex gap-4">
                    {/* Item Image/Icon */}
                    <div className="flex h-20 w-20 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-amber-100 to-orange-100">
                      <img 
                        src={item.image_url || "/placeholder-0taew.png"} 
                        alt={item.name}
                        className="h-full w-full rounded-xl object-cover"
                      />
                    </div>
                    
                    {/* Item Details */}
                    <div className="min-w-0 flex-1">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold text-gray-900">
                            {item.name}
                          </h3>
                          {item.description && (
                            <p className="mt-1 line-clamp-2 text-sm text-gray-600">
                              {item.description}
                            </p>
                          )}
                          <div className="mt-3">
                            <span className="text-xl font-bold text-amber-600">
                              {formatCurrency(item.price)}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
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