import path from "path";

export function getLogoPath(filename: string) {
  return path.join("uploads", "logos", filename);
}

export function getPaymentQrPath(filename: string) {
  return path.join("uploads", "payment-qr", filename);
}
