import { Schema, model } from "mongoose";

import { ICategory } from "../interfaces/category.interface.js";

const CategorySchema = new Schema<ICategory>(
  {
    /* ---------------------------------------------------------------------- */
    /* Category Code                                                          */
    /* ---------------------------------------------------------------------- */

    categoryCode: {
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
    /* Virtual Fields                                                         */
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
 * Counts products directly assigned to this category.
 *
 * Product model:
 *
 * category: {
 *   type: Schema.Types.ObjectId,
 *   ref: "Category",
 * }
 */
CategorySchema.virtual("productCount", {
  ref: "Product",
  localField: "_id",
  foreignField: "category",
  count: true,
});

/* ========================================================================== */
/* INDEXES                                                                    */
/* ========================================================================== */

/**
 * Prevent duplicate category names.
 */
CategorySchema.index(
  {
    name: 1,
  },
  {
    unique: true,
  },
);

/**
 * Speed up active/inactive filtering.
 */
CategorySchema.index({
  isActive: 1,
});

/* ========================================================================== */
/* MODEL                                                                      */
/* ========================================================================== */

export default model<ICategory>("Category", CategorySchema);
