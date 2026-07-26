import { PurchaseOcrResult } from "../interfaces/purchase-ocr.interface.js";
import { parseItems } from "./item.parser.js";
import { detectInvoice } from "../helpers/invoice-detector.js";

export function parseInvoice(text: string): PurchaseOcrResult {
  const detected = detectInvoice(text);
  const invoiceNumber = detected.invoiceNumber;

  const invoiceDate = text.match(/(\d{2}[\/.-]\d{2}[\/.-]\d{4})/)?.[1] ?? "";

  const gstNumber = detected.gstNumber;

  const subtotal =
    Number(text.match(/sub.?total[: ]+([\d,.]+)/i)?.[1]?.replace(/,/g, "")) ||
    0;

  const taxAmount =
    Number(text.match(/(gst|tax)[: ]+([\d,.]+)/i)?.[2]?.replace(/,/g, "")) || 0;

  const grandTotal =
    Number(text.match(/grand.?total[: ]+([\d,.]+)/i)?.[1]?.replace(/,/g, "")) ||
    Number(text.match(/total[: ]+([\d,.]+)/i)?.[1]?.replace(/,/g, "")) ||
    0;

  return {
    supplier: {
      name: "",
      matched: false,
      confidence: 0,
    },

    invoiceNumber,

    invoiceDate,

    gstNumber,

    subtotal,

    taxAmount,

    grandTotal,

    items: parseItems(detected.items.join("\n")),

    rawText: text,
  };
}
