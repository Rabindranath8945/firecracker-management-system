import { Document, Types } from "mongoose";
import { ISupplier } from "../../supplier/interfaces/supplier.interface.js";

/* -------------------------------------------------------------------------- */
/*                          Payment Types                                    */
/* -------------------------------------------------------------------------- */

export type PurchasePaymentMethod =
  | "CASH"
  | "BANK"
  | "UPI"
  | "CARD"
  | "CHEQUE"
  | "CREDIT";

export type PurchaseStatus = "PAID" | "PARTIAL" | "DUE";

/* -------------------------------------------------------------------------- */
/*                            Purchase Item                                   */
/* -------------------------------------------------------------------------- */

export interface IPurchaseItem {
  product: Types.ObjectId;

  quantity: number;

  purchasePrice: number;

  sellingPrice: number;

  discount: number;

  gstRate: number;

  tax: number;

  subtotal: number;

  total: number;
}

/* -------------------------------------------------------------------------- */
/*                              Purchase                                      */
/* -------------------------------------------------------------------------- */

export interface IPurchase extends Document {
  purchaseNo: string;

  supplier: Types.ObjectId | ISupplier;

  invoiceNo?: string;

  purchaseDate: Date;

  dueDate?: Date;

  items: IPurchaseItem[];

  subtotal: number;

  taxAmount: number;

  discount: number;

  transportCharge: number;

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
