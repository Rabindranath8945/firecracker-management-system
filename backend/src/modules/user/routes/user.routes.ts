import { Router } from "express";

import UserController from "../controllers/user.controller.js";

import { authenticate } from "../../auth/middleware/auth.middleware.js";
import { authorize } from "../../auth/middleware/permission.middleware.js";

import { asyncHandler } from "../../../common/utils/async-handler.js";

const router = Router();

/* -------------------------------------------------------------------------- */
/*                               Current User                                 */
/* -------------------------------------------------------------------------- */

router.get("/me", authenticate, asyncHandler(UserController.me));

/* -------------------------------------------------------------------------- */
/*                           Employee Management                              */
/* -------------------------------------------------------------------------- */

router.post(
  "/employees",
  authenticate,
  authorize("OWNER"),
  asyncHandler(UserController.createEmployee),
);

router.get(
  "/employees",
  authenticate,
  authorize("OWNER", "MANAGER"),
  asyncHandler(UserController.getEmployees),
);

router.get(
  "/employees/:id",
  authenticate,
  authorize("OWNER", "MANAGER"),
  asyncHandler(UserController.getEmployeeById),
);

router.put(
  "/employees/:id",
  authenticate,
  authorize("OWNER", "MANAGER"),
  asyncHandler(UserController.updateEmployee),
);

router.patch(
  "/employees/:id/status",
  authenticate,
  authorize("OWNER"),
  asyncHandler(UserController.toggleEmployeeStatus),
);

router.delete(
  "/employees/:id",
  authenticate,
  authorize("OWNER"),
  asyncHandler(UserController.deleteEmployee),
);

export default router;
