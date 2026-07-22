export interface ValidationError {
  row: number;
  field: string;
  message: string;
}

export function validateProductRows(
  rows: Record<string, unknown>[],
): ValidationError[] {
  const errors: ValidationError[] = [];

  rows.forEach((row, index) => {
    const rowNumber = index + 2;

    if (!row.productCode) {
      errors.push({
        row: rowNumber,
        field: "Product Code",
        message: "Product Code is required.",
      });
    }

    if (!row.name) {
      errors.push({
        row: rowNumber,
        field: "Product Name",
        message: "Product Name is required.",
      });
    }

    if (Number(row.purchasePrice) < 0) {
      errors.push({
        row: rowNumber,
        field: "Purchase Price",
        message: "Purchase Price cannot be negative.",
      });
    }

    if (Number(row.sellingPrice) < 0) {
      errors.push({
        row: rowNumber,
        field: "Selling Price",
        message: "Selling Price cannot be negative.",
      });
    }

    if (Number(row.stock) < 0) {
      errors.push({
        row: rowNumber,
        field: "Stock",
        message: "Stock cannot be negative.",
      });
    }
  });

  return errors;
}
