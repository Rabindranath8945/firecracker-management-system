import { Router } from "express";

import { authController } from "../controllers/auth.controller.js";

import { authenticate } from "../middleware/auth.middleware.js";
import { asyncHandler } from "../../../common/utils/async-handler.js";

const router = Router();

/* -------------------------------------------------------------------------- */
/*                                Authentication                              */
/* -------------------------------------------------------------------------- */

router.post("/google", asyncHandler(authController.googleLogin));

router.post("/refresh", asyncHandler(authController.refresh));

router.post("/logout", asyncHandler(authController.logout));

router.get("/me", authenticate, asyncHandler(authController.me));

/* -------------------------------------------------------------------------- */
/*                           Complete Onboarding                              */
/* -------------------------------------------------------------------------- */

router.patch(
  "/onboarding",
  authenticate,
  asyncHandler(authController.completeOnboarding),
);

export default router;
