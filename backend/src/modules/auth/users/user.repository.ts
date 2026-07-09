import { IUser, User, UserRole } from "./user.model.js";

class UserRepository {
  create(userData: Partial<IUser>): Promise<IUser> {
    return User.create(userData);
  }

  findById(id: string): Promise<IUser | null> {
    return User.findById(id).exec();
  }

  findByGoogleId(googleId: string): Promise<IUser | null> {
    return User.findOne({ googleId }).exec();
  }

  findByEmail(email: string): Promise<IUser | null> {
    return User.findOne({ email }).exec();
  }

  findByDeviceId(deviceId: string): Promise<IUser | null> {
    return User.findOne({ deviceId }).exec();
  }

  findOwner(): Promise<IUser | null> {
    return User.findOne({
      role: UserRole.OWNER,
    }).exec();
  }

  updateLastLogin(userId: string): Promise<IUser | null> {
    return User.findByIdAndUpdate(
      userId,
      {
        lastLogin: new Date(),
      },
      {
        new: true,
      },
    ).exec();
  }

  updateAppLock(userId: string, enabled: boolean): Promise<IUser | null> {
    return User.findByIdAndUpdate(
      userId,
      {
        appLockEnabled: enabled,
      },
      {
        new: true,
      },
    ).exec();
  }
}

export const userRepository = new UserRepository();
