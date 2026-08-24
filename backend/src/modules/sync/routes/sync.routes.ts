import { Router } from "express";

import SyncController from "../controllers/sync.controller.js";

import { authenticate } from "../../auth/middleware/auth.middleware.js";
import { asyncHandler } from "../../../common/utils/async-handler.js";

const router = Router();

router.post("/", authenticate, asyncHandler(SyncController.sync));

export default router;
