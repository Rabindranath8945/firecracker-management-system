import { Router } from "express";

import ReportController from "../controllers/report.controller.js";

import { asyncHandler } from "../../../common/utils/async-handler.js";

import { authenticate } from "../../auth/middleware/auth.middleware.js";

const router = Router();

// Sales
router.get("/sales/pdf", authenticate, asyncHandler(ReportController.salesPdf));

// Purchase
router.get(
  "/purchase/pdf",
  authenticate,
  asyncHandler(ReportController.purchasePdf),
);

// Expense
router.get(
  "/expense/pdf",
  authenticate,
  asyncHandler(ReportController.expensePdf),
);

// Customer
router.get(
  "/customer/pdf",
  authenticate,
  asyncHandler(ReportController.customerPdf),
);

// Supplier
router.get(
  "/supplier/pdf",
  authenticate,
  asyncHandler(ReportController.supplierPdf),
);

// Stock
router.get("/stock/pdf", authenticate, asyncHandler(ReportController.stockPdf));

// Low Stock
router.get(
  "/low-stock/pdf",
  authenticate,
  asyncHandler(ReportController.lowStockPdf),
);

// GST
router.get("/gst/pdf", authenticate, asyncHandler(ReportController.gstPdf));

// Profit & Loss
router.get(
  "/profit-loss/pdf",
  authenticate,
  asyncHandler(ReportController.profitLossPdf),
);

export default router;
