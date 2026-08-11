import { Router } from "express";

import SettingsController from "../controllers/settings.controller.js";

import { authenticate } from "../../auth/middleware/auth.middleware.js";

import { asyncHandler } from "../../../common/utils/async-handler.js";

import { ocrUpload } from "../../../common/uploads/middleware/ocr-upload.middleware.js";

import { settingsUpload } from "../../../common/uploads/middleware/upload.middleware.js";

const router = Router();

router.use(authenticate);

router.get("/", asyncHandler(SettingsController.get));

// router.post("/", asyncHandler(SettingsController.create));

router.patch("/business", asyncHandler(SettingsController.updateBusiness));

router.patch("/users", asyncHandler(SettingsController.updateUsers));

router.patch("/payment", asyncHandler(SettingsController.updatePayment));

router.patch("/invoice", asyncHandler(SettingsController.updateInvoice));

router.patch("/tax", asyncHandler(SettingsController.updateTax));

router.patch("/numbering", asyncHandler(SettingsController.updateNumbering));

router.get("/payment/qr", asyncHandler(SettingsController.paymentQr));

router.patch(
  "/payment/qr",
  ocrUpload.single("qr"),
  asyncHandler(SettingsController.updatePaymentQr),
);

router.get("/payment/status", asyncHandler(SettingsController.paymentStatus));

router.get("/payment/qr", asyncHandler(SettingsController.paymentQr));

router.patch(
  "/logo",
  settingsUpload.single("logo"),
  asyncHandler(SettingsController.updateLogo),
);

router.patch(
  "/data-management",
  asyncHandler(SettingsController.updateDataManagement),
);

router.patch(
  "/notification",
  asyncHandler(SettingsController.updateNotification),
);

router.patch("/appearance", asyncHandler(SettingsController.updateAppearance));

router.patch("/system", asyncHandler(SettingsController.updateSystem));

router.patch("/security", asyncHandler(SettingsController.updateSecurity));

router.patch("/about", asyncHandler(SettingsController.updateAbout));

export default router;
