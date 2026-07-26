import { Schema, model } from "mongoose";

import { ISecurity } from "../interfaces/security.interface.js";

import { SECURITY_LOCK_TYPE } from "../constants/security.constants.js";

import { SECURITY_AUTO_LOCK } from "../constants/security.constants.js";

import { deviceSchema } from "./device.model.js";
import { sessionSchema } from "./session.model.js";

const securitySchema = new Schema<ISecurity>(
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
    },

    lockType: {
      type: String,
      enum: SECURITY_LOCK_TYPE,
      default: "NONE",
    },

    appLockEnabled: {
      type: Boolean,
      default: false,
    },

    autoLock: {
      type: String,
      enum: SECURITY_AUTO_LOCK,
      default: "NEVER",
    },

    requireSecurityForSensitiveActions: {
      type: Boolean,
      default: true,
    },

    pinHash: {
      type: String,
      default: "",
    },

    devices: {
      type: [deviceSchema],
      default: [],
    },

    sessions: {
      type: [sessionSchema],
      default: [],
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

export default model<ISecurity>("Security", securitySchema);
