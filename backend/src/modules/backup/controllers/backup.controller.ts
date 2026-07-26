import { Request, Response } from "express";
import { Types } from "mongoose";

import BackupService from "../services/backup.service.js";

class BackupController {
  private handleError(res: Response, error: unknown, message: string) {
    return res.status(500).json({
      success: false,
      message,
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }

  /* -------------------------------------------------------------------------- */
  /*                                    Find                                    */
  /* -------------------------------------------------------------------------- */

  async get(req: Request, res: Response) {
    try {
      const backups = await BackupService.get();

      return res.json({
        success: true,
        data: backups,
      });
    } catch (error) {
      return this.handleError(res, error, "Failed to fetch backups.");
    }
  }

  async getById(req: Request, res: Response) {
    try {
      const backup = await BackupService.getById(String(req.params.id));

      return res.json({
        success: true,
        data: backup,
      });
    } catch (error) {
      return this.handleError(res, error, "Failed to fetch backup.");
    }
  }

  async history(req: Request, res: Response) {
    try {
      const backups = await BackupService.history(
        String(req.params.businessId),
      );

      return res.json({
        success: true,
        data: backups,
      });
    } catch (error) {
      return this.handleError(res, error, "Failed to fetch backup history.");
    }
  }

  /* -------------------------------------------------------------------------- */
  /*                                   Create                                   */
  /* -------------------------------------------------------------------------- */

  async create(req: Request, res: Response) {
    try {
      if (!req.user) {
        return res.status(401).json({
          success: false,
          message: "Unauthorized",
        });
      }

      const userId = new Types.ObjectId(req.user.userId);

      const backup = await BackupService.create(userId.toString(), req.body);

      return res.status(201).json({
        success: true,
        message: "Backup created successfully.",
        data: backup,
      });
    } catch (error) {
      return this.handleError(res, error, "Failed to create backup.");
    }
  }

  async download(req: Request, res: Response) {
    try {
      const filePath = await BackupService.download(String(req.params.id));

      return res.download(filePath);
    } catch (error) {
      return this.handleError(res, error, "Failed to download backup.");
    }
  }

  /* -------------------------------------------------------------------------- */
  /*                                   Delete                                   */
  /* -------------------------------------------------------------------------- */

  async delete(req: Request, res: Response) {
    try {
      const backup = await BackupService.delete(String(req.params.id));

      return res.json({
        success: true,
        message: "Backup deleted successfully.",
        data: backup,
      });
    } catch (error) {
      return this.handleError(res, error, "Failed to delete backup.");
    }
  }

  async restore(req: Request, res: Response) {
    try {
      const backup = await BackupService.restore(String(req.params.id));

      return res.json({
        success: true,
        message: "Backup restored successfully.",
        data: backup,
      });
    } catch (error) {
      return this.handleError(res, error, "Failed to restore backup.");
    }
  }
}

export default new BackupController();
