import { PdfDocument, PdfSummaryItem } from "../types/pdf.types.js";

export function drawPdfSummary(doc: PdfDocument, items: PdfSummaryItem[]) {
  const startX = 360;

  const labelWidth = 120;

  const valueWidth = 100;

  let currentY = doc.y;

  doc.font("Helvetica");

  for (const item of items) {
    doc.text(item.label, startX, currentY, {
      width: labelWidth,
      align: "left",
    });

    doc.text(String(item.value), startX + labelWidth, currentY, {
      width: valueWidth,
      align: "right",
    });

    currentY += 18;
  }

  doc
    .moveTo(startX, currentY + 2)
    .lineTo(startX + labelWidth + valueWidth, currentY + 2)
    .stroke();

  doc.y = currentY + 10;
}
