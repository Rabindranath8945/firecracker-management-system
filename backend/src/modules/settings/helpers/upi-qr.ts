import QRCode from "qrcode";

interface GenerateUpiQrOptions {
  upiId: string;
  merchantName: string;
  amount: number;
  note?: string;
}

export async function generateUpiQr({
  upiId,
  merchantName,
  amount,
  note = "Payment",
}: GenerateUpiQrOptions): Promise<string> {
  const upiUrl = new URL("upi://pay");

  upiUrl.searchParams.set("pa", upiId);
  upiUrl.searchParams.set("pn", merchantName);
  upiUrl.searchParams.set("am", amount.toFixed(2));
  upiUrl.searchParams.set("cu", "INR");
  upiUrl.searchParams.set("tn", note);

  return QRCode.toDataURL(upiUrl.toString(), {
    errorCorrectionLevel: "H",
    margin: 2,
    width: 300,
  });
}
