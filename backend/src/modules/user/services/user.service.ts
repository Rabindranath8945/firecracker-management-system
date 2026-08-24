import { userRepository } from "../repositories/user.repository.js";

import type { IUser } from "../models/user.model.js";

import {
  USER_PERMISSIONS,
  type UserRole,
} from "../constants/user.constants.js";

class UserService {
  /* ------------------------------------------------------------------------ */
  /* Authentication                                                            */
  /* ------------------------------------------------------------------------ */

  async createUser(userData: Partial<IUser>): Promise<IUser> {
    return userRepository.create(userData);
  }

  async getUserById(userId: string): Promise<IUser | null> {
    const user = await userRepository.findById(userId);

    if (!user) {
      return null;
    }

    return this.ensureCurrentUserAccess(user);
  }

  async getUserByGoogleId(googleId: string): Promise<IUser | null> {
    return userRepository.findByGoogleId(googleId);
  }

  async getUserByEmail(email: string): Promise<IUser | null> {
    return userRepository.findByEmail(email);
  }

  async getUserByDeviceId(deviceId: string): Promise<IUser | null> {
    return userRepository.findByDeviceId(deviceId);
  }

  async getUserByMobile(mobile: string): Promise<IUser | null> {
    return userRepository.findByMobile(mobile);
  }

  /* ------------------------------------------------------------------------ */
  /* Owner Access                                                             */
  /* ------------------------------------------------------------------------ */

  private async ensureCurrentUserAccess(user: IUser): Promise<IUser> {
    if (user.role !== "OWNER") {
      return user;
    }

    const hasAllPermissions = USER_PERMISSIONS.every((permission) =>
      user.permissions.includes(permission),
    );

    if (hasAllPermissions) {
      return user;
    }

    const updatedUser = await userRepository.ensureOwnerPermissions(
      user._id.toString(),
      [...USER_PERMISSIONS] as IUser["permissions"],
    );

    return updatedUser ?? user;
  }

  /* ------------------------------------------------------------------------ */
  /* Current User                                                             */
  /* ------------------------------------------------------------------------ */

  async getCurrentUser(userId: string): Promise<IUser> {
    const user = await userRepository.findById(userId);

    if (!user) {
      throw new Error("User not found.");
    }

    return this.ensureCurrentUserAccess(user);
  }

  /* ------------------------------------------------------------------------ */
  /* Business                                                                 */
  /* ------------------------------------------------------------------------ */

  async getCurrentBusiness(userId: string): Promise<string | null> {
    const user = await userRepository.findById(userId);

    if (!user) {
      throw new Error("User not found.");
    }

    return user.currentBusiness?.toString() ?? null;
  }

  async setCurrentBusiness(
    userId: string,
    businessId: string,
  ): Promise<IUser | null> {
    return userRepository.setCurrentBusiness(userId, businessId);
  }

  /* ------------------------------------------------------------------------ */
  /* User Activity                                                            */
  /* ------------------------------------------------------------------------ */

  async updateMe(userId: string, data: Partial<IUser>): Promise<IUser> {
    /*
     * Never allow a normal profile update to
     * convert an employee into an OWNER.
     */
    if (data.role === "OWNER") {
      throw new Error("OWNER role cannot be assigned through profile update.");
    }

    const user = await userRepository.updateMe(userId, data);

    if (!user) {
      throw new Error("User not found.");
    }

    return this.ensureCurrentUserAccess(user);
  }

  async updateLastLogin(userId: string): Promise<IUser | null> {
    return userRepository.updateLastLogin(userId);
  }

  async updateLastSeen(userId: string): Promise<IUser | null> {
    return userRepository.updateLastSeen(userId);
  }

  /* ------------------------------------------------------------------------ */
  /* App Security                                                             */
  /* ------------------------------------------------------------------------ */

  async updateAppLock(userId: string, enabled: boolean): Promise<IUser | null> {
    return userRepository.updateAppLock(userId, enabled);
  }

  /* ------------------------------------------------------------------------ */
  /* ERP User Management                                                      */
  /* ------------------------------------------------------------------------ */

  async createEmployee(employeeData: Partial<IUser>): Promise<IUser> {
    if (employeeData.role === "OWNER") {
      throw new Error("OWNER role cannot be assigned to an employee.");
    }

    return userRepository.create({
      ...employeeData,

      isOwner: false,

      permissions: employeeData.permissions ?? [],

      status: employeeData.status ?? "ACTIVE",

      isActive: employeeData.isActive ?? true,
    });
  }

  async getEmployees(ownerId: string): Promise<IUser[]> {
    return userRepository.findAllEmployees(ownerId);
  }

  async getEmployeeById(id: string): Promise<IUser | null> {
    return userRepository.findEmployeeById(id);
  }

  async getEmployeesByOwner(ownerId: string): Promise<IUser[]> {
    return userRepository.findByOwner(ownerId);
  }

  async getEmployeeByMobile(mobile: string): Promise<IUser | null> {
    return userRepository.findByMobile(mobile);
  }

  async updateEmployee(
    id: string,
    data: Partial<IUser>,
  ): Promise<IUser | null> {
    if (data.role === "OWNER") {
      throw new Error("OWNER role cannot be assigned to an employee.");
    }

    return userRepository.updateEmployee(id, data);
  }

  async deleteEmployee(id: string): Promise<IUser | null> {
    return userRepository.deleteEmployee(id);
  }

  async toggleEmployeeStatus(id: string): Promise<IUser | null> {
    return userRepository.toggleEmployeeStatus(id);
  }

  /* ------------------------------------------------------------------------ */
  /* Complete Onboarding                                                      */
  /* ------------------------------------------------------------------------ */

  async completeOnboarding(userId: string): Promise<IUser | null> {
    return userRepository.update(userId, {
      onboardingCompleted: true,
    });
  }

  /* ------------------------------------------------------------------------ */
  /* Activate Employee                                                        */
  /* ------------------------------------------------------------------------ */

  async activateEmployee(
    userId: string,
    businessId: string,
    role: UserRole,
  ): Promise<IUser | null> {
    if (role === "OWNER") {
      throw new Error("OWNER role cannot be assigned to an employee.");
    }

    return userRepository.activateEmployee(userId, businessId, role);
  }
}

export default new UserService();
