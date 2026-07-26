import { RestoreBackupInput } from "../validators/backup.validator.js";

export interface RestoreDto {
  success: boolean;

  message: string;

  data: RestoreBackupInput;
}
