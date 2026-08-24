import { LoginInput } from "../validators/security.validator.js";

export interface LoginDto {
  success: boolean;

  message: string;

  data: LoginInput;
}
