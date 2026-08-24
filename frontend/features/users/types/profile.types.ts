import type {
  UserPermission,
  UserRole,
  UserStatus,
} from "../constants/user.constants";

/* -------------------------------------------------------------------------- */
/* Profile User                                                               */
/* -------------------------------------------------------------------------- */

export interface Profile {
  id: string;

  googleId: string;

  firstName: string;

  lastName: string;

  email: string;

  mobile: string;

  profilePicture: string;

  owner?: string | null;

  currentBusiness?: string | null;

  role: UserRole;

  permissions: UserPermission[];

  status: UserStatus;

  isOwner: boolean;

  isActive: boolean;

  deviceId: string;

  appLockEnabled: boolean;

  onboardingCompleted: boolean;

  lastLogin?: string | null;

  lastSeen?: string | null;

  createdAt: string;

  updatedAt: string;
}

/* -------------------------------------------------------------------------- */
/* Update Profile                                                             */
/* -------------------------------------------------------------------------- */

export interface UpdateProfileInput {
  firstName?: string;

  lastName?: string;

  mobile?: string;

  profilePicture?: string;
}

/* -------------------------------------------------------------------------- */
/* Profile API Response                                                       */
/* -------------------------------------------------------------------------- */

export interface ProfileResponse {
  success: boolean;

  data: Profile;
}
