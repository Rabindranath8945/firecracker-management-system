import api from "@/lib/api";

export interface InvoiceSettings {
  prefix: string;
  nextNumber: number;
  footer: string;
  terms: string;
  showLogo: boolean;
  showGST: boolean;
  showCustomerMobile: boolean;
  showCustomerAddress: boolean;
}

interface SettingsResponse {
  success: boolean;
  data: {
    invoice: InvoiceSettings;
  };
}

interface UpdateInvoiceResponse {
  success: boolean;
  message: string;
  data: {
    invoice: InvoiceSettings;
  };
}

class InvoiceSettingsService {
  async getSettings(): Promise<InvoiceSettings> {
    const response = await api.get<SettingsResponse>("/settings");

    return response.data.data.invoice;
  }

  async updateSettings(invoice: InvoiceSettings): Promise<InvoiceSettings> {
    const response = await api.patch<UpdateInvoiceResponse>(
      "/settings/invoice",
      invoice,
    );

    return response.data.data.invoice;
  }
}

export const invoiceSettingsService = new InvoiceSettingsService();
