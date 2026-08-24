import ReportRepository from "../repositories/report.repository.js";
import Customer from "../../customer/models/customer.model.js";
import Sale from "../../sales/models/sales.model.js";
import Purchase from "../../purchase/models/purchase.model.js";
import Supplier from "../../supplier/models/supplier.model.js";
import { generateSalesReport } from "../pdf/sales-report.js";
import { generatePurchaseReport } from "../pdf/purchase-report.js";
import { generateCustomerReport } from "../pdf/customer-report.js";
import { generateSupplierReport } from "../pdf/supplier-report.js";
import { generateStockReport } from "../pdf/stock-report.js";
import { generateLowStockReport } from "../pdf/low-stock-report.js";
import { generateGSTReport } from "../pdf/gst-report.js";
import { generateProfitLossReport } from "../pdf/profit-loss-report.js";

/* ========================================================================== */
/* TYPES                                                                      */
/* ========================================================================== */

export interface ReportBusinessContext {
  name: string;
  businessId: string;
  ownerName?: string;
  logo?: string;
  address: string;
  phone: string;
  email?: string;
  website?: string;
  gstNo?: string;
}

export interface ReportGeneratedBy {
  userId?: string;
  name?: string;
}

/* ========================================================================== */
/* HELPERS                                                                    */
/* ========================================================================== */

/**
 * Format report date range consistently across all reports.
 */
function formatDateRange(from: Date, to: Date): string {
  return `${from.toLocaleDateString("en-IN")} - ${to.toLocaleDateString(
    "en-IN",
  )}`;
}

/**
 * Convert business context into the structure expected by PDF generators.
 *
 * Keeping this in one place prevents repeating:
 * business.name
 * business.businessId
 * business.address
 * etc.
 */
function getPdfBusinessContext(business: ReportBusinessContext) {
  return {
    name: business.name,

    businessId: business.businessId,

    address: business.address ?? "",

    phone: business.phone,

    email: business.email,

    gstNo: business.gstNo,

    logo: business.logo,

    website: business.website,
  };
}

/**
 * Generated-by name used inside PDF metadata/footer.
 */
function getGeneratedByName(generatedBy: ReportGeneratedBy): string {
  return generatedBy.name?.trim() || "System";
}

/* ========================================================================== */
/* SERVICE                                                                    */
/* ========================================================================== */

class ReportService {
  /* ======================================================================== */
  /* SALES DATA                                                               */
  /* ======================================================================== */

  async salesData(from: Date, to: Date) {
    const sales = await ReportRepository.getSalesReport(from, to);

    return {
      items: sales.map((sale) => ({
        id: String(sale._id),

        invoiceNo: sale.invoiceNo,

        customer:
          (sale.customer as { name?: string } | null)?.name ??
          "Walk-in Customer",

        date: sale.saleDate.toISOString(),

        paymentMethod: sale.payment.method,

        paymentStatus: sale.paymentStatus,

        total: Number(sale.grandTotal ?? 0),
      })),
    };
  }

  /* ======================================================================== */
  /* PURCHASE DATA                                                            */
  /* ======================================================================== */

  async purchaseData(from: Date, to: Date) {
    const purchases = await ReportRepository.getPurchaseReport(from, to);

    return {
      items: purchases.map((purchase) => ({
        id: String(purchase._id),

        purchaseNo: purchase.purchaseNo,

        invoiceNo: purchase.invoiceNo,

        supplier:
          (purchase.supplier as { name?: string } | null)?.name ??
          "Unknown Supplier",

        date: purchase.purchaseDate.toISOString(),

        paymentMethod: purchase.paymentMethod,

        paymentStatus: purchase.paymentStatus,

        total: Number(purchase.grandTotal ?? 0),
      })),
    };
  }

  /* ======================================================================== */
  /* EXPENSE DATA                                                             */
  /* ======================================================================== */

  /**
   * Expense module is not implemented yet.
   *
   * Do not expose/use this method until Expense Management is created.
   */

