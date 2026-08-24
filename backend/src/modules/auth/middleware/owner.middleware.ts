import { Request, Response, NextFunction } from "express";

export function ownerOnly(req: Request, res: Response, next: NextFunction) {
  if (!req.user) {
    return res.status(401).json({
      success: false,
      message: "Unauthorized.",
    });
  }

  if (req.user.role !== "OWNER") {
    return res.status(403).json({
      success: false,
      message: "Only owner can perform this action.",
    });
  }

  next();
}
