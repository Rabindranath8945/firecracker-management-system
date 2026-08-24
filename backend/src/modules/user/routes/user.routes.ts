import { Router } from "express";

import UserController from "../controllers/user.controller.js";

import { authenticate } from "../../auth/middleware/auth.middleware.js";
import { authorize } from "../../auth/middleware/permission.middleware.js";

import { asyncHandler } from "../../../common/utils/async-handler.js";

const router = Router();

/* -------------------------------------------------------------------------- */
/*                              Current User                                  */
/* -------------------------------------------------------------------------- */

/**
 * Get currently authenticated user's complete profile.
 *
 * Used by:
 * - Header profile
 * - User profile
 * - Google profile image
 * - Role display
 * - Permission display
 * - Account settings
 */
router.get("/me", authenticate, asyncHandler(UserController.me));

router.put("/me", authenticate, asyncHandler(UserController.updateMe));

router.patch("/me", authenticate, asyncHandler(UserController.updateMe));

/* -------------------------------------------------------------------------- */
/*                              App Security                                  */
/* -------------------------------------------------------------------------- */

/**
 * Enable / disable application lock.
 */
router.patch(
  "/app-lock",
  authenticate,
  asyncHandler(UserController.updateAppLock),
);

/* -------------------------------------------------------------------------- */
/*                             Business Selection                             */
/* -------------------------------------------------------------------------- */

/**
 * Set the business currently being used by the user.
 */
router.patch(
  "/business",
  authenticate,
  asyncHandler(UserController.setCurrentBusiness),
);

/* -------------------------------------------------------------------------- */
/*                              Onboarding                                    */
/* -------------------------------------------------------------------------- */

/**
 * Mark onboarding as completed.
 */
router.patch(
  "/onboarding",
  authenticate,
  asyncHandler(UserController.completeOnboarding),
);

/* -------------------------------------------------------------------------- */
/*                           Employee Management                              */
/* -------------------------------------------------------------------------- */

/**
 * Create employee.
 *
 * Only OWNER can create employees.
 */
router.post(
  "/employees",
  authenticate,
  authorize("OWNER"),
  asyncHandler(UserController.createEmployee),
);

/**
 * Get employees belonging to the current owner.
 *
 * OWNER and MANAGER can view employees.
 */
router.get(
  "/employees",
  authenticate,
  authorize("OWNER", "MANAGER"),
  asyncHandler(UserController.getEmployees),
);

/**
 * Get a single employee.
 */
router.get(
  "/employees/:id",
  authenticate,
  authorize("OWNER", "MANAGER"),
  asyncHandler(UserController.getEmployeeById),
);

/**
 * Update employee profile, role and permissions.
 *
 * OWNER and MANAGER can update.
 *
 * Additional protection against changing:
 * - owner
 * - isOwner
 * - googleId
 * - createdBy
 *
 * is handled inside the controller/service.
 */
router.put(
  "/employees/:id",
  authenticate,
  authorize("OWNER", "MANAGER"),
  asyncHandler(UserController.updateEmployee),
);

/**
 * Activate / deactivate employee.
 *
 * Only OWNER can change employee status.
 */
router.patch(
  "/employees/:id/status",
  authenticate,
  authorize("OWNER"),
  asyncHandler(UserController.toggleEmployeeStatus),
);

/**
 * Soft-delete / deactivate employee.
 *
 * Only OWNER can perform this operation.
 */
router.delete(
  "/employees/:id",
  authenticate,
  authorize("OWNER"),
  asyncHandler(UserController.deleteEmployee),
);

export default router;
