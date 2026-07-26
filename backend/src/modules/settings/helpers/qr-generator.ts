import QRCode from "qrcode";

export async function generateQrCode(text: string): Promise<string> {
  return QRCode.toDataURL(text, {
    errorCorrectionLevel: "H",
    margin: 2,
    width: 300,
  });
}
