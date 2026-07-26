import { CustomerExcelRow } from "../../../common/excel/types/customer-excel-row.types.js";
import { ExcelValidationError } from "../../../common/excel/services/excel.service.js";

export function validateCustomerRows(
  rows: CustomerExcelRow[],
): ExcelValidationError[] {
  const errors: ExcelValidationError[] = [];

  rows.forEach((row, index) => {
    if (!row.customerCode) {
      errors.push({
        row: index + 2,
        field: "customerCode",
        message: "Customer Code is required.",
      });
    }

    if (!row.name) {
      errors.push({
        row: index + 2,
        field: "name",
        message: "Customer Name is required.",
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
