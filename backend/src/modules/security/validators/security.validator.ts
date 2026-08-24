import { z } from "zod";

import {
  SECURITY_DEVICE_STATUS,
  SECURITY_LOCK_TYPE,
  SECURITY_LOGIN_PROVIDER,
  SECURITY_PLATFORM,
  SECURITY_SESSION_STATUS,
  SECURITY_AUTO_LOCK,
} from "../constants/security.constants.js";

/* -------------------------------------------------------------------------- */
/*                                   Device                                   */
/* -------------------------------------------------------------------------- */

export const deviceSchema = z.object({
  deviceId: z.string(),

  deviceName: z.string().min(2).max(100),

  platform: z.enum(SECURITY_PLATFORM),

  osVersion: z.string(),

  appVersion: z.string(),

  ipAddress: z.string(),

  trusted: z.boolean(),

  biometricEnabled: z.boolean(),

  pinEnabled: z.boolean(),

  current: z.boolean(),

  status: z.enum(SECURITY_DEVICE_STATUS),

  lastLoginAt: z.date(),

  lastActiveAt: z.date(),
});

/* -------------------------------------------------------------------------- */
/*                                   Session                                  */
/* -------------------------------------------------------------------------- */

export const sessionSchema = z.object({
  sessionId: z.string(),

  refreshToken: z.string(),

  loginProvider: z.enum(SECURITY_LOGIN_PROVIDER),

  status: z.enum(SECURITY_SESSION_STATUS),

  expiresAt: z.date(),
});

/* -------------------------------------------------------------------------- */
/*                                     PIN                                    */
/* -------------------------------------------------------------------------- */

export const pinSchema = z.object({
  pin: z.string().regex(/^\d{4,6}$/, "PIN must be 4 to 6 digits"),
});

/* -------------------------------------------------------------------------- */
/*                                Biometric                                   */
/* -------------------------------------------------------------------------- */

export const biometricSchema = z.object({
  enabled: z.boolean(),
});

/* -------------------------------------------------------------------------- */
/*                                   Login                                    */
/* -------------------------------------------------------------------------- */

export const loginSchema = z.object({
  provider: z.enum(SECURITY_LOGIN_PROVIDER),

  refreshToken: z.string(),
});

/* -------------------------------------------------------------------------- */
/*                                  Security                                  */
/* -------------------------------------------------------------------------- */

export const securitySchema = z.object({
  user: z.string(),

  businessId: z.string(),

  lockType: z.enum(SECURITY_LOCK_TYPE),

  autoLock: z.enum(SECURITY_AUTO_LOCK),

  appLockEnabled: z.boolean(),

  requireSecurityForSensitiveActions: z.boolean(),

  pinHash: z.string(),

  devices: z.array(deviceSchema),

  sessions: z.array(sessionSchema),
});

/* -------------------------------------------------------------------------- */
/*                                   Types                                    */
/* -------------------------------------------------------------------------- */

export type DeviceInput = z.infer<typeof deviceSchema>;

export type SessionInput = z.infer<typeof sessionSchema>;

export type PinInput = z.infer<typeof pinSchema>;

export type BiometricInput = z.infer<typeof biometricSchema>;

export type LoginInput = z.infer<typeof loginSchema>;

export type SecurityInput = z.infer<typeof securitySchema>;
