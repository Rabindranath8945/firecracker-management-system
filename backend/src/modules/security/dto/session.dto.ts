import { SessionInput } from "../validators/security.validator.js";

export interface SessionDto {
  success: boolean;

  message: string;

  data: SessionInput;
}
