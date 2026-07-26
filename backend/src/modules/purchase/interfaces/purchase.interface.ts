import { Document, Types } from "mongoose";
import { ISupplier } from "../../supplier/interfaces/supplier.interface.js";

export type PurchasePaymentMethod =
  | "CASH"
  | "BANK"
  | "UPI"
  | "CARD"
  | "CHEQUE"
  | "CREDIT";

export type PurchaseStatus = "PAID" | "PARTIAL" | "UNPAID";

export interface IPurchaseItem {
  product: Types.ObjectId;

  quantity: number;

  purchasePrice: number;

  tax: number;

  total: number;
}

export interface IPurchase extends Document {
  purchaseNo: string;

  supplier: Types.ObjectId | ISupplier;

  invoiceNo?: string;

  purchaseDate: Date;

  items: IPurchaseItem[];

  subtotal: number;

  taxAmount: number;

  discount: number;

  grandTotal: number;

  paidAmount: number;

  dueAmount: number;

  paymentMethod: PurchasePaymentMethod;

  paymentStatus: PurchaseStatus;

  notes?: string;

  isActive: boolean;

  createdBy: Types.ObjectId;

  updatedBy?: Types.ObjectId;

  createdAt: Date;

  updatedAt: Date;
}
