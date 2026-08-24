import {
  PdfService,
  type PdfBusinessContext,
  type PdfOptions,
} from "../../../common/pdf/index.js";

/* -------------------------------------------------------------------------- */
/* TYPES                                                                      */
/* -------------------------------------------------------------------------- */

interface CustomerReportRow {
  name: string;

  mobile: string;

  totalInvoices: number;

  totalSales: number;

  totalDue: number;
}

interface CustomerReportOptions {
  business: PdfBusinessContext;

  generatedBy: string;

  dateRange: string;

  rows: CustomerReportRow[];
}

/* -------------------------------------------------------------------------- */
/* REPORT                                                                     */
/* -------------------------------------------------------------------------- */

export async function generateCustomerReport({
  business,
  generatedBy,
  dateRange,
  rows,
}: CustomerReportOptions): Promise<Buffer> {
  const totalSales = rows.reduce(
    (sum, item) => sum + Number(item.totalSales ?? 0),
    0,
  );

  const totalDue = rows.reduce(
    (sum, item) => sum + Number(item.totalDue ?? 0),
    0,
  );

  const options: PdfOptions = {
    title: "Customer Report",

    company: business,

    generatedBy,

    dateRange,

    columns: [
      {
        title: "Customer",
        key: "name",
        width: 160,
      },

      {
        title: "Mobile",
        key: "mobile",
        width: 120,
      },

      {
        title: "Invoices",
        key: "totalInvoices",
        width: 70,
        align: "right",
      },

      {
        title: "Sales",
        key: "totalSales",
        width: 90,
        align: "right",
      },

      {
        title: "Due",
        key: "totalDue",
        width: 90,
        align: "right",
      },
    ],

    rows: rows.map((item) => ({
      name: item.name,

      mobile: item.mobile,

      totalInvoices: Number(item.totalInvoices ?? 0),

      totalSales: `Rs. ${Number(item.totalSales ?? 0).toFixed(2)}`,

      totalDue: `Rs. ${Number(item.totalDue ?? 0).toFixed(2)}`,
    })),

    summary: [
      {
        label: "Customers",
        value: rows.length,
      },

      {
        label: "Total Sales",
        value: `Rs. ${totalSales.toFixed(2)}`,
        highlight: true,
      },

      {
        label: "Outstanding Due",
        value: `Rs. ${totalDue.toFixed(2)}`,
        highlight: true,
      },
    ],
  };

  return PdfService.generate(options);
}
