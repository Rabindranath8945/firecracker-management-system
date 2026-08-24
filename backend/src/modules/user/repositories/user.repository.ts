import { User } from "../models/user.model.js";

import type { IUser } from "../models/user.model.js";
import type { UserRole } from "../constants/user.constants.js";

class UserRepository {
  /* -------------------------------------------------------------------------- */
  /*                                   Create                                   */
  /* -------------------------------------------------------------------------- */

  async create(userData: Partial<IUser>): Promise<IUser> {
    return User.create(userData);
  }

  /* -------------------------------------------------------------------------- */
  /*                                    Find                                    */
  /* -------------------------------------------------------------------------- */

  async findById(id: string): Promise<IUser | null> {
    return User.findById(id).exec();
  }

  async findByGoogleId(googleId: string): Promise<IUser | null> {
    return User.findOne({
      googleId,
    }).exec();
  }

  async findByEmail(email: string): Promise<IUser | null> {
    return User.findOne({
      email,
    }).exec();
  }

  async findByDeviceId(deviceId: string): Promise<IUser | null> {
    return User.findOne({
      deviceId,
    }).exec();
  }

  async findByMobile(mobile: string): Promise<IUser | null> {
    return User.findOne({
      mobile,
    }).exec();
  }

  /* -------------------------------------------------------------------------- */
  /*                                  Owner                                     */
  /* -------------------------------------------------------------------------- */

  async findOwner(): Promise<IUser | null> {
    return User.findOne({
      role: "OWNER",
      isOwner: true,
      isActive: true,
    }).exec();
  }

  async ensureOwnerPermissions(
    userId: string,
    permissions: IUser["permissions"],
  ): Promise<IUser | null> {
    return User.findByIdAndUpdate(
      userId,
      {
        $set: {
          permissions,
        },
      },
      {
        new: true,
      },
    ).exec();
  }

  /* -------------------------------------------------------------------------- */
  /*                                Employees                                   */
  /* -------------------------------------------------------------------------- */

  async findAllEmployees(ownerId: string): Promise<IUser[]> {
    return User.find({
      owner: ownerId,
      isOwner: false,
    })
      .sort({
        createdAt: -1,
      })
      .exec();
  }

  async findEmployeeById(id: string): Promise<IUser | null> {
    return User.findOne({
      _id: id,
      isOwner: false,
    }).exec();
  }

  async findByOwner(ownerId: string): Promise<IUser[]> {
    return User.find({
      owner: ownerId,
      isOwner: false,
    })
      .sort({
        createdAt: -1,
      })
      .exec();
  }

  /* -------------------------------------------------------------------------- */
  /*                                  Update                                    */
  /* -------------------------------------------------------------------------- */

  async update(id: string, data: Partial<IUser>): Promise<IUser | null> {
    return User.findByIdAndUpdate(id, data, {
      new: true,
      runValidators: true,
    }).exec();
  }

  async updateMe(userId: string, data: Partial<IUser>): Promise<IUser | null> {
    return User.findByIdAndUpdate(
      userId,
      {
        $set: data,
      },
      {
        new: true,
        runValidators: true,
      },
    ).exec();
  }

  async updateEmployee(
    id: string,
    data: Partial<IUser>,
  ): Promise<IUser | null> {
    return User.findOneAndUpdate(
      {
        _id: id,
        isOwner: false,
      },
      data,
      {
        new: true,
        runValidators: true,
      },
    ).exec();
  }

  /* -------------------------------------------------------------------------- */
  /*                              Authentication                                */
  /* -------------------------------------------------------------------------- */

  async updateLastLogin(userId: string): Promise<IUser | null> {
    return User.findByIdAndUpdate(
      userId,
      {
        lastLogin: new Date(),
        lastSeen: new Date(),
      },
      {
        new: true,
      },
    ).exec();
  }

  async updateLastSeen(userId: string): Promise<IUser | null> {
    return User.findByIdAndUpdate(
      userId,
      {
        lastSeen: new Date(),
      },
      {
        new: true,
      },
    ).exec();
  }

  /* -------------------------------------------------------------------------- */
  /*                                App Lock                                    */
  /* -------------------------------------------------------------------------- */

  async updateAppLock(userId: string, enabled: boolean): Promise<IUser | null> {
    return User.findByIdAndUpdate(
      userId,
      {
        appLockEnabled: enabled,
      },
      {
        new: true,
        runValidators: true,
      },
    ).exec();
  }

  /* -------------------------------------------------------------------------- */
  /*                             Business                                       */
  /* -------------------------------------------------------------------------- */

  async setCurrentBusiness(
    userId: string,
    businessId: string,
  ): Promise<IUser | null> {
    return User.findByIdAndUpdate(
      userId,
      {
        currentBusiness: businessId,
      },
      {
        new: true,
        runValidators: true,
      },
    ).exec();
  }

  /* -------------------------------------------------------------------------- */
  /*                            Employee Status                                  */
  /* -------------------------------------------------------------------------- */

  async toggleEmployeeStatus(id: string): Promise<IUser | null> {
    const user = await User.findOne({
      _id: id,
      isOwner: false,
    }).exec();

    if (!user) {
      return null;
    }

    user.isActive = !user.isActive;

    user.status = user.isActive ? "ACTIVE" : "INACTIVE";

    return user.save();
  }

  async activateEmployee(
    userId: string,
    businessId: string,
    role: UserRole,
  ): Promise<IUser | null> {
    return User.findOneAndUpdate(
      {
        _id: userId,
        isOwner: false,
      },
      {
        currentBusiness: businessId,
        role,
        status: "ACTIVE",
        isActive: true,
      },
      {
        new: true,
        runValidators: true,
      },
    ).exec();
  }

  /* -------------------------------------------------------------------------- */
  /*                                  Delete                                    */
  /* -------------------------------------------------------------------------- */

  async deleteEmployee(id: string): Promise<IUser | null> {
    return User.findOneAndUpdate(
      {
        _id: id,
        isOwner: false,
      },
      {
        isActive: false,
        status: "INACTIVE",
      },
      {
        new: true,
        runValidators: true,
      },
    ).exec();
  }
}

export const userRepository = new UserRepository();
