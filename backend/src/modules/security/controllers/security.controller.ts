import { Request, Response } from "express";

import SecurityService from "../services/security.service.js";

class SecurityController {
  private handleError(res: Response, error: unknown, message: string) {
    return res.status(500).json({
      success: false,
      message: error instanceof Error ? error.message : message,
    });
  }

  async get(_req: Request, res: Response) {
    try {
      const security = await SecurityService.get();

      return res.json({
        success: true,
        data: security,
      });
    } catch (error) {
      return this.handleError(res, error, "Failed to fetch security settings.");
    }
  }

  async getById(req: Request, res: Response) {
    try {
      const security = await SecurityService.getById(String(req.params.id));

      return res.json({
        success: true,
        data: security,
      });
    } catch (error) {
      return this.handleError(res, error, "Failed to fetch security settings.");
    }
  }

  async getByUser(req: Request, res: Response) {
    try {
      const security = await SecurityService.getByUser(
        String(req.params.userId),
      );

      return res.json({
        success: true,
        data: security,
      });
    } catch (error) {
      return this.handleError(res, error, "Failed to fetch user security.");
    }
  }

  async update(req: Request, res: Response) {
    try {
      const security = await SecurityService.update(
        String(req.params.id),
        req.body,
      );

      return res.json({
        success: true,
        message: "Security updated successfully.",
        data: security,
      });
    } catch (error) {
      return this.handleError(res, error, "Failed to update security.");
    }
  }

  /* -------------------------------------------------------------------------- */
  /*                                   Device                                   */
  /* -------------------------------------------------------------------------- */

  async registerDevice(req: Request, res: Response) {
    try {
      const security = await SecurityService.registerDevice(
        String(req.params.id),
        req.body,
      );

      return res.json({
        success: true,
        message: "Device registered successfully.",
        data: security,
      });
    } catch (error) {
      return this.handleError(res, error, "Failed to register device.");
    }
  }

  async getCurrentDevice(req: Request, res: Response) {
    try {
      const security = await SecurityService.getCurrentDevice(
        String(req.params.id),
      );

      return res.json({
        success: true,
        data: security,
      });
    } catch (error) {
      return this.handleError(res, error, "Failed to fetch current device.");
    }
  }

  async findDevice(req: Request, res: Response) {
    try {
      const security = await SecurityService.findDevice(
        String(req.params.id),
        String(req.params.deviceId),
      );

      return res.json({
        success: true,
        data: security,
      });
    } catch (error) {
      return this.handleError(res, error, "Failed to fetch device.");
    }
  }

  async updateDevice(req: Request, res: Response) {
    try {
      const security = await SecurityService.updateDevice(
        String(req.params.id),
        String(req.params.deviceId),
        req.body,
      );

      return res.json({
        success: true,
        message: "Device updated successfully.",
        data: security,
      });
    } catch (error) {
      return this.handleError(res, error, "Failed to update device.");
    }
  }

  async removeDevice(req: Request, res: Response) {
    try {
      const security = await SecurityService.removeDevice(
        String(req.params.id),
        String(req.params.deviceId),
      );

      return res.json({
        success: true,
        message: "Device removed successfully.",
        data: security,
      });
    } catch (error) {
      return this.handleError(res, error, "Failed to remove device.");
    }
  }

  async enableBiometric(req: Request, res: Response) {
    try {
      const security = await SecurityService.enableBiometric(
        String(req.params.id),
        String(req.params.deviceId),
        req.body,
      );

      return res.json({
        success: true,
        message: "Biometric updated successfully.",
        data: security,
      });
    } catch (error) {
      return this.handleError(res, error, "Failed to update biometric.");
    }
  }

  /* -------------------------------------------------------------------------- */
  /*                                  Session                                   */
  /* -------------------------------------------------------------------------- */

  async createSession(req: Request, res: Response) {
    try {
      const security = await SecurityService.createSession(
        String(req.params.id),
        req.body,
      );

      return res.json({
        success: true,
        message: "Session created successfully.",
        data: security,
      });
    } catch (error) {
      return this.handleError(res, error, "Failed to create session.");
    }
  }

  async findSession(req: Request, res: Response) {
    try {
      const security = await SecurityService.findSession(
        String(req.params.id),
        String(req.params.sessionId),
      );

      return res.json({
        success: true,
        data: security,
      });
    } catch (error) {
      return this.handleError(res, error, "Failed to fetch session.");
    }
  }

  async removeSession(req: Request, res: Response) {
    try {
      const security = await SecurityService.removeSession(
        String(req.params.id),
        String(req.params.sessionId),
      );

      return res.json({
        success: true,
        message: "Session removed successfully.",
        data: security,
      });
    } catch (error) {
      return this.handleError(res, error, "Failed to remove session.");
    }
  }

  async logoutAll(req: Request, res: Response) {
    try {
      const security = await SecurityService.logoutAll(String(req.params.id));

      return res.json({
        success: true,
        message: "Logged out from all devices.",
        data: security,
      });
    } catch (error) {
      return this.handleError(res, error, "Failed to logout all devices.");
    }
  }

  async updateLastLogin(req: Request, res: Response) {
    try {
      const security = await SecurityService.updateLastLogin(
        String(req.params.id),
        String(req.params.deviceId),
      );

      return res.json({
        success: true,
        message: "Last login updated.",
        data: security,
      });
    } catch (error) {
      return this.handleError(res, error, "Failed to update last login.");
    }
  }

  async updateLastActive(req: Request, res: Response) {
    try {
      const security = await SecurityService.updateLastActive(
        String(req.params.id),
        String(req.params.deviceId),
      );

      return res.json({
        success: true,
        message: "Last active updated.",
        data: security,
      });
    } catch (error) {
      return this.handleError(res, error, "Failed to update last active.");
    }
  }

  async clearDevices(req: Request, res: Response) {
    try {
      const security = await SecurityService.clearDevices(
        String(req.params.id),
      );

      return res.json({
        success: true,
        message: "All devices removed successfully.",
        data: security,
      });
    } catch (error) {
      return this.handleError(res, error, "Failed to remove devices.");
    }
  }

  /* -------------------------------------------------------------------------- */
  /*                                     PIN                                    */
  /* -------------------------------------------------------------------------- */

  async setPin(req: Request, res: Response) {
    try {
      const security = await SecurityService.setPin(
        String(req.params.id),
        req.body,
      );

      return res.json({
        success: true,
        message: "PIN updated successfully.",
        data: security,
      });
    } catch (error) {
      return this.handleError(res, error, "Failed to update PIN.");
    }
  }

  async verifyPin(req: Request, res: Response) {
    try {
      const result = await SecurityService.verifyPin(
        String(req.params.id),
        req.body,
      );

      return res.json(result);
    } catch (error) {
      return this.handleError(res, error, "PIN verification failed.");
    }
  }

  async updateLockType(req: Request, res: Response) {
    try {
      const security = await SecurityService.updateLockType(
        String(req.params.id),
        req.body.lockType,
      );

      return res.json({
        success: true,
        message: "Lock type updated successfully.",
        data: security,
      });
    } catch (error) {
      return this.handleError(res, error, "Failed to update lock type.");
    }
  }

  /* -------------------------------------------------------------------------- */
  /*                                   Login                                    */
  /* -------------------------------------------------------------------------- */

  async login(req: Request, res: Response) {
    try {
      const result = await SecurityService.login(req.body);

      return res.json(result);
    } catch (error) {
      return this.handleError(res, error, "Login failed.");
    }
  }
}

export default new SecurityController();
