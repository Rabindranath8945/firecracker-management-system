import { Request, Response } from "express";

import InvoiceService from "../pdf/invoice.service.js";

class InvoiceController {
  async download(req: Request, res: Response) {
    try {
      const saleId = String(req.params.id);

      const pdf = await InvoiceService.generatePdf(saleId);

      res.setHeader("Content-Type", "application/pdf");

      res.setHeader(
        "Content-Disposition",
        `inline; filename="invoice-${saleId}.pdf`,
      );

      res.setHeader("Cache-Control", "no-store");

      return res.send(pdf);
    } catch (error) {
      return res.status(500).json({
        success: false,
        message:
          error instanceof Error
            ? error.message
            : "Failed to generate invoice.",
      });
    }
  }
}

export default new InvoiceController();
