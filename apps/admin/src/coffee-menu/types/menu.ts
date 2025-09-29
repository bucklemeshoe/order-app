import * as z from "zod"

export type Category =
  | "Coffee"
  | "Lattes"
  | "Hot or Cold"
  | "Milkshakes & Smoothies"
  | "Combos"
  | "Extras"
  | "Drinks"
  | "Specialty"

export const categories: Category[] = [
  "Coffee",
  "Lattes",
  "Hot or Cold",
  "Milkshakes & Smoothies",
  "Combos",
  "Extras",
  "Drinks",
  "Specialty",
]

export type Variant = {
  id: string
  name: string
  price: number
}

export type MenuVariant = Variant

export type MenuItem = {
  id: string
  name: string
  category: Category
  variants: Variant[]
  available: boolean
  description?: string
  tags?: string[]
  platforms?: string[] // Added platforms field for multi-select
  extras?: string[] // Available extras for this item
  imageUrl?: string
  // Controls ordering within each category (lower appears first)
  position?: number
}

export const menuItemSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  category: z.enum(categories as [Category, ...Category[]]),
  description: z.string().optional(),
  imageUrl: z.string().optional(),
  variants: z.array(
    z.object({
      id: z.string().min(1),
      name: z.string().min(1),
      price: z.number(),
    }),
  ),
  available: z.boolean(),
  tags: z.array(z.string()).optional(),
  platforms: z.array(z.string()).optional(), // Added platforms to schema
  extras: z.array(z.string()).optional(), // Added extras to schema
  position: z.number().optional(),
})
