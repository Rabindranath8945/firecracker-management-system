import { Router } from "express";

import PurchaseController from "../controllers/purchase.controller.js";
import PurchaseOCRController from "../controllers/purchase-ocr.controller.js";

import { authenticate } from "../../auth/middleware/auth.middleware.js";

import { asyncHandler } from "../../../common/utils/async-handler.js";

import { ocrUpload } from "../../../common/middleware/upload.middleware.js";

const router = Router();

/* -------------------------------------------------------------------------- */
/* CREATE PURCHASE                                                            */
/* -------------------------------------------------------------------------- */

router.post("/", authenticate, asyncHandler(PurchaseController.create));

/* -------------------------------------------------------------------------- */
/* PURCHASE OCR                                                               */
/* -------------------------------------------------------------------------- */

router.post(
  "/ocr",
  authenticate,
  ocrUpload.single("file"),
  asyncHandler(PurchaseOCRController.extract),
);

/* -------------------------------------------------------------------------- */
/* GET ALL PURCHASES                                                          */
/* -------------------------------------------------------------------------- */

router.get("/", asyncHandler(PurchaseController.getAll));

/* -------------------------------------------------------------------------- */
/* GET PURCHASE BY ID                                                         */
/* -------------------------------------------------------------------------- */

router.get("/:id", asyncHandler(PurchaseController.getById));

/* -------------------------------------------------------------------------- */
/* UPDATE PURCHASE                                                            */
/* -------------------------------------------------------------------------- */

router.put("/:id", authenticate, asyncHandler(PurchaseController.update));

/* -------------------------------------------------------------------------- */
/* DELETE PURCHASE                                                            */
/* -------------------------------------------------------------------------- */

router.delete("/:id", authenticate, asyncHandler(PurchaseController.delete));

export default router;
