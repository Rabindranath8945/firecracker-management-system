import type { BusinessType } from "../types/business.types";

export const BUSINESS_TYPES: {
  value: BusinessType;
  label: string;
  icon: string;
}[] = [
  {
    value: "GENERAL_STORE",
    label: "General Store",
    icon: "🏪",
  },
  {
    value: "MEDICAL",
    label: "Medical Store",
    icon: "💊",
  },
  {
    value: "GROCERY",
    label: "Grocery Store",
    icon: "🛒",
  },
  {
    value: "HARDWARE",
    label: "Hardware Store",
    icon: "🛠️",
  },
  {
    value: "STATIONERY",
    label: "Stationery Store",
    icon: "📚",
  },
  {
    value: "ELECTRONICS",
    label: "Electronics Store",
    icon: "💻",
  },
  {
    value: "CLOTHING",
    label: "Clothing Store",
    icon: "👕",
  },
  {
    value: "RESTAURANT",
    label: "Restaurant",
    icon: "🍽️",
  },
  {
    value: "OTHER",
    label: "Other",
    icon: "🏢",
  },
];
