import {
  BadgeIndianRupee,
  CircleCheckBig,
  Clock3,
  FileText,
  Package,
  ReceiptText,
  TrendingUp,
  Truck,
  Users,
} from "lucide-react";

import type {
  CustomerReportItem,
  ExpenseReportItem,
  ProfitReportItem,
  PurchaseReportItem,
  ReportSummary,
  SalesReportItem,
  StockReportItem,
  SupplierReportItem,
} from "../types/report";

/* -------------------------------------------------------------------------- */
/*                                  Mock Data                                 */
/* -------------------------------------------------------------------------- */

const salesData: SalesReportItem[] = [
  {
    id: "sale-1",
    invoiceNo: "INV-1001",
    customer: "Rahul Sharma",
    date: "2026-07-15",
    total: 12500,
    paymentStatus: "Paid",
  },
  {
    id: "sale-2",
    invoiceNo: "INV-1002",
    customer: "Amit Das",
    date: "2026-07-16",
    total: 8400,
    paymentStatus: "Pending",
  },
];

const purchaseData: PurchaseReportItem[] = [
  {
    id: "purchase-1",
    purchaseNo: "PUR-1001",
    supplier: "ABC Traders",
    date: "2026-07-14",
    total: 18000,
    paymentStatus: "Paid",
  },
  {
    id: "purchase-2",
    purchaseNo: "PUR-1002",
    supplier: "XYZ Agencies",
    date: "2026-07-16",
    total: 9200,
    paymentStatus: "Pending",
  },
];

const expenseData: ExpenseReportItem[] = [
  {
    id: "expense-1",
    expenseNo: "EXP-1001",
    category: "Electricity",
    date: "2026-07-12",
    amount: 2400,
  },
  {
    id: "expense-2",
    expenseNo: "EXP-1002",
    category: "Transport",
    date: "2026-07-16",
    amount: 1100,
  },
];

const stockData: StockReportItem[] = [
  {
    id: "stock-1",
    productName: "Sky Shot",
    category: "Fireworks",
    stock: 120,
    unit: "Box",
  },
  {
    id: "stock-2",
    productName: "Flower Pot",
    category: "Fireworks",
    stock: 45,
    unit: "Box",
  },
];

const customerData: CustomerReportItem[] = [
  {
    id: "customer-1",
    customerNo: "CUS-1001",
    name: "Rahul Sharma",
    mobile: "9876543210",
    balance: 1200,
  },
  {
    id: "customer-2",
    customerNo: "CUS-1002",
    name: "Amit Das",
    mobile: "9123456780",
    balance: 0,
  },
];

const supplierData: SupplierReportItem[] = [
  {
    id: "supplier-1",
    supplierNo: "SUP-1001",
    name: "ABC Traders",
    mobile: "9988776655",
    balance: 4500,
  },
  {
    id: "supplier-2",
    supplierNo: "SUP-1002",
    name: "XYZ Agencies",
    mobile: "9876501234",
    balance: 0,
  },
];

const profitData: ProfitReportItem[] = [
  {
    id: "profit-1",
    month: "July",
    sales: 250000,
    purchases: 160000,
    expenses: 25000,
    profit: 65000,
  },
];

/* -------------------------------------------------------------------------- */
/*                                  Helpers                                   */
/* -------------------------------------------------------------------------- */

type SummaryItem = {
  total?: number;
  amount?: number;
  balance?: number;
};

/* -------------------------------------------------------------------------- */
/*                                 Service                                    */
/* -------------------------------------------------------------------------- */

