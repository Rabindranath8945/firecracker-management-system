import { Document, Types } from "mongoose";

export type ExpensePaymentMethod = "CASH" | "BANK" | "UPI" | "CARD" | "CHEQUE";

export interface IExpense extends Document {
  expenseNo: string;

  title: string;

  category: string;

  amount: number;

  paymentMethod: ExpensePaymentMethod;

  expenseDate: Date;

  notes?: string;

  isActive: boolean;

  createdBy: Types.ObjectId;

  updatedBy?: Types.ObjectId;

  createdAt: Date;

  updatedAt: Date;
}
