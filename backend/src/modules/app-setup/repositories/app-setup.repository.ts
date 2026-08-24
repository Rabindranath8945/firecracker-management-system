import AppSetup from "../models/app-setup.model.js";

import { IAppSetup } from "../interfaces/app-setup.interface.js";

class AppSetupRepository {
  /* -------------------------------------------------------------------------- */
  /*                                   Create                                   */
  /* -------------------------------------------------------------------------- */

  async create(data: Partial<IAppSetup>) {
    return AppSetup.create(data);
  }

  async start(data: Partial<IAppSetup>) {
    return AppSetup.create(data);
  }

  /* -------------------------------------------------------------------------- */
  /*                                    Find                                    */
  /* -------------------------------------------------------------------------- */

  async find() {
    return AppSetup.findOne({
      isActive: true,
    });
  }

  async findById(id: string) {
    return AppSetup.findById(id);
  }

  async findByUser(user: string) {
    return AppSetup.findOne({
      user,
      isActive: true,
    });
  }

  async findByBusinessId(businessId: string) {
    return AppSetup.findOne({
      businessId,
      isActive: true,
    });
  }

  async existsByUser(user: string) {
    return AppSetup.exists({
      user,
      isActive: true,
    });
  }

  /* -------------------------------------------------------------------------- */
  /*                                   Update                                   */
  /* -------------------------------------------------------------------------- */

  async update(id: string, data: Partial<IAppSetup>) {
    return AppSetup.findByIdAndUpdate(id, data, {
      new: true,
      runValidators: true,
    });
  }

  /* -------------------------------------------------------------------------- */
  /*                              Setup Progress                                */
  /* -------------------------------------------------------------------------- */

  async updateStep(id: string, currentStep: IAppSetup["currentStep"]) {
    return AppSetup.findByIdAndUpdate(
      id,
      {
        currentStep,
      },
      {
        new: true,
      },
    );
  }

  async markSettingsConfigured(id: string) {
    return AppSetup.findByIdAndUpdate(
      id,
      {
        settingsConfigured: true,
      },
      {
        new: true,
      },
    );
  }

  async markSecurityConfigured(id: string) {
    return AppSetup.findByIdAndUpdate(
      id,
      {
        securityConfigured: true,
      },
      {
        new: true,
      },
    );
  }

  async markDeviceRegistered(id: string) {
    return AppSetup.findByIdAndUpdate(
      id,
      {
        deviceRegistered: true,
      },
      {
        new: true,
      },
    );
  }

  async markCompleted(id: string) {
    return AppSetup.findByIdAndUpdate(
      id,
      {
        completed: true,
        currentStep: "COMPLETED",
        completedAt: new Date(),
      },
      {
        new: true,
      },
    );
  }

  async reset(id: string) {
    return AppSetup.findByIdAndUpdate(
      id,
      {
        completed: false,
        currentStep: "START",
        settingsConfigured: false,
        securityConfigured: false,
        deviceRegistered: false,
        completedAt: null,
      },
      {
        new: true,
      },
    );
  }

  async getStatus(user: string) {
    return AppSetup.findOne(
      {
        user,
        isActive: true,
      },
      {
        completed: 1,
        currentStep: 1,
        language: 1,
        businessType: 1,
      },
    );
  }
}

export default new AppSetupRepository();
