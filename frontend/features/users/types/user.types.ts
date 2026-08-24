import type {
  UserPermission,
  UserRole,
  UserStatus,
} from "@/features/users/constants/user.constants";

export interface User {
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

  appLockEnabled: boolean;

  onboardingCompleted: boolean;

  lastLogin?: string | null;

  lastSeen?: string | null;

  createdAt: string;

  updatedAt: string;
}

export interface CreateEmployeeInput {
  firstName: string;

  lastName: string;

  email: string;

  mobile: string;

  profilePicture?: string;

  role: UserRole;

  permissions: UserPermission[];

  currentBusiness?: string;
}

export interface UpdateEmployeeInput {
  firstName?: string;

  lastName?: string;

  email?: string;

  mobile?: string;

  profilePicture?: string;

  role?: UserRole;

  permissions?: UserPermission[];

  status?: UserStatus;

  isActive?: boolean;
}

export interface UserStats {
  total: number;

  active: number;

  inactive: number;

  suspended: number;

  managers: number;

  cashiers: number;

  inventory: number;
}
