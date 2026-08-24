import api from "@/lib/api";

/* ==========================================================================
 * SHARED TYPES
 * ========================================================================== */

export interface ReportOverview {
  sales: number;
  purchases: number;
  expenses: number;
  customers: number;
  suppliers: number;
  products: number;
}

interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

/* ==========================================================================
 * SALES
 * ========================================================================== */

export interface SalesReportResponse {
  id: string;
  invoiceNo: string;
  customer: string;
  date: string;
  paymentMethod: string;
  paymentStatus: string;
  total: number;
}

interface SalesReportData {
  items: SalesReportResponse[];
}

/* ==========================================================================
 * PURCHASE
 * ========================================================================== */

export interface PurchaseReportResponse {
  id: string;
  purchaseNo: string;
  supplier: string;
  date: string;
  paymentMethod?: string;
  paymentStatus: string;
  total: number;
}

interface PurchaseReportData {
  items: PurchaseReportResponse[];
}

/* ==========================================================================
 * STOCK
 * ========================================================================== */

export interface StockReportResponse {
  id: string;

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

interface StockReportData {
  items: StockReportResponse[];
}

/* ==========================================================================
 * CUSTOMER
 * ========================================================================== */

export interface CustomerReportResponse {
  id: string;
  customerNo: string;
  name: string;
  mobile: string;
  totalInvoices: number;
  totalSales: number;
  totalDue: number;
  balance: number;
}

interface CustomerReportApiResponse {
  success: boolean;
  message: string;
  data: CustomerReportResponse[];
}

interface CustomerReportData {
  items: CustomerReportResponse[];
}

/* ==========================================================================
 * SUPPLIER
 * ========================================================================== */

export interface SupplierReportResponse {
  id: string;
  supplierNo: string;
  name: string;
  mobile: string;
  totalPurchases: number;
  purchaseAmount: number;
  balance: number;
}

interface SupplierReportApiResponse {
  success: boolean;
  message: string;
  data: SupplierReportResponse[];
}

/* ==========================================================================
 * EXPENSE
 * ========================================================================== */

export interface ExpenseReportResponse {
  id: string;
  expenseNo: string;
  category: string;
  date: string;
  amount: number;
}

interface ExpenseReportData {
  items: ExpenseReportResponse[];
}

/* ==========================================================================
 * PROFIT & LOSS
 * ========================================================================== */

export interface ProfitReportResponse {
  id: string;
  month: string;
  sales: number;
  purchases: number;
  expenses: number;
  profit: number;
}

interface ProfitReportApiResponse {
  success: boolean;
  message: string;
  data:
    | ProfitReportResponse[]
    | {
        items?: ProfitReportResponse[];
      };
}

/* ==========================================================================
 * SERVICE
 * ========================================================================== */

class ReportService {
  /* ------------------------------------------------------------------------
   * OVERVIEW
   * ---------------------------------------------------------------------- */

  async getOverview(from?: string, to?: string): Promise<ReportOverview> {
    const response = await api.get<ApiResponse<ReportOverview>>(
      "/reports/overview",
      {
        params: {
          ...(from ? { from } : {}),
          ...(to ? { to } : {}),
        },
      },
    );

    return response.data.data;
  }

  /* ------------------------------------------------------------------------
   * SALES
   * ---------------------------------------------------------------------- */

  async getSalesReport(
    from?: string,
    to?: string,
  ): Promise<SalesReportResponse[]> {
    const response = await api.get<ApiResponse<SalesReportData>>(
      "/reports/sales",
      {
        params: {
          ...(from ? { from } : {}),
          ...(to ? { to } : {}),
        },
      },
    );

    return response.data.data.items.map((item, index) => ({
      ...item,
      id: item.id || item.invoiceNo || `sale-${index}`,
    }));
  }

  /* ------------------------------------------------------------------------
   * PURCHASE
   * ---------------------------------------------------------------------- */

  async getPurchaseReport(
    from?: string,
    to?: string,
  ): Promise<PurchaseReportResponse[]> {
    const response = await api.get<ApiResponse<PurchaseReportData>>(
      "/reports/purchase",
      {
        params: {
          ...(from ? { from } : {}),
          ...(to ? { to } : {}),
        },
      },
    );

    return response.data.data.items.map((item, index) => ({
      ...item,
      id: item.id || item.purchaseNo || `purchase-${index}`,
    }));
  }

  /* ------------------------------------------------------------------------
   * STOCK
   * ---------------------------------------------------------------------- */

