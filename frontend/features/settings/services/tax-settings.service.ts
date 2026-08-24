import api from "@/lib/api";

export interface TaxSettings {
  enabled: boolean;
  defaultGST: number;
  taxType: string;
  currency: string;
  currencySymbol: string;
}

interface SettingsResponse {
  success: boolean;
  data: {
    tax: TaxSettings;
    business: {
      gstNo: string;
      panNo: string;
      businessType: string;
    };
  };
}

interface UpdateTaxResponse {
  success: boolean;
  message: string;
  data: TaxSettings;
}

class TaxSettingsService {
  async getSettings(): Promise<SettingsResponse["data"]> {
    const response = await api.get<SettingsResponse>("/settings");

    return response.data.data;
  }

  async updateSettings(tax: TaxSettings): Promise<TaxSettings> {
    const response = await api.patch<UpdateTaxResponse>("/settings/tax", tax);

    return response.data.data;
  }
}

export const taxSettingsService = new TaxSettingsService();
