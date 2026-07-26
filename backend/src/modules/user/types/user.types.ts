import { UserRole } from "./user.model.js";

export interface CreateUserDto {
  googleId: string;
  email: string;
  profilePicture?: string;
  deviceId: string;
}

export interface UpdateUserDto {
  profilePicture?: string;
  appLockEnabled?: boolean;
  isActive?: boolean;
}

export interface UserResponseDto {
  id: string;
  email: string;
  profilePicture?: string;
  role: UserRole;
  appLockEnabled: boolean;
  isActive: boolean;
}
