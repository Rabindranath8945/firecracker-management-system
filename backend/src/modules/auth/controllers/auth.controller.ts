import { Request, Response } from "express";

import { authService } from "../services/auth.service.js";

class AuthController {
  /* -------------------------------------------------------------------------- */
  /*                              Google Login                                  */
  /* -------------------------------------------------------------------------- */

  googleLogin = async (req: Request, res: Response) => {
    try {
      const { credential, deviceId } = req.body ?? {};

      if (!credential) {
        return res.status(400).json({
          success: false,
          message: "Google credential is required.",
        });
      }

      if (!deviceId) {
        return res.status(400).json({
          success: false,
          message: "Device ID is required.",
        });
      }

      const result = await authService.googleLogin(credential, deviceId);

      return res.status(200).json({
        success: true,
        message: "Login successful.",
        data: result,
      });
    } catch (error) {
      console.error(error);

      return res.status(500).json({
        success: false,
        message: "Internal Server Error",
      });
    }
  };

  /* -------------------------------------------------------------------------- */
  /*                         Complete Onboarding                                */
  /* -------------------------------------------------------------------------- */

  completeOnboarding = async (req: Request, res: Response) => {
    const userId = req.user?.userId;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized.",
      });
    }

    await authService.completeOnboarding(userId);

    return res.json({
      success: true,
      message: "Onboarding completed.",
    });
  };

  me = async (req: Request, res: Response) => {
    const userId = req.user?.userId;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const user = await authService.me(userId);

    return res.json({
      success: true,
      data: user,
    });
  };

  refresh = async (req: Request, res: Response) => {
    const { refreshToken } = req.body;

    const data = await authService.refresh(refreshToken);

    return res.json({
      success: true,
      data,
    });
  };

  logout = async (req: Request, res: Response) => {
    const { refreshToken } = req.body;

    await authService.logout(refreshToken);

    return res.json({
      success: true,
    });
  };
}

export const authController = new AuthController();
