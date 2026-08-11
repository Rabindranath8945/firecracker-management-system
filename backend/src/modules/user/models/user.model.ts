import mongoose, { Document, Schema, Types } from "mongoose";

export enum UserRole {
  OWNER = "OWNER",

  MANAGER = "MANAGER",

  CASHIER = "CASHIER",

  INVENTORY = "INVENTORY",
}

export interface IUser extends Document {
  googleId: string;

  currentBusiness?: Types.ObjectId;

  email: string;

  profilePicture?: string;

  role: UserRole;

  deviceId: string;

  tokenVersion: number;

  appLockEnabled: boolean;

  onboardingCompleted: boolean;

  isActive: boolean;

  lastLogin?: Date;

  createdAt: Date;

  updatedAt: Date;
}

const UserSchema = new Schema<IUser>(
  {
    googleId: {
      type: String,
      required: true,
      unique: true,
      index: true,
      trim: true,
    },

    currentBusiness: {
      type: Schema.Types.ObjectId,
      ref: "Business",
      default: null,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    profilePicture: {
      type: String,
      default: "",
    },

    role: {
      type: String,
      enum: Object.values(UserRole),
      default: UserRole.OWNER,
    },

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

    isActive: {
      type: Boolean,
      default: true,
    },

    lastLogin: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

export const User = mongoose.model<IUser>("User", UserSchema);
