import {
  PdfService,
  type PdfBusinessContext,
  type PdfOptions,
} from "../../../common/pdf/index.js";

/* -------------------------------------------------------------------------- */
/* TYPES                                                                      */
/* -------------------------------------------------------------------------- */

interface ProfitLossReportOptions {
  business: PdfBusinessContext;

  generatedBy: string;

  dateRange: string;

  sales: number;

  purchase: number;

  expense: number;

  purchaseCost: number;

  grossProfit: number;

  netProfit: number;
}

/* -------------------------------------------------------------------------- */
/* REPORT                                                                     */
/* -------------------------------------------------------------------------- */

export async function generateProfitLossReport({
  business,
  generatedBy,
  dateRange,
  sales,
  purchase,
  expense,
  purchaseCost,
  grossProfit,
  netProfit,
}: ProfitLossReportOptions): Promise<Buffer> {
  const options: PdfOptions = {
    title: "Profit & Loss Report",

    company: business,

    generatedBy,

    dateRange,

    columns: [],

    rows: [],

    summary: [
      {
        label: "Sales",
        value: `Rs. ${Number(sales ?? 0).toFixed(2)}`,
      },

      {
        label: "Purchase",
        value: `Rs. ${Number(purchase ?? 0).toFixed(2)}`,
      },

      {
        label: "Purchase Cost",
        value: `Rs. ${Number(purchaseCost ?? 0).toFixed(2)}`,
      },

      {
        label: "Expenses",
        value: `Rs. ${Number(expense ?? 0).toFixed(2)}`,
      },

      {
        label: "Gross Profit",
        value: `Rs. ${Number(grossProfit ?? 0).toFixed(2)}`,
      },

      {
        label: "Net Profit",
        value: `Rs. ${Number(netProfit ?? 0).toFixed(2)}`,
        highlight: true,
      },
    ],
  };

  return PdfService.generate(options);
}
