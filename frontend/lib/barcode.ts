import { BarcodeScanner } from "@capacitor-mlkit/barcode-scanning";

export async function scanBarcode(): Promise<string | null> {
  const permission = await BarcodeScanner.requestPermissions();

  if (permission.camera !== "granted") {
    return null;
  }

  const { barcodes } = await BarcodeScanner.scan();

  const barcode = barcodes.at(0);

  if (!barcode) {
    return null;
  }

  return barcode.displayValue ?? barcode.rawValue ?? null;
}
