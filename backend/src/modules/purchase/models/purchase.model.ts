import { Schema, model } from "mongoose";

import { IPurchase } from "../interfaces/purchase.interface.js";

import {
  PURCHASE_PAYMENT_METHODS,
  PURCHASE_PAYMENT_STATUS,
} from "../constants/purchase.constants.js";

/* -------------------------------------------------------------------------- */
/*                              Purchase Item                                 */
/* -------------------------------------------------------------------------- */

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

    sellingPrice: {
      type: Number,
      required: true,
      min: 0,
    },

    discount: {
      type: Number,
      default: 0,
      min: 0,
    },

    gstRate: {
      type: Number,
      default: 0,
      min: 0,
    },

    /*
     * Calculated GST/tax amount for this item.
     */
    tax: {
      type: Number,
      default: 0,
      min: 0,
    },

    /*
     * Quantity × purchase price
     * before item GST and after item discount.
     */
    subtotal: {
      type: Number,
      required: true,
      min: 0,
    },

    /*
     * Final item amount.
     */
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

/* -------------------------------------------------------------------------- */
/*                              Purchase                                      */
/* -------------------------------------------------------------------------- */

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
      required: true,
      unique: true,
      trim: true,
      uppercase: true,
    },

    purchaseDate: {
      type: Date,
      required: true,
    },

    dueDate: {
      type: Date,
    },

    /* ---------------------------------------------------------------------- */
    /* Items                                                                  */
    /* ---------------------------------------------------------------------- */

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

    /* ---------------------------------------------------------------------- */
    /* Amounts                                                                */
    /* ---------------------------------------------------------------------- */

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

    transportCharge: {
      type: Number,
      default: 0,
      min: 0,
    },

    grandTotal: {
      type: Number,
      required: true,
      min: 0,
    },

    /* ---------------------------------------------------------------------- */
    /* Payment                                                                */
    /* ---------------------------------------------------------------------- */

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

    /* ---------------------------------------------------------------------- */
    /* Other                                                                  */
    /* ---------------------------------------------------------------------- */

    notes: {
      type: String,
      trim: true,
      default: "",
    },

    isActive: {
      type: Boolean,
      default: true,
    },

    /* ---------------------------------------------------------------------- */
    /* Audit                                                                  */
    /* ---------------------------------------------------------------------- */

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

/* -------------------------------------------------------------------------- */
/*                                  Indexes                                   */
/* -------------------------------------------------------------------------- */

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

purchaseSchema.index({
  paymentStatus: 1,
});

export default model<IPurchase>("Purchase", purchaseSchema);
