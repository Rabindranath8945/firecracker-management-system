import { Router } from "express";

import BusinessController from "../controllers/business.controller.js";

import { authenticate } from "../../auth/middleware/auth.middleware.js";

import { asyncHandler } from "../../../common/utils/async-handler.js";

const router = Router();

/* -------------------------------------------------------------------------- */
/*                               Business                                      */
/* -------------------------------------------------------------------------- */

router.post("/", authenticate, asyncHandler(BusinessController.create));

router.get("/me", authenticate, asyncHandler(BusinessController.getMine));

router.get("/search", authenticate, asyncHandler(BusinessController.search));

router.put("/:id", authenticate, asyncHandler(BusinessController.update));

export default router;
