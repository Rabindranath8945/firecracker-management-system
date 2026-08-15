import { Router } from "express";
import multer from "multer";

import PurchaseOCRController from "../controllers/purchase-ocr.controller.js";

// Use memory storage because we immediately send
// the image buffer to Google Vision.
const upload = multer({
  storage: multer.memoryStorage(),

  limits: {
    fileSize: 10 * 1024 * 1024,
  },

  fileFilter: (_req, file, callback) => {
    const allowedTypes = ["image/jpeg", "image/png", "image/webp"];

    if (!allowedTypes.includes(file.mimetype)) {
      callback(
        new Error("Only JPG, PNG and WEBP invoice images are supported."),
      );

      return;
    }

    callback(null, true);
  },
});

const router = Router();

router.post("/ocr", upload.single("file"), PurchaseOCRController.extract);

export default router;
