import { PdfDocument, PdfSummaryItem } from "../types/pdf.types.js";

export function drawPdfSummary(doc: PdfDocument, items: PdfSummaryItem[]) {
  if (!items.length) {
    return;
  }

  const margin = doc.page.margins.left;

  const pageWidth =
    doc.page.width - doc.page.margins.left - doc.page.margins.right;

  const gap = 10;

  const columns = items.length === 1 ? 1 : 2;

  const cardWidth = (pageWidth - gap * (columns - 1)) / columns;

  const cardHeight = 58;

  let currentY = doc.y;

  /* ------------------------------------------------------------------------ */
  /* TITLE                                                                    */
  /* ------------------------------------------------------------------------ */

  doc
    .font("Helvetica-Bold")
    .fontSize(11)
    .fillColor("#0F172A")
    .text("REPORT SUMMARY", margin, currentY);

  currentY += 18;

  /* ------------------------------------------------------------------------ */
  /* CARDS                                                                    */
  /* ------------------------------------------------------------------------ */

  items.forEach((item, index) => {
    const column = index % columns;

    const row = Math.floor(index / columns);

    const x = margin + column * (cardWidth + gap);

    const y = currentY + row * (cardHeight + gap);

    const highlight = item.highlight === true;

    /* Background */

    doc
      .roundedRect(x, y, cardWidth, cardHeight, 10)
      .fill(highlight ? "#EFF6FF" : "#F8FAFC");

    /* Border */

    doc
      .roundedRect(x, y, cardWidth, cardHeight, 10)
      .lineWidth(1)
      .strokeColor(highlight ? "#BFDBFE" : "#E2E8F0")
      .stroke();

    /* Label */

    doc
      .font("Helvetica")
      .fontSize(7.5)
      .fillColor("#64748B")
      .text(item.label.toUpperCase(), x + 12, y + 11, {
        width: cardWidth - 24,
      });

    /* Value */

    doc
      .font("Helvetica-Bold")
      .fontSize(highlight ? 15 : 12)
      .fillColor(highlight ? "#0369A1" : "#0F172A")
      .text(String(item.value), x + 12, y + 28, {
        width: cardWidth - 24,
      });
  });

  const rows = Math.ceil(items.length / columns);

  doc.y = currentY + rows * (cardHeight + gap) + 8;

  doc.fillColor("#0F172A");
}
