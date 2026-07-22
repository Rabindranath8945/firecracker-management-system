import { Request, Response } from "express";
import { authService } from "../services/auth.service.js";

class AuthController {
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
}

export const authController = new AuthController();
