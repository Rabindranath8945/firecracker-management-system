import extract from "extract-zip";

export async function unzipBackup(zipFile: string, destination: string) {
  await extract(zipFile, {
    dir: destination,
  });
}