  /* ======================================================================== */
  /* CUSTOMER DATA                                                            */
  /* ======================================================================== */

  async customerData(from: Date, to: Date) {
    const customers = await Customer.find({
      isActive: true,
    }).lean();

    const sales = await Sale.find({
      saleDate: {
        $gte: from,
        $lte: to,
      },
      isActive: true,
    }).lean();

    return customers.map((customer) => {
      const customerSales = sales.filter(
        (sale) =>
          sale.customer && String(sale.customer) === String(customer._id),
      );

      const totalInvoices = customerSales.length;

      const totalSales = customerSales.reduce(
        (sum, sale) => sum + Number(sale.grandTotal ?? 0),
        0,
      );

      const totalDue = customerSales.reduce(
        (sum, sale) => sum + Number(sale.dueAmount ?? 0),
        0,
      );

      return {
        id: String(customer._id),

        // Customer model uses customerCode
        customerNo: customer.customerCode,

        name: customer.name,

        mobile: customer.mobile,

        totalInvoices,

        totalSales,

        totalDue,

        balance: Number(customer.openingBalance ?? 0) + totalDue,
      };
    });
  }

  /* ======================================================================== */
  /* SUPPLIER DATA                                                            */
  /* ======================================================================== */

  async supplierData(from: Date, to: Date) {
    const suppliers = await Supplier.find({
      isActive: true,
    }).lean();

    const purchases = await Purchase.find({
      purchaseDate: {
        $gte: from,
        $lte: to,
      },
      isActive: true,
    }).lean();

    return suppliers.map((supplier) => {
      const supplierPurchases = purchases.filter(
        (purchase) =>
          purchase.supplier &&
          String(purchase.supplier) === String(supplier._id),
      );

      const totalPurchases = supplierPurchases.length;

      const purchaseAmount = supplierPurchases.reduce(
        (sum: number, purchase) => sum + Number(purchase.grandTotal ?? 0),
        0,
      );

      const dueAmount = supplierPurchases.reduce(
        (sum: number, purchase) => sum + Number(purchase.dueAmount ?? 0),
        0,
      );

      const openingBalance = Number(supplier.openingBalance ?? 0);

      return {
        id: String(supplier._id),

        // IMPORTANT:
        // Database field = supplierCode
        // Report field = supplierNo
        supplierNo: supplier.supplierCode,

        name: supplier.name,

        mobile: supplier.mobile,

        totalPurchases,

        purchaseAmount,

        balance: openingBalance + dueAmount,
      };
    });
  }

  /* ======================================================================== */
  /* STOCK DATA                                                               */
  /* ======================================================================== */

  async stockData() {
    const products = await ReportRepository.getStockReport();

    return products.map((product) => {
      const purchasePrice = Number(product.purchasePrice ?? 0);
      const sellingPrice = Number(product.sellingPrice ?? 0);
      const stock = Number(product.stock ?? 0);

      const profit = sellingPrice - purchasePrice;

      return {
        id: product._id.toString(),

        productCode: product.productCode,

        productName: product.name,

        category:
          typeof product.category === "object" &&
          product.category !== null &&
          "name" in product.category
            ? String(product.category.name ?? "")
            : "",

        subCategory:
          typeof product.subCategory === "object" &&
          product.subCategory !== null &&
          "name" in product.subCategory
            ? String(product.subCategory.name ?? "")
            : "",

        stock,

        minimumStock: Number(product.minimumStock ?? 0),

        purchasePrice,

        sellingPrice,

        profit,
      };
    });
  }

  /* ======================================================================== */
  /* PROFIT DATA                                                              */
  /* ======================================================================== */

  async profitData(from: Date, to: Date) {
    return ReportRepository.getProfitLossReport(from, to);
  }

  /* ======================================================================== */
  /* SUMMARY                                                                  */
  /* ======================================================================== */

  async summary(from: Date, to: Date) {
    return ReportRepository.getSummary(from, to);
  }

  /* ======================================================================== */
  /* SALES PDF                                                                */
  /* ======================================================================== */

