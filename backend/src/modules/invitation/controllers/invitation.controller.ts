import type { Request, Response } from "express";

import InvitationService from "../services/invitation.service.js";
import { UserService } from "../../user/index.js";

import {
  createInvitationSchema,
  scanInvitationSchema,
} from "../validators/invitation.validator.js";

class InvitationController {
  /* -------------------------------------------------------------------------- */
  /*                              Create Invitation                             */
  /* -------------------------------------------------------------------------- */

  async create(req: Request, res: Response) {
    const ownerId = req.user?.userId;

    if (!ownerId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized.",
      });
    }

    const input = createInvitationSchema.parse(req.body);

    const result = await InvitationService.createInvitation(ownerId, input);

    return res.status(201).json({
      success: true,
      message: "Invitation created successfully.",
      data: {
        id: result.invitation._id.toString(),

        token: result.token,

        role: result.invitation.role,

        permissions: result.invitation.permissions,

        expiresAt: result.invitation.expiresAt,
      },
    });
  }

  /* -------------------------------------------------------------------------- */
  /*                              Latest Invitations                            */
  /* -------------------------------------------------------------------------- */

  async latest(req: Request, res: Response) {
    const ownerId = req.user?.userId;

    if (!ownerId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized.",
      });
    }

    const invitations = await InvitationService.getOwnerInvitations(ownerId);

    return res.json({
      success: true,
      data: invitations,
    });
  }

  /* -------------------------------------------------------------------------- */
  /*                            Pending Invitations                             */
  /* -------------------------------------------------------------------------- */

  async pending(req: Request, res: Response) {
    const ownerId = req.user?.userId;

    if (!ownerId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized.",
      });
    }

    const invitations = await InvitationService.getPendingInvitations(ownerId);

    return res.json({
      success: true,
      data: invitations,
    });
  }

  /* -------------------------------------------------------------------------- */
  /*                              Get Invitation                                */
  /* -------------------------------------------------------------------------- */

  async getById(req: Request, res: Response) {
    const invitation = await InvitationService.getInvitationById(
      String(req.params.id),
    );

    return res.json({
      success: true,
      data: invitation,
    });
  }

  /* -------------------------------------------------------------------------- */
  /*                              Scan QR Token                                 */
  /* -------------------------------------------------------------------------- */

  /*
   * Public endpoint.
   *
   * The employee does not need to be authenticated
   * just to validate the QR invitation.
   */
  async scan(req: Request, res: Response) {
    const input = scanInvitationSchema.parse(req.body);

    const invitation = await InvitationService.scanInvitation(input.token);

    return res.json({
      success: true,
      message: "Invitation is valid.",
      data: {
        invitationId: invitation._id.toString(),

        businessId: invitation.businessId.toString(),

        role: invitation.role,

        permissions: invitation.permissions,

        expiresAt: invitation.expiresAt,

        status: invitation.status,
      },
    });
  }

  /* -------------------------------------------------------------------------- */
  /*                              Request To Join                               */
  /* -------------------------------------------------------------------------- */

  /*
   * Employee must already be authenticated.
   *
   * We load the complete User from MongoDB because
   * req.user only contains authentication payload data.
   */
  async requestJoin(req: Request, res: Response) {
    const userId = req.user?.userId;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Authentication required.",
      });
    }

    const invitationId = String(req.params.id);

    const user = await UserService.getUserById(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User account not found.",
      });
    }

    const invitation = await InvitationService.attachJoinRequest(
      invitationId,
      userId,
      {
        email: user.email,

        googleId: user.googleId,

        profilePicture: user.profilePicture,
      },
    );

    return res.json({
      success: true,
      message: "Join request submitted successfully.",
      data: invitation,
    });
  }

  /* -------------------------------------------------------------------------- */
  /*                                  Approve                                   */
  /* -------------------------------------------------------------------------- */

  async approve(req: Request, res: Response) {
    const ownerId = req.user?.userId;

    if (!ownerId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized.",
      });
    }

    const result = await InvitationService.approveInvitation(
      String(req.params.id),
      ownerId,
    );

    return res.json({
      success: true,
      message: "Employee approved and activated successfully.",
      data: result,
    });
  }

  /* -------------------------------------------------------------------------- */
  /*                                   Reject                                   */
  /* -------------------------------------------------------------------------- */

  async reject(req: Request, res: Response) {
    const ownerId = req.user?.userId;

    if (!ownerId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized.",
      });
    }

    const invitation = await InvitationService.rejectInvitation(
      String(req.params.id),
      ownerId,
    );

    return res.json({
      success: true,
      message: "Join request rejected.",
      data: invitation,
    });
  }

  /* -------------------------------------------------------------------------- */
  /*                                   Revoke                                   */
  /* -------------------------------------------------------------------------- */

  async revoke(req: Request, res: Response) {
    const ownerId = req.user?.userId;

    if (!ownerId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized.",
      });
    }

    const invitation = await InvitationService.revokeInvitation(
      String(req.params.id),
      ownerId,
    );

    return res.json({
      success: true,
      message: "Invitation revoked successfully.",
      data: invitation,
    });
  }

  /* -------------------------------------------------------------------------- */
  /*                                   Delete                                   */
  /* -------------------------------------------------------------------------- */

  async delete(req: Request, res: Response) {
    const ownerId = req.user?.userId;

    if (!ownerId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized.",
      });
    }

    await InvitationService.deleteInvitation(String(req.params.id), ownerId);

    return res.json({
      success: true,
      message: "Invitation deleted successfully.",
    });
  }
}

export default new InvitationController();
