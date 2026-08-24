import { PdfDocument, PdfTableColumn } from "../types/pdf.types.js";

const HEADER_HEIGHT = 28;
const ROW_HEIGHT = 25;
const FOOTER_RESERVED = 70;

function drawTableHeader(
  doc: PdfDocument,
  columns: PdfTableColumn[],
  y: number,
) {
  const startX = doc.page.margins.left;

  const tableWidth = columns.reduce((sum, column) => sum + column.width, 0);

  /* Header background */

  doc.roundedRect(startX, y, tableWidth, HEADER_HEIGHT, 8).fill("#F1F5F9");

  let x = startX;

  columns.forEach((column) => {
    doc
      .font("Helvetica-Bold")
      .fontSize(8)
      .fillColor("#475569")
      .text(column.title.toUpperCase(), x + 8, y + 9, {
        width: column.width - 16,
        align: column.align ?? "left",
      });

    x += column.width;
  });

  doc.fillColor("#0F172A");

  return y + HEADER_HEIGHT;
}

export function drawPdfTable(
  doc: PdfDocument,
  columns: PdfTableColumn[],
  rows: Record<string, unknown>[],
) {
  const startX = doc.page.margins.left;

  const tableWidth = columns.reduce((sum, column) => sum + column.width, 0);

  let currentY = drawTableHeader(doc, columns, doc.y);

  rows.forEach((row, index) => {
    /* ---------------------------------------------------------------------- */
    /* PAGE BREAK                                                             */
    /* ---------------------------------------------------------------------- */

    const bottomLimit =
      doc.page.height - doc.page.margins.bottom - FOOTER_RESERVED;

    if (currentY + ROW_HEIGHT > bottomLimit) {
      doc.addPage();

      currentY = drawTableHeader(doc, columns, doc.page.margins.top);
    }

    /* ---------------------------------------------------------------------- */
    /* ROW BACKGROUND                                                          */
    /* ---------------------------------------------------------------------- */

    if (index % 2 === 0) {
      doc.rect(startX, currentY, tableWidth, ROW_HEIGHT).fill("#F8FAFC");
    }

    /* ---------------------------------------------------------------------- */
    /* ROW CONTENT                                                             */
    /* ---------------------------------------------------------------------- */

    let x = startX;

    columns.forEach((column) => {
      const value = row[column.key] ?? "";

      doc
        .font("Helvetica")
        .fontSize(8.5)
        .fillColor("#334155")
        .text(String(value), x + 8, currentY + 8, {
          width: column.width - 16,
          align: column.align ?? "left",
          lineBreak: false,
        });

      x += column.width;
    });

    /* Bottom separator */

    doc
      .moveTo(startX, currentY + ROW_HEIGHT)
      .lineTo(startX + tableWidth, currentY + ROW_HEIGHT)
      .lineWidth(0.5)
      .strokeColor("#E2E8F0")
      .stroke();

    currentY += ROW_HEIGHT;
  });

  doc.y = currentY + 14;
}
