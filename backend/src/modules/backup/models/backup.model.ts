import { Schema, model } from "mongoose";

import { IBackup } from "../interfaces/backup.interface.js";

import {
  BACKUP_FORMAT,
  BACKUP_STATUS,
  BACKUP_STORAGE,
  BACKUP_TYPE,
} from "../constants/backup.constants.js";

const backupSchema = new Schema<IBackup>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    backupDuration: {
      type: Number,
      default: 0,
    },

    name: {
      type: String,
      required: true,
      trim: true,
    },

    fileName: {
      type: String,
      required: true,
    },

    filePath: {
      type: String,
      required: true,
    },

    format: {
      type: String,
      enum: BACKUP_FORMAT,
      default: "ZIP",
    },

    type: {
      type: String,
      enum: BACKUP_TYPE,
      default: "MANUAL",
    },

    storage: {
      type: String,
      enum: BACKUP_STORAGE,
      default: "LOCAL",
    },

    status: {
      type: String,
      enum: BACKUP_STATUS,
      default: "PENDING",
    },

    version: {
      type: String,
      default: "1.0.0",
    },

    size: {
      type: Number,
      default: 0,
    },

    checksum: {
      type: String,
      default: "",
    },

    downloaded: {
      type: Boolean,
      default: false,
    },

    restored: {
      type: Boolean,
      default: false,
    },

    restoredAt: {
      type: Date,
      default: null,
    },

    notes: {
      type: String,
      default: "",
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

export default model<IBackup>("Backup", backupSchema);