  async getStockReport(): Promise<StockReportResponse[]> {
    const response =
      await api.get<ApiResponse<StockReportResponse[]>>("/reports/stock");

    const items = response.data.data;

    if (!Array.isArray(items)) {
      return [];
    }

    return items.map((item, index) => ({
      ...item,
      id: item.id || item.productCode || `stock-${index}`,
    }));
  }

  /* ------------------------------------------------------------------------
   * CUSTOMER
   * ---------------------------------------------------------------------- */

  async getCustomerReport(
    from?: string,
    to?: string,
  ): Promise<CustomerReportResponse[]> {
    const response = await api.get<CustomerReportApiResponse>(
      "/reports/customer",
      {
        params: {
          ...(from ? { from } : {}),
          ...(to ? { to } : {}),
        },
      },
    );

    const data = response.data.data;

    if (!Array.isArray(data)) {
      console.error("Invalid customer report response:", response.data);

      return [];
    }

    return data.map((item, index) => ({
      id: item.id || `customer-${index}`,

      customerNo: item.customerNo ?? "",

      name: item.name ?? "",

      mobile: item.mobile ?? "",

      totalInvoices: Number(item.totalInvoices ?? 0),

      totalSales: Number(item.totalSales ?? 0),

      totalDue: Number(item.totalDue ?? 0),

      balance: Number(item.balance ?? 0),
    }));
  }

  /* ------------------------------------------------------------------------
   * SUPPLIER
   * ---------------------------------------------------------------------- */

  async getSupplierReport(
    from?: string,
    to?: string,
  ): Promise<SupplierReportResponse[]> {
    const response = await api.get<SupplierReportApiResponse>(
      "/reports/supplier",
      {
        params: {
          ...(from ? { from } : {}),
          ...(to ? { to } : {}),
        },
      },
    );

    const data = response.data.data;

    if (!Array.isArray(data)) {
      console.error("Invalid supplier report response:", response.data);

      return [];
    }

    return data.map((item, index) => ({
      id: item.id || `supplier-${index}`,

      supplierNo: item.supplierNo ?? "",

      name: item.name ?? "",

      mobile: item.mobile ?? "",

      totalPurchases: Number(item.totalPurchases ?? 0),

      purchaseAmount: Number(item.purchaseAmount ?? 0),

      balance: Number(item.balance ?? 0),
    }));
  }

  /* ------------------------------------------------------------------------
   * EXPENSE
   *
   * Expense module is currently unavailable in the application.
   * Keep this method ready for when the backend expense module is created.
   * ---------------------------------------------------------------------- */

  async getExpenseReport(
    from?: string,
    to?: string,
  ): Promise<ExpenseReportResponse[]> {
    const response = await api.get<ApiResponse<ExpenseReportData>>(
      "/reports/expense",
      {
        params: {
          ...(from ? { from } : {}),
          ...(to ? { to } : {}),
        },
      },
    );

    return response.data.data.items.map((item, index) => ({
      ...item,
      id: item.id || item.expenseNo || `expense-${index}`,
    }));
  }

  /* ------------------------------------------------------------------------
   * PROFIT & LOSS
   * ---------------------------------------------------------------------- */

  async getProfitReport(
    from?: string,
    to?: string,
  ): Promise<ProfitReportResponse[]> {
    const response = await api.get<ProfitReportApiResponse>("/reports/profit", {
      params: {
        ...(from ? { from } : {}),
        ...(to ? { to } : {}),
      },
    });

    const rawData = response.data.data;

    /*
     * Support both possible backend response formats:
     *
     * 1. data: [...]
     * 2. data: { items: [...] }
     */

    const rows = Array.isArray(rawData)
      ? rawData
      : Array.isArray(rawData.items)
        ? rawData.items
        : [];

    return rows.map((item, index) => ({
      id: item.id || `profit-${index}`,

      month: String(item.month ?? ""),

      sales: Number(item.sales ?? 0),

      purchases: Number(item.purchases ?? 0),

      expenses: Number(item.expenses ?? 0),

      profit: Number(item.profit ?? 0),
    }));
  }

  /* ==========================================================================
   * PDF
   * ========================================================================== */

  /**
   * Fetch a PDF from backend.
   *
   * IMPORTANT:
   * `api` already contains `/api/v1` in its baseURL.
   *
   * Therefore endpoints MUST be:
   *
   * /reports/sales/pdf
   * /reports/purchase/pdf
   *
   * NOT:
   *
   * /api/v1/reports/sales/pdf
   */

  private async getPdf(
    endpoint: string,
    from?: string,
    to?: string,
  ): Promise<Blob> {
    const response = await api.get<Blob>(endpoint, {
      params: {
        ...(from ? { from } : {}),
        ...(to ? { to } : {}),
      },
      responseType: "blob",
    });

    return response.data;
  }

