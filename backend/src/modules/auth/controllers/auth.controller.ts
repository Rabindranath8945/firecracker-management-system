import { NextFunction, Request, Response } from "express";

import { sendSuccess } from "../../../common/shared/response.js";
import { authService } from "../services/auth.service.js";

class AuthController {
  googleLogin = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { credential, deviceId } = req.body;

      const result = await authService.googleLogin(credential, deviceId);

      return sendSuccess(res, result, "Authentication successful");
    } catch (error) {
      next(error);
    }
  };

  refresh = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { refreshToken } = req.body;

      const result = await authService.refresh(refreshToken);

      return sendSuccess(res, result, "Token refreshed successfully");
    } catch (error) {
      next(error);
    }
  };

  logout = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { refreshToken } = req.body;

      await authService.logout(refreshToken);

      return sendSuccess(res, null, "Logged out successfully");
    } catch (error) {
      next(error);
    }
  };

  me = async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!req.user) {
        return res.status(401).json({
          success: false,
          message: "Unauthorized",
        });
      }

      const user = await authService.me(req.user.userId);

      return sendSuccess(res, user, "User retrieved successfully");
    } catch (error) {
      next(error);
    }
  };
}

export const authController = new AuthController();
