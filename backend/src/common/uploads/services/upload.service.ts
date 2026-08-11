import { Express } from "express";
import path from "path";

class UploadService {
  getFile(file?: Express.Multer.File) {
    if (!file) {
      throw new Error("File is required.");
    }

    const folder = path.basename(file.destination);

    return {
      filename: file.filename,

      originalName: file.originalname,

      mimeType: file.mimetype,

      size: file.size,

      folder,

      path: `/uploads/${folder}/${file.filename}`,
    };
  }

  getImage(file?: Express.Multer.File) {
    return this.getFile(file);
  }

  getExcel(file?: Express.Multer.File) {
    return this.getFile(file);
  }

  getOcr(file?: Express.Multer.File) {
    return this.getFile(file);
  }
}

export default new UploadService();
