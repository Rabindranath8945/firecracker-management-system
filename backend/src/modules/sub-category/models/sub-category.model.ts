import { Schema, model } from "mongoose";

import { ISubCategory } from "../interfaces/sub-category.interface.js";

const SubCategorySchema = new Schema<ISubCategory>(
  {
    /* ---------------------------------------------------------------------- */
    /* Sub Category Code                                                      */
    /* ---------------------------------------------------------------------- */

    subCategoryCode: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      uppercase: true,
    },

    /* ---------------------------------------------------------------------- */
    /* Name                                                                   */
    /* ---------------------------------------------------------------------- */

    name: {
      type: String,
      required: true,
      trim: true,
    },

    /* ---------------------------------------------------------------------- */
    /* Parent Category                                                        */
    /* ---------------------------------------------------------------------- */

    category: {
      type: Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },

    /* ---------------------------------------------------------------------- */
    /* Description                                                            */
    /* ---------------------------------------------------------------------- */

    description: {
      type: String,
      default: "",
      trim: true,
    },

    /* ---------------------------------------------------------------------- */
    /* Image                                                                  */
    /* ---------------------------------------------------------------------- */

    image: {
      type: String,
      default: "",
      trim: true,
    },

    /* ---------------------------------------------------------------------- */
    /* Status                                                                 */
    /* ---------------------------------------------------------------------- */

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
      default: null,
    },
  },

  {
    timestamps: true,

    /* ---------------------------------------------------------------------- */
    /* Virtuals                                                               */
    /* ---------------------------------------------------------------------- */

    toJSON: {
      virtuals: true,
    },

    toObject: {
      virtuals: true,
    },
  },
);

/* ========================================================================== */
/* PRODUCT COUNT                                                              */
/* ========================================================================== */

/**
 * Counts products assigned to this sub-category.
 *
 * Product model must contain:
 *
 * subCategory: {
 *   type: Schema.Types.ObjectId,
 *   ref: "SubCategory"
 * }
 */
SubCategorySchema.virtual("productCount", {
  ref: "Product",
  localField: "_id",
  foreignField: "subCategory",
  count: true,
});

/* ========================================================================== */
/* INDEXES                                                                    */
/* ========================================================================== */

/**
 * Prevent duplicate sub-category names
 * inside the same parent category.
 */
SubCategorySchema.index(
  {
    category: 1,
    name: 1,
  },
  {
    unique: true,
  },
);

/**
 * Faster lookup by parent category.
 */
SubCategorySchema.index({
  category: 1,
});

/**
 * Faster active/inactive filtering.
 */
SubCategorySchema.index({
  isActive: 1,
});

/* ========================================================================== */
/* MODEL                                                                      */
/* ========================================================================== */

export default model<ISubCategory>("SubCategory", SubCategorySchema);
