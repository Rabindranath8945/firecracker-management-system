import { LanguageInput } from "../validators/app-setup.validator.js";

export interface LanguageDto {
  success: boolean;

  message: string;

  data: LanguageInput;
}
