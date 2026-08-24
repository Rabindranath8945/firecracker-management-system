import { Types } from "mongoose";

export interface ISubCategory {
  _id?: Types.ObjectId;

  subCategoryCode: string;

  name: string;

  category: Types.ObjectId;

  description?: string;

  image?: string;

  isActive: boolean;

  createdBy: Types.ObjectId;

  updatedBy?: Types.ObjectId | null;

  /**
   * Virtual field populated from Product collection.
   */
  productCount?: number;

  createdAt?: Date;

  updatedAt?: Date;
}
