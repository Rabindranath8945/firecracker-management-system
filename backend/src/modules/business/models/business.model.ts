import { Schema, model } from "mongoose";

import { IBusiness } from "../interfaces/business.interface.js";

import {
  BUSINESS_STATUS,
  BUSINESS_TYPES,
} from "../constants/business.constants.js";

const businessSchema = new Schema<IBusiness>(
  {
    businessId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },

    name: {
      type: String,
      required: true,
      trim: true,
    },

    type: {
      type: String,
      enum: BUSINESS_TYPES,
      default: "GENERAL_STORE",
    },

    owner: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },

    logo: {
      type: String,
      default: "",
    },

    phone: String,

    email: String,

    address: String,

    status: {
      type: String,
      enum: BUSINESS_STATUS,
      default: "ACTIVE",
    },

    isActive: {
      type: Boolean,
      default: true,
    },

    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
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

export default model<IBusiness>("Business", businessSchema);
