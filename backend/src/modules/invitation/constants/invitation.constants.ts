export const INVITATION_STATUS = [
  "PENDING",
  "ACCEPTED",
  "REJECTED",
  "EXPIRED",
  "REVOKED",
] as const;

export type InvitationStatus = (typeof INVITATION_STATUS)[number];

export const INVITATION_EXPIRY_MINUTES = 10;

export const INVITATION_MAX_USES = 1;
