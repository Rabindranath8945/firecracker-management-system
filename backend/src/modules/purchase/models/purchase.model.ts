import { Schema, model } from "mongoose";

import { IPurchase } from "../interfaces/purchase.interface.js";
import {
  PURCHASE_PAYMENT_METHODS,
  PURCHASE_PAYMENT_STATUS,
} from "../constants/purchase.constants.js";

const purchaseItemSchema = new Schema(
  {
    product: {
      type: Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },

    quantity: {
      type: Number,
      required: true,
      min: 1,
    },

    purchasePrice: {
      type: Number,
      required: true,
      min: 0,
    },

    tax: {
      type: Number,
      default: 0,
      min: 0,
    },

    total: {
      type: Number,
      required: true,
      min: 0,
    },
  },
  {
    _id: false,
  },
);

const purchaseSchema = new Schema<IPurchase>(
  {
    purchaseNo: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      uppercase: true,
    },

    supplier: {
      type: Schema.Types.ObjectId,
      ref: "Supplier",
      required: true,
    },

    invoiceNo: {
      type: String,
      trim: true,
    },

    purchaseDate: {
      type: Date,
      required: true,
    },

    items: {
      type: [purchaseItemSchema],
      required: true,
      validate: {
        validator(items: unknown[]) {
          return items.length > 0;
        },
        message: "Purchase must contain at least one item.",
      },
    },

    subtotal: {
      type: Number,
      required: true,
      min: 0,
    },

    taxAmount: {
      type: Number,
      default: 0,
      min: 0,
    },

    discount: {
      type: Number,
      default: 0,
      min: 0,
    },

    grandTotal: {
      type: Number,
      required: true,
      min: 0,
    },

    paidAmount: {
      type: Number,
      default: 0,
      min: 0,
    },

    dueAmount: {
      type: Number,
      default: 0,
      min: 0,
    },

    paymentMethod: {
      type: String,
      enum: PURCHASE_PAYMENT_METHODS,
      default: "CASH",
    },

    paymentStatus: {
      type: String,
      enum: PURCHASE_PAYMENT_STATUS,
      default: "PAID",
    },

    notes: {
      type: String,
      trim: true,
      default: "",
    },

    isActive: {
      type: Boolean,
      default: true,
    },

    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    updatedBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

purchaseSchema.index({
  supplier: 1,
});

purchaseSchema.index({
  purchaseDate: -1,
});

purchaseSchema.index({
  createdAt: -1,
});

purchaseSchema.index({
  isActive: 1,
});

export default model<IPurchase>("Purchase", purchaseSchema);
