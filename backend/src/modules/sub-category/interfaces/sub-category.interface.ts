import { Document, Types } from "mongoose";

export interface ISubCategory extends Document {
  subCategoryCode: string;

  name: string;

  category: Types.ObjectId;

  description?: string;

  image?: string;

  isActive: boolean;

  createdBy: Types.ObjectId;

  updatedBy?: Types.ObjectId;

  createdAt: Date;

  updatedAt: Date;
}
