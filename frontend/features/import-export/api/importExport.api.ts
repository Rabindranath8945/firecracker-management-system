import api from "@/lib/api";

const IMPORT_EXPORT_BASE = "/import-export";

export interface ImportResult {
  total: number;
  imported: number;
  skipped: number;
  failed: number;
  errors: {
    row: number;
    message: string;
  }[];
}

export const importExportApi = {
  async exportProducts(): Promise<Blob> {
    const response = await api.get(`${IMPORT_EXPORT_BASE}/products/export`, {
      responseType: "blob",
    });

    return response.data;
  },

  async importProducts(file: File): Promise<ImportResult> {
    const formData = new FormData();

    formData.append("file", file);

    const response = await api.post<{
      success: boolean;
      message: string;
      data: ImportResult;
    }>(`${IMPORT_EXPORT_BASE}/products/import`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return response.data.data;
  },
};
