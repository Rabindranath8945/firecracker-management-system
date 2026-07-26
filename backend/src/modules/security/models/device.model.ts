import { Schema } from "mongoose";

import {
  SECURITY_DEVICE_STATUS,
  SECURITY_PLATFORM,
} from "../constants/security.constants.js";

export const deviceSchema = new Schema(
  {
    deviceId: {
      type: String,
      required: true,
      trim: true,
    },

    deviceName: {
      type: String,
      required: true,
      trim: true,
    },

    platform: {
      type: String,
      enum: SECURITY_PLATFORM,
      required: true,
    },

    osVersion: {
      type: String,
      default: "",
    },

    appVersion: {
      type: String,
      default: "",
    },

    ipAddress: {
      type: String,
      default: "",
    },

    trusted: {
      type: Boolean,
      default: true,
    },

    biometricEnabled: {
      type: Boolean,
      default: false,
    },

    pinEnabled: {
      type: Boolean,
      default: false,
    },

    current: {
      type: Boolean,
      default: false,
    },

    status: {
      type: String,
      enum: SECURITY_DEVICE_STATUS,
      default: "ACTIVE",
    },

    lastLoginAt: {
      type: Date,
      default: Date.now,
    },

    lastActiveAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    _id: false,
  },
);
