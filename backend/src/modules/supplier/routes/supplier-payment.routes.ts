import { Router } from "express";

import SupplierPaymentController from "../controllers/supplier-payment.controller.js";

import { authenticate } from "../../auth/middleware/auth.middleware.js";

import { asyncHandler } from "../../../common/utils/async-handler.js";

const router = Router();

/* -------------------------------------------------------------------------- */
/* CREATE                                                                     */
/* -------------------------------------------------------------------------- */

router.post("/", authenticate, asyncHandler(SupplierPaymentController.create));

/* -------------------------------------------------------------------------- */
/* GET ALL                                                                    */
/* -------------------------------------------------------------------------- */

router.get("/", authenticate, asyncHandler(SupplierPaymentController.getAll));

/* -------------------------------------------------------------------------- */
/* GET SUPPLIER PAYMENT TOTAL                                                 */
/* -------------------------------------------------------------------------- */

router.get(
  "/supplier/:supplierId/total",
  authenticate,
  asyncHandler(SupplierPaymentController.getTotalBySupplier),
);

/* -------------------------------------------------------------------------- */
/* GET BY ID                                                                  */
/* -------------------------------------------------------------------------- */

router.get(
  "/:id",
  authenticate,
  asyncHandler(SupplierPaymentController.getById),
);

/* -------------------------------------------------------------------------- */
/* UPDATE                                                                     */
/* -------------------------------------------------------------------------- */

router.put(
  "/:id",
  authenticate,
  asyncHandler(SupplierPaymentController.update),
);

/* -------------------------------------------------------------------------- */
/* DELETE                                                                     */
/* -------------------------------------------------------------------------- */

router.delete(
  "/:id",
  authenticate,
  asyncHandler(SupplierPaymentController.delete),
);

export default router;
