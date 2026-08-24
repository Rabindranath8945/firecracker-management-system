import { Router } from "express";

import DashboardController from "../controllers/dashboard.controller.js";

import { authenticate } from "../../auth/middleware/auth.middleware.js";
import { asyncHandler } from "../../../common/utils/async-handler.js";

const router = Router();

/* -------------------------------------------------------------------------- */
/*                                Dashboard                                   */
/* -------------------------------------------------------------------------- */

router.get("/", authenticate, asyncHandler(DashboardController.getDashboard));

export default router;
