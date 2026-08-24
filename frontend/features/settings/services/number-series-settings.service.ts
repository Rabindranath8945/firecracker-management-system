import api from "@/lib/api";

export interface NumberingSettings {
  product: string;
  customer: string;
  supplier: string;
  purchase: string;
  sale: string;
  expense: string;
}

interface SettingsResponse {
  success: boolean;
  data: {
    numbering: NumberingSettings;
  };
}

interface UpdateNumberingResponse {
  success: boolean;
  message: string;
  data: NumberingSettings;
}

class NumberSeriesSettingsService {
  async getSettings(): Promise<NumberingSettings> {
    const response = await api.get<SettingsResponse>("/settings");

    return response.data.data.numbering;
  }

  async updateSettings(
    numbering: NumberingSettings,
  ): Promise<NumberingSettings> {
    const response = await api.patch<UpdateNumberingResponse>(
      "/settings/numbering",
      numbering,
    );

    return response.data.data;
  }
}

export const numberSeriesSettingsService = new NumberSeriesSettingsService();
