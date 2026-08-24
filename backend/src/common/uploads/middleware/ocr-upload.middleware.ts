import multer from "multer";

import { createStorage } from "../utils/createStorage.js";
import { ocrFileFilter } from "../utils/file-filter.js";

const MAX_FILE_SIZE = 15 * 1024 * 1024;

export const ocrUpload = multer({
  storage: createStorage("ocr", "OCR"),

  fileFilter: ocrFileFilter,

  limits: {
    fileSize: MAX_FILE_SIZE,
  },
});
