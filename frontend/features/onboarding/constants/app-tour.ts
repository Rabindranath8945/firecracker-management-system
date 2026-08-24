import {
  BarChart3,
  CreditCard,
  Package,
  ShoppingCart,
  type LucideIcon,
} from "lucide-react";

export interface AppTourItem {
  title: string;
  description: string;
  icon: LucideIcon;
}

export const APP_TOUR: AppTourItem[] = [
  {
    title: "Manage Products",
    description:
      "Create products, manage stock and organize your inventory effortlessly.",
    icon: Package,
  },
  {
    title: "Fast Billing",
    description:
      "Create invoices in seconds with a simple and powerful sales experience.",
    icon: ShoppingCart,
  },
  {
    title: "Multiple Payments",
    description: "Accept Cash, UPI and Credit with automatic payment tracking.",
    icon: CreditCard,
  },
  {
    title: "Business Reports",
    description:
      "Track sales, profit, expenses and business performance from one dashboard.",
    icon: BarChart3,
  },
];
