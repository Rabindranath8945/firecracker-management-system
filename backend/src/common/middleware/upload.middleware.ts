import multer from "multer";

const storage = multer.memoryStorage();

const allowedMimeTypes = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "application/pdf",
];

const fileFilter: multer.Options["fileFilter"] = (_req, file, callback) => {
  if (!allowedMimeTypes.includes(file.mimetype)) {
    callback(
      new Error("Unsupported file type. Please upload JPG, PNG, WEBP, or PDF."),
    );

    return;
  }

  callback(null, true);
};

export const ocrUpload = multer({
  storage,

  limits: {
    fileSize: 10 * 1024 * 1024,
  },

  fileFilter,
});
