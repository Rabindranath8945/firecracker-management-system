import multer from "multer";

import { createStorage } from "../utils/storage.js";
import { imageFileFilter } from "../utils/file-filter.js";

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 MB

const createUpload = (folder: string, prefix: string) =>
  multer({
    storage: createStorage(folder, prefix),

    fileFilter: imageFileFilter,

    limits: {
      fileSize: MAX_FILE_SIZE,
    },
  });

export const productUpload = createUpload("products", "PRD");

export const categoryUpload = createUpload("categories", "CAT");

export const subCategoryUpload = createUpload("sub-categories", "SUB");

export const customerUpload = createUpload("customers", "CUS");

export const supplierUpload = createUpload("suppliers", "SUP");

export const settingsUpload = createUpload("settings", "LOGO");
