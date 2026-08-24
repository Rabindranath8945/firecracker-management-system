import { Document, Types } from "mongoose";

import type {
  SupplierPaymentMethod,
  SupplierPaymentType,
} from "../constants/supplier-payment.constants.js";

export interface ISupplierPayment extends Document {
  supplier: Types.ObjectId;

  amount: number;

  paymentMethod: SupplierPaymentMethod;

  paymentType: SupplierPaymentType;

  paymentDate: Date;

  referencePurchase?: Types.ObjectId;

  notes?: string;

  isActive: boolean;

  createdBy: Types.ObjectId;

  updatedBy?: Types.ObjectId;

  createdAt: Date;

  updatedAt: Date;
}
