import type { MenuItem } from "@/types/menu"

export const dummyImages = [
  "/images/coffee-1.png",
  "/images/coffee-2.png",
  "/images/coffee-3.png",
  "/images/coffee-4.png",
  "/images/coffee-5.png",
]

// Seed items reflecting your provided display sections and prices
export const seedItems: MenuItem[] = [
  // Coffee
  {
    id: "coffee-golden-hour",
    name: "Golden Hour (Butterscotch)",
    category: "Coffee",
    variants: [
      { name: "Short", price: Number.NaN }, // display as "-"
      { name: "Tall", price: 55 },
    ],
    available: true,
    position: 0,
    imageUrl: dummyImages[0],
    tags: ["signature"],
  },
  {
    id: "coffee-drip",
    name: "Drip Coffee",
    category: "Coffee",
    variants: [
      { name: "Short", price: 35 },
      { name: "Tall", price: 40 },
    ],
    available: true,
    position: 1,
    imageUrl: dummyImages[1],
  },
  {
    id: "coffee-espresso",
    name: "Espresso",
    category: "Coffee",
    variants: [
      { name: "Short", price: 25 },
      { name: "Tall", price: 28 },
    ],
    available: true,
    position: 2,
    imageUrl: dummyImages[2],
  },
  {
    id: "coffee-mocha",
    name: "Cafe Mocha",
    category: "Coffee",
    variants: [
      { name: "Short", price: 40 },
      { name: "Tall", price: 45 },
    ],
    available: true,
    position: 3,
    imageUrl: dummyImages[3],
  },
  {
    id: "coffee-cortado",
    name: "Cortado",
    category: "Coffee",
    variants: [
      { name: "Short", price: 35 },
      { name: "Tall", price: Number.NaN },
    ],
    available: true,
    position: 4,
    imageUrl: dummyImages[4],
  },
  {
    id: "coffee-americano",
    name: "Americano",
    category: "Coffee",
    variants: [
      { name: "Short", price: 30 },
      { name: "Tall", price: 33 },
    ],
    available: true,
    position: 5,
  },
  {
    id: "coffee-cappuccino",
    name: "Cappuccino",
    category: "Coffee",
    variants: [
      { name: "Short", price: 35 },
      { name: "Tall", price: 40 },
    ],
    available: true,
    position: 6,
  },
  {
    id: "coffee-flat-white",
    name: "Flat White",
    category: "Coffee",
    variants: [
      { name: "Short", price: 35 },
      { name: "Tall", price: Number.NaN },
    ],
    available: true,
    position: 7,
  },

  // Lattes
  {
    id: "latte-cafe",
    name: "Cafe Latte",
    category: "Lattes",
    variants: [
      { name: "Short", price: 35 },
      { name: "Tall", price: 40 },
    ],
    available: true,
    position: 0,
  },
  {
    id: "latte-chai",
    name: "Chai Latte",
    category: "Lattes",
    variants: [
      { name: "Short", price: 40 },
      { name: "Tall", price: 45 },
    ],
    available: true,
    position: 1,
  },
  {
    id: "latte-ice-tall",
    name: "Ice Latte Tall",
    category: "Lattes",
    variants: [
      { name: "Short", price: Number.NaN },
      { name: "Tall", price: 45 },
    ],
    available: true,
    position: 2,
  },
  {
    id: "latte-ice-choc",
    name: "Ice Chocolate Latte",
    category: "Lattes",
    variants: [
      { name: "Short", price: Number.NaN },
      { name: "Tall", price: 55 },
    ],
    available: true,
    position: 3,
  },
  {
    id: "latte-ice-mocha",
    name: "Ice Mocha Tall",
    category: "Lattes",
    variants: [
      { name: "Short", price: Number.NaN },
      { name: "Tall", price: 50 },
    ],
    available: true,
    position: 4,
  },
  {
    id: "latte-ice-spanish",
    name: "Ice Spanish Latte",
    category: "Lattes",
    variants: [
      { name: "Short", price: Number.NaN },
      { name: "Tall", price: 45 },
    ],
    available: true,
    position: 5,
  },
  {
    id: "latte-ice-rose-spanish",
    name: "Ice Rose Spanish Latte",
    category: "Lattes",
    variants: [
      { name: "Short", price: Number.NaN },
      { name: "Tall", price: 45 },
    ],
    available: true,
    position: 6,
  },

  // Hot or Cold
  {
    id: "hoc-red-espresso",
    name: "Red Espresso",
    category: "Hot or Cold",
    variants: [
      { name: "Short", price: 40 },
      { name: "Tall", price: 45 },
    ],
    available: true,
    position: 0,
  },
  {
    id: "hoc-ice-golden-hour",
    name: "Ice Golden Hour (Butterscotch)",
    category: "Hot or Cold",
    variants: [
      { name: "Short", price: Number.NaN },
      { name: "Tall", price: 69 },
    ],
    available: true,
    position: 1,
  },
  {
    id: "hoc-hot-chocolate",
    name: "Hot Chocolate",
    category: "Hot or Cold",
    variants: [
      { name: "Short", price: 40 },
      { name: "Tall", price: 45 },
    ],
    available: true,
    position: 2,
  },

  // Milkshakes & Smoothies
  {
    id: "ms-date",
    name: "Date Smoothie",
    category: "Milkshakes & Smoothies",
    variants: [{ name: "500ml", price: 75 }],
    available: true,
    position: 0,
  },
  {
    id: "ms-go-green",
    name: "Go Green Smoothie",
    category: "Milkshakes & Smoothies",
    variants: [{ name: "500ml", price: 75 }],
    available: true,
    position: 1,
  },
  {
    id: "ms-goldenhour-shake",
    name: "Goldenhour Shake (no coffee)",
    category: "Milkshakes & Smoothies",
    variants: [{ name: "500ml", price: 75 }],
    available: true,
    position: 2,
  },
  {
    id: "ms-strawberry",
    name: "Strawberry Shake",
    category: "Milkshakes & Smoothies",
    variants: [{ name: "500ml", price: 59 }],
    available: true,
    position: 3,
  },
  {
    id: "ms-coffee-shake",
    name: "Coffee Shake",
    category: "Milkshakes & Smoothies",
    variants: [{ name: "500ml", price: 65 }],
    available: true,
    position: 4,
  },
  {
    id: "ms-chocolate",
    name: "Chocolate Shake",
    category: "Milkshakes & Smoothies",
    variants: [{ name: "500ml", price: 59 }],
    available: true,
    position: 5,
  },

  // Specialty (Karak)
  {
    id: "spec-karak",
    name: "Green Gold Karak",
    category: "Specialty",
    variants: [{ name: "250ml", price: 45 }],
    available: true,
    position: 0,
    description:
      "Spicy blend inspired by Dubai • Comes with a date • Available on Fridays, Saturdays & Sundays takeaway only",
  },

  // Combos
  {
    id: "combo-cappuccino-bagel",
    name: "Combo Short Cappuccino + Chicken Mayo Bagel",
    category: "Combos",
    variants: [{ name: "One Size", price: 70 }],
    available: true,
    position: 0,
  },
  {
    id: "combo-cappuccino-koeksisters",
    name: "Combo Short Cappuccino + 3 Koeksisters",
    category: "Combos",
    variants: [{ name: "One Size", price: 50 }],
    available: true,
    position: 1,
  },

  // Extras
  {
    id: "extra-vanilla",
    name: "Vanilla Syrup",
    category: "Extras",
    variants: [{ name: "Add", price: 11 }],
    available: true,
    position: 0,
  },
  {
    id: "extra-hazelnut",
    name: "Hazelnut Syrup",
    category: "Extras",
    variants: [{ name: "Add", price: 11 }],
    available: true,
    position: 1,
  },
  {
    id: "extra-decaf",
    name: "Decaf Shot",
    category: "Extras",
    variants: [{ name: "Add", price: 12 }],
    available: true,
    position: 2,
  },
  {
    id: "extra-almond",
    name: "Almond Milk",
    category: "Extras",
    variants: [{ name: "Add", price: 11 }],
    available: true,
    position: 3,
  },
  {
    id: "extra-oat",
    name: "Oat Milk",
    category: "Extras",
    variants: [{ name: "Add", price: 11 }],
    available: true,
    position: 4,
  },
  {
    id: "extra-cream",
    name: "Extra Cream",
    category: "Extras",
    variants: [{ name: "Add", price: 11 }],
    available: true,
    position: 5,
  },
  {
    id: "extra-shot",
    name: "Extra Shot",
    category: "Extras",
    variants: [{ name: "Add", price: 12 }],
    available: true,
    position: 6,
  },

  // Drinks
  {
    id: "drink-salaam-cola",
    name: "Salaam Cola",
    category: "Drinks",
    variants: [{ name: "Bottle", price: 18 }],
    available: true,
    position: 0,
  },
  {
    id: "drink-bashews",
    name: "Bashews",
    category: "Drinks",
    variants: [{ name: "Can", price: 15 }],
    available: true,
    position: 1,
  },
  {
    id: "drink-sparkling",
    name: "Sparkling Water 500ml",
    category: "Drinks",
    variants: [{ name: "Bottle", price: 18 }],
    available: true,
    position: 2,
  },
  {
    id: "drink-still",
    name: "Still Water 500ml",
    category: "Drinks",
    variants: [{ name: "Bottle", price: 15 }],
    available: true,
    position: 3,
  },
]
