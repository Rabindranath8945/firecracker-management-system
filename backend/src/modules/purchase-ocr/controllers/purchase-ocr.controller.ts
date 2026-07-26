import { Request, Response } from "express";

import PurchaseOcrService from "../services/purchase-ocr.service.js";

class PurchaseOcrController {
  async scan(req: Request, res: Response) {
    try {
      if (!req.file) {
        return res.status(400).json({
          success: false,
          message: "Invoice image is required.",
        });
      }

      const result = await PurchaseOcrService.scan(req.file.path);

      return res.json({
        success: true,
        data: result,
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: error instanceof Error ? error.message : "OCR failed.",
      });
    }
  }

  async save(req: Request, res: Response) {
    try {
      if (!req.user) {
        return res.status(401).json({
          success: false,
          message: "Unauthorized",
        });
      }

      const purchase = await PurchaseOcrService.save(req.body, req.user.userId);

      return res.status(201).json({
        success: true,
        data: purchase,
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message:
          error instanceof Error ? error.message : "Failed to save purchase.",
      });
    }
  }
}

export default new PurchaseOcrController();
