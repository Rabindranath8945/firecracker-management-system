import { BackupStatusInput } from "../validators/backup.validator.js";

export interface BackupStatusDto {
  success: boolean;

  message: string;

  data: BackupStatusInput;
}
