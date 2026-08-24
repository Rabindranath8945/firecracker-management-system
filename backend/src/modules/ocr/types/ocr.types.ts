export interface OCRResult {
  text: string;
  confidence?: number;
  provider: "google-vision";
}

export interface OCRProvider {
  extractText(buffer: Buffer, mimeType: string): Promise<OCRResult>;
}
