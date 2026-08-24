import { Schema, model } from "mongoose";
import { INotification } from "../interfaces/notification.interface.js";

const NotificationSchema = new Schema<INotification>(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    message: {
      type: String,
      required: true,
      trim: true,
    },

    type: {
      type: String,
      enum: ["LOW_STOCK", "BACKUP", "SECURITY", "PURCHASE", "SALES", "SYSTEM"],
      required: true,
    },

    read: {
      type: Boolean,
      default: false,
    },

    data: {
      type: Schema.Types.Mixed,
      default: {},
    },

    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    updatedBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
  },
  {
    timestamps: true,
  },
);

NotificationSchema.index({
  createdBy: 1,
  createdAt: -1,
});

NotificationSchema.index({
  createdBy: 1,
  read: 1,
});

export default model<INotification>("Notification", NotificationSchema);
