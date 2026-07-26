import { Schema, model } from "mongoose";

import { IStockTransaction } from "../interfaces/stock-transaction.interface.js";

import { STOCK_TRANSACTION_TYPES } from "../constants/stock-transaction.constants.js";

const schema = new Schema<IStockTransaction>(
  {
    product: {
      type: Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },

    referenceId: {
      type: Schema.Types.ObjectId,
    },

    referenceNo: String,

    type: {
      type: String,
      enum: STOCK_TRANSACTION_TYPES,
      required: true,
    },

    quantity: {
      type: Number,
      required: true,
    },

    previousStock: {
      type: Number,
      required: true,
    },

    currentStock: {
      type: Number,
      required: true,
    },

    notes: String,

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

schema.index({
  product: 1,
  createdAt: -1,
});

export default model("StockTransaction", schema);
