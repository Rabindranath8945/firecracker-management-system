export type ExpensePaymentMethod = "CASH" | "UPI" | "BANK" | "CARD" | "CHEQUE";

export type ExpenseStatus = "PAID" | "PENDING" | "CANCELLED";

export interface Expense {
  id: string;

  expenseNo: string;

  date: string;

  title: string;

  description?: string;

  amount: number;

  paymentMethod: ExpensePaymentMethod;

  status: ExpenseStatus;

  isActive: boolean;
}
