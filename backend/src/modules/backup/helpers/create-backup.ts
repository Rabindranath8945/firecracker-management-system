import fs from "fs/promises";

export async function createBackup(path: string, data: unknown) {
  await fs.writeFile(path, JSON.stringify(data, null, 2), "utf8");
}
