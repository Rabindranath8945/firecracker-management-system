import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";

/* -------------------------------------------------------------------------- */
/*                                   Common                                   */
/* -------------------------------------------------------------------------- */

export type ReportType =
  | "sales"
  | "purchases"
  | "expenses"
  | "stock"
  | "customers"
  | "suppliers"
  | "profit";

export type ReportCardColor =
  | "blue"
  | "green"
  | "orange"
  | "purple"
  | "cyan"
  | "amber"
  | "emerald";

export type ReportStatColor =
  | "blue"
  | "green"
  | "orange"
  | "purple"
  | "cyan"
  | "amber"
  | "emerald";

/* -------------------------------------------------------------------------- */
/*                               Dashboard Cards                              */
/* -------------------------------------------------------------------------- */

export interface ReportCard {
  id: ReportType;
  title: string;
  description: string;
  href: string;

  icon: LucideIcon;

  color: ReportCardColor;

  records?: string;

  updatedAt?: string;
}

/* -------------------------------------------------------------------------- */
/*                               Summary Cards                                */
/* -------------------------------------------------------------------------- */

export interface ReportSummary {
  label: string;
  value: number;
  formattedValue: string;

  icon?: LucideIcon;

  color?: ReportStatColor;

  trend?: string;
}

/* -------------------------------------------------------------------------- */
/*                                   Filters                                  */
/* -------------------------------------------------------------------------- */

export interface ReportFilterValues {
  search: string;
  status: string;

  fromDate?: string;

  toDate?: string;
}

/* -------------------------------------------------------------------------- */
/*                                   Tables                                   */
/* -------------------------------------------------------------------------- */

export interface ReportColumn<T> {
  key: keyof T;
  title: string;

  align?: "left" | "center" | "right";

  render?: (row: T) => ReactNode;
}

/* -------------------------------------------------------------------------- */
/*                                  Base Row                                  */
/* -------------------------------------------------------------------------- */

export interface ReportRow {
  id: string;
}

/* -------------------------------------------------------------------------- */
/*                               Sales Report                                 */
/* -------------------------------------------------------------------------- */

export interface SalesReportItem extends ReportRow {
  invoiceNo: string;
  customer: string;
  date: string;
  total: number;
  paymentStatus: "Paid" | "Pending";
}

/* -------------------------------------------------------------------------- */
/*                              Purchase Report                               */
/* -------------------------------------------------------------------------- */

export interface PurchaseReportItem extends ReportRow {
  purchaseNo: string;
  supplier: string;
  date: string;
  total: number;
  paymentStatus: "Paid" | "Pending";
}

/* -------------------------------------------------------------------------- */
/*                              Expense Report                                */
/* -------------------------------------------------------------------------- */

export interface ExpenseReportItem extends ReportRow {
  expenseNo: string;
  category: string;
  date: string;
  amount: number;
}

/* -------------------------------------------------------------------------- */
/*                                Stock Report                                */
/* -------------------------------------------------------------------------- */

/* -------------------------------------------------------------------------- */
/*                                Stock Report                                */
/* -------------------------------------------------------------------------- */

export interface StockReportItem extends ReportRow {
  productCode: string;
  productName: string;

  category: string;
  subCategory: string;

  stock: number;
  minimumStock: number;

  purchasePrice: number;
  sellingPrice: number;

  profit: number;
}

/* -------------------------------------------------------------------------- */
/*                              Customer Report                               */
/* -------------------------------------------------------------------------- */

export interface CustomerReportItem extends ReportRow {
  customerNo: string;

  name: string;

  mobile: string;

  totalInvoices: number;

  totalSales: number;

  totalDue: number;

  balance: number;
}

/* -------------------------------------------------------------------------- */
/*                              Supplier Report                               */
/* -------------------------------------------------------------------------- */

export interface SupplierReportItem extends ReportRow {
  supplierNo: string;
  name: string;
  mobile: string;
  totalPurchases: number;
  purchaseAmount: number;
  balance: number;
}

/* -------------------------------------------------------------------------- */
/*                               Profit Report                                */
/* -------------------------------------------------------------------------- */

export interface ProfitReportItem extends ReportRow {
  month: string;
  sales: number;
  purchases: number;
  expenses: number;
  profit: number;
}
