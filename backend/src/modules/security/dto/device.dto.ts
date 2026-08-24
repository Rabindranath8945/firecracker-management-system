import { DeviceInput } from "../validators/security.validator.js";

export interface DeviceDto {
  success: boolean;

  message: string;

  data: DeviceInput;
}
