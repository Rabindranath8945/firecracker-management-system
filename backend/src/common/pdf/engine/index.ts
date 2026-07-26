import PDFDocument from "pdfkit";

class PdfService {
  create() {
    return new PDFDocument({
      size: "A4",
      margin: 40,
      bufferPages: true,
    });
  }

  async toBuffer(doc: PDFKit.PDFDocument): Promise<Buffer> {
    return new Promise((resolve, reject) => {
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

export default new PdfService();
