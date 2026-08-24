import { ExpenseExcelRow } from "../../../common/excel/types/expense-excel-row.types.js";
import { ExcelValidationError } from "../../../common/excel/services/excel.service.js";

export function validateExpenseRows(
  rows: ExpenseExcelRow[],
): ExcelValidationError[] {
  const errors: ExcelValidationError[] = [];

  rows.forEach((row, index) => {
    if (!row.expenseNo) {
      errors.push({
        row: index + 2,
        field: "expenseNo",
        message: "Expense No is required.",
      });
    }

    if (!row.title) {
      errors.push({
        row: index + 2,
        field: "title",
        message: "Title is required.",
      });
    }

    if (!row.category) {
      errors.push({
        row: index + 2,
        field: "category",
        message: "Category is required.",
      });
    }

    if (row.amount <= 0) {
      errors.push({
        row: index + 2,
        field: "amount",
        message: "Amount must be greater than zero.",
      });
    }

    if (!row.paymentMethod) {
      errors.push({
        row: index + 2,
        field: "paymentMethod",
        message: "Payment Method is required.",
      });
    }

    if (
      !(row.expenseDate instanceof Date) ||
      isNaN(row.expenseDate.getTime())
    ) {
      errors.push({
        row: index + 2,
        field: "expenseDate",
        message: "Invalid Expense Date.",
      });
    }
  });

  return errors;
}
