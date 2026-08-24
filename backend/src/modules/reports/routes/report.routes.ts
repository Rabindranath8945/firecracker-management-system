import { Router } from "express";

import ReportController from "../controllers/report.controller.js";

import { asyncHandler } from "../../../common/utils/async-handler.js";
import { authenticate } from "../../auth/middleware/auth.middleware.js";

const router = Router();

/* ========================================================================== */
/* JSON REPORTS                                                               */
/* ========================================================================== */

/**
 * GET /api/v1/reports/overview
 */
router.get("/overview", authenticate, asyncHandler(ReportController.overview));

/**
 * GET /api/v1/reports/sales
 */
router.get("/sales", authenticate, asyncHandler(ReportController.sales));

/**
 * GET /api/v1/reports/purchase
 */
router.get("/purchase", authenticate, asyncHandler(ReportController.purchase));

/**
 * GET /api/v1/reports/customer
 */
router.get("/customer", authenticate, asyncHandler(ReportController.customer));

/**
 * GET /api/v1/reports/supplier
 */
router.get("/supplier", authenticate, asyncHandler(ReportController.supplier));

/**
 * GET /api/v1/reports/stock
 */
router.get("/stock", authenticate, asyncHandler(ReportController.stock));

/**
 * GET /api/v1/reports/profit-loss
 */
router.get("/profit", authenticate, asyncHandler(ReportController.profitLoss));

/* ========================================================================== */
/* PDF REPORTS                                                                */
/* ========================================================================== */

/**
 * GET /api/v1/reports/sales/pdf
 */
router.get("/sales/pdf", authenticate, asyncHandler(ReportController.salesPdf));

/**
 * GET /api/v1/reports/purchase/pdf
 */
router.get(
  "/purchase/pdf",
  authenticate,
  asyncHandler(ReportController.purchasePdf),
);

/**
 * GET /api/v1/reports/customer/pdf
 */
router.get(
  "/customer/pdf",
  authenticate,
  asyncHandler(ReportController.customerPdf),
);

/**
 * GET /api/v1/reports/supplier/pdf
 */
router.get(
  "/supplier/pdf",
  authenticate,
  asyncHandler(ReportController.supplierPdf),
);

/**
 * GET /api/v1/reports/stock/pdf
 */
router.get("/stock/pdf", authenticate, asyncHandler(ReportController.stockPdf));

/**
 * GET /api/v1/reports/low-stock/pdf
 */
router.get(
  "/low-stock/pdf",
  authenticate,
  asyncHandler(ReportController.lowStockPdf),
);

/**
 * GET /api/v1/reports/gst/pdf
 */
router.get("/gst/pdf", authenticate, asyncHandler(ReportController.gstPdf));

/**
 * GET /api/v1/reports/profit-loss/pdf
 */
router.get(
  "/profit-loss/pdf",
  authenticate,
  asyncHandler(ReportController.profitLossPdf),
);

export default router;