  /**
   * Download an already fetched PDF blob.
   */
  private downloadBlob(blob: Blob, filename: string): void {
    const url = window.URL.createObjectURL(blob);

    try {
      const link = document.createElement("a");

      link.href = url;
      link.download = filename;

      document.body.appendChild(link);

      link.click();

      link.remove();
    } finally {
      window.URL.revokeObjectURL(url);
    }
  }

  /* ------------------------------------------------------------------------
   * SALES PDF
   * ---------------------------------------------------------------------- */

  async exportSalesPdf(from?: string, to?: string): Promise<Blob> {
    return this.getPdf("/reports/sales/pdf", from, to);
  }

  /* ------------------------------------------------------------------------
   * PURCHASE PDF
   * ---------------------------------------------------------------------- */

  async exportPurchasePdf(from?: string, to?: string): Promise<Blob> {
    return this.getPdf("/reports/purchase/pdf", from, to);
  }

  /* ------------------------------------------------------------------------
   * EXPENSE PDF
   * ---------------------------------------------------------------------- */

  async exportExpensePdf(from?: string, to?: string): Promise<Blob> {
    return this.getPdf("/reports/expense/pdf", from, to);
  }

  /* ------------------------------------------------------------------------
   * CUSTOMER PDF
   * ---------------------------------------------------------------------- */

  async exportCustomerPdf(from?: string, to?: string): Promise<Blob> {
    return this.getPdf("/reports/customer/pdf", from, to);
  }

  /* ------------------------------------------------------------------------
   * SUPPLIER PDF
   * ---------------------------------------------------------------------- */

  async exportSupplierPdf(from?: string, to?: string): Promise<Blob> {
    return this.getPdf("/reports/supplier/pdf", from, to);
  }

  /* ------------------------------------------------------------------------
   * STOCK PDF
   * ---------------------------------------------------------------------- */

  async exportStockPdf(): Promise<Blob> {
    const response = await api.get<Blob>("/reports/stock/pdf", {
      responseType: "blob",
    });

    return response.data;
  }

  /* ------------------------------------------------------------------------
   * LOW STOCK PDF
   * ---------------------------------------------------------------------- */

  async exportLowStockPdf(): Promise<Blob> {
    return this.getPdf("/reports/low-stock/pdf");
  }

  /* ------------------------------------------------------------------------
   * GST PDF
   * ---------------------------------------------------------------------- */

  async exportGstPdf(from?: string, to?: string): Promise<Blob> {
    return this.getPdf("/reports/gst/pdf", from, to);
  }

  /* ------------------------------------------------------------------------
   * PROFIT & LOSS PDF
   * ---------------------------------------------------------------------- */

  async exportProfitLossPdf(from?: string, to?: string): Promise<Blob> {
    return this.getPdf("/reports/profit-loss/pdf", from, to);
  }

  /* ==========================================================================
   * DIRECT DOWNLOAD HELPERS
   *
   * Optional convenience methods if you want the service itself to download
   * the PDF instead of returning Blob to the page.
   * ========================================================================== */

  async downloadSalesPdf(from?: string, to?: string): Promise<void> {
    const blob = await this.exportSalesPdf(from, to);

    this.downloadBlob(blob, "sales-report.pdf");
  }

  async downloadPurchasePdf(from?: string, to?: string): Promise<void> {
    const blob = await this.exportPurchasePdf(from, to);

    this.downloadBlob(blob, "purchase-report.pdf");
  }

  async downloadCustomerPdf(from?: string, to?: string): Promise<void> {
    const blob = await this.exportCustomerPdf(from, to);

    this.downloadBlob(blob, "customer-report.pdf");
  }

  async downloadSupplierPdf(from?: string, to?: string): Promise<void> {
    const blob = await this.exportSupplierPdf(from, to);

    this.downloadBlob(blob, "supplier-report.pdf");
  }

  async downloadStockPdf(): Promise<void> {
    const blob = await this.exportStockPdf();

    this.downloadBlob(blob, "stock-report.pdf");
  }

  async downloadLowStockPdf(): Promise<void> {
    const blob = await this.exportLowStockPdf();

    this.downloadBlob(blob, "low-stock-report.pdf");
  }

  async downloadGstPdf(from?: string, to?: string): Promise<void> {
    const blob = await this.exportGstPdf(from, to);

    this.downloadBlob(blob, "gst-report.pdf");
  }

  async downloadProfitLossPdf(from?: string, to?: string): Promise<void> {
    const blob = await this.exportProfitLossPdf(from, to);

    this.downloadBlob(blob, "profit-loss-report.pdf");
  }
}

export const reportService = new ReportService();
