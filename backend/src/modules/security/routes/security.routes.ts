import { Router } from "express";

import SecurityController from "../controllers/security.controller.js";

import { authenticate } from "../../auth/middleware/auth.middleware.js";

import { asyncHandler } from "../../../common/utils/async-handler.js";

const router = Router();

/* -------------------------------------------------------------------------- */
/*                                   Security                                 */
/* -------------------------------------------------------------------------- */

router.get("/", authenticate, asyncHandler(SecurityController.get));

router.get("/:id", authenticate, asyncHandler(SecurityController.getById));

router.get(
  "/user/:userId",
  authenticate,
  asyncHandler(SecurityController.getByUser),
);

router.put("/:id", authenticate, asyncHandler(SecurityController.update));

/* -------------------------------------------------------------------------- */
/*                                   Device                                   */
/* -------------------------------------------------------------------------- */

router.post(
  "/:id/devices",
  authenticate,
  asyncHandler(SecurityController.registerDevice),
);

router.patch(
  "/:id/devices/:deviceId",
  authenticate,
  asyncHandler(SecurityController.updateDevice),
);

router.delete(
  "/:id/devices/:deviceId",
  authenticate,
  asyncHandler(SecurityController.removeDevice),
);

router.patch(
  "/:id/devices/:deviceId/biometric",
  authenticate,
  asyncHandler(SecurityController.enableBiometric),
);

router.get(
  "/:id/current-device",
  authenticate,
  asyncHandler(SecurityController.getCurrentDevice),
);

router.get(
  "/:id/devices/:deviceId",
  authenticate,
  asyncHandler(SecurityController.findDevice),
);

router.delete(
  "/:id/devices",
  authenticate,
  asyncHandler(SecurityController.clearDevices),
);

router.patch(
  "/:id/devices/:deviceId/last-login",
  authenticate,
  asyncHandler(SecurityController.updateLastLogin),
);

router.patch(
  "/:id/devices/:deviceId/last-active",
  authenticate,
  asyncHandler(SecurityController.updateLastActive),
);
/* -------------------------------------------------------------------------- */
/*                                  Session                                   */
/* -------------------------------------------------------------------------- */

router.post(
  "/:id/sessions",
  authenticate,
  asyncHandler(SecurityController.createSession),
);

router.delete(
  "/:id/sessions/:sessionId",
  authenticate,
  asyncHandler(SecurityController.removeSession),
);

router.delete(
  "/:id/sessions",
  authenticate,
  asyncHandler(SecurityController.logoutAll),
);

/* -------------------------------------------------------------------------- */
/*                                     PIN                                    */
/* -------------------------------------------------------------------------- */

router.post("/:id/pin", authenticate, asyncHandler(SecurityController.setPin));

router.post(
  "/:id/pin/verify",
  authenticate,
  asyncHandler(SecurityController.verifyPin),
);

router.patch(
  "/:id/lock-type",
  authenticate,
  asyncHandler(SecurityController.updateLockType),
);

/* -------------------------------------------------------------------------- */
/*                                   Login                                    */
/* -------------------------------------------------------------------------- */

router.post("/login", asyncHandler(SecurityController.login));

export default router;