  async salesReport(
    from: Date,
    to: Date,
    business: ReportBusinessContext,
    generatedBy: ReportGeneratedBy,
  ) {
    const sales = await ReportRepository.getSalesReport(from, to);

    /*
     * Ensure newest sales appear first.
     */
    const sortedSales = [...sales].sort(
      (a, b) => b.saleDate.getTime() - a.saleDate.getTime(),
    );

    return generateSalesReport({
      business: getPdfBusinessContext(business),

      generatedBy: getGeneratedByName(generatedBy),

      dateRange: formatDateRange(from, to),

      rows: sortedSales.map((sale) => ({
        invoiceNo: sale.invoiceNo,

        customer:
          (sale.customer as { name?: string } | null)?.name ??
          "Walk-in Customer",

        date: sale.saleDate.toLocaleDateString("en-IN"),

        paymentMethod: sale.payment.method,

        total: Number(sale.grandTotal ?? 0),
      })),
    });
  }

  /* ======================================================================== */
  /* PURCHASE PDF                                                             */
  /* ======================================================================== */

  async purchaseReport(
    from: Date,
    to: Date,
    business: ReportBusinessContext,
    generatedBy: ReportGeneratedBy,
  ) {
    const purchases = await ReportRepository.getPurchaseReport(from, to);

    /*
     * Ensure newest purchases appear first.
     */
    const sortedPurchases = [...purchases].sort(
      (a, b) => b.purchaseDate.getTime() - a.purchaseDate.getTime(),
    );

    return generatePurchaseReport({
      business: getPdfBusinessContext(business),

      generatedBy: getGeneratedByName(generatedBy),

      dateRange: formatDateRange(from, to),

      rows: sortedPurchases.map((purchase) => ({
        purchaseNo: purchase.purchaseNo,

        supplier:
          (purchase.supplier as { name?: string } | null)?.name ??
          "Unknown Supplier",

        date: purchase.purchaseDate.toLocaleDateString("en-IN"),

        total: Number(purchase.grandTotal ?? 0),
      })),
    });
  }

  /* ======================================================================== */
  /* CUSTOMER PDF                                                             */
  /* ======================================================================== */

  async customerReport(
    from: Date,
    to: Date,
    business: ReportBusinessContext,
    generatedBy: ReportGeneratedBy,
  ) {
    const customers = await ReportRepository.getCustomerReport(from, to);

    return generateCustomerReport({
      business: getPdfBusinessContext(business),

      generatedBy: getGeneratedByName(generatedBy),

      dateRange: formatDateRange(from, to),

      rows: customers.map((customer) => ({
        name: customer.name,

        mobile: customer.mobile ?? "",

        totalInvoices: Number(customer.totalInvoices ?? 0),

        totalSales: Number(customer.totalSales ?? 0),

        totalDue: Number(customer.totalDue ?? 0),
      })),
    });
  }

  /* ======================================================================== */
  /* SUPPLIER PDF                                                             */
  /* ======================================================================== */

  async supplierReport(
    from: Date,
    to: Date,
    business: ReportBusinessContext,
    generatedBy: ReportGeneratedBy,
  ) {
    const suppliers = await ReportRepository.getSupplierReport(from, to);

    return generateSupplierReport({
      business: getPdfBusinessContext(business),

      generatedBy: getGeneratedByName(generatedBy),

      dateRange: formatDateRange(from, to),

      rows: suppliers.map((supplier) => ({
        name: supplier.name,

        mobile: supplier.mobile ?? "",

        totalPurchases: Number(supplier.totalPurchases ?? 0),

        purchaseAmount: Number(supplier.purchaseAmount ?? 0),
      })),
    });
  }

  /* ======================================================================== */
  /* STOCK PDF                                                                */
  /* ======================================================================== */

