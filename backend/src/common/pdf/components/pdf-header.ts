import { PdfCompany, PdfDocument } from "../types/pdf.types.js";

export function drawPdfHeader(
  doc: PdfDocument,
  company: PdfCompany,
  title: string,
) {
  const margin = doc.page.margins.left;
  const pageWidth =
    doc.page.width - doc.page.margins.left - doc.page.margins.right;

  let y = doc.y;

  /* ------------------------------------------------------------------------ */
  /* TOP ACCENT                                                               */
  /* ------------------------------------------------------------------------ */

  doc
    .moveTo(margin, y)
    .lineTo(margin + pageWidth, y)
    .lineWidth(2)
    .strokeColor("#0EA5E9")
    .stroke();

  y += 16;

  /* ------------------------------------------------------------------------ */
  /* BUSINESS NAME                                                            */
  /* ------------------------------------------------------------------------ */

  doc
    .font("Helvetica-Bold")
    .fontSize(19)
    .fillColor("#0F172A")
    .text(company.name || "Business", margin, y, {
      width: pageWidth,
      align: "center",
    });

  y += 27;

  /* ------------------------------------------------------------------------ */
  /* BUSINESS ID                                                              */
  /* ------------------------------------------------------------------------ */

  if (company.businessId) {
    doc
      .font("Helvetica")
      .fontSize(8)
      .fillColor("#64748B")
      .text(`Business ID: ${company.businessId}`, margin, y, {
        width: pageWidth,
        align: "center",
      });

    y += 13;
  }

  /* ------------------------------------------------------------------------ */
  /* ADDRESS                                                                  */
  /* ------------------------------------------------------------------------ */

  if (company.address) {
    doc
      .font("Helvetica")
      .fontSize(9)
      .fillColor("#475569")
      .text(company.address, margin, y, {
        width: pageWidth,
        align: "center",
      });

    y += 14;
  }

  /* ------------------------------------------------------------------------ */
  /* CONTACT                                                                  */
  /* ------------------------------------------------------------------------ */

  const contact = [
    company.phone,
    company.email,
    company.gstNo ? `GST: ${company.gstNo}` : undefined,
  ]
    .filter(Boolean)
    .join("  •  ");

  if (contact) {
    doc
      .font("Helvetica")
      .fontSize(8)
      .fillColor("#64748B")
      .text(contact, margin, y, {
        width: pageWidth,
        align: "center",
      });

    y += 15;
  }

  /* ------------------------------------------------------------------------ */
  /* SEPARATOR                                                                */
  /* ------------------------------------------------------------------------ */

  y += 4;

  doc
    .moveTo(margin, y)
    .lineTo(margin + pageWidth, y)
    .lineWidth(0.7)
    .strokeColor("#E2E8F0")
    .stroke();

  y += 17;

  /* ------------------------------------------------------------------------ */
  /* REPORT TITLE                                                             */
  /* ------------------------------------------------------------------------ */

  doc
    .font("Helvetica-Bold")
    .fontSize(15)
    .fillColor("#0F172A")
    .text(title, margin, y, {
      width: pageWidth,
      align: "left",
    });

  y += 21;

  doc.y = y;

  doc.fillColor("#0F172A");
}
