import { scanInvoice } from "../providers/tesseract.provider.js";
import { parseInvoice } from "../parsers/invoice.parser.js";

import SupplierRepository from "../../supplier/repositories/supplier.repository.js";
import ProductRepository from "../../product/repositories/product.repository.js";

class PurchaseOcrService {
  async scan(imagePath: string) {
    /* ---------------------------------------------------------------------- */
    /* 1. OCR Scan                                                            */
    /* ---------------------------------------------------------------------- */

    const rawText = await scanInvoice(imagePath);

    /* ---------------------------------------------------------------------- */
    /* 2. Parse Invoice                                                       */
    /* ---------------------------------------------------------------------- */

    const invoice = parseInvoice(rawText);

    /* ---------------------------------------------------------------------- */
    /* 3. Find Supplier                                                       */
    /* ---------------------------------------------------------------------- */

    let supplier = null;

    if (invoice.supplier) {
      supplier = await SupplierRepository.findByName(invoice.supplier);
    }

    /* ---------------------------------------------------------------------- */
    /* 4. Match Products                                                      */
    /* ---------------------------------------------------------------------- */

    const items = await Promise.all(
      invoice.items.map(async (item) => {
        const product = await ProductRepository.findByName(item.name);

        return {
          ...item,
          product,
          matched: !!product,
        };
      }),
    );

    /* ---------------------------------------------------------------------- */
    /* 5. Return Suggestion                                                   */
    /* ---------------------------------------------------------------------- */

    return {
      supplier,

      invoiceNumber: invoice.invoiceNumber,

      invoiceDate: invoice.invoiceDate,

      gst: (invoice as any).gst,

      total: invoice.total,

      items,

      rawText,
    };
  }
}

export default new PurchaseOcrService();
