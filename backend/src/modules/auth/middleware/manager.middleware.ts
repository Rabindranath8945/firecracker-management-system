import { Request, Response, NextFunction } from "express";

export function managerOrOwner(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  if (!req.user) {
    return res.status(401).json({
      success: false,
      message: "Unauthorized.",
    });
  }

  if (req.user.role !== "OWNER" && req.user.role !== "MANAGER") {
    return res.status(403).json({
      success: false,
      message: "Access denied.",
    });
  }

  next();
}
