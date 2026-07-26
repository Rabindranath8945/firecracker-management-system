import { IUser, User, UserRole } from "../models/user.model.js";

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

  async findAllEmployees(ownerId: string): Promise<IUser[]> {
    return User.find({
      owner: ownerId,
    }).sort({
      createdAt: -1,
    });
  }

  async findEmployeeById(id: string): Promise<IUser | null> {
    return User.findById(id);
  }

  async findByMobile(mobile: string): Promise<IUser | null> {
    return User.findOne({
      mobile,
    });
  }

  async findByOwner(ownerId: string): Promise<IUser[]> {
    return User.find({
      owner: ownerId,
    });
  }

  async updateEmployee(
    id: string,
    data: Partial<IUser>,
  ): Promise<IUser | null> {
    return User.findByIdAndUpdate(id, data, {
      new: true,
    });
  }

  async deleteEmployee(id: string): Promise<IUser | null> {
    return User.findByIdAndUpdate(
      id,
      {
        isActive: false,
      },
      {
        new: true,
      },
    );
  }

  async assignBusiness(
    userId: string,
    businessId: string,
  ): Promise<IUser | null> {
    return User.findByIdAndUpdate(
      userId,
      {
        business: businessId,
      },
      {
        new: true,
      },
    );
  }

  async toggleEmployeeStatus(id: string): Promise<IUser | null> {
    const user = await User.findById(id);

    if (!user) return null;

    user.isActive = !user.isActive;

    return user.save();
  }

  update(id: string, data: Partial<IUser>) {
    return User.findByIdAndUpdate(id, data, {
      new: true,
    });
  }

  async activateEmployee(
    userId: string,
    businessId: string,
    role: UserRole,
  ): Promise<IUser | null> {
    return User.findByIdAndUpdate(
      userId,
      {
        business: businessId,
        role,
        isActive: true,
      },
      {
        new: true,
      },
    ).exec();
  }
}

export const userRepository = new UserRepository();
