import fs from "fs/promises";

export async function restoreBackup(path: string) {
  const file = await fs.readFile(path, "utf8");

  return JSON.parse(file);
}
