import { ProductExcelRow } from "../../../common/excel/types/excel-row.types.js";

export function transformProductRows(
  rows: Record<string, unknown>[],
): ProductExcelRow[] {
  return rows.map((row) => ({
    ...row,

    purchasePrice: Number(row.purchasePrice ?? 0),

    sellingPrice: Number(row.sellingPrice ?? 0),

    stock: Number(row.stock ?? 0),

    minimumStock: Number(row.minimumStock ?? 0),

    tax: Number(row.tax ?? 0),

    isActive:
      String(row.status ?? row.isActive ?? "Active").toLowerCase() === "active",
  })) as ProductExcelRow[];
}
