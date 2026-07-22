import { Schema, model } from "mongoose";

import { ISubCategory } from "../interfaces/sub-category.interface.js";

const SubCategorySchema = new Schema<ISubCategory>(
  {
    subCategoryCode: {
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
      required: true,
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

// Prevent duplicate sub category names within the same category
SubCategorySchema.index(
  {
    category: 1,
    name: 1,
  },
  {
    unique: true,
  },
);

// Speed up category-based lookups
SubCategorySchema.index({
  category: 1,
});

export default model<ISubCategory>("SubCategory", SubCategorySchema);
