import { Types } from "mongoose";

export type CustomerPaymentMethod = "CASH" | "UPI";

export type CustomerPaymentType = "DUE_COLLECTION";

export interface ICustomerPayment {
  customer: Types.ObjectId;

  amount: number;

  paymentMethod: CustomerPaymentMethod;

  type: CustomerPaymentType;

  referenceSale?: Types.ObjectId | null;

  referenceInvoice?: string;

  notes?: string;

  createdBy: Types.ObjectId;

  createdAt?: Date;

  updatedAt?: Date;
}
