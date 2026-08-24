import type { Request, Response } from "express";

import ImportExportService from "../services/import-export.service.js";

import type { ImportExportEntity } from "../types/import-export.types.js";

const IMPORT_EXPORT_ENTITIES: ImportExportEntity[] = [
  "PRODUCT",
  "SALE",
  "PURCHASE",
];

class ImportExportController {
  /* ------------------------------------------------------------------------ */
  /* IMPORT                                                                   */
  /* ------------------------------------------------------------------------ */

  async importFile(req: Request, res: Response): Promise<void> {
    try {
      /* -------------------------------------------------------------------- */
      /* AUTH                                                                 */
      /* -------------------------------------------------------------------- */

      const userId = req.user?.userId;

      if (!userId) {
        res.status(401).json({
          success: false,
          message: "Unauthorized.",
        });

        return;
      }

      /* -------------------------------------------------------------------- */
      /* FILE                                                                 */
      /* -------------------------------------------------------------------- */

      if (!req.file) {
        res.status(400).json({
          success: false,
          message: "Excel file is required.",
        });

        return;
      }

      /* -------------------------------------------------------------------- */
      /* ENTITY                                                               */
      /* -------------------------------------------------------------------- */

      const entity = String(req.body.entity ?? "")
        .trim()
        .toUpperCase() as ImportExportEntity;

      if (!IMPORT_EXPORT_ENTITIES.includes(entity)) {
        res.status(400).json({
          success: false,
          message:
            "Invalid import entity. Supported entities: PRODUCT, SALE, PURCHASE.",
        });

        return;
      }

      /* -------------------------------------------------------------------- */
      /* BUSINESS                                                             */
      /* -------------------------------------------------------------------- */

      const businessId = String(
        req.body.businessId ?? req.query.businessId ?? "",
      ).trim();

      /* -------------------------------------------------------------------- */
      /* IMPORT                                                               */
      /* -------------------------------------------------------------------- */

      const result = await ImportExportService.importFile(
        entity,
        userId,
        businessId || undefined,
        req.file,
      );

      res.status(200).json({
        success: true,
        message: `${entity} imported successfully.`,
        data: result,
      });
    } catch (error) {
      console.error("Import/export import error:", error);

      res.status(500).json({
        success: false,
        message: "Failed to import data.",
        error: error instanceof Error ? error.message : "Unknown error",
      });
    }
  }

  /* ------------------------------------------------------------------------ */
  /* EXPORT                                                                   */
  /* ------------------------------------------------------------------------ */

  async exportData(req: Request, res: Response): Promise<void> {
    try {
      /* -------------------------------------------------------------------- */
      /* AUTH                                                                 */
      /* -------------------------------------------------------------------- */

      const userId = req.user?.userId;

      if (!userId) {
        res.status(401).json({
          success: false,
          message: "Unauthorized.",
        });

        return;
      }

      /* -------------------------------------------------------------------- */
      /* ENTITY                                                               */
      /* -------------------------------------------------------------------- */

      const entity = String(req.query.entity ?? "")
        .trim()
        .toUpperCase() as ImportExportEntity;

      if (!IMPORT_EXPORT_ENTITIES.includes(entity)) {
        res.status(400).json({
          success: false,
          message:
            "Invalid export entity. Supported entities: PRODUCT, SALE, PURCHASE.",
        });

        return;
      }

      /* -------------------------------------------------------------------- */
      /* BUSINESS                                                             */
      /* -------------------------------------------------------------------- */

      const businessId = String(req.query.businessId ?? "").trim();

      /* -------------------------------------------------------------------- */
      /* EXPORT                                                               */
      /* -------------------------------------------------------------------- */

      const result = await ImportExportService.exportFile(
        entity,
        userId,
        businessId || undefined,
      );

      /* -------------------------------------------------------------------- */
      /* RESPONSE                                                             */
      /* -------------------------------------------------------------------- */

      res.setHeader(
        "Content-Type",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      );

      res.setHeader(
        "Content-Disposition",
        `attachment; filename="${entity.toLowerCase()}s.xlsx"`,
      );

      res.send(result);
    } catch (error) {
      console.error("Import/export export error:", error);

      res.status(500).json({
        success: false,
        message: "Failed to export data.",
        error: error instanceof Error ? error.message : "Unknown error",
      });
    }
  }
}

export default new ImportExportController();
