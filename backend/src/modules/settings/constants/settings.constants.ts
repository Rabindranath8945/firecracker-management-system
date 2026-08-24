export const SETTINGS_THEME = ["LIGHT"] as const;

export const SETTINGS_LANGUAGE = ["ENGLISH"] as const;

export const SETTINGS_CURRENCY = ["INR"] as const;

export const SETTINGS_TAX_TYPE = ["INCLUSIVE", "EXCLUSIVE"] as const;

export const SETTINGS_PAYMENT_MODE = ["STATIC_QR", "DYNAMIC_QR"] as const;

export const SETTINGS_ANNOUNCEMENT_STYLE = [
  "PAYMENT_RECEIVED",
  "AMOUNT_RECEIVED",
] as const;

export const SETTINGS_FONT_SIZE = ["SMALL", "MEDIUM", "LARGE"] as const;

export const SETTINGS_DATE_FORMAT = [
  "DD/MM/YYYY",
  "MM/DD/YYYY",
  "YYYY-MM-DD",
] as const;

export const SETTINGS_DEFAULT_ROLE = [
  "OWNER",
  "MANAGER",
  "CASHIER",
  "STAFF",
] as const;
