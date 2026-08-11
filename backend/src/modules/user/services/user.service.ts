import { userRepository } from "../repositories/user.repository.js";
import { IUser, UserRole } from "../models/user.model.js";

class UserService {
  /* -------------------------------------------------------------------------- */
  /*                              Authentication                                */
  /* -------------------------------------------------------------------------- */

  async createUser(userData: Partial<IUser>): Promise<IUser> {
    return userRepository.create(userData);
  }

  async getUserById(userId: string): Promise<IUser | null> {
    return userRepository.findById(userId);
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

  async updateLastLogin(userId: string): Promise<IUser | null> {
    return userRepository.updateLastLogin(userId);
  }

  async updateAppLock(userId: string, enabled: boolean): Promise<IUser | null> {
    return userRepository.updateAppLock(userId, enabled);
  }

  /* -------------------------------------------------------------------------- */
  /*                           ERP User Management                              */
  /* -------------------------------------------------------------------------- */

  async createEmployee(employeeData: Partial<IUser>): Promise<IUser> {
    return userRepository.create(employeeData);
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
    return userRepository.updateEmployee(id, data);
  }

  async deleteEmployee(id: string): Promise<IUser | null> {
    return userRepository.deleteEmployee(id);
  }

  async toggleEmployeeStatus(id: string): Promise<IUser | null> {
    return userRepository.toggleEmployeeStatus(id);
  }

  /* -------------------------------------------------------------------------- */
  /*                           Assign Business                                  */
  /* -------------------------------------------------------------------------- */

  async setCurrentBusiness(
    userId: string,
    businessId: string,
  ): Promise<IUser | null> {
    return userRepository.setCurrentBusiness(userId, businessId);
  }

  /* -------------------------------------------------------------------------- */
  /*                         Complete Onboarding                                */
  /* -------------------------------------------------------------------------- */

  async completeOnboarding(userId: string): Promise<IUser | null> {
    return userRepository.update(userId, {
      onboardingCompleted: true,
    });
  }

  /* -------------------------------------------------------------------------- */
  /*                           Activate Employee                                */
  /* -------------------------------------------------------------------------- */

  async activateEmployee(
    userId: string,
    businessId: string,
    role: UserRole,
  ): Promise<IUser | null> {
    return userRepository.activateEmployee(userId, businessId, role);
  }
}

export default new UserService();
