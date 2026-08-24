import { Document, Types } from "mongoose";

export interface ICustomer extends Document {
  customerCode: string;

  name: string;

  mobile: string;

  alternateMobile?: string;

  email?: string;

  gstNo?: string;

  address?: string;

  city?: string;

  state?: string;

  pinCode?: string;

  openingBalance: number;

  creditLimit: number;

  notes?: string;

  isActive: boolean;

  createdBy: Types.ObjectId;

  updatedBy?: Types.ObjectId;

  createdAt: Date;

  updatedAt: Date;
}
