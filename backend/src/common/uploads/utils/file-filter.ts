import multer from "multer";

const allowedMimeTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];

export const imageFileFilter: multer.Options["fileFilter"] = (
  _req,
  file,
  callback,
) => {
  if (allowedMimeTypes.includes(file.mimetype)) {
    callback(null, true);
    return;
  }

  callback(new Error("Only JPG, JPEG, PNG and WEBP images are allowed."));
};
