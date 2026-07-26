import { Schema, model } from "mongoose";

import { IExpense } from "../interfaces/expense.interface.js";
import {
  EXPENSE_CATEGORIES,
  EXPENSE_PAYMENT_METHODS,
} from "../constants/expense.constants.js";

const expenseSchema = new Schema<IExpense>(
  {
    expenseNo: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      uppercase: true,
    },

    title: {
      type: String,
      required: true,
      trim: true,
    },

    category: {
      type: String,
      required: true,
      enum: EXPENSE_CATEGORIES,
    },

    amount: {
      type: Number,
      required: true,
      min: 0,
    },

    paymentMethod: {
      type: String,
      enum: EXPENSE_PAYMENT_METHODS,
      default: "CASH",
    },

    expenseDate: {
      type: Date,
      required: true,
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

expenseSchema.index({
  category: 1,
});

expenseSchema.index({
  expenseDate: -1,
});

expenseSchema.index({
  isActive: 1,
});

export default model<IExpense>("Expense", expenseSchema);
