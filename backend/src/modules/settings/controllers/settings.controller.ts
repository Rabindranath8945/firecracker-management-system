import { Request, Response } from "express";

import SettingsService from "../services/settings.service.js";

class SettingsController {
  private getId = (req: Request): string => {
    return String(req.params.id);
  };

  private handleError = (res: Response, error: unknown, message: string) => {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: error instanceof Error ? error.message : message,
    });
  };

  /* ---------------------------------------------------------------------- */
  /* Get Settings                                                           */
  /* ---------------------------------------------------------------------- */

  get = async (_req: Request, res: Response) => {
    try {
      const settings = await SettingsService.get();

      return res.json({
        success: true,
        data: settings,
      });
    } catch (error) {
      return this.handleError(res, error, "Failed to fetch settings.");
    }
  };

  /* ---------------------------------------------------------------------- */
  /* Business                                                               */
  /* ---------------------------------------------------------------------- */

  updateBusiness = async (req: Request, res: Response): Promise<Response> => {
    try {
      if (!req.user?.userId) {
        return res.status(401).json({
          success: false,
          message: "Unauthorized",
        });
      }

      const settings = await SettingsService.updateBusiness(
        req.user.userId,
        req.body,
      );

      return res.json({
        success: true,
        message: "Business settings updated successfully.",
        data: settings,
      });
    } catch (error) {
      return this.handleError(
        res,
        error,
        "Failed to update business settings.",
      );
    }
  };

  /* ---------------------------------------------------------------------- */
  /* Users                                                                  */
  /* ---------------------------------------------------------------------- */

  updateUsers = async (req: Request, res: Response) => {
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
  };

  /* ---------------------------------------------------------------------- */
  /* Payment                                                                */
  /* ---------------------------------------------------------------------- */

  updatePayment = async (req: Request, res: Response) => {
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
  };

  /* ---------------------------------------------------------------------- */
  /* Invoice                                                                */
  /* ---------------------------------------------------------------------- */

  updateInvoice = async (req: Request, res: Response): Promise<Response> => {
    try {
      const userId = req.user?.userId;

      if (!userId) {
        return res.status(401).json({
          success: false,
          message: "Authenticated user not found.",
        });
      }

      const settings = await SettingsService.updateInvoice(userId, req.body);

      return res.json({
        success: true,
        message: "Invoice settings updated successfully.",
        data: settings,
      });
    } catch (error) {
      return this.handleError(res, error, "Failed to update invoice settings.");
    }
  };

  /* ---------------------------------------------------------------------- */
  /* Tax                                                                    */
  /* ---------------------------------------------------------------------- */

  updateTax = async (req: Request, res: Response): Promise<Response> => {
    try {
      const userId = req.user?.userId;

      if (!userId) {
        return res.status(401).json({
          success: false,
          message: "Unauthorized",
        });
      }

      const settings = await SettingsService.updateTax(userId, req.body);

      return res.json({
        success: true,
        message: "Tax settings updated successfully.",
        data: settings.tax,
      });
    } catch (error) {
      return this.handleError(res, error, "Failed to update tax settings.");
    }
  };

  /* ---------------------------------------------------------------------- */
  /* Numbering                                                              */
  /* ---------------------------------------------------------------------- */

  updateNumbering = async (req: Request, res: Response): Promise<Response> => {
    try {
      const userId = req.user?.userId;

      if (!userId) {
        return res.status(401).json({
          success: false,
          message: "Unauthorized",
        });
      }

      const settings = await SettingsService.updateNumbering(userId, req.body);

      return res.json({
        success: true,
        message: "Number series updated successfully.",
        data: settings.numbering,
      });
    } catch (error) {
      return this.handleError(res, error, "Failed to update number series.");
    }
  };

  /* ---------------------------------------------------------------------- */
  /* Data Management                                                        */
  /* ---------------------------------------------------------------------- */

  updateDataManagement = async (req: Request, res: Response) => {
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
  };

  /* ---------------------------------------------------------------------- */
  /* Notification                                                           */
  /* ---------------------------------------------------------------------- */

  updateNotification = async (req: Request, res: Response) => {
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
  };

  /* ---------------------------------------------------------------------- */
  /* Appearance                                                             */
  /* ---------------------------------------------------------------------- */

  updateAppearance = async (req: Request, res: Response) => {
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
  };

  /* ---------------------------------------------------------------------- */
  /* System                                                                 */
  /* ---------------------------------------------------------------------- */

  updateSystem = async (req: Request, res: Response) => {
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
  };

  /* ---------------------------------------------------------------------- */
  /* Security                                                               */
  /* ---------------------------------------------------------------------- */

  updateSecurity = async (req: Request, res: Response) => {
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
  };

  /* ---------------------------------------------------------------------- */
  /* About                                                                  */
  /* ---------------------------------------------------------------------- */

  updateAbout = async (req: Request, res: Response) => {
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
  };

  /* ---------------------------------------------------------------------- */
  /* Logo                                                                   */
  /* ---------------------------------------------------------------------- */

  updateLogo = async (req: Request, res: Response) => {
    try {
      if (!req.file) {
        return res.status(400).json({
          success: false,
          message: "Please upload a logo.",
        });
      }

      const settings = await SettingsService.updateLogo(
        this.getId(req),
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
  };

  /* ---------------------------------------------------------------------- */
  /* Payment QR                                                             */
  /* ---------------------------------------------------------------------- */

  updatePaymentQr = async (req: Request, res: Response) => {
    try {
      if (!req.file) {
        return res.status(400).json({
          success: false,
          message: "Please upload a payment QR.",
        });
      }

      const settings = await SettingsService.updatePaymentQr(
        this.getId(req),
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
  };

  /* ---------------------------------------------------------------------- */
  /* Generate Payment QR                                                    */
  /* ---------------------------------------------------------------------- */

  paymentQr = async (req: Request, res: Response) => {
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
  };

  /* ---------------------------------------------------------------------- */
  /* Payment Status                                                         */
  /* ---------------------------------------------------------------------- */

  paymentStatus = async (_req: Request, res: Response) => {
    try {
      const status = await SettingsService.getPaymentStatus();

      return res.json({
        success: true,
        data: status,
      });
    } catch (error) {
      return this.handleError(res, error, "Failed to fetch payment status.");
    }
  };

  async initializeFromUser(req: Request, res: Response) {
    try {
      if (!req.user) {
        return res.status(401).json({
          success: false,
          message: "Unauthorized",
        });
      }

      const settings = await SettingsService.initializeForUser(req.user.userId);

      return res.status(200).json({
        success: true,
        message: "Settings initialized successfully.",
        data: settings,
      });
    } catch (error) {
      console.error("Failed to initialize settings:", error);

      return res.status(500).json({
        success: false,
        message:
          error instanceof Error
            ? error.message
            : "Failed to initialize settings.",
      });
    }
  }
}

export default new SettingsController();
