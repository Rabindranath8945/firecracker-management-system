import { Document, Types } from "mongoose";
import { ICustomer } from "../../customer/interfaces/customer.interface.js";

export type SalesPaymentMethod =
  | "CASH"
  | "UPI"
  | "CARD"
  | "BANK"
  | "CREDIT"
  | "MIXED";

export type SalesPaymentStatus = "PAID" | "PARTIAL" | "UNPAID";

export interface ISaleItem {
  product: Types.ObjectId;

  // Product Snapshot
  productCode: string;

  productName: string;

  barcode?: string;

  hsnCode?: string;

  brand?: string;

  category?: Types.ObjectId;

  subCategory?: Types.ObjectId;

  unit: string;

  // Pricing Snapshot
  purchasePrice: number;

  sellingPrice: number;

  quantity: number;

  discount: number;

  // Tax Snapshot
  productTax: number;

  tax: number;

  total: number;
}

export interface ISalePayment {
  method: SalesPaymentMethod;

  cash: number;

  upi: number;

  card: number;

  bank: number;

  credit: number;
}

export interface ISale extends Document {
  saleNo: string;

  invoiceNo: string;

  customer?: Types.ObjectId | ICustomer;

  saleDate: Date;

  items: ISaleItem[];

  subtotal: number;

  discount: number;

  taxAmount: number;

  grandTotal: number;

  paidAmount: number;

  dueAmount: number;

  payment: ISalePayment;

  paymentStatus: SalesPaymentStatus;

  notes?: string;

  isActive: boolean;

  createdBy: Types.ObjectId;

  updatedBy?: Types.ObjectId;

  createdAt: Date;

  updatedAt: Date;
}
