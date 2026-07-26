import { BiometricInput } from "../validators/security.validator.js";

export interface BiometricDto {
  success: boolean;

  message: string;

  data: BiometricInput;
}
