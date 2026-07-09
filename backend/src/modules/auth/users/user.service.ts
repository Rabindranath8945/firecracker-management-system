import { IUser } from "./user.model.js";
import { userRepository } from "./user.repository.js";

class UserService {
  async createUser(userData: Partial<IUser>): Promise<IUser> {
    return await userRepository.create(userData);
  }

  async getUserById(userId: string): Promise<IUser | null> {
    return await userRepository.findById(userId);
  }

  async getUserByGoogleId(googleId: string): Promise<IUser | null> {
    return await userRepository.findByGoogleId(googleId);
  }

  async getUserByEmail(email: string): Promise<IUser | null> {
    return await userRepository.findByEmail(email);
  }

  async getUserByDeviceId(deviceId: string): Promise<IUser | null> {
    return await userRepository.findByDeviceId(deviceId);
  }

  async updateRefreshToken(
    userId: string,
    refreshToken: string,
  ): Promise<IUser | null> {
    return await userRepository.updateRefreshToken(userId, refreshToken);
  }

  async updateLastLogin(userId: string): Promise<IUser | null> {
    return await userRepository.updateLastLogin(userId);
  }

  async updateAppLock(userId: string, enabled: boolean): Promise<IUser | null> {
    return await userRepository.updateAppLock(userId, enabled);
  }
}

export const userService = new UserService();
