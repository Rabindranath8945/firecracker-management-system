import { Document, Types } from "mongoose";

export interface ICategory extends Document {
  categoryCode: string;

  name: string;

  description?: string;

  image?: string;

  isActive: boolean;

  createdBy: Types.ObjectId;

  updatedBy?: Types.ObjectId;

  createdAt: Date;

  updatedAt: Date;
}
