import { Document, Types } from "mongoose";

export type StockTransactionType =
  | "PURCHASE"
  | "SALE"
  | "PURCHASE_RETURN"
  | "SALE_RETURN"
  | "ADJUSTMENT"
  | "OPENING";

export interface IStockTransaction extends Document {
  product: Types.ObjectId;

  referenceId?: Types.ObjectId;

  referenceNo?: string;

  type: StockTransactionType;

  quantity: number;

  previousStock: number;

  currentStock: number;

  notes?: string;

  createdBy: Types.ObjectId;

  createdAt: Date;

  updatedAt: Date;
}
