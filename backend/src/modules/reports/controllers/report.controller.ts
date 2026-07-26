import { Request, Response } from "express";

import ReportService from "../services/report.service.js";

import { sendPdf } from "../helpers/report-response.js";

class ReportController {
  private getDates(req: Request) {
    return {
      from: req.query.from
        ? new Date(String(req.query.from))
        : new Date("2000-01-01"),

      to: req.query.to ? new Date(String(req.query.to)) : new Date(),
    };
  }

  private generatedBy = "Admin";

  async salesPdf(req: Request, res: Response) {
    const { from, to } = this.getDates(req);

    const pdf = await ReportService.salesReport(from, to, this.generatedBy);

    return sendPdf(res, pdf, "sales-report.pdf");
  }

  async purchasePdf(req: Request, res: Response) {
    const { from, to } = this.getDates(req);

    const pdf = await ReportService.purchaseReport(from, to, this.generatedBy);

    return sendPdf(res, pdf, "purchase-report.pdf");
  }

  async expensePdf(req: Request, res: Response) {
    const { from, to } = this.getDates(req);

    const pdf = await ReportService.expenseReport(from, to, this.generatedBy);

    return sendPdf(res, pdf, "expense-report.pdf");
  }

  async customerPdf(req: Request, res: Response) {
    const { from, to } = this.getDates(req);

    const pdf = await ReportService.customerReport(from, to, this.generatedBy);

    return sendPdf(res, pdf, "customer-report.pdf");
  }

  async supplierPdf(req: Request, res: Response) {
    const { from, to } = this.getDates(req);

    const pdf = await ReportService.supplierReport(from, to, this.generatedBy);

    return sendPdf(res, pdf, "supplier-report.pdf");
  }

  async stockPdf(_req: Request, res: Response) {
    const pdf = await ReportService.stockReport(this.generatedBy);

    return sendPdf(res, pdf, "stock-report.pdf");
  }

  async lowStockPdf(_req: Request, res: Response) {
    const pdf = await ReportService.lowStockReport(this.generatedBy);

    return sendPdf(res, pdf, "low-stock-report.pdf");
  }

  async gstPdf(req: Request, res: Response) {
    const { from, to } = this.getDates(req);

    const pdf = await ReportService.gstReport(from, to, this.generatedBy);

    return sendPdf(res, pdf, "gst-report.pdf");
  }

  async profitLossPdf(req: Request, res: Response) {
    const { from, to } = this.getDates(req);

    const pdf = await ReportService.profitLossReport(
      from,
      to,
      this.generatedBy,
    );

    return sendPdf(res, pdf, "profit-loss-report.pdf");
  }
}

export default new ReportController();
