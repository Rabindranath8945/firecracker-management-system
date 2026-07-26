import { BusinessInfoInput } from "../validators/app-setup.validator.js";

export interface BusinessInfoDto {
  success: boolean;

  message: string;

  data: BusinessInfoInput;
}
