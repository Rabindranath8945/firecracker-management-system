import { Document, Types } from "mongoose";

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

export interface IDevice {
  deviceId: string;

  deviceName: string;

  platform: (typeof SECURITY_PLATFORM)[number];

  osVersion: string;

  appVersion: string;

  ipAddress: string;

  trusted: boolean;

  biometricEnabled: boolean;

  pinEnabled: boolean;

  current: boolean;

  status: (typeof SECURITY_DEVICE_STATUS)[number];

  lastLoginAt: Date;

  lastActiveAt: Date;
}

/* -------------------------------------------------------------------------- */
/*                                   Session                                  */
/* -------------------------------------------------------------------------- */

export interface ISession {
  sessionId: string;

  refreshToken: string;

  loginProvider: (typeof SECURITY_LOGIN_PROVIDER)[number];

  status: (typeof SECURITY_SESSION_STATUS)[number];

  expiresAt: Date;
}

/* -------------------------------------------------------------------------- */
/*                                  Security                                  */
/* -------------------------------------------------------------------------- */

export interface ISecurity extends Document {
  user: Types.ObjectId;

  businessId: string;

  lockType: (typeof SECURITY_LOCK_TYPE)[number];

  appLockEnabled: boolean;

  autoLock: (typeof SECURITY_AUTO_LOCK)[number];

  requireSecurityForSensitiveActions: boolean;

  pinHash: string;

  devices: IDevice[];

  sessions: ISession[];

  isActive: boolean;

  createdBy: Types.ObjectId;

  updatedBy?: Types.ObjectId;

  createdAt: Date;

  updatedAt: Date;
}
