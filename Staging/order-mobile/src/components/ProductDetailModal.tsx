import { useState, useEffect } from 'react'
import { IonModal, IonHeader, IonToolbar, IonTitle, IonButtons, IonButton, IonIcon, IonContent, IonSegment, IonSegmentButton, IonLabel } from '@ionic/react'
import { arrowBackOutline, addOutline, removeOutline, checkmarkOutline } from 'ionicons/icons'
import { formatCurrency } from '../utils/format'

type Variant = {
  id: string
  name: string
  price: number
}

type Product = {
  id: string
  name: string
  description?: string
  price: number
  image_url?: string
  variants?: Variant[]
  category?: string
}

export type ExtraOption = {
  id: string
  name: string
  price: number
}

interface ProductDetailModalProps {
  isOpen: boolean
  product: Product | null
  adding?: boolean
  onDismiss: () => void
  onAdd: (quantity: number, extras: ExtraOption[], instructions: string, variant?: Variant) => void | Promise<void>
  extras?: ExtraOption[]
}

export default function ProductDetailModal({ isOpen, product, adding, onDismiss, onAdd, extras }: ProductDetailModalProps) {
  const [quantity, setQuantity] = useState(1)
  const [selectedExtras, setSelectedExtras] = useState<ExtraOption[]>([])
  const [instructions, setInstructions] = useState('')
  const [selectedVariant, setSelectedVariant] = useState<Variant | null>(null)

  // Use only the extras passed from parent (configured in admin)
  const effectiveExtras = extras || []
  const extrasUnitTotal = selectedExtras.reduce((sum, e) => sum + e.price, 0)
  
  // Get current price from selected variant or fallback to base price
  const currentPrice = selectedVariant?.price ?? product?.price ?? 0
  const perUnitTotal = currentPrice + extrasUnitTotal
  const totalPrice = perUnitTotal * quantity

  // Available variants for this product
  const availableVariants = product?.variants || []
  const hasMultipleVariants = availableVariants.length > 1

  useEffect(() => {
    if (isOpen) {
      setQuantity(1)
      setSelectedExtras([])
      setInstructions('')
      // Set default variant (first one or null if no variants)
      setSelectedVariant(availableVariants.length > 0 ? availableVariants[0] : null)
    }
  }, [isOpen, availableVariants])

  const toggleExtra = (extra: ExtraOption, checked: boolean) => {
    setSelectedExtras((prev) => {
      if (checked) {
        if (prev.find((e) => e.id === extra.id)) return prev
        return [...prev, extra]
      }
      return prev.filter((e) => e.id !== extra.id)
    })
  }

  return (
    <IonModal isOpen={isOpen} onDidDismiss={onDismiss}>
      <IonHeader>
        <IonToolbar className="bg-white border-b border-neutral-200">
          <IonButtons slot="start">
            <IonButton onClick={onDismiss} color="dark" fill="clear">
              <IonIcon icon={arrowBackOutline} />
            </IonButton>
          </IonButtons>
          <IonTitle className="ion-text-center">
            <span className="block max-w-[65vw] mx-auto truncate text-neutral-900">{product?.category ?? ''}</span>
          </IonTitle>
          {/* Invisible end button to balance start button and keep title centered on MD */}
          <IonButtons slot="end">
            <IonButton className="opacity-0 pointer-events-none" fill="clear">
              <IonIcon icon={arrowBackOutline} />
            </IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding product-detail-modal">
            {product && (
          <div className="space-y-6">
            <div className="rounded-xl border p-4 bg-white border-neutral-200">
              <div className="h-44 w-full rounded-lg overflow-hidden bg-neutral-100 border border-neutral-200">
                <img
                  src={product.image_url || '/placeholder.svg'}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            <div className="text-center space-y-1">
              <h1 className="text-xl font-bold leading-7 text-neutral-900">{product.name}</h1>
              {product.description && (
                <p className="text-sm font-normal leading-7 text-neutral-600">{product.description}</p>
              )}
              <div className="text-2xl font-bold leading-7 text-yellow-600">{formatCurrency(currentPrice)}</div>
            </div>

            {/* Size Selection */}
            {availableVariants.length > 0 && (
              <div className="space-y-3">
                <h3 className="text-sm font-bold text-neutral-900">Size</h3>
                {hasMultipleVariants ? (
                  <div className="inline-flex rounded-xl border border-neutral-200 bg-neutral-100 p-1 w-full">
                    <IonSegment
                      className="size-segment w-full"
                      value={selectedVariant?.id || availableVariants[0]?.id}
                      onIonChange={(e) => {
                        const id = (e as any).detail.value as string
                        const found = availableVariants.find(v => v.id === id) || null
                        setSelectedVariant(found)
                      }}
                    >
                      {availableVariants.map((variant) => (
                        <IonSegmentButton key={variant.id} value={variant.id} className="size-segment-button">
                          <IonLabel className="text-sm font-medium">{variant.name}</IonLabel>
                        </IonSegmentButton>
                      ))}
                    </IonSegment>
                  </div>
                ) : (
                  <div className="text-center text-gray-600">
                    {availableVariants[0]?.name}
                  </div>
                )}
              </div>
            )}

            {/* Extras */}
            {effectiveExtras.length > 0 && (
              <div className="space-y-3">
                <h3 className="text-sm font-bold text-neutral-900">Extras</h3>
                <div className="rounded-xl border border-neutral-200 overflow-hidden bg-white extras-list">
                  {effectiveExtras.map((extra, i) => {
                    const checked = !!selectedExtras.find((e) => e.id === extra.id)
                    return (
                      <div key={extra.id}>
                        <button
                          type="button"
                          onClick={() => toggleExtra(extra, !checked)}
                          role="checkbox"
                          aria-checked={checked}
                          className={`w-full flex items-center justify-between px-3 py-3 text-left transition-colors ${
                            checked ? 'bg-neutral-50' : 'bg-white'
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            <span
                              aria-hidden="true"
                              className={`inline-flex h-4 w-4 items-center justify-center rounded-full border ${
                                checked ? 'border-neutral-900 bg-neutral-900' : 'border-neutral-300'
                              }`}
                            >
                              {checked ? (
                                <IonIcon icon={checkmarkOutline} className="h-3 w-3 text-white" />
                              ) : null}
                            </span>
                            <span className="text-neutral-900 text-sm font-medium">{extra.name}</span>
                          </div>
                          <span className="text-sm text-yellow-600 font-bold">{formatCurrency(extra.price)}</span>
                        </button>
                        {i < effectiveExtras.length - 1 && <div className="h-px bg-neutral-200" />}
                      </div>
                    )
                  })}
                </div>
                {selectedExtras.length > 0 && (
                  <div className="text-sm text-neutral-600">
                    Selected extras: {selectedExtras.map((e) => e.name).join(', ')} (+{formatCurrency(extrasUnitTotal)} per item)
                  </div>
                )}
              </div>
            )}

            <div className="space-y-4">
              <h3 className="text-sm font-bold text-neutral-900 text-center">Quantity</h3>
              <div className="flex items-center justify-center gap-3">
                <button
                  type="button"
                  aria-label="Decrease quantity"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  disabled={quantity <= 1}
                  className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-neutral-300 bg-white text-neutral-700 hover:bg-neutral-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <IonIcon icon={removeOutline} className="h-4 w-4" />
                </button>
                <div className="w-10 text-center text-lg font-semibold tabular-nums">{quantity}</div>
                <button
                  type="button"
                  aria-label="Increase quantity"
                  onClick={() => setQuantity(quantity + 1)}
                  className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-neutral-300 bg-white text-neutral-700 hover:bg-neutral-50"
                >
                  <IonIcon icon={addOutline} className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Special notes */}
            <div className="grid gap-2">
              <h3 className="text-sm font-bold text-neutral-900">Special notes</h3>
              <p className="text-sm text-neutral-500">Any special requests or modifications?</p>
              <input
                type="text"
                value={instructions}
                onChange={(e) => setInstructions(e.target.value)}
                placeholder="e.g. Extra hot, no foam, oat milk on the side..."
                className="h-10 w-full rounded-md border border-neutral-300 bg-white px-3 text-sm placeholder:text-sm placeholder:text-neutral-500 focus:outline-none focus:ring-2 focus:ring-yellow-500"
              />
            </div>

            <div className="space-y-3">
              <button
                type="button"
                onClick={() => onAdd(quantity, selectedExtras, instructions, selectedVariant || undefined)}
                disabled={adding}
                className="w-full h-10 font-medium transition-colors bg-yellow-500 text-neutral-900 hover:bg-yellow-600 hover:text-white disabled:opacity-60 disabled:cursor-not-allowed cta-button"
              >
                {adding ? 'Adding to cart…' : 'Add to cart'}
              </button>
            </div>
          </div>
        )}
      </IonContent>
    </IonModal>
  )
}

