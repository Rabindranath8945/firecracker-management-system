import { NextFunction, Request, Response } from "express";
import { jwtProvider } from "../../modules/auth/providers/jwt.providers.js";

declare global {
  namespace Express {
    interface Request {
      user?: {
        userId: string;
        deviceId: string;
        role: string;
      };
    }
  }
}

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

    req.user = payload;

    next();
  } catch (_error) {
    return res.status(401).json({
      success: false,
      message: "Invalid or expired token.",
    });
  }
}
