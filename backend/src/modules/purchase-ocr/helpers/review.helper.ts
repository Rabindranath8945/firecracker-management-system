import { PurchaseOcrResult } from "../interfaces/purchase-ocr.interface.js";

export function buildReview(result: PurchaseOcrResult) {
  const matchedProducts = result.items.filter((item) => item.matched).length;

  const reviewProducts = result.items.filter(
    (item) => !item.matched && item.confidence >= 70,
  ).length;

  const notFoundProducts = result.items.filter(
    (item) => !item.matched && item.confidence < 50,
  ).length;

  return {
    supplier: {
      matched: result.supplier.matched,
      confidence: result.supplier.confidence,
    },

    invoice: {
      number: result.invoiceNumber !== "",
      date: result.invoiceDate !== "",
    },

    summary: {
      totalProducts: result.items.length,

      matchedProducts,

      reviewProducts,

      notFoundProducts,
    },
  };
}
