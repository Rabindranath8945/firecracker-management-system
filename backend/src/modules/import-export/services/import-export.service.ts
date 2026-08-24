import type {
  ImportExportEntity,
  ImportResult,
} from "../types/import-export.types.js";

import ProductImportExportService from "./product-import-export.service.js";
import SalesImportExportService from "./sales-import-export.service.js";
import PurchaseImportExportService from "./purchase-import-export.service.js";

class ImportExportService {
  /* ------------------------------------------------------------------------ */
  /* IMPORT                                                                   */
  /* ------------------------------------------------------------------------ */

  async importFile(
    entity: ImportExportEntity,
    userId: string,
    businessId: string | undefined,
    file: Express.Multer.File,
  ): Promise<ImportResult> {
    switch (entity) {
      /* -------------------------------------------------------------------- */
      /* PRODUCT                                                              */
      /* -------------------------------------------------------------------- */

      case "PRODUCT":
        return ProductImportExportService.importProducts(userId, file);

      /* -------------------------------------------------------------------- */
      /* SALE                                                                 */
      /* -------------------------------------------------------------------- */

      case "SALE": {
        if (!businessId) {
          throw new Error("Business ID is required for sales import.");
        }

        return SalesImportExportService.importSales(businessId, file);
      }

      /* -------------------------------------------------------------------- */
      /* PURCHASE                                                             */
      /* -------------------------------------------------------------------- */

      case "PURCHASE": {
        if (!businessId) {
          throw new Error("Business ID is required for purchase import.");
        }

        return PurchaseImportExportService.importPurchases(businessId, file);
      }

      default:
        throw new Error(`Unsupported import entity: ${entity}`);
    }
  }

  /* ------------------------------------------------------------------------ */
  /* EXPORT                                                                   */
  /* ------------------------------------------------------------------------ */

  async exportFile(
    entity: ImportExportEntity,
    userId: string,
    businessId?: string,
  ): Promise<Buffer> {
    switch (entity) {
      /* -------------------------------------------------------------------- */
      /* PRODUCT                                                              */
      /* -------------------------------------------------------------------- */

      case "PRODUCT":
        return ProductImportExportService.exportProducts(userId);

      /* -------------------------------------------------------------------- */
      /* SALE                                                                 */
      /* -------------------------------------------------------------------- */

      case "SALE": {
        if (!businessId) {
          throw new Error("Business ID is required for sales export.");
        }

        return SalesImportExportService.exportSales(businessId);
      }

      /* -------------------------------------------------------------------- */
      /* PURCHASE                                                             */
      /* -------------------------------------------------------------------- */

      case "PURCHASE": {
        if (!businessId) {
          throw new Error("Business ID is required for purchase export.");
        }

        return PurchaseImportExportService.exportPurchases(businessId);
      }

      default:
        throw new Error(`Unsupported export entity: ${entity}`);
    }
  }
}

export default new ImportExportService();
