import {
  PdfService,
  type PdfBusinessContext,
  type PdfOptions,
} from "../../../common/pdf/index.js";

/* -------------------------------------------------------------------------- */
/* TYPES                                                                      */
/* -------------------------------------------------------------------------- */

interface LowStockReportRow {
  productCode: string;

  productName: string;

  category: string;

  stock: number;

  minimumStock: number;
}

interface LowStockReportOptions {
  business: PdfBusinessContext;

  generatedBy: string;

  dateRange: string;

  rows: LowStockReportRow[];
}

/* -------------------------------------------------------------------------- */
/* REPORT                                                                     */
/* -------------------------------------------------------------------------- */

export async function generateLowStockReport({
  business,
  generatedBy,
  dateRange,
  rows,
}: LowStockReportOptions): Promise<Buffer> {
  const options: PdfOptions = {
    title: "Low Stock Report",

    company: business,

    generatedBy,

    dateRange,

    columns: [
      {
        title: "Code",
        key: "productCode",
        width: 90,
      },

      {
        title: "Product",
        key: "productName",
        width: 180,
      },

      {
        title: "Category",
        key: "category",
        width: 120,
      },

      {
        title: "Stock",
        key: "stock",
        width: 70,
        align: "right",
      },

      {
        title: "Minimum",
        key: "minimumStock",
        width: 80,
        align: "right",
      },
    ],

    rows: rows.map((item) => ({
      productCode: item.productCode,

      productName: item.productName,

      category: item.category,

      stock: Number(item.stock ?? 0),

      minimumStock: Number(item.minimumStock ?? 0),
    })),

    summary: [
      {
        label: "Low Stock Items",
        value: rows.length,
        highlight: true,
      },
    ],
  };

  return PdfService.generate(options);
}
