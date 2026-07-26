export function generateSaleNumber(sequence: number) {
  return `SAL-${String(sequence).padStart(6, "0")}`;
}

export function generateInvoiceNumber(sequence: number) {
  return `INV-${String(sequence).padStart(6, "0")}`;
}
