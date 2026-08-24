import type { UserPermission, UserRole } from "../constants/user.constants.js";

/* -------------------------------------------------------------------------- */
/* Create User                                                                */
/* -------------------------------------------------------------------------- */

export interface CreateUserDto {
  googleId: string;

  firstName: string;

  lastName?: string;

  email: string;

  mobile?: string;

  profilePicture?: string;

  deviceId: string;

  role?: UserRole;

  permissions?: UserPermission[];

  isOwner?: boolean;

  isActive?: boolean;

  currentBusiness?: string;

  owner?: string;
}

/* -------------------------------------------------------------------------- */
/* Update User                                                                */
/* -------------------------------------------------------------------------- */

export interface UpdateUserDto {
  firstName?: string;

  lastName?: string;

  email?: string;

  mobile?: string;

  profilePicture?: string;

  role?: UserRole;

  permissions?: UserPermission[];

  currentBusiness?: string;

  appLockEnabled?: boolean;

  isActive?: boolean;
}

/* -------------------------------------------------------------------------- */
/* User Response                                                              */
/* -------------------------------------------------------------------------- */

export interface UserResponseDto {
  id: string;

  googleId: string;

  firstName: string;

  lastName: string;

  email: string;

  mobile: string;

  profilePicture: string;

  role: UserRole;

  permissions: UserPermission[];

  currentBusiness?: string | null;

  appLockEnabled: boolean;

  onboardingCompleted: boolean;

  isOwner: boolean;

  isActive: boolean;

  lastLogin?: string | null;

  lastSeen?: string | null;

  createdAt: string;

  updatedAt: string;
}
