import {
  Package,
  ReceiptText,
  ShoppingCart,
  TrendingUp,
  Truck,
  Users,
  Wallet,
} from "lucide-react";

import type { ReportCard } from "../types/report";

export const REPORT_CARDS: ReportCard[] = [
  {
    id: "sales",
    title: "Sales Report",
    description: "Track invoices, revenue and payment performance.",
    href: "/reports/sales",
    icon: ReceiptText,
    color: "blue",
    records: "245 Records",
    updatedAt: "Today",
  },
  {
    id: "purchases",
    title: "Purchase Report",
    description: "Monitor supplier purchases and procurement.",
    href: "/reports/purchases",
    icon: ShoppingCart,
    color: "green",
    records: "182 Records",
    updatedAt: "Today",
  },
  {
    id: "expenses",
    title: "Expense Report",
    description: "Analyze operational and business expenses.",
    href: "/reports/expenses",
    icon: Wallet,
    color: "orange",
    records: "96 Records",
    updatedAt: "Yesterday",
  },
  {
    id: "stock",
    title: "Stock Report",
    description: "Review inventory levels and stock availability.",
    href: "/reports/stock",
    icon: Package,
    color: "purple",
    records: "1,248 Items",
    updatedAt: "Today",
  },
  {
    id: "customers",
    title: "Customer Report",
    description: "View customer balances and transaction history.",
    href: "/reports/customers",
    icon: Users,
    color: "cyan",
    records: "386 Customers",
    updatedAt: "Today",
  },
  {
    id: "suppliers",
    title: "Supplier Report",
    description: "Manage supplier balances and purchase records.",
    href: "/reports/suppliers",
    icon: Truck,
    color: "amber",
    records: "42 Suppliers",
    updatedAt: "Today",
  },
  {
    id: "profit",
    title: "Profit Summary",
    description: "Compare sales, purchases and net profit.",
    href: "/reports/profit",
    icon: TrendingUp,
    color: "emerald",
    records: "12 Months",
    updatedAt: "Live",
  },
];

export const REPORT_STATUS_OPTIONS = [
  {
    label: "All Status",
    value: "all",
  },
  {
    label: "Paid",
    value: "paid",
  },
  {
    label: "Pending",
    value: "pending",
  },
];

export const REPORT_DATE_RANGES = [
  {
    label: "Today",
    value: "today",
  },
  {
    label: "Last 7 Days",
    value: "7days",
  },
  {
    label: "Last 30 Days",
    value: "30days",
  },
  {
    label: "This Month",
    value: "month",
  },
  {
    label: "This Year",
    value: "year",
  },
  {
    label: "Custom",
    value: "custom",
  },
];

export const REPORT_EXPORT_OPTIONS = [
  {
    label: "Export Excel",
    value: "excel",
  },
  {
    label: "Export PDF",
    value: "pdf",
  },
];

export const REPORT_STATS = [
  {
    id: "total",
    title: "Total",
  },
  {
    id: "paid",
    title: "Paid",
  },
  {
    id: "pending",
    title: "Pending",
  },
];
