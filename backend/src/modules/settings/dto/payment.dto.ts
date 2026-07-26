export interface PaymentDto {
  mode: "STATIC_QR" | "DYNAMIC_QR";

  merchantName: string;

  upiId: string;

  staticQr?: string;

  dynamicQr: boolean;

  showQrOnInvoice: boolean;

  showMerchantName: boolean;

  showUpiId: boolean;

  voiceAnnouncement: boolean;

  announcementStyle: "PAYMENT_RECEIVED" | "AMOUNT_RECEIVED";

  volume: number;
}
