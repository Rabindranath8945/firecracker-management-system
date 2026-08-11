import { Schema, model } from "mongoose";

import { ISale } from "../interfaces/sales.interface.js";
import {
  SALES_PAYMENT_METHODS,
  SALES_PAYMENT_STATUS,
} from "../constants/sales.constants.js";

const saleItemSchema = new Schema(
  {
    product: {
      type: Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },

    productCode: {
      type: String,
      required: true,
      trim: true,
    },

    productName: {
      type: String,
      required: true,
      trim: true,
    },

    unit: {
      type: String,
      required: true,
      trim: true,
    },

    category: {
      type: Schema.Types.ObjectId,
      ref: "Category",
    },

    categoryName: {
      type: String,
      default: "",
      trim: true,
    },

    hsnCode: {
      type: String,
      default: "",
      trim: true,
    },
    barcode: {
      type: String,
      default: "",
      trim: true,
    },

    brand: {
      type: String,
      default: "",
      trim: true,
    },

    productTax: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },

    purchasePrice: {
      type: Number,
      required: true,
      min: 0,
    },

    sellingPrice: {
      type: Number,
      required: true,
      min: 0,
    },

    quantity: {
      type: Number,
      required: true,
      min: 1,
    },

    discount: {
      type: Number,
      default: 0,
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

    profit: {
      type: Number,
      required: true,
      default: 0,
      min: 0,
    },
  },
  {
    _id: false,
  },
);
const paymentSchema = new Schema(
  {
    method: {
      type: String,
      enum: SALES_PAYMENT_METHODS,
      required: true,
    },

    cash: {
      type: Number,
      default: 0,
    },

    upi: {
      type: Number,
      default: 0,
    },

    card: {
      type: Number,
      default: 0,
    },

    bank: {
      type: Number,
      default: 0,
    },

    credit: {
      type: Number,
      default: 0,
    },
  },
  {
    _id: false,
  },
);

const salesSchema = new Schema<ISale>(
  {
    saleNo: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      uppercase: true,
    },

    invoiceNo: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      uppercase: true,
    },

    customer: {
      type: Schema.Types.ObjectId,
      ref: "Customer",
    },

    saleDate: {
      type: Date,
      required: true,
    },

    items: {
      type: [saleItemSchema],
      required: true,
      validate: {
        validator(items: unknown[]) {
          return items.length > 0;
        },
        message: "Sale must contain at least one item.",
      },
    },

    subtotal: {
      type: Number,
      required: true,
    },

    discount: {
      type: Number,
      default: 0,
    },

    taxAmount: {
      type: Number,
      default: 0,
    },

    grandTotal: {
      type: Number,
      required: true,
    },

    paidAmount: {
      type: Number,
      default: 0,
    },

    dueAmount: {
      type: Number,
      default: 0,
    },

    payment: {
      type: paymentSchema,
      required: true,
    },

    paymentStatus: {
      type: String,
      enum: SALES_PAYMENT_STATUS,
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

salesSchema.index({ customer: 1 });

salesSchema.index({ saleDate: -1 });

salesSchema.index({ paymentStatus: 1 });

salesSchema.index({ createdAt: -1 });

salesSchema.index({ isActive: 1 });

export default model<ISale>("Sale", salesSchema);
