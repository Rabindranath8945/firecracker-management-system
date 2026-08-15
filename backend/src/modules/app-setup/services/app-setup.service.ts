import { Types } from "mongoose";

import AppSetupRepository from "../repositories/app-setup.repository.js";

import SettingsService from "../../settings/services/settings.service.js";
import SecurityService from "../../security/services/security.service.js";

import { IAppSetup } from "../interfaces/app-setup.interface.js";

import {
  AppSetupInput,
  BusinessInfoInput,
  LanguageInput,
} from "../validators/app-setup.validator.js";

class AppSetupService {
  private ensureExists<T>(setup: T | null): T {
    if (!setup) {
      throw new Error("App setup not found.");
    }

    return setup;
  }

  /* -------------------------------------------------------------------------- */
  /*                                   Basic                                    */
  /* -------------------------------------------------------------------------- */

  async create(data: Partial<IAppSetup>) {
    return AppSetupRepository.create(data);
  }

  async get() {
    return this.ensureExists(await AppSetupRepository.find());
  }

  async getById(id: string) {
    return this.ensureExists(await AppSetupRepository.findById(id));
  }

  async getByUser(user: string) {
    return this.ensureExists(await AppSetupRepository.findByUser(user));
  }

  async getStatus(user: string) {
    return this.ensureExists(await AppSetupRepository.getStatus(user));
  }

  async update(id: string, data: Partial<IAppSetup>) {
    return this.ensureExists(await AppSetupRepository.update(id, data));
  }

  /* -------------------------------------------------------------------------- */
  /*                                Setup Flow                                 */
  /* -------------------------------------------------------------------------- */

  async updateLanguage(id: string, language: LanguageInput) {
    return this.update(id, language);
  }

  async updateBusiness(id: string, business: BusinessInfoInput) {
    return this.update(id, {
      businessType: business.businessType,
    });
  }

  async updateStep(id: string, step: IAppSetup["currentStep"]) {
    return this.ensureExists(await AppSetupRepository.updateStep(id, step));
  }

  async markSettingsConfigured(id: string) {
    return this.ensureExists(
      await AppSetupRepository.markSettingsConfigured(id),
    );
  }

  async markSecurityConfigured(id: string) {
    return this.ensureExists(
      await AppSetupRepository.markSecurityConfigured(id),
    );
  }

  async markDeviceRegistered(id: string) {
    return this.ensureExists(await AppSetupRepository.markDeviceRegistered(id));
  }

  async complete(id: string) {
    return this.ensureExists(await AppSetupRepository.markCompleted(id));
  }

  async reset(id: string) {
    return this.ensureExists(await AppSetupRepository.reset(id));
  }

  /* -------------------------------------------------------------------------- */
  /*                           Complete App Setup                               */
  /* -------------------------------------------------------------------------- */

  async initialize(
    appSetupId: string,
    userId: Types.ObjectId,
    data: AppSetupInput,
  ) {
    const { businessId } = await SettingsService.initialize({
      businessName: data.businessName,
      ownerName: data.ownerName,
      phone: data.phone,
      userId: userId.toString(),
    });

    await this.markSettingsConfigured(appSetupId);

    await SecurityService.initialize({
      user: userId,
      businessId,
      createdBy: userId,
    });

    await this.markSecurityConfigured(appSetupId);

    await this.markDeviceRegistered(appSetupId);

    return this.complete(appSetupId);
  }

  async start(data: { user: Types.ObjectId; createdBy: Types.ObjectId }) {
    const setup = await AppSetupRepository.start({
      user: data.user,

      businessId: "",

      language: "ENGLISH",

      businessType: "GENERAL_STORE",

      currentStep: "START",

      completed: false,

      settingsConfigured: false,

      securityConfigured: false,

      deviceRegistered: false,

      appVersion: "1.0.0",

      setupVersion: 1,

      isActive: true,

      createdBy: data.createdBy,
    });

    return this.ensureExists(setup);
  }
}

export default new AppSetupService();
