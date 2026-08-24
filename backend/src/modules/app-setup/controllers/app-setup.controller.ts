import { Request, Response } from "express";
import { Types } from "mongoose";

import AppSetupService from "../services/app-setup.service.js";

class AppSetupController {
  private handleError(res: Response, error: unknown, message: string) {
    return res.status(500).json({
      success: false,
      message: error instanceof Error ? error.message : message,
    });
  }

  /* -------------------------------------------------------------------------- */
  /*                                   Basic                                    */
  /* -------------------------------------------------------------------------- */

  async get(_req: Request, res: Response) {
    try {
      const setup = await AppSetupService.get();

      return res.json({
        success: true,
        data: setup,
      });
    } catch (error) {
      return this.handleError(res, error, "Failed to fetch app setup.");
    }
  }

  async getById(req: Request, res: Response) {
    try {
      const setup = await AppSetupService.getById(String(req.params.id));

      return res.json({
        success: true,
        data: setup,
      });
    } catch (error) {
      return this.handleError(res, error, "Failed to fetch app setup.");
    }
  }

  async getByUser(req: Request, res: Response) {
    try {
      const setup = await AppSetupService.getByUser(String(req.params.userId));

      return res.json({
        success: true,
        data: setup,
      });
    } catch (error) {
      return this.handleError(res, error, "Failed to fetch user setup.");
    }
  }

  async getStatus(req: Request, res: Response) {
    try {
      const status = await AppSetupService.getStatus(String(req.params.userId));

      return res.json({
        success: true,
        data: status,
      });
    } catch (error) {
      return this.handleError(res, error, "Failed to fetch setup status.");
    }
  }

  async update(req: Request, res: Response) {
    try {
      const setup = await AppSetupService.update(
        String(req.params.id),
        req.body,
      );

      return res.json({
        success: true,
        message: "App setup updated successfully.",
        data: setup,
      });
    } catch (error) {
      return this.handleError(res, error, "Failed to update app setup.");
    }
  }

  /* -------------------------------------------------------------------------- */
  /*                               Setup Flow                                   */
  /* -------------------------------------------------------------------------- */

  async updateLanguage(req: Request, res: Response) {
    try {
      const setup = await AppSetupService.updateLanguage(
        String(req.params.id),
        req.body,
      );

      return res.json({
        success: true,
        message: "Language updated successfully.",
        data: setup,
      });
    } catch (error) {
      return this.handleError(res, error, "Failed to update language.");
    }
  }

  async updateBusiness(req: Request, res: Response) {
    try {
      const setup = await AppSetupService.updateBusiness(
        String(req.params.id),
        req.body,
      );

      return res.json({
        success: true,
        message: "Business information updated successfully.",
        data: setup,
      });
    } catch (error) {
      return this.handleError(
        res,
        error,
        "Failed to update business information.",
      );
    }
  }

  async initialize(req: Request, res: Response) {
    try {
      if (!req.user) {
        return res.status(401).json({
          success: false,
          message: "Unauthorized",
        });
      }

      const userId = new Types.ObjectId(req.user.userId);

      const setup = await AppSetupService.initialize(
        String(req.params.id),
        userId,
        req.body,
      );

      return res.json({
        success: true,
        message: "App setup completed successfully.",
        data: setup,
      });
    } catch (error) {
      return this.handleError(res, error, "Failed to complete app setup.");
    }
  }

  async reset(req: Request, res: Response) {
    try {
      const setup = await AppSetupService.reset(String(req.params.id));

      return res.json({
        success: true,
        message: "App setup reset successfully.",
        data: setup,
      });
    } catch (error) {
      return this.handleError(res, error, "Failed to reset app setup.");
    }
  }

  async start(req: Request, res: Response) {
    try {
      if (!req.user) {
        return res.status(401).json({
          success: false,
          message: "Unauthorized",
        });
      }

      const userId = new Types.ObjectId(req.user.userId);

      const setup = await AppSetupService.start({
        user: userId,
        createdBy: userId,
      });

      return res.status(201).json({
        success: true,
        message: "App setup started successfully.",
        data: setup,
      });
    } catch (error) {
      return this.handleError(res, error, "Failed to start app setup.");
    }
  }
}

export default new AppSetupController();
