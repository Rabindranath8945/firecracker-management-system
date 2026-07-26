import { PdfDocument, PdfOptions } from "../types/pdf.types.js";

import { drawPdfHeader } from "../components/pdf-header.js";
import { drawPdfTable } from "../components/pdf-table.js";
import { drawPdfSummary } from "../components/pdf-summary.js";
import { drawPdfFooter } from "../components/pdf-footer.js";

import PdfCoreService from "./core.service.js";

class PdfService {
  async generate(options: PdfOptions): Promise<Buffer> {
    const doc: PdfDocument = PdfCoreService.create();

    drawPdfHeader(doc, options.company, options.title);

    if (options.customer) {
      doc.font("Helvetica-Bold").fontSize(11).text("Customer");

      doc.font("Helvetica").fontSize(10);

      doc.text(options.customer.name);

      if (options.customer.mobile) {
        doc.text(options.customer.mobile);
      }

      if (options.customer.address) {
        doc.text(options.customer.address);
      }

      if (options.customer.gstNo) {
        doc.text(`GST : ${options.customer.gstNo}`);
      }

      doc.moveDown();
    }

    drawPdfTable(doc, options.columns, options.rows);

    drawPdfSummary(doc, options.summary);

    drawPdfFooter(doc, options.notes);

    return PdfCoreService.toBuffer(doc);
  }
}

export default new PdfService();
