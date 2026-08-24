import { Document, Types } from "mongoose";

export type NotificationType =
  | "LOW_STOCK"
  | "BACKUP"
  | "SECURITY"
  | "PURCHASE"
  | "SALES"
  | "SYSTEM";

export interface INotification extends Document {
  title: string;

  message: string;

  type: NotificationType;

  read: boolean;

  data?: Record<string, unknown>;

  createdBy: Types.ObjectId;

  updatedBy?: Types.ObjectId | null;

  createdAt: Date;

  updatedAt: Date;
}
