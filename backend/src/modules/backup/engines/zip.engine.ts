import fs from "fs/promises";
import path from "path";
import JSZip from "jszip";

export async function createZip(
  metadata: unknown,
  data: unknown,
  output: string,
): Promise<void> {
  const zip = new JSZip();

  zip.file("metadata.json", JSON.stringify(metadata, null, 2));

  zip.file("backup.json", JSON.stringify(data, null, 2));

  const buffer = await zip.generateAsync({
    type: "nodebuffer",
    compression: "DEFLATE",
    compressionOptions: {
      level: 9,
    },
  });

  await fs.mkdir(path.dirname(output), {
    recursive: true,
  });

  await fs.writeFile(output, buffer);
}

export async function extractZip(filePath: string) {
  const buffer = await fs.readFile(filePath);

  const zip = await JSZip.loadAsync(buffer);

  const metadataFile = zip.file("metadata.json");

  const backupFile = zip.file("backup.json");

  if (!metadataFile) {
    throw new Error("metadata.json not found in backup.");
  }

  if (!backupFile) {
    throw new Error("backup.json not found in backup.");
  }

  const metadata = JSON.parse(await metadataFile.async("string"));

  const data = JSON.parse(await backupFile.async("string"));

  return {
    metadata,
    data,
  };
}
