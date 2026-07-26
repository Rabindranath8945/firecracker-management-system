import fs from "fs/promises";
import path from "path";

import BackupRepository from "../repositories/backup.repository.js";
import BackupEngine from "../engines/backup.engine.js";
import { extractZip } from "../engines/zip.engine.js";
import ImporterEngine from "../engines/importer.engine.js";
import { generateChecksum } from "../engines/checksum.engine.js";

import {
  CreateBackupInput,
  BackupNotesInput,
  BackupStatusInput,
} from "../validators/backup.validator.js";

import { generateBackupName } from "../helpers/backup-name.js";

class BackupService {
  private ensureExists<T>(backup: T | null): T {
    if (!backup) {
      throw new Error("Backup not found.");
    }

    return backup;
  }

  /* -------------------------------------------------------------------------- */
  /*                                   Basic                                    */
  /* -------------------------------------------------------------------------- */

  async get() {
    return BackupRepository.find();
  }

  async getById(id: string) {
    return this.ensureExists(await BackupRepository.findById(id));
  }

  async delete(id: string) {
    return this.ensureExists(await BackupRepository.archive(id));
  }

  async history(businessId: string) {
    return BackupRepository.history(businessId);
  }

  /* -------------------------------------------------------------------------- */
  /*                               Create Backup                                */
  /* -------------------------------------------------------------------------- */

  async create(userId: string, input: CreateBackupInput) {
    const backupName = generateBackupName();

    const fileName = `${backupName}.zip`;

    const backupDirectory = path.join(process.cwd(), "backups");

    await fs.mkdir(backupDirectory, {
      recursive: true,
    });

    const output = path.join(backupDirectory, fileName);

    const engine = await BackupEngine.create({
      version: "1.0.0",
      output,
      createdBy: userId,
    });

    const stats = await fs.stat(output);

    return BackupRepository.create({
      user: userId as never,

      name: backupName,

      fileName,

      filePath: output,

      checksum: engine.checksum,

      size: stats.size,

      version: engine.metadata.version,

      type: input.type,

      format: input.format,

      storage: input.storage,

      notes: input.notes,

      status: "COMPLETED",

      downloaded: false,

      restored: false,

      backupDuration: 0,

      isActive: true,

      createdBy: userId as never,
    });
  }

  /* -------------------------------------------------------------------------- */
  /*                                Download                                    */
  /* -------------------------------------------------------------------------- */

  async download(id: string) {
    const backup = this.ensureExists(await BackupRepository.findById(id));

    return backup.filePath;
  }

  /* -------------------------------------------------------------------------- */
  /*                                 Restore                                    */
  /* -------------------------------------------------------------------------- */

  async restore(id: string) {
    const backup = this.ensureExists(await BackupRepository.findById(id));

    /* ---------------------------------------------------------------------- */
    /* Verify checksum                                                        */
    /* ---------------------------------------------------------------------- */

    const checksum = await generateChecksum(backup.filePath);

    if (checksum !== backup.checksum) {
      throw new Error("Backup file is corrupted.");
    }

    /* ---------------------------------------------------------------------- */
    /* Extract ZIP                                                            */
    /* ---------------------------------------------------------------------- */

    const payload = await extractZip(backup.filePath);

    /* ---------------------------------------------------------------------- */
    /* Restore                                                                */
    /* ---------------------------------------------------------------------- */

    await ImporterEngine.replace(payload);

    /* ---------------------------------------------------------------------- */
    /* Mark Restored                                                          */
    /* ---------------------------------------------------------------------- */

    await BackupRepository.markRestored(id);

    return this.ensureExists(await BackupRepository.findById(id));
  }

  /* -------------------------------------------------------------------------- */
  /*                                 Remove                                     */
  /* -------------------------------------------------------------------------- */

  async remove(id: string) {
    const backup = this.ensureExists(await BackupRepository.findById(id));

    await fs.rm(backup.filePath, {
      force: true,
    });

    await BackupRepository.delete(id);

    return backup;
  }
}

export default new BackupService();
