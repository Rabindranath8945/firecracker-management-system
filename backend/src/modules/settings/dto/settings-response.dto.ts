import { ISettings } from "../interfaces/settings.interface.js";

export interface SettingsResponseDto {
  success: boolean;

  message?: string;

  data: ISettings | null;
}