export const reportService = {
  getSalesReport(): SalesReportItem[] {
    return salesData;
  },

  getPurchaseReport(): PurchaseReportItem[] {
    return purchaseData;
  },

  getExpenseReport(): ExpenseReportItem[] {
    return expenseData;
  },

  getStockReport(): StockReportItem[] {
    return stockData;
  },

  getCustomerReport(): CustomerReportItem[] {
    return customerData;
  },

  getSupplierReport(): SupplierReportItem[] {
    return supplierData;
  },

  getProfitReport(): ProfitReportItem[] {
    return profitData;
  },

  getSalesSummary(): ReportSummary[] {
    return [
      {
        label: "Total Sales",
        value: 20900,
        formattedValue: "₹20,900",
        icon: BadgeIndianRupee,
        color: "emerald",
        trend: "+12% Today",
      },
      {
        label: "Invoices",
        value: salesData.length,
        formattedValue: salesData.length.toString(),
        icon: ReceiptText,
        color: "blue",
        trend: "Today's invoices",
      },
      {
        label: "Paid",
        value: 12500,
        formattedValue: "₹12,500",
        icon: CircleCheckBig,
        color: "green",
        trend: "1 Invoice",
      },
      {
        label: "Pending",
        value: 8400,
        formattedValue: "₹8,400",
        icon: Clock3,
        color: "amber",
        trend: "1 Invoice",
      },
    ];
  },

  getPurchaseSummary(): ReportSummary[] {
    return [
      {
        label: "Total Purchase",
        value: 27200,
        formattedValue: "₹27,200",
        icon: BadgeIndianRupee,
        color: "blue",
        trend: "This month",
      },
      {
        label: "Orders",
        value: purchaseData.length,
        formattedValue: purchaseData.length.toString(),
        icon: ReceiptText,
        color: "purple",
        trend: "Purchase orders",
      },
      {
        label: "Paid",
        value: 18000,
        formattedValue: "₹18,000",
        icon: CircleCheckBig,
        color: "green",
        trend: "Paid suppliers",
      },
      {
        label: "Pending",
        value: 9200,
        formattedValue: "₹9,200",
        icon: Clock3,
        color: "amber",
        trend: "Outstanding",
      },
    ];
  },

  getExpenseSummary(): ReportSummary[] {
    return [
      {
        label: "Total Expense",
        value: 3500,
        formattedValue: "₹3,500",
        icon: BadgeIndianRupee,
        color: "orange",
        trend: "This month",
      },
      {
        label: "Entries",
        value: expenseData.length,
        formattedValue: expenseData.length.toString(),
        icon: FileText,
        color: "blue",
        trend: "Expense entries",
      },
    ];
  },

  getStockSummary(): ReportSummary[] {
    return [
      {
        label: "Products",
        value: stockData.length,
        formattedValue: stockData.length.toString(),
        icon: Package,
        color: "purple",
        trend: "Available products",
      },
      {
        label: "Stock Qty",
        value: 165,
        formattedValue: "165",
        icon: Package,
        color: "emerald",
        trend: "Units in stock",
      },
    ];
  },

  getCustomerSummary(): ReportSummary[] {
    return [
      {
        label: "Customers",
        value: customerData.length,
        formattedValue: customerData.length.toString(),
        icon: Users,
        color: "cyan",
        trend: "Registered",
      },
      {
        label: "Outstanding",
        value: 1200,
        formattedValue: "₹1,200",
        icon: BadgeIndianRupee,
        color: "amber",
        trend: "Receivable",
      },
    ];
  },

  getSupplierSummary(): ReportSummary[] {
    return [
      {
        label: "Suppliers",
        value: supplierData.length,
        formattedValue: supplierData.length.toString(),
        icon: Truck,
        color: "blue",
        trend: "Active suppliers",
      },
      {
        label: "Payable",
        value: 4500,
        formattedValue: "₹4,500",
        icon: BadgeIndianRupee,
        color: "orange",
        trend: "Outstanding",
      },
    ];
  },

  getProfitSummary(): ReportSummary[] {
    return [
      {
        label: "Net Profit",
        value: 65000,
        formattedValue: "₹65,000",
        icon: TrendingUp,
        color: "emerald",
        trend: "This month",
      },
      {
        label: "Sales",
        value: 250000,
        formattedValue: "₹2,50,000",
        icon: BadgeIndianRupee,
        color: "blue",
        trend: "Revenue",
      },
    ];
  },
};
