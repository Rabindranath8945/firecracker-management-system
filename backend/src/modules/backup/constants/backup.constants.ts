export const BACKUP_STATUS = [
  "PENDING",
  "RUNNING",
  "COMPLETED",
  "FAILED",
] as const;

export const BACKUP_TYPE = ["MANUAL", "AUTO"] as const;

export const BACKUP_STORAGE = ["LOCAL", "GOOGLE_DRIVE", "DROPBOX"] as const;

export const BACKUP_FORMAT = ["JSON", "ZIP"] as const;
