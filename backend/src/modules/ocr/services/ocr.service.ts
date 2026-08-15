import GoogleVisionProvider from "../providers/google-vision.provider.js";

import type { OCRResult } from "../types/ocr.types.js";

class OCRService {
  private readonly provider = GoogleVisionProvider;

  async extractText(buffer: Buffer, mimeType: string): Promise<OCRResult> {
    if (!buffer || buffer.length === 0) {
      throw new Error("OCR file is required.");
    }

    return this.provider.extractText(buffer, mimeType);
  }
}

export default new OCRService();
