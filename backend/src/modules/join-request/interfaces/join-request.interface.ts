import { Document, Types } from "mongoose";

export interface IJoinRequest extends Document {
  business: Types.ObjectId;

  user: Types.ObjectId;

  role: string;

  status: string;

  createdAt: Date;

  updatedAt: Date;
}
