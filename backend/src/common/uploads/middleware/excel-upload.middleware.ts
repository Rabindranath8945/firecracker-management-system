import multer from "multer";

import { excelFileFilter } from "../utils/file-filter.js";

const MAX_FILE_SIZE = 10 * 1024 * 1024;

export const excelUpload = multer({
  storage: multer.memoryStorage(),

  fileFilter: excelFileFilter,

  limits: {
    fileSize: MAX_FILE_SIZE,
  },
});
