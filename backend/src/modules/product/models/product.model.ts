import { Schema, model } from "mongoose";

import { IProduct } from "../interfaces/product.interface.js";

const ProductSchema = new Schema<IProduct>(
  {
    productCode: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      uppercase: true,
    },

    name: {
      type: String,
      required: true,
      trim: true,
    },

    category: {
      type: Schema.Types.ObjectId,
      ref: "Category",
    },

    subCategory: {
      type: Schema.Types.ObjectId,
      ref: "SubCategory",
    },

    barcode: {
      type: String,
      trim: true,
    },

    unit: {
      type: String,
      required: true,
      default: "PCS",
      trim: true,
      uppercase: true,
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

    stock: {
      type: Number,
      default: 0,
      min: 0,
    },

    minimumStock: {
      type: Number,
      default: 0,
      min: 0,
    },

    tax: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },

    description: {
      type: String,
      default: "",
      trim: true,
    },

    image: {
      type: String,
      default: "",
      trim: true,
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
      default: null,
    },
  },
  {
    timestamps: true,
  },
);

// Barcode should be unique only when present
ProductSchema.index(
  { barcode: 1 },
  {
    unique: true,
    sparse: true,
  },
);

// Prevent duplicate product names within the same sub category
ProductSchema.index(
  {
    subCategory: 1,
    name: 1,
  },
  {
    unique: true,
  },
);

// Speed up category filtering
ProductSchema.index({
  category: 1,
});

// Speed up sub category filtering
ProductSchema.index({
  subCategory: 1,
});

export default model<IProduct>("Product", ProductSchema);
