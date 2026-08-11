import { Router } from "express";

import PurchaseOcrController from "../controllers/purchase-ocr.controller.js";

import { authenticate } from "../../../common/middleware/authenticate.js";
import { ocrUpload } from "../../../common/uploads/middleware/ocr-upload.middleware.js";

const router = Router();

router.post(
  "/scan",
  authenticate,
  ocrUpload.single("invoice"),
  PurchaseOcrController.scan,
);

router.post("/save", authenticate, PurchaseOcrController.save);

export default router;
