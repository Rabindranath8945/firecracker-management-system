import { Schema, model } from "mongoose";

import { ISupplierPayment } from "../interfaces/supplier-payment.interface.js";

import {
  SUPPLIER_PAYMENT_METHODS,
  SUPPLIER_PAYMENT_TYPES,
} from "../constants/supplier-payment.constants.js";

/* -------------------------------------------------------------------------- */
/*                          Supplier Payment                                  */
/* -------------------------------------------------------------------------- */

const supplierPaymentSchema = new Schema<ISupplierPayment>(
  {
    supplier: {
      type: Schema.Types.ObjectId,
      ref: "Supplier",
      required: true,
      index: true,
    },

    amount: {
      type: Number,
      required: true,
      min: 0.01,
    },

    paymentMethod: {
      type: String,
      enum: SUPPLIER_PAYMENT_METHODS,
      required: true,
    },

    paymentType: {
      type: String,
      enum: SUPPLIER_PAYMENT_TYPES,
      required: true,
    },

    paymentDate: {
      type: Date,
      required: true,
    },

    referencePurchase: {
      type: Schema.Types.ObjectId,
      ref: "Purchase",
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

/* -------------------------------------------------------------------------- */
/*                                  Indexes                                   */
/* -------------------------------------------------------------------------- */

supplierPaymentSchema.index({
  supplier: 1,
  paymentDate: -1,
});

supplierPaymentSchema.index({
  referencePurchase: 1,
});

supplierPaymentSchema.index({
  isActive: 1,
});

export default model<ISupplierPayment>(
  "SupplierPayment",
  supplierPaymentSchema,
);
