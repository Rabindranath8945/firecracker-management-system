import api from "@/lib/api";

import type { ExportEntity, ImportEntity } from "../types/import-export.types";

class ImportExportService {
  /* ------------------------------------------------------------------------ */
  /* IMPORT                                                                   */
  /* ------------------------------------------------------------------------ */

  async importFile(entity: ImportEntity, file: File, businessId?: string) {
    const formData = new FormData();

    formData.append("file", file);
    formData.append("entity", entity);

    if (businessId) {
      formData.append("businessId", businessId);
    }

    const response = await api.post("/import-export/import", formData);

    return response.data;
  }

  /* ------------------------------------------------------------------------ */
  /* EXPORT                                                                   */
  /* ------------------------------------------------------------------------ */

  async exportData(entity: ExportEntity, businessId?: string): Promise<Blob> {
    if (entity === "SALE" || entity === "PURCHASE") {
      if (!businessId) {
        throw new Error(
          `Business ID is required for ${entity.toLowerCase()} export.`,
        );
      }
    }

    const response = await api.get("/import-export/export", {
      params: {
        entity,
        ...(businessId ? { businessId } : {}),
      },
      responseType: "blob",
    });

    return response.data;
  }
}

export default new ImportExportService();
