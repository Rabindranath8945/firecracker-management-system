import ReportRepository from "../repositories/report.repository.js";

import { generateSalesReport } from "../pdf/sales-report.js";
import { generatePurchaseReport } from "../pdf/purchase-report.js";
import { generateExpenseReport } from "../pdf/expense-report.js";
import { generateCustomerReport } from "../pdf/customer-report.js";
import { generateSupplierReport } from "../pdf/supplier-report.js";
import { generateStockReport } from "../pdf/stock-report.js";
import { generateLowStockReport } from "../pdf/low-stock-report.js";
import { generateGSTReport } from "../pdf/gst-report.js";
import { generateProfitLossReport } from "../pdf/profit-loss-report.js";

class ReportService {
  async salesReport(
    from: Date,
    to: Date,
    generatedBy: string,
    businessName = "YOUR BUSINESS NAME",
  ) {
    const sales = await ReportRepository.getSalesReport(from, to);

    return generateSalesReport({
      businessName,

      generatedBy,

      dateRange: `${from.toLocaleDateString()} - ${to.toLocaleDateString()}`,

      rows: sales.map((sale) => ({
        invoiceNo: sale.invoiceNo,

        customer:
          (sale.customer as { name?: string } | null)?.name ??
          "Walk-in Customer",

        date: sale.saleDate.toLocaleDateString(),

        paymentMethod: sale.payment.method,

        total: sale.grandTotal,
      })),
    });
  }

  async purchaseReport(
    from: Date,
    to: Date,
    generatedBy: string,
    businessName = "YOUR BUSINESS NAME",
  ) {
    const purchases = await ReportRepository.getPurchaseReport(from, to);

    return generatePurchaseReport({
      businessName,

      generatedBy,

      dateRange: `${from.toLocaleDateString()} - ${to.toLocaleDateString()}`,

      rows: purchases.map((purchase) => ({
        purchaseNo: purchase.purchaseNo,

        supplier:
          (purchase.supplier as { name?: string } | null)?.name ?? "Unknown",

        date: purchase.purchaseDate.toLocaleDateString(),

        total: purchase.grandTotal,
      })),
    });
  }

  async expenseReport(
    from: Date,
    to: Date,
    generatedBy: string,
    businessName = "YOUR BUSINESS NAME",
  ) {
    const expenses = await ReportRepository.getExpenses(from, to);

    return generateExpenseReport({
      businessName,

      generatedBy,

      dateRange: `${from.toLocaleDateString()} - ${to.toLocaleDateString()}`,

      rows: expenses.map((expense) => ({
        expenseNo: expense.expenseNo,

        category: expense.category,

        date: expense.expenseDate.toLocaleDateString(),

        amount: expense.amount,
      })),
    });
  }

  async customerReport(
    from: Date,
    to: Date,
    generatedBy: string,
    businessName = "YOUR BUSINESS NAME",
  ) {
    const customers = await ReportRepository.getCustomerReport(from, to);

    return generateCustomerReport({
      businessName,

      generatedBy,

      dateRange: `${from.toLocaleDateString()} - ${to.toLocaleDateString()}`,

      rows: customers.map((customer) => ({
        name: customer.name,

        mobile: customer.mobile ?? "",

        totalInvoices: customer.totalInvoices,

        totalSales: customer.totalSales,

        totalDue: customer.totalDue,
      })),
    });
  }

  async supplierReport(
    from: Date,
    to: Date,
    generatedBy: string,
    businessName = "YOUR BUSINESS NAME",
  ) {
    const suppliers = await ReportRepository.getSupplierReport(from, to);

    return generateSupplierReport({
      businessName,

      generatedBy,

      dateRange: `${from.toLocaleDateString()} - ${to.toLocaleDateString()}`,

      rows: suppliers.map((supplier) => ({
        name: supplier.name,

        mobile: supplier.mobile ?? "",

        totalPurchases: supplier.totalPurchases,

        purchaseAmount: supplier.purchaseAmount,
      })),
    });
  }

  async stockReport(generatedBy: string, businessName = "YOUR BUSINESS NAME") {
    const products = await ReportRepository.getStockReport();

    return generateStockReport({
      businessName,

      generatedBy,

      rows: products.map((product) => ({
        productCode: product.productCode,

        productName: product.name,

        category: (product.category as { name?: string } | null)?.name ?? "",

        stock: product.stock,

        value: product.stock * product.purchasePrice,
      })),
    });
  }

  async lowStockReport(
    generatedBy: string,
    businessName = "YOUR BUSINESS NAME",
  ) {
    const products = await ReportRepository.getLowStockReport();

    return generateLowStockReport({
      businessName,

      generatedBy,

      dateRange: "Current",

      rows: products.map((product) => ({
        productCode: product.productCode,

        productName: product.name,

        category: (product.category as { name?: string } | null)?.name ?? "",

        stock: product.stock,

        minimumStock: product.minimumStock,
      })),
    });
  }

  async gstReport(
    from: Date,
    to: Date,
    generatedBy: string,
    businessName = "YOUR BUSINESS NAME",
  ) {
    const gst = await ReportRepository.getGSTReport(from, to);

    return generateGSTReport({
      businessName,

      generatedBy,

      dateRange: `${from.toLocaleDateString()} - ${to.toLocaleDateString()}`,

      rows: gst.map((item) => ({
        taxRate: item._id,

        taxableAmount: item.taxableAmount,

        gstAmount: item.gstAmount,
      })),
    });
  }

  async profitLossReport(
    from: Date,
    to: Date,
    generatedBy: string,
    businessName = "YOUR BUSINESS NAME",
  ) {
    const report = await ReportRepository.getProfitLossReport(from, to);

    return generateProfitLossReport({
      businessName,

      generatedBy,

      dateRange: `${from.toLocaleDateString()} - ${to.toLocaleDateString()}`,

      ...report,
    });
  }

  async summary(from: Date, to: Date) {
    return ReportRepository.getSummary(from, to);
  }
}

export default new ReportService();
