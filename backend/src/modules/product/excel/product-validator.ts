import { ProductExcelRow } from "../../../common/excel/types/excel-row.types.js";

export interface ProductImportError {
  row: number;
  field: string;
  message: string;
}

export function validateProductRows(
  rows: ProductExcelRow[],
): ProductImportError[] {
  const errors: ProductImportError[] = [];

  rows.forEach((row, index) => {
    if (!row.productCode) {
      errors.push({
        row: index + 2,
        field: "productCode",
        message: "Product Code is required.",
      });
    }

    if (!row.name) {
      errors.push({
        row: index + 2,
        field: "name",
        message: "Product Name is required.",
      });
    }

    if (row.purchasePrice < 0) {
      errors.push({
        row: index + 2,
        field: "purchasePrice",
        message: "Purchase Price cannot be negative.",
      });
    }

    if (row.sellingPrice < 0) {
      errors.push({
        row: index + 2,
        field: "sellingPrice",
        message: "Selling Price cannot be negative.",
      });
    }

    if (row.stock < 0) {
      errors.push({
        row: index + 2,
        field: "stock",
        message: "Stock cannot be negative.",
      });
    }

    if (row.minimumStock < 0) {
      errors.push({
        row: index + 2,
        field: "minimumStock",
        message: "Minimum Stock cannot be negative.",
      });
    }

    if (row.tax < 0) {
      errors.push({
        row: index + 2,
        field: "tax",
        message: "Tax cannot be negative.",
      });
    }
  });

  return errors;
}
