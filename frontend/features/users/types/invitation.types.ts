import type {
  UserPermission,
  UserRole,
} from "@/features/users/constants/user.constants";

export type InvitationStatus =
  | "PENDING"
  | "ACCEPTED"
  | "REJECTED"
  | "REVOKED"
  | "EXPIRED";

export interface Invitation {
  id: string;

  businessId: string;

  ownerId: string;

  role: UserRole;

  permissions: UserPermission[];

  status: InvitationStatus;

  expiresAt: string;

  maxUses: number;

  usedCount: number;

  requestedBy?: string | null;

  requestedEmail?: string | null;

  requestedName?: string | null;

  requestedGoogleId?: string | null;

  requestedProfilePicture?: string | null;

  approvedBy?: string | null;

  approvedAt?: string | null;

  acceptedAt?: string | null;

  rejectedBy?: string | null;

  rejectedAt?: string | null;

  revokedBy?: string | null;

  revokedAt?: string | null;

  createdAt: string;

  updatedAt: string;
}

export interface CreateInvitationInput {
  role: UserRole;
  permissions: UserPermission[];
}

export interface CreateInvitationResponse {
  id: string;

  token: string;

  role: UserRole;

  permissions: UserPermission[];

  expiresAt: string;
}

export interface ScanInvitationInput {
  token: string;
}

export interface ScanInvitationResponse {
  invitationId: string;

  businessId: string;

  role: UserRole;

  permissions: UserPermission[];

  expiresAt: string;

  status: InvitationStatus;
}
