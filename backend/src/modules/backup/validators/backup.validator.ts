import { z } from "zod";

import {
  BACKUP_FORMAT,
  BACKUP_STATUS,
  BACKUP_STORAGE,
  BACKUP_TYPE,
} from "../constants/backup.constants.js";

/* -------------------------------------------------------------------------- */
/*                               Create Backup                                */
/* -------------------------------------------------------------------------- */

export const createBackupSchema = z.object({
  type: z.enum(BACKUP_TYPE).default("MANUAL"),

  storage: z.enum(BACKUP_STORAGE).default("LOCAL"),

  format: z.enum(BACKUP_FORMAT).default("ZIP"),

  notes: z.string().max(500).optional(),
});

/* -------------------------------------------------------------------------- */
/*                              Restore Backup                                */
/* -------------------------------------------------------------------------- */

export const restoreBackupSchema = z.object({
  backupId: z.string().trim().min(1),
});

/* -------------------------------------------------------------------------- */
/*                               Backup Status                                */
/* -------------------------------------------------------------------------- */

export const backupStatusSchema = z.object({
  status: z.enum(BACKUP_STATUS),
});

/* -------------------------------------------------------------------------- */
/*                               Backup Notes                                 */
/* -------------------------------------------------------------------------- */

export const backupNotesSchema = z.object({
  notes: z.string().trim().max(500),
});

/* -------------------------------------------------------------------------- */
/*                                   Types                                    */
/* -------------------------------------------------------------------------- */

export type CreateBackupInput = z.infer<typeof createBackupSchema>;

export type RestoreBackupInput = z.infer<typeof restoreBackupSchema>;

export type BackupStatusInput = z.infer<typeof backupStatusSchema>;

export type BackupNotesInput = z.infer<typeof backupNotesSchema>;
