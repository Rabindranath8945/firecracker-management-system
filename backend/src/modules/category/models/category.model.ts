import { Schema, model } from "mongoose";

import { ICategory } from "../interfaces/category.interface.js";

const CategorySchema = new Schema<ICategory>(
  {
    categoryCode: {
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

// Prevent duplicate category names
CategorySchema.index(
  {
    name: 1,
  },
  {
    unique: true,
  },
);

// Speed up active/inactive filtering
CategorySchema.index({
  isActive: 1,
});

export default model<ICategory>("Category", CategorySchema);
