import { SetupStatusInput } from "../validators/app-setup.validator.js";

export interface SetupStatusDto {
  success: boolean;

  message: string;

  data: SetupStatusInput;
}
