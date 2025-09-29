import { useState, useEffect } from 'react'
import { IonModal, IonHeader, IonToolbar, IonTitle, IonButtons, IonButton, IonIcon, IonContent, IonList, IonItem, IonCheckbox, IonLabel, IonTextarea } from '@ionic/react'
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
        <IonToolbar color="warning">
          <IonButtons slot="start">
            <IonButton onClick={onDismiss}>
              <IonIcon icon={arrowBackOutline} />
            </IonButton>
          </IonButtons>
          <IonTitle>{product?.name}</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
            {product && (
          <div className="space-y-6">
            <div className="flex justify-center">
              <div className="w-64 h-64 rounded-2xl bg-gradient-to-br from-amber-100 to-orange-100 flex items-center justify-center">
                <img 
                  src={product.image_url || "/placeholder-0taew.png"} 
                  alt={product.name} 
                  className="w-full h-full rounded-2xl object-cover" 
                />
              </div>
            </div>

            <div className="text-center space-y-4">
              <h1 className="text-3xl font-bold text-gray-900">{product.name}</h1>
              {product.description && (
                <p className="text-lg text-gray-600 leading-relaxed">{product.description}</p>
              )}
              <div className="text-4xl font-bold text-amber-600">{formatCurrency(currentPrice)}</div>
            </div>

            {/* Size Selection */}
            {availableVariants.length > 0 && (
              <div className="space-y-3">
                <h3 className="text-xl font-semibold text-gray-900">
                  {hasMultipleVariants ? 'Size' : 'Size'}
                </h3>
                {hasMultipleVariants ? (
                  <div className="grid grid-cols-2 gap-2">
                    {availableVariants.map((variant) => {
                      const isSelected = selectedVariant?.id === variant.id
                      return (
                        <button
                          key={variant.id}
                          onClick={() => setSelectedVariant(variant)}
                          className={`p-3 rounded-xl border-2 transition-all ${
                            isSelected 
                              ? 'border-amber-500 bg-amber-50 text-amber-900' 
                              : 'border-gray-200 bg-white text-gray-700 hover:border-amber-300'
                          }`}
                        >
                          <div className="text-center">
                            <div className="font-semibold">{variant.name}</div>
                            <div className="text-sm font-medium text-amber-600">
                              {formatCurrency(variant.price)}
                            </div>
                          </div>
                        </button>
                      )
                    })}
                  </div>
                ) : (
                  <div className="text-center text-gray-600">
                    {availableVariants[0]?.name} - {formatCurrency(availableVariants[0]?.price)}
                  </div>
                )}
              </div>
            )}

            {/* Extras */}
            {effectiveExtras.length > 0 && (
              <div className="space-y-3">
                <h3 className="text-xl font-semibold text-gray-900">Extras</h3>
                <IonList>
                  {effectiveExtras.map((extra) => {
                    const checked = !!selectedExtras.find((e) => e.id === extra.id)
                    return (
                      <IonItem key={extra.id} lines="full">
                        <IonCheckbox
                          checked={checked}
                          onIonChange={(e) => toggleExtra(extra, !!e.detail.checked)}
                          slot="start"
                        />
                        <IonLabel>
                          <div className="flex items-center justify-between w-full">
                            <span className="text-gray-900">{extra.name}</span>
                            <span className="text-amber-600 font-medium">{formatCurrency(extra.price)}</span>
                          </div>
                        </IonLabel>
                      </IonItem>
                    )
                  })}
                </IonList>
                {selectedExtras.length > 0 && (
                  <div className="text-sm text-gray-600">
                    Selected extras: {selectedExtras.map((e) => e.name).join(', ')} (+{formatCurrency(extrasUnitTotal)} per item)
                  </div>
                )}
              </div>
            )}

            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-gray-900 text-center">Quantity</h3>
              <div className="flex items-center justify-center gap-4">
                <IonButton onClick={() => setQuantity(Math.max(1, quantity - 1))} fill="outline" color="warning" disabled={quantity <= 1}>
                  <IonIcon icon={removeOutline} />
                </IonButton>
                <span className="text-2xl font-bold text-gray-900 min-w-[3rem] text-center">{quantity}</span>
                <IonButton onClick={() => setQuantity(quantity + 1)} fill="outline" color="warning">
                  <IonIcon icon={addOutline} />
                </IonButton>
              </div>
            </div>

            {/* Instructions */}
            <div className="space-y-2">
              <h3 className="text-xl font-semibold text-gray-900">Instructions</h3>
              <IonTextarea
                value={instructions}
                onIonInput={(e) => setInstructions(e.detail.value ?? '')}
                autoGrow
                placeholder="e.g. Oat milk, less ice, light sugar"
              />
            </div>

            <div className="space-y-3">
              <IonButton
                expand="block"
                size="large"
                color="warning"
                onClick={() => onAdd(quantity, selectedExtras, instructions, selectedVariant || undefined)}
                disabled={adding}
              >
                {adding ? (
                  <>
                    <IonIcon icon={checkmarkOutline} slot="start" />
                    Adding to Cart...
                  </>
                ) : (
                  <>
                    <IonIcon icon={addOutline} slot="start" />
                    Add {quantity}x to Cart - {formatCurrency(totalPrice)}
                  </>
                )}
              </IonButton>
            </div>
          </div>
        )}
      </IonContent>
    </IonModal>
  )
}

