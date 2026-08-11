import { Router } from "express";

import CustomerPaymentController from "../controllers/customer-payment.controller.js";
import { authenticate } from "../../auth/middleware/auth.middleware.js";
import { asyncHandler } from "../../../common/utils/async-handler.js";

const router = Router();

/* -------------------------------------------------------------------------- */
/* Create Due Payment                                                        */
/* -------------------------------------------------------------------------- */

router.post(
  "/:customerId/due-payment",
  authenticate,
  asyncHandler(CustomerPaymentController.create),
);

/* -------------------------------------------------------------------------- */
/* Payment History                                                            */
/* -------------------------------------------------------------------------- */

router.get(
  "/:customerId/payments",
  authenticate,
  asyncHandler(CustomerPaymentController.getCustomerPayments),
);

/* -------------------------------------------------------------------------- */
/* Current Customer Due                                                       */
/* -------------------------------------------------------------------------- */

router.get(
  "/:customerId/due",
  authenticate,
  asyncHandler(CustomerPaymentController.getCustomerDue),
);

export default router;
