import {
  Store,
  Pill,
  ShoppingCart,
  Shirt,
  Hammer,
  UtensilsCrossed,
  Laptop,
  BookOpen,
  type LucideIcon,
} from "lucide-react";

export interface BusinessType {
  id:
    | "GENERAL_STORE"
    | "MEDICAL"
    | "GROCERY"
    | "HARDWARE"
    | "STATIONERY"
    | "ELECTRONICS"
    | "CLOTHING"
    | "RESTAURANT";

  title: string;
  description: string;
  icon: LucideIcon;
  available: boolean;
}

export const BUSINESSES: BusinessType[] = [
  {
    id: "GENERAL_STORE",
    title: "General Store",
    description: "Groceries, FMCG, daily essentials and retail items.",
    icon: Store,
    available: true,
  },

  {
    id: "MEDICAL",
    title: "Medical Store",
    description: "Medicine and pharmacy management.",
    icon: Pill,
    available: true,
  },

  {
    id: "GROCERY",
    title: "Grocery",
    description: "Grocery, food items and everyday household products.",
    icon: ShoppingCart,
    available: true,
  },

  {
    id: "HARDWARE",
    title: "Hardware",
    description: "Hardware tools and building materials.",
    icon: Hammer,
    available: true,
  },

  {
    id: "STATIONERY",
    title: "Stationery",
    description: "Books, stationery, office and school supplies.",
    icon: BookOpen,
    available: true,
  },

  {
    id: "ELECTRONICS",
    title: "Electronics",
    description: "Electronics and appliance retail.",
    icon: Laptop,
    available: true,
  },

  {
    id: "CLOTHING",
    title: "Clothing",
    description: "Clothing and fashion retail management.",
    icon: Shirt,
    available: true,
  },

  {
    id: "RESTAURANT",
    title: "Restaurant",
    description: "Food orders, billing and kitchen management.",
    icon: UtensilsCrossed,
    available: true,
  },
] as const;
