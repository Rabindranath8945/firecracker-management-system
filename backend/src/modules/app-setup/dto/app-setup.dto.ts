import { AppSetupInput } from "../validators/app-setup.validator.js";

export interface AppSetupDto {
  success: boolean;

  message: string;

  data: AppSetupInput;
}
