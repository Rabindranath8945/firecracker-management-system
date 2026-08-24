import {
  Store,
  Pill,
  Bike,
  Shirt,
  Hammer,
  UtensilsCrossed,
  Laptop,
  ShoppingBag,
  type LucideIcon,
} from "lucide-react";

export interface BusinessType {
  id: string;
  title: string;
  description: string;
  icon: LucideIcon;
  available: boolean;
}

export const BUSINESSES: BusinessType[] = [
  {
    id: "general",
    title: "General Store",
    description: "Groceries, FMCG, daily essentials and retail items.",
    icon: Store,
    available: true,
  },
  {
    id: "medical",
    title: "Medical Store",
    description: "Medicine and pharmacy management.",
    icon: Pill,
    available: false,
  },
  {
    id: "cycle",
    title: "Cycle Store",
    description: "Bicycle sales, spare parts and service.",
    icon: Bike,
    available: false,
  },
  {
    id: "garments",
    title: "Garments",
    description: "Clothing and fashion retail management.",
    icon: Shirt,
    available: false,
  },
  {
    id: "hardware",
    title: "Hardware",
    description: "Hardware tools and building materials.",
    icon: Hammer,
    available: false,
  },
  {
    id: "restaurant",
    title: "Restaurant",
    description: "Food orders, billing and kitchen management.",
    icon: UtensilsCrossed,
    available: false,
  },
  {
    id: "electronics",
    title: "Electronics",
    description: "Electronics and appliance retail.",
    icon: Laptop,
    available: false,
  },
  {
    id: "supermarket",
    title: "Supermarket",
    description: "Large retail and supermarket operations.",
    icon: ShoppingBag,
    available: false,
  },
] as const;
