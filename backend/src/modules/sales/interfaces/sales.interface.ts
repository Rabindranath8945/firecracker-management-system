import { Document, Types } from "mongoose";
import { ICustomer } from "../../customer/interfaces/customer.interface.js";

export type SalesPaymentMethod =
  | "CASH"
  | "UPI"
  | "CARD"
  | "BANK"
  | "CREDIT"
  | "MIXED";

export type SalesPaymentStatus = "PAID" | "PARTIAL" | "DUE";

export interface ISaleItem {
  product: Types.ObjectId;

  productCode: string;

  productName: string;

  barcode?: string;

  hsnCode?: string;

  brand?: string;

  category?: Types.ObjectId;

  subCategory?: Types.ObjectId;

  unit: string;

  purchasePrice: number;

  sellingPrice: number;

  quantity: number;

  discount: number;

  productTax: number;

  tax: number;

  total: number;

  profit: number;
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

  businessId: Types.ObjectId;

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
