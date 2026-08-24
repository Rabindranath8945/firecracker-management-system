import multer from "multer";
import path from "path";
import fs from "fs";

export function createStorage(folder: string, prefix: string) {
  const uploadDir = path.join("uploads", folder);

  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, {
      recursive: true,
    });
  }

  return multer.diskStorage({
    destination(_req, _file, callback) {
      callback(null, uploadDir);
    },

    filename(_req, file, callback) {
      const extension = path.extname(file.originalname);

      callback(null, `${prefix}_${Date.now()}${extension}`);
    },
  });
}
