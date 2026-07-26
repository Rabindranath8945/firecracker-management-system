import { PdfCompany, PdfDocument } from "../types/pdf.types.js";

export function drawPdfHeader(
  doc: PdfDocument,
  company: PdfCompany,
  title: string,
) {
  doc.fontSize(20).text(company.name, {
    align: "center",
  });

  doc.moveDown(0.3).fontSize(10).text(company.address, {
    align: "center",
  });

  doc.text(company.phone, {
    align: "center",
  });

  if (company.email) {
    doc.text(company.email, {
      align: "center",
    });
  }

  if (company.gstNo) {
    doc.text(`GST : ${company.gstNo}`, {
      align: "center",
    });
  }

  doc.moveDown().fontSize(16).text(title, {
    align: "center",
  });

  doc.moveDown();
}
