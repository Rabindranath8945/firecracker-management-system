export interface InvoiceSections {
  supplier: string;
  invoiceNumber: string;
  invoiceDate: string;
  gstNumber: string;
  items: string[];
  total: string;
}

export function detectInvoice(text: string): InvoiceSections {
  const lines = text
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);

  let supplier = "";
  let invoiceNumber = "";
  let invoiceDate = "";
  let gstNumber = "";
  let total = "";

  const items: string[] = [];

  let tableStarted = false;

  for (const line of lines) {
    const upper = line.toUpperCase();

    /* ---------------- Supplier ---------------- */

    if (!supplier && line.length > 4 && !upper.includes("INVOICE")) {
      supplier = line;
    }

    /* ---------------- Invoice No ---------------- */

    if (
      upper.includes("INVOICE") ||
      upper.includes("BILL NO") ||
      upper.includes("INV NO")
    ) {
      invoiceNumber = line;
    }

    /* ---------------- Date ---------------- */

    if (/\d{2}[\/.-]\d{2}[\/.-]\d{4}/.test(line)) {
      invoiceDate = line;
    }

    /* ---------------- GST ---------------- */

    if (upper.includes("GST") || upper.includes("GSTIN")) {
      gstNumber = line;
    }

    /* ---------------- Table Start ---------------- */

    if (
      upper.includes("QTY") &&
      (upper.includes("RATE") || upper.includes("PRICE"))
    ) {
      tableStarted = true;
      continue;
    }

    /* ---------------- Grand Total ---------------- */

    if (upper.includes("TOTAL") && /\d/.test(line)) {
      total = line;
      tableStarted = false;
    }

    /* ---------------- Table Rows ---------------- */

    if (tableStarted) {
      items.push(line);
    }
  }

  return {
    supplier,
    invoiceNumber,
    invoiceDate,
    gstNumber,
    items,
    total,
  };
}
