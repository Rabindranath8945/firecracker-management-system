import {
  PdfService,
  type PdfBusinessContext,
  type PdfOptions,
} from "../../../common/pdf/index.js";

/* -------------------------------------------------------------------------- */
/* TYPES                                                                      */
/* -------------------------------------------------------------------------- */

interface SupplierReportRow {
  name: string;

  mobile: string;

  totalPurchases: number;

  purchaseAmount: number;
}

interface SupplierReportOptions {
  business: PdfBusinessContext;

  generatedBy: string;

  dateRange: string;

  rows: SupplierReportRow[];
}

/* -------------------------------------------------------------------------- */
/* REPORT                                                                     */
/* -------------------------------------------------------------------------- */

export async function generateSupplierReport({
  business,
  generatedBy,
  dateRange,
  rows,
}: SupplierReportOptions): Promise<Buffer> {
  const purchaseAmount = rows.reduce(
    (sum, item) => sum + Number(item.purchaseAmount ?? 0),
    0,
  );

  const options: PdfOptions = {
    title: "Supplier Report",

    company: business,

    generatedBy,

    dateRange,

    columns: [
      {
        title: "Supplier",
        key: "name",
        width: 180,
      },

      {
        title: "Mobile",
        key: "mobile",
        width: 120,
      },

      {
        title: "Purchases",
        key: "totalPurchases",
        width: 90,
        align: "right",
      },

      {
        title: "Amount",
        key: "purchaseAmount",
        width: 100,
        align: "right",
      },
    ],

    rows: rows.map((item) => ({
      name: item.name,

      mobile: item.mobile,

      totalPurchases: Number(item.totalPurchases ?? 0),

      purchaseAmount: `Rs. ${Number(item.purchaseAmount ?? 0).toFixed(2)}`,
    })),

    summary: [
      {
        label: "Suppliers",
        value: rows.length,
      },

      {
        label: "Purchase Amount",
        value: `Rs. ${purchaseAmount.toFixed(2)}`,
        highlight: true,
      },
    ],
  };

  return PdfService.generate(options);
}
