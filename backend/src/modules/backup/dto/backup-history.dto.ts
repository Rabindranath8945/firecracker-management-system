import { IBackup } from "../interfaces/backup.interface.js";

export interface BackupHistoryDto {
  success: boolean;

  message: string;

  data: IBackup[];
}
