import mongoose, { Document, Schema, Types } from "mongoose";

import {
  USER_PERMISSIONS,
  USER_ROLES,
  USER_STATUS,
  type UserPermission,
  type UserRole,
  type UserStatus,
} from "../constants/user.constants.js";

export interface IUser extends Document {
  /* ------------------------------------------------------------------------ */
  /* Identity                                                                 */
  /* ------------------------------------------------------------------------ */

  googleId: string;

  firstName: string;

  lastName: string;

  email: string;

  mobile: string;

  profilePicture: string;

  /* ------------------------------------------------------------------------ */
  /* Business                                                                 */
  /* ------------------------------------------------------------------------ */

  owner?: Types.ObjectId | null;

  currentBusiness?: Types.ObjectId | null;

  /* ------------------------------------------------------------------------ */
  /* Access                                                                    */
  /* ------------------------------------------------------------------------ */

  role: UserRole;

  permissions: UserPermission[];

  status: UserStatus;

  isOwner: boolean;

  isActive: boolean;

  /* ------------------------------------------------------------------------ */
  /* Device / Security                                                        */
  /* ------------------------------------------------------------------------ */

  deviceId: string;

  tokenVersion: number;

  appLockEnabled: boolean;

  onboardingCompleted: boolean;

  /* ------------------------------------------------------------------------ */
  /* Activity                                                                  */
  /* ------------------------------------------------------------------------ */

  lastLogin?: Date | null;

  lastSeen?: Date | null;

  /* ------------------------------------------------------------------------ */
  /* Audit                                                                     */
  /* ------------------------------------------------------------------------ */

  createdBy?: Types.ObjectId;

  updatedBy?: Types.ObjectId;

  createdAt: Date;

  updatedAt: Date;
}

const UserSchema = new Schema<IUser>(
  {
    /* ---------------------------------------------------------------------- */
    /* Identity                                                               */
    /* ---------------------------------------------------------------------- */

    googleId: {
      type: String,
      required: true,
      unique: true,
      index: true,
      trim: true,
    },

    firstName: {
      type: String,
      required: true,
      trim: true,
    },

    lastName: {
      type: String,
      default: "",
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    mobile: {
      type: String,
      default: "",
      trim: true,
    },

    profilePicture: {
      type: String,
      default: "",
      trim: true,
    },

    /* ---------------------------------------------------------------------- */
    /* Business                                                               */
    /* ---------------------------------------------------------------------- */

    owner: {
      type: Schema.Types.ObjectId,
      ref: "User",
      default: null,
      index: true,
    },

    currentBusiness: {
      type: Schema.Types.ObjectId,
      ref: "Business",
      default: null,
      index: true,
    },

    /* ---------------------------------------------------------------------- */
    /* Access                                                                  */
    /* ---------------------------------------------------------------------- */

    role: {
      type: String,
      enum: USER_ROLES,
      default: "OWNER",
      required: true,
    },

    permissions: {
      type: [
        {
          type: String,
          enum: USER_PERMISSIONS,
        },
      ],
      default: [],
    },

    status: {
      type: String,
      enum: USER_STATUS,
      default: "ACTIVE",
      required: true,
    },

    isOwner: {
      type: Boolean,
      default: false,
    },

    isActive: {
      type: Boolean,
      default: true,
    },

    /* ---------------------------------------------------------------------- */
    /* Security                                                                */
    /* ---------------------------------------------------------------------- */

    deviceId: {
      type: String,
      required: true,
    },

    tokenVersion: {
      type: Number,
      default: 0,
    },

    appLockEnabled: {
      type: Boolean,
      default: false,
    },

    onboardingCompleted: {
      type: Boolean,
      default: false,
    },

    /* ---------------------------------------------------------------------- */
    /* Activity                                                                */
    /* ---------------------------------------------------------------------- */

    lastLogin: {
      type: Date,
      default: null,
    },

    lastSeen: {
      type: Date,
      default: null,
    },

    /* ---------------------------------------------------------------------- */
    /* Audit                                                                   */
    /* ---------------------------------------------------------------------- */

    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      default: null,
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

/* -------------------------------------------------------------------------- */
/* Indexes                                                                    */
/* -------------------------------------------------------------------------- */

UserSchema.index({
  owner: 1,
  role: 1,
});

UserSchema.index({
  owner: 1,
  status: 1,
});

export const User = mongoose.model<IUser>("User", UserSchema);
