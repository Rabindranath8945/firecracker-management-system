import multer from "multer";

/* -------------------------------------------------------------------------- */
/*                               Image Filter                                 */
/* -------------------------------------------------------------------------- */

export const imageFileFilter: multer.Options["fileFilter"] = (
  _req,
  file,
  callback,
) => {
  const allowedMimeTypes = [
    "image/jpeg",
    "image/png",
    "image/webp",
    "image/svg+xml",
  ];

  if (allowedMimeTypes.includes(file.mimetype)) {
    callback(null, true);
    return;
  }

  callback(new Error("Only JPG, PNG, WEBP and SVG images are allowed."));
};

/* -------------------------------------------------------------------------- */
/*                               Excel Filter                                 */
/* -------------------------------------------------------------------------- */

export const excelFileFilter: multer.Options["fileFilter"] = (
  _req,
  file,
  callback,
) => {
  const allowedMimeTypes = [
    "application/vnd.ms-excel",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  ];

  if (allowedMimeTypes.includes(file.mimetype)) {
    callback(null, true);
    return;
  }

  callback(new Error("Only Excel (.xls, .xlsx) files are allowed."));
};

/* -------------------------------------------------------------------------- */
/*                                OCR Filter                                  */
/* -------------------------------------------------------------------------- */

export const ocrFileFilter: multer.Options["fileFilter"] = (
  _req,
  file,
  callback,
) => {
  const allowedMimeTypes = [
    "image/jpeg",
    "image/png",
    "image/webp",
    "application/pdf",
  ];

  if (allowedMimeTypes.includes(file.mimetype)) {
    callback(null, true);
    return;
  }

  callback(new Error("Only JPG, PNG, WEBP and PDF files are allowed."));
};
