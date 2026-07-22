import { Document, Types } from "mongoose";

export interface IProduct extends Document {
  productCode: string;

  name: string;

  category?: Types.ObjectId;

  subCategory?: Types.ObjectId;

  barcode?: string;

  unit: string;

  purchasePrice: number;

  sellingPrice: number;

  stock: number;

  minimumStock: number;

  tax: number;

  description?: string;

  image?: string;

  isActive: boolean;

  createdBy: Types.ObjectId;

  updatedBy?: Types.ObjectId;

  createdAt: Date;

  updatedAt: Date;
}
