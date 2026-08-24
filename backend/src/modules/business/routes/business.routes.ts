import { Router } from "express";

import BusinessController from "../controllers/business.controller.js";

import { authenticate } from "../../auth/middleware/auth.middleware.js";

import { asyncHandler } from "../../../common/utils/async-handler.js";

const router = Router();

/* -------------------------------------------------------------------------- */
/*                               Business                                     */
/* -------------------------------------------------------------------------- */

router.post("/", authenticate, asyncHandler(BusinessController.create));

/* -------------------------------------------------------------------------- */
/*                           Current Business                                 */
/* -------------------------------------------------------------------------- */

router.get(
  "/current",
  authenticate,
  asyncHandler(BusinessController.getCurrent),
);

/* -------------------------------------------------------------------------- */
/*                            My Businesses                                   */
/* -------------------------------------------------------------------------- */

router.get("/me", authenticate, asyncHandler(BusinessController.getMine));

/* -------------------------------------------------------------------------- */
/*                            Search Business                                 */
/* -------------------------------------------------------------------------- */

router.get("/search", authenticate, asyncHandler(BusinessController.search));

/* -------------------------------------------------------------------------- */
/*                             Update Business                                */
/* -------------------------------------------------------------------------- */

router.put("/:id", authenticate, asyncHandler(BusinessController.update));

/* -------------------------------------------------------------------------- */
/*                            Switch Business                                 */
/* -------------------------------------------------------------------------- */

router.patch(
  "/:id/switch",
  authenticate,
  asyncHandler(BusinessController.switchBusiness),
);

export default router;
