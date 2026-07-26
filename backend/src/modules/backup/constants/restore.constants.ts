export const RESTORE_MODE = ["PREVIEW", "MERGE", "REPLACE"] as const;

export type RestoreMode = (typeof RESTORE_MODE)[number];

export const RESTORE_STATUS = [
  "PENDING",
  "VALIDATING",
  "RESTORING",
  "COMPLETED",
  "FAILED",
  "ROLLED_BACK",
] as const;

export type RestoreStatus = (typeof RESTORE_STATUS)[number];
