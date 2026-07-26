import { Schema } from "mongoose";

import {
  SECURITY_LOGIN_PROVIDER,
  SECURITY_SESSION_STATUS,
} from "../constants/security.constants.js";

export const sessionSchema = new Schema(
  {
    sessionId: {
      type: String,
      required: true,
    },

    refreshToken: {
      type: String,
      required: true,
    },

    loginProvider: {
      type: String,
      enum: SECURITY_LOGIN_PROVIDER,
      default: "GOOGLE",
    },

    status: {
      type: String,
      enum: SECURITY_SESSION_STATUS,
      default: "ACTIVE",
    },

    expiresAt: {
      type: Date,
      required: true,
    },
  },
  {
    _id: false,
  },
);
