import { CreateBackupInput } from "../validators/backup.validator.js";

export interface BackupDto {
  success: boolean;

  message: string;

  data: CreateBackupInput;
}
