import { ExpenseExcelRow } from "../../../common/excel/types/expense-excel-row.types.js";

export function transformExpenseRows(
  rows: Record<string, unknown>[],
): ExpenseExcelRow[] {
  return rows.map((row) => ({
    expenseNo: String(row.expenseNo ?? "").trim(),

    title: String(row.title ?? "").trim(),

    category: String(row.category ?? "").trim(),

    amount: Number(row.amount ?? 0),

    paymentMethod: String(
      row.paymentMethod ?? "CASH",
    ).toUpperCase() as ExpenseExcelRow["paymentMethod"],

    expenseDate: new Date(String(row.expenseDate ?? new Date())),

    notes: row.notes ? String(row.notes).trim() : undefined,

    isActive:
      String(row.status ?? row.isActive ?? "Active").toLowerCase() === "active",
  }));
}
