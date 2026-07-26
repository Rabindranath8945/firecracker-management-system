import { Router } from "express";

import PurchaseController from "../controllers/purchase.controller.js";

import { authenticate } from "../../auth/middleware/auth.middleware.js";

import { asyncHandler } from "../../../common/utils/async-handler.js";

import { ocrUpload } from "../../../common/middleware/upload.middleware.js";

const router = Router();

router.post("/", authenticate, asyncHandler(PurchaseController.create));

router.get("/", asyncHandler(PurchaseController.getAll));

router.get("/:id", asyncHandler(PurchaseController.getById));

router.put("/:id", authenticate, asyncHandler(PurchaseController.update));

router.delete("/:id", authenticate, asyncHandler(PurchaseController.delete));

export default router;
