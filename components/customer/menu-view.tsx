"use client"

import { useMemo } from "react"
import Image from "next/image"
import { cn } from "@/lib/utils"
import { UI } from "@/lib/theme"
import { formatCurrency } from "@/lib/helpers/formatting"
import { Coffee, Star } from "lucide-react"
import type { Product } from "@/types"
import { Carousel, CarouselContent, CarouselItem } from "@/components/ui/carousel"

function HeroBanner() {
  return (
    <div
      className={cn(
        "relative h-[35vh] min-h-[200px] max-h-[360px] rounded-xl overflow-hidden",
      )}
      aria-label="Promotional banner"
    >
      {/* Hero image */}
      <Image
        src="/images/hero-banner.png"
        alt="Fresh food and artisan coffee"
        fill
        className="object-cover"
        priority
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

      {/* Content */}
      <div className="relative h-full flex flex-col justify-end p-5">
        <div className="inline-flex items-center gap-2 mb-2">
          <div className="h-8 w-8 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
            <Coffee className="h-4 w-4 text-white" />
          </div>
        </div>
        <h2 className="text-white text-xl font-bold tracking-tight">Fresh & Delicious</h2>
        <p className="text-white/70 text-sm mt-0.5">Order ahead, skip the queue</p>
      </div>
    </div>
  )
}

function FeaturedCarousel({ products, onOpenProduct }: { products: Product[], onOpenProduct: (p: Product) => void }) {
  const featured = useMemo(() => products.filter(p => p.is_featured), [products])
  if (featured.length === 0) return <HeroBanner />

  return (
    <div className="mt-2 -mr-4">
      <Carousel opts={{ align: "start", dragFree: true }} className="w-full">
        <CarouselContent>
          {featured.map(p => (
            <CarouselItem 
              key={p.id} 
              className={cn(
                "pl-4",
                featured.length === 1 ? "basis-full pr-4" : "basis-[85%] sm:basis-[60%]"
              )}
            >
              <button 
                onClick={() => onOpenProduct(p)}
                className="relative h-[25vh] min-h-[160px] max-h-[240px] w-full rounded-2xl overflow-hidden touch-manipulation text-left group shadow-sm hover:shadow-md active:scale-[0.98] transition-all duration-300 bg-neutral-900 border border-border"
              >
                {(() => {
                  const imgUrl = p.image || (p as any).image_url;
                  const hasValidImage = imgUrl && !imgUrl.includes("placeholder");
                  return hasValidImage ? (
                    <>
                      <Image 
                        src={imgUrl} 
                        alt={p.name} 
                        fill 
                        className="object-cover transition-transform duration-700 group-hover:scale-105" 
                      />
                    </>
                  ) : (
                    <>
                      <Image
                        src="/images/default-product.png"
                        alt={p.name}
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                    </>
                  )
                })()}
                
                {/* Unified gradient overlay spreading gracefully from bottom */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent pointer-events-none" />
                
                {/* Seamless text at bottom left */}
                <div className="absolute bottom-0 left-0 right-0 p-5 flex flex-col gap-0.5">
                  <span className="text-white font-bold text-lg drop-shadow-md tracking-tight leading-tight">
                    {p.name}
                  </span>
                  <span className="text-amber-400 font-semibold text-sm drop-shadow-md">
                    {formatCurrency(p.price)}
                  </span>
                </div>
              </button>
            </CarouselItem>
          ))}
          {featured.length > 1 && (
            <CarouselItem className="basis-4 pl-0" />
          )}
        </CarouselContent>
      </Carousel>
    </div>
  )
}

function ProductImage({ src, alt }: { src?: string | null; alt: string }) {
  if (src && !src.includes("placeholder")) {
    return (
      <Image
        src={src}
        alt={alt}
        width={56}
        height={56}
        className="h-14 w-14 object-cover"
      />
    )
  }
  // Warm fallback image for items without custom images
  return (
    <Image
      src="/images/default-product.png"
      alt={alt}
      width={56}
      height={56}
      className="h-14 w-14 object-cover"
    />
  )
}

export function MenuView({
  products,
  filteredProducts,
  category,
  onCategoryChange,
  onOpenProduct,
}: {
  products: Product[]
  filteredProducts: Product[]
  category: string
  onCategoryChange: (c: string) => void
  onOpenProduct: (p: Product) => void
}) {
  const availableCategories = useMemo(() => {
    const cats = Array.from(new Set(products.map((p) => p.category).filter(Boolean)))
    return ["All Items", ...cats]
  }, [products])

  return (
    <section className="grid gap-4">
      <FeaturedCarousel products={products} onOpenProduct={onOpenProduct} />

      <div className="flex items-center gap-2 overflow-x-auto pb-2 pl-4 -mr-4 scrollbar-hide">
        {availableCategories.map((c) => {
          const active = c === category
          return (
            <button
              key={c}
              onClick={() => onCategoryChange(c)}
              aria-pressed={active}
              className={cn(
                "px-3 py-1.5 rounded-md text-sm transition-all duration-200 border whitespace-nowrap flex-shrink-0 shadow-sm active:scale-95",
                active
                  ? "bg-primary text-primary-foreground border-primary shadow-md"
                  : "bg-background text-foreground border-border hover:bg-muted hover:shadow"
              )}
            >
              {c}
            </button>
          )
        })}
        {/* Spacer to ensure the last item doesn't touch the very edge when fully scrolled */}
        <div className="w-4 shrink-0" />
      </div>

      {filteredProducts.length === 0 ? (
        <div className="text-center py-12">
          <Coffee className="h-8 w-8 text-neutral-300 mx-auto mb-3" />
          <p className="text-sm text-neutral-500">No items available</p>
        </div>
      ) : (
        <ul className="grid gap-2">
          {filteredProducts.map((p) => (
            <li key={p.id}>
              <button
                onClick={() => onOpenProduct(p)}
                className={cn(
                  "w-full text-left rounded-xl border p-3",
                  "bg-card hover:bg-accent hover:shadow-md hover:border-brand/40",
                  "border-border text-card-foreground",
                  "transition-all duration-200 ease-out",
                  "active:scale-[0.98] active:shadow-sm",
                  "touch-manipulation group"
                )}
                aria-label={`Open ${p.name}`}
              >
                <div className="flex items-center gap-3">
                  <div className="h-14 w-14 rounded-md overflow-hidden bg-muted border border-border shrink-0 flex items-center justify-center transition-transform duration-300 group-hover:scale-105">
                    <ProductImage src={p.image || (p as any).image_url} alt={p.name} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="text-[15px] font-medium">{p.name}</div>
                    <div className={cn("text-sm line-clamp-2", UI.muted)}>{p.description}</div>
                  </div>
                  <div className="text-sm font-semibold ml-2 text-brand">
                    {formatCurrency(p.price)}
                  </div>
                </div>
              </button>
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}

