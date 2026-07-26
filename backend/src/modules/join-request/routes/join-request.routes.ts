import { Router } from "express";

import JoinRequestController from "../controller/join-request.controller.js";

import { authenticate } from "../../auth/middleware/auth.middleware.js";
import { authorize } from "../../auth/middleware/permission.middleware.js";

import { asyncHandler } from "../../../common/utils/async-handler.js";

const router = Router();

/* -------------------------------------------------------------------------- */
/*                           Employee Join Request                            */
/* -------------------------------------------------------------------------- */

router.post("/", authenticate, asyncHandler(JoinRequestController.create));

router.get(
  "/pending",
  authenticate,
  authorize("OWNER", "MANAGER"),
  asyncHandler(JoinRequestController.pending),
);

router.patch(
  "/:id/approve",
  authenticate,
  authorize("OWNER", "MANAGER"),
  asyncHandler(JoinRequestController.approve),
);

router.patch(
  "/:id/reject",
  authenticate,
  authorize("OWNER", "MANAGER"),
  asyncHandler(JoinRequestController.reject),
);

export default router;
