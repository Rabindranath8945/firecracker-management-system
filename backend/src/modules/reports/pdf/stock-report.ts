import { PdfService, type PdfOptions } from "../../../common/pdf/index.js";

/* -------------------------------------------------------------------------- */
/* TYPES                                                                      */
/* -------------------------------------------------------------------------- */

interface StockReportRow {
  productCode: string;
  productName: string;
  category: string;
  subCategory: string;
  stock: number;
  purchasePrice: number;
  sellingPrice: number;
  profit: number;
}

interface StockReportOptions {
  businessName: string;
  businessId: string;
  address?: string;
  phone?: string;
  email?: string;
  gstNo?: string;

  generatedBy: string;

  rows: StockReportRow[];
}

/* -------------------------------------------------------------------------- */
/* HELPERS                                                                    */
/* -------------------------------------------------------------------------- */

function formatMoney(value: number): string {
  const amount = Number(value);

  if (!Number.isFinite(amount)) {
    return "₹0.00";
  }

  return `₹${amount.toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

function formatNumber(value: number): string {
  const amount = Number(value);

  if (!Number.isFinite(amount)) {
    return "0";
  }

  return amount.toLocaleString("en-IN");
}

/* -------------------------------------------------------------------------- */
/* GENERATOR                                                                  */
/* -------------------------------------------------------------------------- */

export async function generateStockReport({
  businessName,
  businessId,
  address,
  phone,
  email,
  gstNo,
  generatedBy,
  rows,
}: StockReportOptions): Promise<Buffer> {
  const safeRows = rows.map((item) => ({
    productCode: String(item.productCode ?? "-"),
    productName: String(item.productName ?? "-"),
    category: String(item.category ?? "-"),
    subCategory: String(item.subCategory ?? "-"),

    stock: Number.isFinite(Number(item.stock)) ? Number(item.stock) : 0,

    purchasePrice: Number.isFinite(Number(item.purchasePrice))
      ? Number(item.purchasePrice)
      : 0,

    sellingPrice: Number.isFinite(Number(item.sellingPrice))
      ? Number(item.sellingPrice)
      : 0,

    profit: Number.isFinite(Number(item.profit)) ? Number(item.profit) : 0,
  }));

  /* ------------------------------------------------------------------------ */
  /* SUMMARY                                                                  */
  /* ------------------------------------------------------------------------ */

  const totalProducts = safeRows.length;

  const totalStock = safeRows.reduce((sum, item) => sum + item.stock, 0);

  const purchaseValue = safeRows.reduce(
    (sum, item) => sum + item.stock * item.purchasePrice,
    0,
  );

  const sellingValue = safeRows.reduce(
    (sum, item) => sum + item.stock * item.sellingPrice,
    0,
  );

  const potentialProfit = safeRows.reduce(
    (sum, item) => sum + item.stock * item.profit,
    0,
  );

  /* ------------------------------------------------------------------------ */
  /* PDF OPTIONS                                                              */
  /* ------------------------------------------------------------------------ */

  const options: PdfOptions = {
    title: "Stock Report",

    company: {
      name: businessName,
      businessId,
      address: address ?? "",
      phone: phone ?? "",
      email,
      gstNo,
    },

    generatedBy,

    dateRange: "Current Stock",

    /* ---------------------------------------------------------------------- */
    /* IMPORTANT: LANDSCAPE                                                   */
    /* ---------------------------------------------------------------------- */

    orientation: "landscape",

    /* ---------------------------------------------------------------------- */
    /* TABLE                                                                   */
    /* ---------------------------------------------------------------------- */

    columns: [
      {
        title: "Code",
        key: "productCode",
        width: 65,
      },

      {
        title: "Product",
        key: "productName",
        width: 125,
      },

      {
        title: "Category",
        key: "category",
        width: 95,
      },

      {
        title: "Sub Category",
        key: "subCategory",
        width: 115,
      },

      {
        title: "Stock",
        key: "stock",
        width: 55,
        align: "right",
      },

      {
        title: "Purchase",
        key: "purchasePrice",
        width: 85,
        align: "right",
      },

      {
        title: "Selling",
        key: "sellingPrice",
        width: 85,
        align: "right",
      },

      {
        title: "Profit",
        key: "profit",
        width: 85,
        align: "right",
      },
    ],

    rows: safeRows.map((item) => ({
      productCode: item.productCode,

      productName: item.productName,

      category: item.category,

      subCategory: item.subCategory,

      stock: formatNumber(item.stock),

      purchasePrice: formatMoney(item.purchasePrice),

      sellingPrice: formatMoney(item.sellingPrice),

      profit: formatMoney(item.profit),
    })),

    /* ---------------------------------------------------------------------- */
    /* SUMMARY                                                                 */
    /* ---------------------------------------------------------------------- */

    summary: [
      {
        label: "Generated By",
        value: generatedBy,
      },

      {
        label: "Products",
        value: formatNumber(totalProducts),
      },

      {
        label: "Total Stock",
        value: formatNumber(totalStock),
      },

      {
        label: "Purchase Value",
        value: formatMoney(purchaseValue),
      },

      {
        label: "Selling Value",
        value: formatMoney(sellingValue),
      },

      {
        label: "Potential Profit",
        value: formatMoney(potentialProfit),
        highlight: true,
      },
    ],
  };

  return PdfService.generate(options);
}
