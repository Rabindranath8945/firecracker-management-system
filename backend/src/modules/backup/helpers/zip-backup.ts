import JSZip from "jszip";
import fs from "fs/promises";

export async function zipBackup(
  files: Record<string, unknown>,
  destination: string,
) {
  const zip = new JSZip();

  for (const [name, data] of Object.entries(files)) {
    zip.file(`${name}.json`, JSON.stringify(data, null, 2));
  }

  const buffer = await zip.generateAsync({
    type: "nodebuffer",
    compression: "DEFLATE",
    compressionOptions: {
      level: 9,
    },
  });

  await fs.writeFile(destination, buffer);
}
