import { Document, Types } from "mongoose";

import {
  BACKUP_FORMAT,
  BACKUP_STATUS,
  BACKUP_STORAGE,
  BACKUP_TYPE,
} from "../constants/backup.constants.js";

export interface IBackup extends Document {
  user: Types.ObjectId;

  name: string;

  fileName: string;

  filePath: string;

  format: (typeof BACKUP_FORMAT)[number];

  type: (typeof BACKUP_TYPE)[number];

  storage: (typeof BACKUP_STORAGE)[number];

  status: (typeof BACKUP_STATUS)[number];

  version: string;

  size: number;

  downloaded: boolean;

  backupDuration: number;

  checksum: string;

  restored: boolean;

  restoredAt?: Date | null;

  notes?: string;

  isActive: boolean;

  createdBy: Types.ObjectId;

  updatedBy?: Types.ObjectId;

  createdAt: Date;

  updatedAt: Date;
}
