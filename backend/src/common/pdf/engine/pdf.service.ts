import type { PdfDocument, PdfOptions } from "../types/pdf.types.js";

import { drawPdfHeader } from "../components/pdf-header.js";
import { drawPdfTable } from "../components/pdf-table.js";
import { drawPdfSummary } from "../components/pdf-summary.js";
import { drawPdfFooter } from "../components/pdf-footer.js";

import PdfCoreService from "./core.service.js";

class PdfService {
  async generate(options: PdfOptions): Promise<Buffer> {
    /* ---------------------------------------------------------------------- */
    /* PAGE ORIENTATION                                                       */
    /* ---------------------------------------------------------------------- */

    const orientation = options.orientation ?? "portrait";

    /*
     * PdfCoreService handles the actual PDFDocument creation.
     * Passing orientation here ensures the selected layout is actually used.
     */
    const doc: PdfDocument = PdfCoreService.create(orientation);

    /* ---------------------------------------------------------------------- */
    /* HEADER                                                                  */
    /* ---------------------------------------------------------------------- */

    drawPdfHeader(doc, options.company, options.title);

    /* ---------------------------------------------------------------------- */
    /* REPORTING PERIOD                                                        */
    /* ---------------------------------------------------------------------- */

    if (options.dateRange) {
      doc
        .font("Helvetica")
        .fontSize(8)
        .fillColor("#64748B")
        .text(`Reporting Period: ${options.dateRange}`);

      doc.moveDown(0.8);
    }

    /* ---------------------------------------------------------------------- */
    /* CUSTOMER                                                                */
    /* ---------------------------------------------------------------------- */

    if (options.customer) {
      doc
        .font("Helvetica-Bold")
        .fontSize(9)
        .fillColor("#0F172A")
        .text("CUSTOMER");

      doc
        .font("Helvetica")
        .fontSize(9)
        .fillColor("#475569")
        .text(options.customer.name);

      if (options.customer.mobile) {
        doc.text(options.customer.mobile);
      }

      if (options.customer.address) {
        doc.text(options.customer.address);
      }

      if (options.customer.gstNo) {
        doc.text(`GST: ${options.customer.gstNo}`);
      }

      doc.moveDown();
    }

    /* ---------------------------------------------------------------------- */
    /* TABLE                                                                   */
    /* ---------------------------------------------------------------------- */

    drawPdfTable(doc, options.columns, options.rows);

    /* ---------------------------------------------------------------------- */
    /* SUMMARY                                                                 */
    /* ---------------------------------------------------------------------- */

    if (options.summary && options.summary.length > 0) {
      const available = doc.page.height - doc.page.margins.bottom - doc.y;

      /*
       * Summary can be relatively large because it may contain
       * multiple summary cards.
       */
      const estimatedSummaryHeight = 180;

      if (available < estimatedSummaryHeight) {
        doc.addPage();
      }

      drawPdfSummary(doc, options.summary);
    }

    /* ---------------------------------------------------------------------- */
    /* NOTES                                                                   */
    /* ---------------------------------------------------------------------- */

    if (options.notes) {
      doc.moveDown();

      doc.font("Helvetica-Bold").fontSize(9).fillColor("#334155").text("Notes");

      doc
        .font("Helvetica")
        .fontSize(8)
        .fillColor("#64748B")
        .text(options.notes, {
          width:
            doc.page.width - doc.page.margins.left - doc.page.margins.right,
        });
    }

    /* ---------------------------------------------------------------------- */
    /* FOOTERS                                                                 */
    /* ---------------------------------------------------------------------- */

    const pageRange = doc.bufferedPageRange();

    const totalPages = pageRange.count;

    for (let index = 0; index < totalPages; index++) {
      doc.switchToPage(index);

      drawPdfFooter(doc, {
        generatedBy: options.generatedBy ?? "OneHub ERP System",
        pageNumber: index + 1,
        totalPages,
        finalPage: index === totalPages - 1,
      });
    }

    /* ---------------------------------------------------------------------- */
    /* BUFFER                                                                  */
    /* ---------------------------------------------------------------------- */

    return PdfCoreService.toBuffer(doc);
  }
}

export default new PdfService();
