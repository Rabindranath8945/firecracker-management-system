import { Request, Response } from "express";

export function healthController(_req: Request, res: Response) {
  res.json({
    success: true,
    status: "UP",
    timestamp: new Date(),
    service: "Firecracker Management API",
    version: "1.0.0",
  });
}
