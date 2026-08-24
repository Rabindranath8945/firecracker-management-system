import { PinInput } from "../validators/security.validator.js";

export interface PinDto {
  success: boolean;

  message: string;

  data: PinInput;
}
