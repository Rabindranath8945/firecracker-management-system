import Backup from "../models/backup.model.js";

import { IBackup } from "../interfaces/backup.interface.js";

class BackupRepository {
  /* -------------------------------------------------------------------------- */
  /*                                   Create                                   */
  /* -------------------------------------------------------------------------- */

  async create(data: Partial<IBackup>) {
    return Backup.create(data);
  }

  /* -------------------------------------------------------------------------- */
  /*                                    Find                                    */
  /* -------------------------------------------------------------------------- */

  async find() {
    return Backup.find({
      isActive: true,
    }).sort({
      createdAt: -1,
    });
  }

  async findById(id: string) {
    return Backup.findById(id);
  }

  async findByUser(user: string) {
    return Backup.find({
      user,
      isActive: true,
    }).sort({
      createdAt: -1,
    });
  }

  async findByBusiness(businessId: string) {
    return Backup.find({
      businessId,
      isActive: true,
    }).sort({
      createdAt: -1,
    });
  }

  async latest(businessId: string) {
    return Backup.findOne({
      businessId,
      isActive: true,
    }).sort({
      createdAt: -1,
    });
  }

  async history(businessId: string) {
    return Backup.find({
      businessId,
      isActive: true,
    }).sort({
      createdAt: -1,
    });
  }

  async exists(id: string) {
    return Backup.exists({
      _id: id,
      isActive: true,
    });
  }

  async cleanupOldBackups(businessId: string, keep: number) {
    return Backup.find({
      businessId,
      isActive: true,
    })
      .sort({
        createdAt: -1,
      })
      .skip(keep);
  }

  /* -------------------------------------------------------------------------- */
  /*                                   Update                                   */
  /* -------------------------------------------------------------------------- */

  async update(id: string, data: Partial<IBackup>) {
    return Backup.findByIdAndUpdate(id, data, {
      new: true,
      runValidators: true,
    });
  }

  async updateStatus(id: string, status: IBackup["status"]) {
    return Backup.findByIdAndUpdate(
      id,
      {
        status,
      },
      {
        new: true,
      },
    );
  }

  async markDownloaded(id: string) {
    return Backup.findByIdAndUpdate(
      id,
      {
        downloaded: true,
      },
      {
        new: true,
      },
    );
  }

  async markRestored(id: string) {
    return Backup.findByIdAndUpdate(
      id,
      {
        restored: true,
        restoredAt: new Date(),
      },
      {
        new: true,
      },
    );
  }

  /* -------------------------------------------------------------------------- */
  /*                                   Delete                                   */
  /* -------------------------------------------------------------------------- */

  async delete(id: string) {
    return Backup.findByIdAndDelete(id);
  }

  async archive(id: string) {
    return Backup.findByIdAndUpdate(
      id,
      {
        isActive: false,
      },
      {
        new: true,
      },
    );
  }
}

export default new BackupRepository();
