export interface ExpenseExcelRow {
  expenseNo: string;

  title: string;

  category: string;

  amount: number;

  paymentMethod: "CASH" | "BANK" | "UPI" | "CARD" | "CHEQUE";

  expenseDate: Date;

  notes?: string;

  isActive: boolean;
}
