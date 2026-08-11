import { Document, Types } from "mongoose";

export interface IProduct extends Document {
  productCode: string;

  name: string;

  category?: Types.ObjectId;

  subCategory?: Types.ObjectId;

  barcode?: string;

  hsnCode?: string;

  brand?: string;

  unit: string;

  purchasePrice: number;

  sellingPrice: number;

  stock: number;

  minimumStock: number;

  tax: number;

  description?: string;

  image?: string;

  /* -------------------------------------------------------------------------- */
  /*                                   Status                                   */
  /* -------------------------------------------------------------------------- */

  isActive: boolean;

  isDeleted: boolean;

  deletedAt?: Date | null;

  deletedBy?: Types.ObjectId | null;

  /* -------------------------------------------------------------------------- */
  /*                                  Audit                                     */
  /* -------------------------------------------------------------------------- */

  createdBy: Types.ObjectId;

  updatedBy?: Types.ObjectId | null;

  createdAt: Date;

  updatedAt: Date;
}
