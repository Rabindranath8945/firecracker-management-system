import {
  PdfService,
  type PdfBusinessContext,
  type PdfOptions,
} from "../../../common/pdf/index.js";

/* -------------------------------------------------------------------------- */
/* TYPES                                                                      */
/* -------------------------------------------------------------------------- */

interface PurchaseReportRow {
  purchaseNo: string;
  supplier: string;
  date: string;
  total: number;
}

interface PurchaseReportOptions {
  business: PdfBusinessContext;

  generatedBy: string;

  dateRange: string;

  rows: PurchaseReportRow[];
}

/* -------------------------------------------------------------------------- */
/* REPORT                                                                     */
/* -------------------------------------------------------------------------- */

export async function generatePurchaseReport({
  business,
  generatedBy,
  dateRange,
  rows,
}: PurchaseReportOptions): Promise<Buffer> {
  /* ------------------------------------------------------------------------ */
  /* TOTAL                                                                    */
  /* ------------------------------------------------------------------------ */

  const totalPurchase = rows.reduce(
    (sum, item) => sum + Number(item.total ?? 0),
    0,
  );

  /* ------------------------------------------------------------------------ */
  /* PDF OPTIONS                                                              */
  /* ------------------------------------------------------------------------ */

  const options: PdfOptions = {
    title: "Purchase Report",

    company: business,

    generatedBy,

    dateRange,

    /* ---------------------------------------------------------------------- */
    /* TABLE                                                                  */
    /* ---------------------------------------------------------------------- */

    columns: [
      {
        title: "Purchase No",
        key: "purchaseNo",
        width: 120,
      },

      {
        title: "Supplier",
        key: "supplier",
        width: 180,
      },

      {
        title: "Date",
        key: "date",
        width: 90,
      },

      {
        title: "Amount",
        key: "total",
        width: 100,
        align: "right",
      },
    ],

    rows: rows.map((item) => ({
      purchaseNo: item.purchaseNo,

      supplier: item.supplier,

      date: item.date,

      total: `Rs. ${Number(item.total ?? 0).toFixed(2)}`,
    })),

    /* ---------------------------------------------------------------------- */
    /* SUMMARY                                                                */
    /* ---------------------------------------------------------------------- */

    summary: [
      {
        label: "Purchase Amount",
        value: `Rs. ${totalPurchase.toFixed(2)}`,
        highlight: true,
      },
    ],
  };

  /* ------------------------------------------------------------------------ */
  /* GENERATE                                                                 */
  /* ------------------------------------------------------------------------ */

  return PdfService.generate(options);
}
