export const SECURITY_DEVICE_STATUS = [
  "ACTIVE",
  "LOGGED_OUT",
  "REMOVED",
] as const;

export const SECURITY_PLATFORM = [
  "ANDROID",
  "IOS",
  "WEB",
  "WINDOWS",
  "MAC",
  "LINUX",
] as const;

export const SECURITY_SESSION_STATUS = [
  "ACTIVE",
  "EXPIRED",
  "REVOKED",
] as const;

export const SECURITY_LOCK_TYPE = [
  "NONE",
  "PIN",
  "BIOMETRIC",
  "PIN_AND_BIOMETRIC",
] as const;

export const SECURITY_AUTO_LOCK = [
  "NEVER",
  "IMMEDIATELY",
  "1_MINUTE",
  "5_MINUTES",
  "15_MINUTES",
] as const;

export const SECURITY_LOGIN_PROVIDER = ["GOOGLE"] as const;
