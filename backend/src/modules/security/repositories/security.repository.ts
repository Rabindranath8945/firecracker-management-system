import Security from "../models/security.model.js";
import {
  IDevice,
  ISecurity,
  ISession,
} from "../interfaces/security.interface.js";

class SecurityRepository {
  /* -------------------------------------------------------------------------- */
  /*                                    Find                                    */
  /* -------------------------------------------------------------------------- */

  async create(data: Partial<ISecurity>) {
    return Security.create(data);
  }

  async find() {
    return Security.findOne({
      isActive: true,
    });
  }

  async findById(id: string) {
    return Security.findById(id);
  }

  async findByUser(user: string) {
    return Security.findOne({
      user,
      isActive: true,
    });
  }

  async findByBusiness(businessId: string) {
    return Security.findOne({
      businessId,
      isActive: true,
    });
  }

  async findDevice(id: string, deviceId: string) {
    return Security.findOne(
      {
        _id: id,
        "devices.deviceId": deviceId,
      },
      {
        "devices.$": 1,
      },
    );
  }

  async findSession(id: string, sessionId: string) {
    return Security.findOne(
      {
        _id: id,
        "sessions.sessionId": sessionId,
      },
      {
        "sessions.$": 1,
      },
    );
  }

  async existsByUser(user: string) {
    return Security.exists({
      user,
      isActive: true,
    });
  }

  async existsByBusinessId(businessId: string) {
    return Security.exists({
      businessId,
      isActive: true,
    });
  }

  /* -------------------------------------------------------------------------- */
  /*                                   Update                                   */
  /* -------------------------------------------------------------------------- */

  async update(id: string, data: Partial<ISecurity>) {
    return Security.findByIdAndUpdate(id, data, {
      new: true,
      runValidators: true,
    });
  }

  /* -------------------------------------------------------------------------- */
  /*                                   Device                                   */
  /* -------------------------------------------------------------------------- */

  async addDevice(id: string, device: IDevice) {
    return Security.findByIdAndUpdate(
      id,
      {
        $push: {
          devices: device,
        },
      },
      {
        new: true,
      },
    );
  }

  async removeDevice(id: string, deviceId: string) {
    return Security.findByIdAndUpdate(
      id,
      {
        $pull: {
          devices: {
            deviceId,
          },
        },
      },
      {
        new: true,
      },
    );
  }

  async updateDevice(id: string, deviceId: string, data: IDevice) {
    return Security.findOneAndUpdate(
      {
        _id: id,
        "devices.deviceId": deviceId,
      },
      {
        $set: {
          "devices.$": data,
        },
      },
      {
        new: true,
      },
    );
  }

  /* -------------------------------------------------------------------------- */
  /*                                  Session                                   */
  /* -------------------------------------------------------------------------- */

  async addSession(id: string, session: ISession) {
    return Security.findByIdAndUpdate(
      id,
      {
        $push: {
          sessions: session,
        },
      },
      {
        new: true,
      },
    );
  }

  async removeSession(id: string, sessionId: string) {
    return Security.findByIdAndUpdate(
      id,
      {
        $pull: {
          sessions: {
            sessionId,
          },
        },
      },
      {
        new: true,
      },
    );
  }

  async clearSessions(id: string) {
    return Security.findByIdAndUpdate(
      id,
      {
        sessions: [],
      },
      {
        new: true,
      },
    );
  }

  async clearDevices(id: string) {
    return Security.findByIdAndUpdate(
      id,
      {
        devices: [],
      },
      {
        new: true,
      },
    );
  }

  async updateLastLogin(id: string, deviceId: string) {
    return Security.findOneAndUpdate(
      {
        _id: id,
        "devices.deviceId": deviceId,
      },
      {
        $set: {
          "devices.$.lastLoginAt": new Date(),
        },
      },
      {
        new: true,
      },
    );
  }

  async updateLastActive(id: string, deviceId: string) {
    return Security.findOneAndUpdate(
      {
        _id: id,
        "devices.deviceId": deviceId,
      },
      {
        $set: {
          "devices.$.lastActiveAt": new Date(),
        },
      },
      {
        new: true,
      },
    );
  }

  async getCurrentDevice(id: string) {
    return Security.findOne(
      {
        _id: id,
        "devices.current": true,
      },
      {
        "devices.$": 1,
      },
    );
  }

  /* -------------------------------------------------------------------------- */
  /*                                    Lock                                    */
  /* -------------------------------------------------------------------------- */

  async updatePin(id: string, pinHash: string) {
    return Security.findByIdAndUpdate(
      id,
      {
        pinHash,
      },
      {
        new: true,
      },
    );
  }

  async updateLockType(id: string, lockType: string) {
    return Security.findByIdAndUpdate(
      id,
      {
        lockType,
      },
      {
        new: true,
      },
    );
  }

  async updateBiometric(id: string, deviceId: string, enabled: boolean) {
    return Security.findOneAndUpdate(
      {
        _id: id,
        "devices.deviceId": deviceId,
      },
      {
        $set: {
          "devices.$.biometricEnabled": enabled,
        },
      },
      {
        new: true,
      },
    );
  }
}

export default new SecurityRepository();
