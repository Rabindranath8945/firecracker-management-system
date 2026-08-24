import crypto from "node:crypto";

import { Types } from "mongoose";

import {
  INVITATION_EXPIRY_MINUTES,
  INVITATION_MAX_USES,
} from "../constants/invitation.constants.js";

import { invitationRepository } from "../repositories/invitation.repository.js";

import { UserService } from "../../user/index.js";

import type { CreateInvitationInput } from "../validators/invitation.validator.js";

import NotificationService from "../../notification/services/notification.service.js";

class InvitationService {
  private generateToken(): string {
    return crypto.randomBytes(32).toString("hex");
  }

  private hashToken(token: string): string {
    return crypto.createHash("sha256").update(token).digest("hex");
  }

  private getExpirationDate(): Date {
    const expiresAt = new Date();

    expiresAt.setMinutes(expiresAt.getMinutes() + INVITATION_EXPIRY_MINUTES);

    return expiresAt;
  }

  private async getInvitationOrThrow(invitationId: string) {
    const id = this.ensureObjectId(invitationId, "Invitation ID");

    const invitation = await invitationRepository.findById(id.toString());

    if (!invitation) {
      throw new Error("Invitation not found.");
    }

    return invitation;
  }

  private ensureOwner(
    invitationOwnerId: Types.ObjectId,
    ownerId: string,
  ): void {
    if (invitationOwnerId.toString() !== ownerId) {
      throw new Error("You are not allowed to manage this invitation.");
    }
  }

  private async ensurePendingAndValid(invitationId: string) {
    const invitation = await this.getInvitationOrThrow(invitationId);

    if (invitation.status !== "PENDING") {
      throw new Error("Invitation is no longer pending.");
    }

    if (invitation.expiresAt.getTime() <= Date.now()) {
      await invitationRepository.update(invitation._id.toString(), {
        status: "EXPIRED",
      });

      throw new Error("This invitation has expired.");
    }

    if (invitation.usedCount >= invitation.maxUses) {
      throw new Error("This invitation has already been used.");
    }

    return invitation;
  }

  private ensureObjectId(value: string, fieldName: string): Types.ObjectId {
    if (!Types.ObjectId.isValid(value)) {
      throw new Error(`${fieldName} is invalid.`);
    }

    return new Types.ObjectId(value);
  }

  async createInvitation(ownerId: string, input: CreateInvitationInput) {
    const owner = await UserService.getUserById(ownerId);

    if (!owner) {
      throw new Error("Owner account not found.");
    }

    if (!owner.currentBusiness) {
      throw new Error("Your account is not connected to a business.");
    }

    if (owner.role !== "OWNER") {
      throw new Error("Only the business owner can create invitations.");
    }

    const token = this.generateToken();

    const tokenHash = this.hashToken(token);

    const ownerObjectId = this.ensureObjectId(ownerId, "Owner ID");

    const businessId = owner.currentBusiness;

    const invitation = await invitationRepository.create({
      businessId,

      ownerId: ownerObjectId,

      tokenHash,

      role: input.role,

      permissions: input.permissions,

      status: "PENDING",

      expiresAt: this.getExpirationDate(),

      maxUses: INVITATION_MAX_USES,

      usedCount: 0,

      createdBy: ownerObjectId,
    });

    return {
      invitation,
      token,
    };
  }
  async getInvitationById(id: string) {
    return invitationRepository.findById(id);
  }

  async getOwnerInvitations(ownerId: string) {
    return invitationRepository.findByOwner(ownerId);
  }

  async getPendingInvitations(ownerId: string) {
    return invitationRepository.findPendingByOwner(ownerId);
  }

  async scanInvitation(token: string) {
    const tokenHash = this.hashToken(token);

    const invitation = await invitationRepository.findByTokenHash(tokenHash);

    if (!invitation) {
      throw new Error("Invitation not found or invalid.");
    }

    if (invitation.status !== "PENDING") {
      throw new Error("This invitation is no longer available.");
    }

    if (invitation.expiresAt.getTime() < Date.now()) {
      await invitationRepository.update(invitation._id.toString(), {
        status: "EXPIRED",
      });

      throw new Error("This invitation has expired.");
    }

    if (invitation.usedCount >= invitation.maxUses) {
      throw new Error("This invitation has already been used.");
    }

    return invitation;
  }

