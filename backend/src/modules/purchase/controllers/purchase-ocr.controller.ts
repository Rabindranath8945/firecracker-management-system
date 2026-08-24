import { Request, Response } from "express";

import OCRService from "../../ocr/services/ocr.service.js";

class PurchaseOCRController {
  extract = async (req: Request, res: Response) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Invoice image is required.",
      });
    }

    const result = await OCRService.extractText(
      req.file.buffer,
      req.file.mimetype,
    );

    return res.status(200).json({
      success: true,
      message: "Invoice OCR completed successfully.",
      data: result,
    });
  };
}

export default new PurchaseOCRController();
