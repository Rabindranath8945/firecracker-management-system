import { exportDatabase } from "./exporter.engine.js";
import { createZip } from "./zip.engine.js";
import { generateChecksum } from "./checksum.engine.js";
import { buildMetadata } from "./metadata.engine.js";

class BackupEngine {
  async create(options: {
    version: string;
    output: string;
    createdBy: string;
  }) {
    /* ---------------------------------------------------------------------- */
    /* 1. Export Database                                                     */
    /* ---------------------------------------------------------------------- */

    const backup = await exportDatabase();

    /* ---------------------------------------------------------------------- */
    /* 2. Build Metadata                                                     */
    /* ---------------------------------------------------------------------- */

    const metadata = buildMetadata({
      version: options.version,
      checksum: "",
      createdBy: options.createdBy,
    });

    /* ---------------------------------------------------------------------- */
    /* 3. Create ZIP                                                         */
    /* ---------------------------------------------------------------------- */

    await createZip(metadata, backup.data, options.output);

    /* ---------------------------------------------------------------------- */
    /* 4. Generate Checksum                                                  */
    /* ---------------------------------------------------------------------- */

    const checksum = await generateChecksum(options.output);

    /* ---------------------------------------------------------------------- */
    /* 5. Return Result                                                      */
    /* ---------------------------------------------------------------------- */

    return {
      metadata,
      checksum,
      output: options.output,
    };
  }
}

export default new BackupEngine();
