import { Schema, model } from "mongoose";

import { IAppSetup } from "../interfaces/app-setup.interface.js";

import {
  APP_BUSINESS_TYPE,
  APP_LANGUAGE,
  APP_SETUP_STEP,
} from "../constants/app-setup.constants.js";

const appSetupSchema = new Schema<IAppSetup>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },

    businessId: {
      type: String,
      required: true,
      unique: true,
    },

    language: {
      type: String,
      enum: APP_LANGUAGE,
      default: "ENGLISH",
    },

    businessType: {
      type: String,
      enum: APP_BUSINESS_TYPE,
      default: "GENERAL_STORE",
    },

    currentStep: {
      type: String,
      enum: APP_SETUP_STEP,
      default: "START",
    },

    completed: {
      type: Boolean,
      default: false,
    },

    completedAt: {
      type: Date,
    },

    appVersion: {
      type: String,
      default: "1.0.0",
    },

    setupVersion: {
      type: Number,
      default: 1,
    },

    settingsConfigured: {
      type: Boolean,
      default: false,
    },

    securityConfigured: {
      type: Boolean,
      default: false,
    },

    skipped: {
      type: Boolean,
      default: false,
    },

    deviceRegistered: {
      type: Boolean,
      default: false,
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

export default model<IAppSetup>("AppSetup", appSetupSchema);
