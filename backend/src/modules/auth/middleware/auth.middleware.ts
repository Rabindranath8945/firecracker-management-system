import { NextFunction, Request, Response } from "express";
import { jwtProvider } from "../../auth/providers/jwt.providers.js";

export function authenticate(req: Request, res: Response, next: NextFunction) {
  try {
    const authorization = req.headers.authorization;

    if (!authorization?.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const token = authorization.replace("Bearer ", "");

    const payload = jwtProvider.verifyAccessToken(token);

    req.user = {
      userId: payload.userId,
      deviceId: payload.deviceId,
      role: payload.role,
    };

    next();
  } catch {
    return res.status(401).json({
      success: false,
      message: "Invalid or expired token.",
    });
  }
}