  async attachJoinRequest(
    invitationId: string,
    userId: string,
    userData: {
      email?: string;
      name?: string;
      googleId?: string;
      profilePicture?: string;
    },
  ) {
    const userObjectId = this.ensureObjectId(userId, "User ID");

    const invitation = await this.ensurePendingAndValid(invitationId);

    /*
     * The same user has already requested
     * this invitation.
     */
    if (
      invitation.requestedBy &&
      invitation.requestedBy.toString() === userId
    ) {
      return invitation;
    }

    /*
     * This invitation is already being
     * requested by another user.
     */
    if (
      invitation.requestedBy &&
      invitation.requestedBy.toString() !== userId
    ) {
      throw new Error("This invitation already has a join request.");
    }

    const updatedInvitation = await invitationRepository.update(
      invitation._id.toString(),
      {
        requestedBy: userObjectId,

        requestedEmail: userData.email?.trim() ?? null,

        requestedName: userData.name?.trim() ?? null,

        requestedGoogleId: userData.googleId ?? null,

        requestedProfilePicture: userData.profilePicture ?? null,
      },
    );

    if (!updatedInvitation) {
      throw new Error("Failed to submit join request.");
    }

    /*
     * Notify the business owner that
     * someone wants to join.
     */
    await NotificationService.create(invitation.ownerId.toString(), {
      title: "New Employee Join Request",

      message: `${
        userData.name ?? userData.email ?? "A user"
      } wants to join your business.`,

      type: "SYSTEM",

      data: {
        invitationId: invitation._id.toString(),

        requestedBy: userId,

        role: invitation.role,
      },
    });

    return updatedInvitation;
  }

  async approveInvitation(invitationId: string, ownerId: string) {
    const invitation = await this.ensurePendingAndValid(invitationId);

    this.ensureOwner(invitation.ownerId, ownerId);

    if (!invitation.requestedBy) {
      throw new Error("No employee has requested to join yet.");
    }

    const employeeId = invitation.requestedBy.toString();

    /*
     * Activate employee
     *
     * Assign:
     * - Business
     * - Role
     * - Active status
     */
    const employee = await UserService.activateEmployee(
      employeeId,
      invitation.businessId.toString(),
      invitation.role,
    );

    if (!employee) {
      throw new Error("Employee account could not be activated.");
    }

    /*
     * Assign permissions and owner.
     */
    const updatedEmployee = await UserService.updateEmployee(employeeId, {
      permissions: invitation.permissions,

      isActive: true,

      owner: this.ensureObjectId(ownerId, "Owner ID"),

      currentBusiness: invitation.businessId,
    });

    /*
     * Mark invitation as accepted.
     */
    const approvedAt = new Date();

    const updatedInvitation = await invitationRepository.update(
      invitation._id.toString(),
      {
        status: "ACCEPTED",

        approvedBy: this.ensureObjectId(ownerId, "Owner ID"),

        approvedAt,

        acceptedAt: approvedAt,

        usedCount: invitation.usedCount + 1,

        updatedBy: this.ensureObjectId(ownerId, "Owner ID"),
      },
    );

    /*
     * Notify the employee after
     * successful approval.
     */
    await NotificationService.create(employeeId, {
      title: "Invitation Approved",

      message:
        "Your request to join the business has been approved. You can now access the ERP.",

      type: "SYSTEM",

      data: {
        invitationId: invitation._id.toString(),

        businessId: invitation.businessId.toString(),

        role: invitation.role,
      },
    });

    return {
      invitation: updatedInvitation,

      employee: updatedEmployee ?? employee,
    };
  }

  async rejectInvitation(invitationId: string, ownerId: string) {
    const invitation = await invitationRepository.findById(invitationId);

    if (!invitation) {
      throw new Error("Invitation not found.");
    }

    if (invitation.ownerId.toString() !== ownerId) {
      throw new Error("You are not allowed to reject this invitation.");
    }

    if (invitation.status !== "PENDING") {
      throw new Error("Invitation is not pending.");
    }

    return invitationRepository.update(invitationId, {
      status: "REJECTED",

      rejectedBy: this.ensureObjectId(ownerId, "Owner ID"),

      rejectedAt: new Date(),
    });
  }

  async revokeInvitation(invitationId: string, ownerId: string) {
    const invitation = await invitationRepository.findById(invitationId);

    if (!invitation) {
      throw new Error("Invitation not found.");
    }

    if (invitation.ownerId.toString() !== ownerId) {
      throw new Error("You are not allowed to revoke this invitation.");
    }

    if (invitation.status !== "PENDING") {
      throw new Error("Only pending invitations can be revoked.");
    }

    return invitationRepository.update(invitationId, {
      status: "REVOKED",

      revokedAt: new Date(),

      updatedBy: this.ensureObjectId(ownerId, "Owner ID"),
    });
  }

  async deleteInvitation(invitationId: string, ownerId: string) {
    const invitation = await invitationRepository.findById(invitationId);

    if (!invitation) {
      throw new Error("Invitation not found.");
    }

    if (invitation.ownerId.toString() !== ownerId) {
      throw new Error("You are not allowed to delete this invitation.");
    }

    return invitationRepository.delete(invitationId);
  }
}

export default new InvitationService();
