export interface SecurityProfile {
  id: string;
  email: string;
  role: string;
  appLockEnabled: boolean;
  isActive: boolean;
  lastLogin?: string | null;
  lastSeen?: string | null;
}

export interface UpdateAppLockInput {
  enabled: boolean;
}
