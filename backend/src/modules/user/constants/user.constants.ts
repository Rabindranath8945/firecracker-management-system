export const USER_ROLES = [
  "OWNER",
  "MANAGER",
  "CASHIER",
  "INVENTORY",
  "CUSTOM",
] as const;

export const USER_STATUS = ["ACTIVE", "INACTIVE", "SUSPENDED"] as const;

export const USER_PERMISSIONS = [
  "DASHBOARD",

  "PRODUCTS",

  "CATEGORIES",

  "CUSTOMERS",

  "SUPPLIERS",

  "PURCHASES",

  "SALES",

  "EXPENSES",

  "REPORTS",

  "SETTINGS",

  "BACKUP",

  "SECURITY",

  "NOTIFICATIONS",

  "OCR",

  "USERS",
] as const;

export type UserRole = (typeof USER_ROLES)[number];

export type UserStatus = (typeof USER_STATUS)[number];

export type UserPermission = (typeof USER_PERMISSIONS)[number];
