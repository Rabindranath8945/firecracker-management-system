import {
  IndianRupee,
  TrendingUp,
  Wallet,
  Users,
  TriangleAlert,
} from "lucide-react";

import type { LucideIcon } from "lucide-react";

export interface KPIStat {
  key:
    | "todaySales"
    | "todayProfit"
    | "monthlyRevenue"
    | "outstandingPayments"
    | "totalCustomers"
    | "lowStock";

  title: string;

  icon: LucideIcon;

  color: "sky" | "emerald" | "violet" | "amber" | "blue" | "red";
}

export const KPI_STATS: KPIStat[] = [
  {
    key: "todaySales",
    title: "Today's Sales",
    icon: IndianRupee,
    color: "sky",
  },
  {
    key: "todayProfit",
    title: "Today's Profit",
    icon: IndianRupee,
    color: "emerald",
  },
  {
    key: "monthlyRevenue",
    title: "Monthly Revenue",
    icon: TrendingUp,
    color: "violet",
  },
  {
    key: "outstandingPayments",
    title: "Outstanding Payments",
    icon: Wallet,
    color: "amber",
  },
  {
    key: "totalCustomers",
    title: "Customers",
    icon: Users,
    color: "blue",
  },
  {
    key: "lowStock",
    title: "Low Stock",
    icon: TriangleAlert,
    color: "red",
  },
];
