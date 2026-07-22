import { Express } from "express";

class UploadService {
  uploadImage(file?: Express.Multer.File) {
    if (!file) {
      throw new Error("Image file is required.");
    }

    const folder = file.destination.split(/[\\/]/).pop();

    return {
      filename: file.filename,
      originalName: file.originalname,
      mimeType: file.mimetype,
      size: file.size,
      path: `/uploads/${folder}/${file.filename}`,
    };
  }
}

export default new UploadService();
