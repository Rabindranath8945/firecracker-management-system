import { PurchaseOcrResult } from "../interfaces/purchase-ocr.interface.js";

export function calculateOcrScore(result: PurchaseOcrResult): number {
  let score = 0;

  if (result.supplier.matched) score += 20;

  if (result.invoiceNumber) score += 10;

  if (result.invoiceDate) score += 10;

  if (result.gstNumber) score += 10;

  const totalItems = result.items.length || 1;

  const matched = result.items.filter((i) => i.matched).length;

  score += (matched / totalItems) * 50;

  return Math.round(score);
}
