import type { CatalogItem } from "@/features/catalog/api/catalogApi";

export const catalog: CatalogItem[] = [
  {
    id: "espresso",
    name: "Single Origin Espresso",
    price: 6.5,
    category: "Coffee",
    inventory: 42,
    description: "Bright citrus and caramel notes sourced from a Guatemalan microlot.",
  },
  {
    id: "pour-over",
    name: "Pour-over Kit",
    price: 38,
    category: "Gear",
    inventory: 12,
    description: "Everything you need for consistent home brews, including filters and a scale.",
  },
  {
    id: "mug",
    name: "Thermal Travel Mug",
    price: 24,
    category: "Accessories",
    inventory: 58,
    description: "Vacuum sealed stainless steel designed to keep beverages hot for 8 hours.",
  },
  {
    id: "beans",
    name: "Seasonal Beans Subscription",
    price: 19,
    category: "Coffee",
    inventory: 150,
    description: "A fresh 12oz bag delivered every two weeks with tasting notes and brew guides.",
  },
];
