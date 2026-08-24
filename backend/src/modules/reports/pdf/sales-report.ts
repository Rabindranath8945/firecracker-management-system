import {
  PdfService,
  type PdfBusinessContext,
  type PdfOptions,
} from "../../../common/pdf/index.js";

/* -------------------------------------------------------------------------- */
/* TYPES                                                                      */
/* -------------------------------------------------------------------------- */

interface SalesReportRow {
  invoiceNo: string;
  customer: string;
  date: string;
  paymentMethod: string;
  total: number;
}

interface SalesReportOptions {
  business: PdfBusinessContext;

  generatedBy: string;

  dateRange: string;

  rows: SalesReportRow[];
}

/* -------------------------------------------------------------------------- */
/* REPORT                                                                     */
/* -------------------------------------------------------------------------- */

export async function generateSalesReport({
  business,
  generatedBy,
  dateRange,
  rows,
}: SalesReportOptions): Promise<Buffer> {
  /* ------------------------------------------------------------------------ */
  /* TOTALS                                                                   */
  /* ------------------------------------------------------------------------ */

  const totalSales = rows.reduce(
    (sum, item) => sum + Number(item.total ?? 0),
    0,
  );

  const cashSales = rows
    .filter((item) => item.paymentMethod.trim().toUpperCase() === "CASH")
    .reduce((sum, item) => sum + Number(item.total ?? 0), 0);

  const upiSales = rows
    .filter((item) => item.paymentMethod.trim().toUpperCase() === "UPI")
    .reduce((sum, item) => sum + Number(item.total ?? 0), 0);

  const creditSales = rows
    .filter((item) => item.paymentMethod.trim().toUpperCase() === "CREDIT")
    .reduce((sum, item) => sum + Number(item.total ?? 0), 0);

  /* ------------------------------------------------------------------------ */
  /* PDF OPTIONS                                                              */
  /* ------------------------------------------------------------------------ */

  const options: PdfOptions = {
    title: "Sales Report",

    company: business,

    generatedBy,

    dateRange,

    /* ---------------------------------------------------------------------- */
    /* TABLE                                                                  */
    /* ---------------------------------------------------------------------- */

    columns: [
      {
        title: "Invoice",
        key: "invoiceNo",
        width: 82,
      },

      {
        title: "Customer",
        key: "customer",
        width: 150,
      },

      {
        title: "Date",
        key: "date",
        width: 82,
      },

      {
        title: "Payment",
        key: "paymentMethod",
        width: 85,
      },

      {
        title: "Amount",
        key: "total",
        width: 116,
        align: "right",
      },
    ],

    rows: rows.map((item) => ({
      invoiceNo: item.invoiceNo,

      customer: item.customer,

      date: item.date,

      paymentMethod: item.paymentMethod,

      total: `Rs. ${Number(item.total ?? 0).toFixed(2)}`,
    })),

    /* ---------------------------------------------------------------------- */
    /* SUMMARY                                                                */
    /* ---------------------------------------------------------------------- */

    summary: [
      {
        label: "Total Sales",
        value: `Rs. ${totalSales.toFixed(2)}`,
        highlight: true,
      },

      {
        label: "Cash Sales",
        value: `Rs. ${cashSales.toFixed(2)}`,
      },

      {
        label: "UPI Sales",
        value: `Rs. ${upiSales.toFixed(2)}`,
      },

      {
        label: "Credit Sales",
        value: `Rs. ${creditSales.toFixed(2)}`,
      },
    ],
  };

  /* ------------------------------------------------------------------------ */
  /* GENERATE                                                                 */
  /* ------------------------------------------------------------------------ */

  return PdfService.generate(options);
}
