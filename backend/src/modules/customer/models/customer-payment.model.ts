import { Schema, model } from "mongoose";

const customerPaymentSchema = new Schema(
  {
    customer: {
      type: Schema.Types.ObjectId,
      ref: "Customer",
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
      enum: ["CASH", "UPI"],
      required: true,
    },

    type: {
      type: String,
      enum: ["DUE_COLLECTION"],
      required: true,
      default: "DUE_COLLECTION",
    },

    referenceSale: {
      type: Schema.Types.ObjectId,
      ref: "Sale",
      default: null,
    },

    referenceInvoice: {
      type: String,
      trim: true,
      default: "",
    },

    notes: {
      type: String,
      trim: true,
      default: "",
    },

    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

customerPaymentSchema.index({
  customer: 1,
  createdAt: -1,
});

customerPaymentSchema.index({
  referenceSale: 1,
});

export default model("CustomerPayment", customerPaymentSchema);
