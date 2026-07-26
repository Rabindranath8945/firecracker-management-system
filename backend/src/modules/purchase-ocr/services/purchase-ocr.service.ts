import { scanInvoice } from "../providers/paddle.provider.js";

import { parseInvoice } from "../parsers/invoice.parser.js";

import SupplierMatcher from "../matchers/supplier.matcher.js";
import ProductMatcher from "../matchers/product.matcher.js";
import { buildReview } from "../helpers/review.helper.js";
import { buildPurchaseDraft } from "../builders/purchase-draft.builder.js";
import { calculateOcrScore } from "../helpers/ocr-score.helper.js";
import PurchaseService from "../../purchase/services/purchase.service.js";

class PurchaseOcrService {
  async scan(imagePath: string) {
    /* ---------------------------------------------------------------------- */
    /*                                OCR                                     */
    /* ---------------------------------------------------------------------- */

    const rawText = await scanInvoice(imagePath);

    /* ---------------------------------------------------------------------- */
    /*                              Parse Invoice                             */
    /* ---------------------------------------------------------------------- */

    const invoice = parseInvoice(rawText);

    /* ---------------------------------------------------------------------- */
    /*                           Match Supplier                               */
    /* ---------------------------------------------------------------------- */

    const lines = rawText
      .split("\n")
      .map((line) => line.trim())
      .filter(Boolean);

    if (lines.length > 0) {
      invoice.supplier = await SupplierMatcher.match(lines[0]);
    }

    /* ---------------------------------------------------------------------- */
    /*                           Match Products                               */
    /* ---------------------------------------------------------------------- */

    for (const item of invoice.items) {
      const product = await ProductMatcher.match(item.name);

      item.productId = product.id;

      if (product.matched) {
        item.name = product.name;
      }

      item.matched = product.matched;

      item.confidence = product.confidence;
    }

    /* ---------------------------------------------------------------------- */
    /*                                Result                                  */
    /* ---------------------------------------------------------------------- */
    const review = buildReview(invoice);

    const draft = buildPurchaseDraft(invoice);

    const ocrScore = calculateOcrScore(invoice);

    return {
      ocrScore,

      review,

      draft,

      invoice,
    };
  }

  async save(data: unknown, userId: string) {
    return PurchaseService.create(data, userId);
  }
}

export default new PurchaseOcrService();
