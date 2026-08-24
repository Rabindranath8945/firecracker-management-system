import { Document, Types } from "mongoose";

import type {
  UserPermission,
  UserRole,
} from "../../user/constants/user.constants.js";

import type { InvitationStatus } from "../constants/invitation.constants.js";

export interface IInvitation extends Document {
  businessId: Types.ObjectId;

  ownerId: Types.ObjectId;

  tokenHash: string;

  role: UserRole;

  permissions: UserPermission[];

  status: InvitationStatus;

  expiresAt: Date;

  maxUses: number;

  usedCount: number;

  requestedBy?: Types.ObjectId | null;

  requestedEmail?: string | null;

  requestedName?: string | null;

  requestedGoogleId?: string | null;

  requestedProfilePicture?: string | null;

  approvedBy?: Types.ObjectId | null;

  approvedAt?: Date | null;

  rejectedBy?: Types.ObjectId | null;

  rejectedAt?: Date | null;

  acceptedAt?: Date | null;

  revokedAt?: Date | null;

  createdBy: Types.ObjectId;

  updatedBy?: Types.ObjectId | null;

  createdAt: Date;

  updatedAt: Date;
}
