import { Types } from "mongoose";
import SecurityRepository from "../repositories/security.repository.js";
import { hashPin, verifyPin } from "../helpers/pin.js";
import NotificationEngine from "../../notification/engines/notification.engine.js";
import {
  BiometricInput,
  DeviceInput,
  LoginInput,
  PinInput,
  SecurityInput,
  SessionInput,
} from "../validators/security.validator.js";

import { ISecurity } from "../interfaces/security.interface.js";

class SecurityService {
  private ensureSecurityExists<T>(security: T | null): T {
    if (!security) {
      throw new Error("Security settings not found.");
    }

    return security;
  }

  /* -------------------------------------------------------------------------- */
  /*                                   Basic                                    */
  /* -------------------------------------------------------------------------- */

  async get() {
    const security = await SecurityRepository.find();

    return this.ensureSecurityExists(security);
  }

  async getById(id: string) {
    const security = await SecurityRepository.findById(id);

    return this.ensureSecurityExists(security);
  }

  async getByUser(user: string) {
    const security = await SecurityRepository.findByUser(user);

    return this.ensureSecurityExists(security);
  }

  async existsByUser(user: string) {
    return SecurityRepository.existsByUser(user);
  }

  async getByBusiness(businessId: string) {
    const security = await SecurityRepository.findByBusiness(businessId);

    return this.ensureSecurityExists(security);
  }

  async existsByBusinessId(businessId: string) {
    return SecurityRepository.existsByBusinessId(businessId);
  }

  async update(id: string, data: Partial<ISecurity>) {
    const security = await SecurityRepository.update(id, data);

    return this.ensureSecurityExists(security);
  }

  /* -------------------------------------------------------------------------- */
  /*                                   Device                                   */
  /* -------------------------------------------------------------------------- */

  async registerDevice(id: string, device: DeviceInput) {
    const security = await SecurityRepository.addDevice(id, device);

    return this.ensureSecurityExists(security);
  }

  async updateDevice(id: string, deviceId: string, device: DeviceInput) {
    const security = await SecurityRepository.updateDevice(
      id,
      deviceId,
      device,
    );

    return this.ensureSecurityExists(security);
  }

  async removeDevice(id: string, deviceId: string) {
    const security = await SecurityRepository.removeDevice(id, deviceId);

    return this.ensureSecurityExists(security);
  }

  async enableBiometric(
    id: string,
    deviceId: string,
    biometric: BiometricInput,
  ) {
    const security = await SecurityRepository.updateBiometric(
      id,
      deviceId,
      biometric.enabled,
    );

    const result = this.ensureSecurityExists(security);

    try {
      await NotificationEngine.securityAlert({
        userId: String(result.user),
        title: "Biometric Authentication",
        message: biometric.enabled
          ? "Biometric authentication enabled."
          : "Biometric authentication disabled.",
      });
    } catch (error) {
      console.error(error);
    }

    return result;
  }

  async findDevice(id: string, deviceId: string) {
    const security = await SecurityRepository.findDevice(id, deviceId);

    return this.ensureSecurityExists(security);
  }

  async clearDevices(id: string) {
    const security = await SecurityRepository.clearDevices(id);

    return this.ensureSecurityExists(security);
  }

  /* -------------------------------------------------------------------------- */
  /*                                  Session                                   */
  /* -------------------------------------------------------------------------- */

  async createSession(id: string, session: SessionInput) {
    const security = await SecurityRepository.addSession(id, session);

    return this.ensureSecurityExists(security);
  }

  async removeSession(id: string, sessionId: string) {
    const security = await SecurityRepository.removeSession(id, sessionId);

    return this.ensureSecurityExists(security);
  }

  async logoutAll(id: string) {
    const security = await SecurityRepository.clearSessions(id);

    const result = this.ensureSecurityExists(security);

    try {
      await NotificationEngine.securityAlert({
        userId: String(result.user),
        title: "Logout From All Devices",
        message: "All active sessions have been logged out.",
      });
    } catch (error) {
      console.error(error);
    }

    return result;
  }

  async findSession(id: string, sessionId: string) {
    const security = await SecurityRepository.findSession(id, sessionId);

    return this.ensureSecurityExists(security);
  }

  async updateLastLogin(id: string, deviceId: string) {
    const security = await SecurityRepository.updateLastLogin(id, deviceId);

    return this.ensureSecurityExists(security);
  }

  async updateLastActive(id: string, deviceId: string) {
    const security = await SecurityRepository.updateLastActive(id, deviceId);

    return this.ensureSecurityExists(security);
  }

  async getCurrentDevice(id: string) {
    const security = await SecurityRepository.getCurrentDevice(id);

    return this.ensureSecurityExists(security);
  }

  /* -------------------------------------------------------------------------- */
  /*                                     PIN                                    */
  /* -------------------------------------------------------------------------- */

  async setPin(id: string, data: PinInput) {
    const pinHash = await hashPin(data.pin);

    const security = await SecurityRepository.updatePin(id, pinHash);

    const result = this.ensureSecurityExists(security);

    try {
      await NotificationEngine.securityAlert({
        userId: String(result.user),
        title: "Security PIN Updated",
        message: "Your security PIN has been updated successfully.",
      });
    } catch (error) {
      console.error(error);
    }

    return result;
  }

  async verifyPin(id: string, data: PinInput) {
    const security = this.ensureSecurityExists(
      await SecurityRepository.findById(id),
    );

    const matched = await verifyPin(data.pin, security.pinHash);

    if (!matched) {
      throw new Error("Invalid PIN.");
    }

    return {
      success: true,
      message: "PIN verified successfully.",
    };
  }

  async updateLockType(id: string, lockType: SecurityInput["lockType"]) {
    const security = await SecurityRepository.updateLockType(id, lockType);

    const result = this.ensureSecurityExists(security);

    try {
      await NotificationEngine.securityAlert({
        userId: String(result.user),
        title: "App Lock Updated",
        message: `Security lock changed to ${lockType}.`,
      });
    } catch (error) {
      console.error(error);
    }

    return result;
  }

  /* -------------------------------------------------------------------------- */
  /*                                   Login                                    */
  /* -------------------------------------------------------------------------- */
  // TODO: Verify PIN / Biometric / Session in Version 2
  async login(_data: LoginInput) {
    return {
      success: true,
      message: "Login verified.",
    };
  }

  async initialize(data: {
    user: Types.ObjectId;
    businessId: string;
    createdBy: Types.ObjectId;
  }) {
    const security = await SecurityRepository.create({
      user: data.user,
      businessId: data.businessId,
      lockType: "NONE",
      appLockEnabled: false,
      autoLock: "NEVER",
      requireSecurityForSensitiveActions: true,
      pinHash: "",
      devices: [],
      sessions: [],
      isActive: true,
      createdBy: data.createdBy,
    });

    return this.ensureSecurityExists(security);
  }
}

export default new SecurityService();