  async stockReport(
    business: ReportBusinessContext,
    generatedBy: ReportGeneratedBy,
  ) {
    const products = await ReportRepository.getStockReport();

    return generateStockReport({
      businessName: business.name,
      businessId: business.businessId,
      address: business.address ?? "",
      phone: business.phone,
      email: business.email,
      gstNo: business.gstNo,

      generatedBy: generatedBy.name ?? "Admin",

      rows: products.map((product) => ({
        productCode: product.productCode,
        productName: product.name,

        category:
          typeof product.category === "object" &&
          product.category !== null &&
          "name" in product.category
            ? String(product.category.name ?? "")
            : "",

        subCategory:
          typeof product.subCategory === "object" &&
          product.subCategory !== null &&
          "name" in product.subCategory
            ? String(product.subCategory.name ?? "")
            : "",

        stock: Number(product.stock ?? 0),

        purchasePrice: Number(product.purchasePrice ?? 0),

        sellingPrice: Number(product.sellingPrice ?? 0),

        profit:
          Number(product.sellingPrice ?? 0) -
          Number(product.purchasePrice ?? 0),
      })),
    });
  }

  /* ======================================================================== */
  /* LOW STOCK PDF                                                            */
  /* ======================================================================== */

  async lowStockReport(
    business: ReportBusinessContext,
    generatedBy: ReportGeneratedBy,
  ) {
    const products = await ReportRepository.getLowStockReport();

    return generateLowStockReport({
      business: getPdfBusinessContext(business),

      generatedBy: getGeneratedByName(generatedBy),

      dateRange: "Current",

      rows: products.map((product) => ({
        productCode: product.productCode,

        productName: product.name,

        category: (product.category as { name?: string } | null)?.name ?? "",

        stock: Number(product.stock ?? 0),

        minimumStock: Number(product.minimumStock ?? 0),
      })),
    });
  }

  /* ======================================================================== */
  /* GST PDF                                                                  */
  /* ======================================================================== */

  async gstReport(
    from: Date,
    to: Date,
    business: ReportBusinessContext,
    generatedBy: ReportGeneratedBy,
  ) {
    const gst = await ReportRepository.getGSTReport(from, to);

    return generateGSTReport({
      business: getPdfBusinessContext(business),

      generatedBy: getGeneratedByName(generatedBy),

      dateRange: formatDateRange(from, to),

      rows: gst.map((item) => ({
        taxRate: Number(item._id),

        taxableAmount: Number(item.taxableAmount ?? 0),

        gstAmount: Number(item.gstAmount ?? 0),
      })),
    });
  }

  /* ======================================================================== */
  /* PROFIT & LOSS PDF                                                        */
  /* ======================================================================== */

  async profitLossReport(
    from: Date,
    to: Date,
    business: ReportBusinessContext,
    generatedBy: ReportGeneratedBy,
  ) {
    const report = await ReportRepository.getProfitLossReport(from, to);

    const totals = report.reduce(
      (
        summary: {
          sales: number;
          purchase: number;
          expense: number;
          grossProfit: number;
          netProfit: number;
        },
        row,
      ) => {
        summary.sales += Number(row.sales ?? 0);

        summary.purchase += Number(row.purchases ?? 0);

        summary.expense += Number(row.expenses ?? 0);

        summary.grossProfit += Number(row.profit ?? 0);

        summary.netProfit += Number(row.profit ?? 0);

        return summary;
      },
      {
        sales: 0,
        purchase: 0,
        expense: 0,
        grossProfit: 0,
        netProfit: 0,
      },
    );

    return generateProfitLossReport({
      business: getPdfBusinessContext(business),

      generatedBy: getGeneratedByName(generatedBy),

      dateRange: formatDateRange(from, to),

      sales: Number(totals.sales.toFixed(2)),

      purchase: Number(totals.purchase.toFixed(2)),

      expense: Number(totals.expense.toFixed(2)),

      /*
       * Purchase cost is currently not separately returned
       * by the monthly profit report.
       */
      purchaseCost: 0,

      grossProfit: Number(totals.grossProfit.toFixed(2)),

      netProfit: Number(totals.netProfit.toFixed(2)),
    });
  }
}

/* ========================================================================== */
/* EXPORT                                                                     */
/* ========================================================================== */

export default new ReportService();
