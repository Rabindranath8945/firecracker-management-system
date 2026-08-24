import PDFDocument from "pdfkit";

import type { PdfDocument } from "../types/pdf.types.js";

class PdfCoreService {
  create(orientation: "portrait" | "landscape" = "portrait"): PdfDocument {
    const doc = new PDFDocument({
      size: "A4",
      layout: orientation,
      margin: 40,

      /*
       * Keep enough space at the bottom for the footer.
       */
      bufferPages: true,
    });

    return doc as PdfDocument;
  }

  toBuffer(doc: PdfDocument): Promise<Buffer> {
    return new Promise<Buffer>((resolve, reject) => {
      const chunks: Buffer[] = [];

      doc.on("data", (chunk: Buffer) => {
        chunks.push(chunk);
      });

      doc.on("end", () => {
        resolve(Buffer.concat(chunks));
      });

      doc.on("error", reject);

      doc.end();
    });
  }
}

export default new PdfCoreService();
