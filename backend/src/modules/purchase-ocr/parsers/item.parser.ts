import { OcrProduct } from "../interfaces/purchase-ocr.interface.js";

export function parseItems(text: string): OcrProduct[] {
  const items: OcrProduct[] = [];

  const lines = text
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);

  for (const line of lines) {
    /*
      Example OCR

      Good Day Biscuit 5 40 200

      Marie Gold 10 32.5 325
    */

    const match = line.match(
      /^(.+?)\s+(\d+(?:\.\d+)?)\s+(\d+(?:\.\d+)?)\s+(\d+(?:\.\d+)?)$/,
    );

    if (!match) {
      continue;
    }

    items.push({
      name: match[1].trim(),

      quantity: Number(match[2]),

      purchasePrice: Number(match[3]),

      total: Number(match[4]),

      matched: false,

      confidence: 0,
    });
  }

  return items;
}
