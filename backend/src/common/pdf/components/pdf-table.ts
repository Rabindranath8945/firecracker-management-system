import { PdfDocument, PdfTableColumn } from "../types/pdf.types.js";

export function drawPdfTable(
  doc: PdfDocument,
  columns: PdfTableColumn[],
  rows: Record<string, unknown>[],
) {
  const startX = doc.page.margins.left;

  let currentY = doc.y;

  // Header
  let x = startX;

  doc.font("Helvetica-Bold");
  doc.fontSize(10);

  for (const column of columns) {
    doc.text(column.title, x, currentY, {
      width: column.width,
      align: column.align ?? "left",
    });

    x += column.width;
  }

  currentY += 20;

  doc
    .moveTo(startX, currentY - 5)
    .lineTo(
      startX + columns.reduce((sum, column) => sum + column.width, 0),
      currentY - 5,
    )
    .stroke();

  // Rows
  doc.font("Helvetica");

  for (const row of rows) {
    x = startX;

    let rowHeight = 20;

    for (const column of columns) {
      const value = row[column.key] ?? "";

      doc.text(String(value), x, currentY, {
        width: column.width,
        align: column.align ?? "left",
      });

      x += column.width;
    }

    currentY += rowHeight;

    // Auto page break
    if (currentY > doc.page.height - doc.page.margins.bottom - 60) {
      doc.addPage();

      currentY = doc.page.margins.top;
    }
  }

  doc.y = currentY + 10;
}
