import vision from "@google-cloud/vision";

import type { OCRProvider, OCRResult } from "../types/ocr.types.js";

class GoogleVisionProvider implements OCRProvider {
  private readonly client: vision.ImageAnnotatorClient;

  constructor() {
    this.client = new vision.ImageAnnotatorClient();
  }

  async extractText(buffer: Buffer, mimeType: string): Promise<OCRResult> {
    if (!buffer || buffer.length === 0) {
      throw new Error("OCR file is empty.");
    }

    if (!mimeType.startsWith("image/")) {
      throw new Error("Only image files are supported for OCR.");
    }

    const [result] = await this.client.documentTextDetection({
      image: {
        content: buffer,
      },
    });

    if (result.error?.message) {
      throw new Error(`Google Vision OCR failed: ${result.error.message}`);
    }

    const text = result.fullTextAnnotation?.text?.trim() ?? "";

    if (!text) {
      throw new Error("No readable text was found in the invoice.");
    }

    return {
      text,
      provider: "google-vision",
    };
  }
}

export default new GoogleVisionProvider();
