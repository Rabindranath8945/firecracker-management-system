import { z } from "zod";

import {
  USER_PERMISSIONS,
  USER_ROLES,
} from "../../user/constants/user.constants.js";

export const createInvitationSchema = z.object({
  role: z.enum(USER_ROLES),

  permissions: z
    .array(z.enum(USER_PERMISSIONS))
    .min(1, "At least one permission is required."),
});

export const scanInvitationSchema = z.object({
  token: z.string().trim().min(1, "Invitation token is required."),
});

export const approveInvitationSchema = z.object({
  invitationId: z.string().min(1),
});

export const rejectInvitationSchema = z.object({
  invitationId: z.string().min(1),
});

export const revokeInvitationSchema = z.object({
  invitationId: z.string().min(1),
});

export type CreateInvitationInput = z.infer<typeof createInvitationSchema>;

export type ScanInvitationInput = z.infer<typeof scanInvitationSchema>;

export type ApproveInvitationInput = z.infer<typeof approveInvitationSchema>;

export type RejectInvitationInput = z.infer<typeof rejectInvitationSchema>;

export type RevokeInvitationInput = z.infer<typeof revokeInvitationSchema>;
