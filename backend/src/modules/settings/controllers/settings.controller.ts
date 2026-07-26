import { Request, Response } from "express";

import SettingsService from "../services/settings.service.js";

class SettingsController {
  private getId(req: Request): string {
    return String(req.params.id);
  }
  private handleError(res: Response, error: unknown, message: string) {
    return res.status(500).json({
      success: false,
      message: error instanceof Error ? error.message : message,
    });
  }

  async get(_req: Request, res: Response) {
    try {
      const settings = await SettingsService.get();

      return res.json({
        success: true,
        data: settings,
      });
    } catch (error) {
      return this.handleError(res, error, "Failed to fetch settings.");
    }
  }

  // async create(req: Request, res: Response) {
  //   try {
  //     const settings = await SettingsService.create(req.body);

  //     return res.status(201).json({
  //       success: true,
  //       message: "Settings created successfully.",
  //       data: settings,
  //     });
  //   } catch (error) {
  //     return this.handleError(res, error, "Failed to create settings.");
  //   }
  // }

  async updateBusiness(req: Request, res: Response) {
    try {
      const settings = await SettingsService.updateBusiness(
        this.getId(req),
        req.body,
      );

      return res.json({
        success: true,
        message: "Business settings updated.",
        data: settings,
      });
    } catch (error) {
      return this.handleError(
        res,
        error,
        "Failed to update business settings.",
      );
    }
  }

  async updateUsers(req: Request, res: Response) {
    try {
      const settings = await SettingsService.updateUsers(
        this.getId(req),
        req.body,
      );

      return res.json({
        success: true,
        message: "User settings updated.",
        data: settings,
      });
    } catch (error) {
      return this.handleError(res, error, "Failed to update user settings.");
    }
  }

  async updatePayment(req: Request, res: Response) {
    try {
      const settings = await SettingsService.updatePayment(
        this.getId(req),
        req.body,
      );

      return res.json({
        success: true,
        message: "Payment settings updated.",
        data: settings,
      });
    } catch (error) {
      return this.handleError(res, error, "Failed to update payment settings.");
    }
  }

  async updateInvoice(req: Request, res: Response) {
    try {
      const settings = await SettingsService.updateInvoice(
        this.getId(req),
        req.body,
      );

      return res.json({
        success: true,
        message: "Invoice settings updated.",
        data: settings,
      });
    } catch (error) {
      return this.handleError(res, error, "Failed to update invoice settings.");
    }
  }

  async updateTax(req: Request, res: Response) {
    try {
      const settings = await SettingsService.updateTax(
        this.getId(req),
        req.body,
      );

      return res.json({
        success: true,
        message: "Tax settings updated.",
        data: settings,
      });
    } catch (error) {
      return this.handleError(res, error, "Failed to update tax settings.");
    }
  }

  async updateNumbering(req: Request, res: Response) {
    try {
      const settings = await SettingsService.updateNumbering(
        this.getId(req),
        req.body,
      );

      return res.json({
        success: true,
        message: "Number series updated.",
        data: settings,
      });
    } catch (error) {
      return this.handleError(res, error, "Failed to update number series.");
    }
  }

  async updateDataManagement(req: Request, res: Response) {
    try {
      const settings = await SettingsService.updateDataManagement(
        this.getId(req),
        req.body,
      );

      return res.json({
        success: true,
        message: "Data management updated.",
        data: settings,
      });
    } catch (error) {
      return this.handleError(res, error, "Failed to update data management.");
    }
  }

  async updateNotification(req: Request, res: Response) {
    try {
      const settings = await SettingsService.updateNotification(
        this.getId(req),
        req.body,
      );

      return res.json({
        success: true,
        message: "Notification settings updated.",
        data: settings,
      });
    } catch (error) {
      return this.handleError(
        res,
        error,
        "Failed to update notification settings.",
      );
    }
  }

  async updateAppearance(req: Request, res: Response) {
    try {
      const settings = await SettingsService.updateAppearance(
        this.getId(req),
        req.body,
      );

      return res.json({
        success: true,
        message: "Appearance settings updated.",
        data: settings,
      });
    } catch (error) {
      return this.handleError(
        res,
        error,
        "Failed to update appearance settings.",
      );
    }
  }

  async updateSystem(req: Request, res: Response) {
    try {
      const settings = await SettingsService.updateSystem(
        this.getId(req),
        req.body,
      );

      return res.json({
        success: true,
        message: "System settings updated.",
        data: settings,
      });
    } catch (error) {
      return this.handleError(res, error, "Failed to update system settings.");
    }
  }

  async updateSecurity(req: Request, res: Response) {
    try {
      const settings = await SettingsService.updateSecurity(
        this.getId(req),
        req.body,
      );

      return res.json({
        success: true,
        message: "Security settings updated.",
        data: settings,
      });
    } catch (error) {
      return this.handleError(
        res,
        error,
        "Failed to update security settings.",
      );
    }
  }

  async updateAbout(req: Request, res: Response) {
    try {
      const settings = await SettingsService.updateAbout(
        this.getId(req),
        req.body,
      );

      return res.json({
        success: true,
        message: "About settings updated.",
        data: settings,
      });
    } catch (error) {
      return this.handleError(res, error, "Failed to update about settings.");
    }
  }
  async updateLogo(req: Request, res: Response) {
    try {
      if (!req.file) {
        return res.status(400).json({
          success: false,
          message: "Please upload a logo.",
        });
      }

      const settings = await SettingsService.updateLogo(
        String(req.params.id),
        `/uploads/${req.file.filename}`,
      );

      return res.json({
        success: true,
        message: "Business logo updated successfully.",
        data: settings,
      });
    } catch (error) {
      return this.handleError(res, error, "Failed to upload business logo.");
    }
  }
  async updatePaymentQr(req: Request, res: Response) {
    try {
      if (!req.file) {
        return res.status(400).json({
          success: false,
          message: "Please upload a payment QR.",
        });
      }

      const settings = await SettingsService.updatePaymentQr(
        String(req.params.id),
        `/uploads/${req.file.filename}`,
      );

      return res.json({
        success: true,
        message: "Payment QR uploaded successfully.",
        data: settings,
      });
    } catch (error) {
      return this.handleError(res, error, "Failed to upload payment QR.");
    }
  }
  async paymentQr(req: Request, res: Response) {
    try {
      const amount = Number(req.query.amount);

      if (Number.isNaN(amount) || amount <= 0) {
        return res.status(400).json({
          success: false,
          message: "Invalid payment amount.",
        });
      }

      const payment = await SettingsService.generatePaymentQr(amount);

      return res.json({
        success: true,
        data: payment,
      });
    } catch (error) {
      return this.handleError(res, error, "Failed to generate payment QR.");
    }
  }

  async paymentStatus(_req: Request, res: Response) {
    try {
      const status = await SettingsService.getPaymentStatus();

      return res.json({
        success: true,
        data: status,
      });
    } catch (error) {
      return this.handleError(res, error, "Failed to fetch payment status.");
    }
  }
}

export default new SettingsController();
