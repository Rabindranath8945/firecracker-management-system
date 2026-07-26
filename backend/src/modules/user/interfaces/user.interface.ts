import { Types } from "mongoose";

import {
  UserPermission,
  UserRole,
  UserStatus,
} from "../constants/user.constants.js";

export interface IUser {
  firstName: string;

  lastName: string;

  email: string;

  mobile: string;

  password: string;

  avatar?: string;

  owner?: Types.ObjectId;

  role: UserRole;

  permissions: UserPermission[];

  status: UserStatus;

  isOwner: boolean;

  isActive: boolean;

  lastLogin?: Date;

  lastSeen?: Date;

  createdBy?: Types.ObjectId;

  updatedBy?: Types.ObjectId;

  createdAt: Date;

  updatedAt: Date;
}
