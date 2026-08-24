import { Router } from "express";

import AppSetupController from "../controllers/app-setup.controller.js";

import { authenticate } from "../../auth/middleware/auth.middleware.js";

import { asyncHandler } from "../../../common/utils/async-handler.js";

const router = Router();

/* -------------------------------------------------------------------------- */
/*                                  Basic                                     */
/* -------------------------------------------------------------------------- */

router.get("/", authenticate, asyncHandler(AppSetupController.get));

router.get("/:id", authenticate, asyncHandler(AppSetupController.getById));

router.get(
  "/user/:userId",
  authenticate,
  asyncHandler(AppSetupController.getByUser),
);

router.get(
  "/status/:userId",
  authenticate,
  asyncHandler(AppSetupController.getStatus),
);

router.put("/:id", authenticate, asyncHandler(AppSetupController.update));

/* -------------------------------------------------------------------------- */
/*                              Setup Process                                 */
/* -------------------------------------------------------------------------- */

router.patch(
  "/:id/language",
  authenticate,
  asyncHandler(AppSetupController.updateLanguage),
);

router.patch(
  "/:id/business",
  authenticate,
  asyncHandler(AppSetupController.updateBusiness),
);

router.post(
  "/:id/initialize",
  authenticate,
  asyncHandler(AppSetupController.initialize),
);

router.post("/start", authenticate, asyncHandler(AppSetupController.start));

router.post("/:id/reset", authenticate, asyncHandler(AppSetupController.reset));

export default router;
