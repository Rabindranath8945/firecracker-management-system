import { Router } from "express";

import InvitationController from "../controllers/invitation.controller.js";

import { authenticate } from "../../auth/middleware/auth.middleware.js";
import { authorize } from "../../auth/middleware/permission.middleware.js";

import { asyncHandler } from "../../../common/utils/async-handler.js";

const router = Router();

/* -------------------------------------------------------------------------- */
/*                              Public QR Validation                          */
/* -------------------------------------------------------------------------- */

/*
 * Employee scans the QR code before authentication.
 *
 * POST /invitations/scan
 */
router.post("/scan", asyncHandler(InvitationController.scan));

/* -------------------------------------------------------------------------- */
/*                              Owner Management                              */
/* -------------------------------------------------------------------------- */

/*
 * Create invitation
 *
 * POST /invitations
 *
 * OWNER only
 */
router.post(
  "/",
  authenticate,
  authorize("OWNER"),
  asyncHandler(InvitationController.create),
);

/*
 * Get owner's invitations
 *
 * GET /invitations
 *
 * OWNER / MANAGER
 */
router.get(
  "/",
  authenticate,
  authorize("OWNER", "MANAGER"),
  asyncHandler(InvitationController.latest),
);

/*
 * Get pending invitations
 *
 * GET /invitations/pending
 *
 * OWNER / MANAGER
 */
router.get(
  "/pending",
  authenticate,
  authorize("OWNER", "MANAGER"),
  asyncHandler(InvitationController.pending),
);

/*
 * Get invitation by ID
 *
 * GET /invitations/:id
 *
 * OWNER / MANAGER
 */
router.get(
  "/:id",
  authenticate,
  authorize("OWNER", "MANAGER"),
  asyncHandler(InvitationController.getById),
);

/* -------------------------------------------------------------------------- */
/*                              Employee Join                                 */
/* -------------------------------------------------------------------------- */

/*
 * Employee submits join request
 *
 * POST /invitations/:id/request-join
 *
 * Any authenticated user
 */
router.post(
  "/:id/request-join",
  authenticate,
  asyncHandler(InvitationController.requestJoin),
);

/* -------------------------------------------------------------------------- */
/*                              Owner Approval                                */
/* -------------------------------------------------------------------------- */

/*
 * Approve employee
 *
 * PATCH /invitations/:id/approve
 *
 * OWNER only
 */
router.patch(
  "/:id/approve",
  authenticate,
  authorize("OWNER"),
  asyncHandler(InvitationController.approve),
);

/*
 * Reject employee
 *
 * PATCH /invitations/:id/reject
 *
 * OWNER only
 */
router.patch(
  "/:id/reject",
  authenticate,
  authorize("OWNER"),
  asyncHandler(InvitationController.reject),
);

/*
 * Revoke invitation
 *
 * PATCH /invitations/:id/revoke
 *
 * OWNER only
 */
router.patch(
  "/:id/revoke",
  authenticate,
  authorize("OWNER"),
  asyncHandler(InvitationController.revoke),
);

/*
 * Delete invitation
 *
 * DELETE /invitations/:id
 *
 * OWNER only
 */
router.delete(
  "/:id",
  authenticate,
  authorize("OWNER"),
  asyncHandler(InvitationController.delete),
);

export default router;
