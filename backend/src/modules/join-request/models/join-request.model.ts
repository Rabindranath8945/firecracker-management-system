import { Schema, model } from "mongoose";

import { IJoinRequest } from "../interfaces/join-request.interface.js";

import { JOIN_REQUEST_STATUS } from "../constants/join-request.constants.js";

const joinRequestSchema = new Schema<IJoinRequest>(
  {
    business: {
      type: Schema.Types.ObjectId,
      ref: "Business",
      required: true,
      index: true,
    },

    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    role: {
      type: String,
      default: "CASHIER",
    },

    status: {
      type: String,
      enum: JOIN_REQUEST_STATUS,
      default: "PENDING",
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

joinRequestSchema.index(
  {
    business: 1,
    user: 1,
  },
  {
    unique: true,
  },
);

export default model<IJoinRequest>("JoinRequest", joinRequestSchema);
