import { Document, Types } from "mongoose";

export interface IBusiness extends Document {
  businessId: string;

  name: string;

  type: string;

  owner: Types.ObjectId;

  logo?: string;

  phone?: string;

  email?: string;

  address?: string;

  status: string;

  isActive: boolean;

  createdBy?: Types.ObjectId;

  updatedBy?: Types.ObjectId;

  createdAt: Date;

  updatedAt: Date;
}
