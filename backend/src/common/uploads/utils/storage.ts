import multer from "multer";
import fs from "fs";
import path from "path";

const UPLOAD_ROOT = path.join(process.cwd(), "uploads");

function ensureDirectory(folder: string) {
  const uploadPath = path.join(UPLOAD_ROOT, folder);

  if (!fs.existsSync(uploadPath)) {
    fs.mkdirSync(uploadPath, {
      recursive: true,
    });
  }

  return uploadPath;
}

export const createStorage = (folder: string, prefix: string) =>
  multer.diskStorage({
    destination(_req, _file, cb) {
      cb(null, ensureDirectory(folder));
    },

    filename(_req, file, cb) {
      const extension = path.extname(file.originalname);

      const filename = `${prefix}_${Date.now()}${extension}`;

      cb(null, filename);
    },
  });
