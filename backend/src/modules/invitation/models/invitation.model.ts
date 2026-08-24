import { model, Schema, Types } from "mongoose";

import type { IInvitation } from "../interfaces/invitation.interface.js";

import { INVITATION_STATUS } from "../constants/invitation.constants.js";

import {
  USER_PERMISSIONS,
  USER_ROLES,
} from "../../user/constants/user.constants.js";

const InvitationSchema = new Schema<IInvitation>(
  {
    businessId: {
      type: Schema.Types.ObjectId,
      ref: "Business",
      required: true,
      index: true,
    },

    ownerId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    tokenHash: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },

    role: {
      type: String,
      enum: USER_ROLES,
      required: true,
    },

    permissions: {
      type: [String],
      enum: USER_PERMISSIONS,
      default: [],
    },

    status: {
      type: String,
      enum: INVITATION_STATUS,
      default: "PENDING",
      index: true,
    },

    expiresAt: {
      type: Date,
      required: true,
      index: true,
    },

    maxUses: {
      type: Number,
      default: 1,
      min: 1,
    },

    usedCount: {
      type: Number,
      default: 0,
      min: 0,
    },

    requestedBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },

    requestedEmail: {
      type: String,
      trim: true,
      lowercase: true,
      default: null,
    },

    requestedName: {
      type: String,
      trim: true,
      default: null,
    },

    requestedGoogleId: {
      type: String,
      default: null,
    },

    requestedProfilePicture: {
      type: String,
      default: null,
    },

    approvedBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },

    approvedAt: {
      type: Date,
      default: null,
    },

    rejectedBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },

    rejectedAt: {
      type: Date,
      default: null,
    },

    acceptedAt: {
      type: Date,
      default: null,
    },

    revokedAt: {
      type: Date,
      default: null,
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
    versionKey: false,
  },
);

/*
 * Main invitation lookup.
 */
InvitationSchema.index({
  tokenHash: 1,
  status: 1,
});

/*
 * Owner's pending requests.
 */
InvitationSchema.index({
  ownerId: 1,
  status: 1,
  createdAt: -1,
});

/*
 * Business invitation history.
 */
InvitationSchema.index({
  businessId: 1,
  createdAt: -1,
});

/*
 * Expiration cleanup/index.
 */

export default model<IInvitation>("Invitation", InvitationSchema);
