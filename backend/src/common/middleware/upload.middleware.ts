import multer from "multer";
import path from "path";
import fs from "fs";

/* -------------------------------------------------------------------------- */
/*                                  Upload Dir                                */
/* -------------------------------------------------------------------------- */

const uploadDir = "uploads";

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, {
    recursive: true,
  });
}

/* -------------------------------------------------------------------------- */
/*                              Image Upload                                  */
/* -------------------------------------------------------------------------- */

const imageStorage = multer.diskStorage({
  destination(_req, _file, callback) {
    callback(null, uploadDir);
  },

  filename(_req, file, callback) {
    const ext = path.extname(file.originalname);

    callback(
      null,
      `${Date.now()}-${Math.random().toString(36).slice(2)}${ext}`,
    );
  },
});

const imageFilter: multer.Options["fileFilter"] = (_req, file, callback) => {
  const allowedMimeTypes = [
    "image/jpeg",
    "image/png",
    "image/webp",
    "image/svg+xml",
  ];

  if (allowedMimeTypes.includes(file.mimetype)) {
    callback(null, true);
  } else {
    callback(new Error("Only image files are allowed."));
  }
};

export const imageUpload = multer({
  storage: imageStorage,

  fileFilter: imageFilter,

  limits: {
    fileSize: 5 * 1024 * 1024,
  },
});

/* -------------------------------------------------------------------------- */
/*                              Excel Upload                                  */
/* -------------------------------------------------------------------------- */

const excelStorage = multer.memoryStorage();

const excelFilter: multer.Options["fileFilter"] = (_req, file, callback) => {
  const allowedMimeTypes = [
    "application/vnd.ms-excel",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  ];

  if (allowedMimeTypes.includes(file.mimetype)) {
    callback(null, true);
  } else {
    callback(new Error("Only Excel (.xls, .xlsx) files are allowed."));
  }
};

export const excelUpload = multer({
  storage: excelStorage,

  fileFilter: excelFilter,

  limits: {
    fileSize: 10 * 1024 * 1024,
  },
});

/* -------------------------------------------------------------------------- */
/*                               OCR Upload                                   */
/* -------------------------------------------------------------------------- */

const ocrStorage = multer.diskStorage({
  destination(_req, _file, callback) {
    callback(null, uploadDir);
  },

  filename(_req, file, callback) {
    const ext = path.extname(file.originalname);

    callback(
      null,
      `ocr-${Date.now()}-${Math.random().toString(36).slice(2)}${ext}`,
    );
  },
});

const ocrFilter: multer.Options["fileFilter"] = (_req, file, callback) => {
  const allowedMimeTypes = [
    "image/jpeg",
    "image/png",
    "image/webp",
    "application/pdf",
  ];

  if (allowedMimeTypes.includes(file.mimetype)) {
    callback(null, true);
  } else {
    callback(new Error("Only JPG, PNG, WEBP and PDF files are allowed."));
  }
};

export const ocrUpload = multer({
  storage: ocrStorage,

  fileFilter: ocrFilter,

  limits: {
    fileSize: 15 * 1024 * 1024,
  },
});
