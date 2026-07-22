export function transformExcelRows(rows: Record<string, unknown>[]) {
  return rows.map((row) => ({
    ...row,

    purchasePrice: Number(row.purchasePrice ?? 0),

    sellingPrice: Number(row.sellingPrice ?? 0),

    stock: Number(row.stock ?? 0),

    minimumStock: Number(row.minimumStock ?? 0),

    tax: Number(row.tax ?? 0),

    isActive: String(row.isActive ?? "true").toLowerCase() === "true",
  }));
}
