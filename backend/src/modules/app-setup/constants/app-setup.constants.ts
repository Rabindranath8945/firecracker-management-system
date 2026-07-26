export const APP_SETUP_STEP = [
  "START",
  "LANGUAGE",
  "BUSINESS",
  "SETTINGS",
  "SECURITY",
  "DEVICE",
  "COMPLETED",
] as const;

export const APP_LANGUAGE = ["ENGLISH", "BENGALI"] as const;

export const APP_BUSINESS_TYPE = [
  "GENERAL_STORE",
  "MEDICAL_STORE",
  "CYCLE_STORE",
  "GARMENTS",
  "HARDWARE",
  "RESTAURANT",
  "ELECTRONICS",
  "SUPERMARKET",
] as const;
