import { Response } from "express";

export function sendPdf(res: Response, pdf: Buffer, filename: string) {
  res.setHeader("Content-Type", "application/pdf");

  res.setHeader("Content-Disposition", `attachment; filename="${filename}"`);

  return res.send(pdf);
}
