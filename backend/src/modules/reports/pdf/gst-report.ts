import {
  PdfService,
  type PdfBusinessContext,
  type PdfOptions,
} from "../../../common/pdf/index.js";

/* -------------------------------------------------------------------------- */
/* TYPES                                                                      */
/* -------------------------------------------------------------------------- */

interface GSTReportRow {
  taxRate: number;

  taxableAmount: number;

  gstAmount: number;
}

interface GSTReportOptions {
  business: PdfBusinessContext;

  generatedBy: string;

  dateRange: string;

  rows: GSTReportRow[];
}

/* -------------------------------------------------------------------------- */
/* REPORT                                                                     */
/* -------------------------------------------------------------------------- */

export async function generateGSTReport({
  business,
  generatedBy,
  dateRange,
  rows,
}: GSTReportOptions): Promise<Buffer> {
  const taxable = rows.reduce(
    (sum, item) => sum + Number(item.taxableAmount ?? 0),
    0,
  );

  const gst = rows.reduce((sum, item) => sum + Number(item.gstAmount ?? 0), 0);

  const options: PdfOptions = {
    title: "GST Report",

    company: business,

    generatedBy,

    dateRange,

    columns: [
      {
        title: "GST %",
        key: "taxRate",
        width: 100,
      },

      {
        title: "Taxable Amount",
        key: "taxableAmount",
        width: 180,
        align: "right",
      },

      {
        title: "GST Amount",
        key: "gstAmount",
        width: 180,
        align: "right",
      },
    ],

    rows: rows.map((item) => ({
      taxRate: `${Number(item.taxRate ?? 0)}%`,

      taxableAmount: `Rs. ${Number(item.taxableAmount ?? 0).toFixed(2)}`,

      gstAmount: `Rs. ${Number(item.gstAmount ?? 0).toFixed(2)}`,
    })),

    summary: [
      {
        label: "Taxable Amount",
        value: `Rs. ${taxable.toFixed(2)}`,
      },

      {
        label: "GST Amount",
        value: `Rs. ${gst.toFixed(2)}`,
        highlight: true,
      },
    ],
  };

  return PdfService.generate(options);
}
