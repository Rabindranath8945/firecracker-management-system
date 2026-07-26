import { SupplierExcelRow } from "../../../common/excel/types/supplier-excel-row.types.js";
import { ExcelValidationError } from "../../../common/excel/services/excel.service.js";

export function validateSupplierRows(
  rows: SupplierExcelRow[],
): ExcelValidationError[] {
  const errors: ExcelValidationError[] = [];

  rows.forEach((row, index) => {
    if (!row.supplierCode) {
      errors.push({
        row: index + 2,
        field: "supplierCode",
        message: "Supplier Code is required.",
      });
    }

    if (!row.name) {
      errors.push({
        row: index + 2,
        field: "name",
        message: "Supplier Name is required.",
      });
    }

    if (!row.mobile) {
      errors.push({
        row: index + 2,
        field: "mobile",
        message: "Mobile is required.",
      });
    }

    if (row.openingBalance < 0) {
      errors.push({
        row: index + 2,
        field: "openingBalance",
        message: "Opening Balance cannot be negative.",
      });
    }
  });

  return errors;
}
