import { SecurityInput } from "../validators/security.validator.js";

export interface SecurityResponseDto {
  success: boolean;

  message: string;

  data: SecurityInput;
}
