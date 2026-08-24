import { generateQrCode } from "./qr-generator.js";

import { SettingsInput } from "../validators/settings.validator.js";

export async function createDefaultSettings(
  businessName: string,
  ownerName: string,
  phone: string,
  businessId: string,
): Promise<SettingsInput> {
  const businessQr = await generateQrCode(businessId);

  return {
    business: {
      name: businessName,
      ownerName,
      phone,
      logo: "",
      businessType: "",
      gstNo: "",
      panNo: "",
      email: "",
      website: "",
      address: "",
      city: "",
      state: "",
      pincode: "",
    },

    users: {
      businessId,
      businessQr,
      allowJoinRequest: true,
      defaultRole: "STAFF",
      maxDevices: 5,
    },

    payment: {
      mode: "DYNAMIC_QR",
      merchantName: "",
      upiId: "",
      staticQr: "",
      dynamicQr: true,
      showQrOnInvoice: true,
      qrExpirySeconds: 300,
      showMerchantName: true,
      showUpiId: true,
      voiceAnnouncement: true,
      announcementStyle: "AMOUNT_RECEIVED",
      volume: 100,
    },

    invoice: {
      prefix: "INV",
      nextNumber: 1,
      footer: "Thank you for your business.",
      terms: "",
      showLogo: true,
      showGST: true,
      showCustomerMobile: true,
      showCustomerAddress: true,
    },

    tax: {
      enabled: true,
      defaultGST: 18,
      taxType: "EXCLUSIVE",
      currency: "INR",
      currencySymbol: "₹",
    },

    numbering: {
      product: "PRD",
      customer: "CUS",
      supplier: "SUP",
      purchase: "PUR",
      sale: "SAL",
      expense: "EXP",
    },

    dataManagement: {
      allowImport: true,
      allowExport: true,
      backupEnabled: true,
    },

    notification: {
      lowStock: true,
      outOfStock: true,
      saleSuccess: true,
      purchaseSuccess: true,
      expenseAdded: true,
      importCompleted: true,
      exportCompleted: true,
      sound: true,
    },

    appearance: {
      theme: "LIGHT",
      fontSize: "MEDIUM",
      compactMode: false,
    },

    system: {
      language: "ENGLISH",
      financialYear: "",
      dateFormat: "DD/MM/YYYY",
      decimalPlaces: 2,
    },

    security: {
      googleLogin: true,
      trustedDevices: true,
      allowMultipleDevices: true,
    },

    about: {
      version: "1.0.0",
      developer: "Mahendra Tech Solutions",
      website: "",
      privacyPolicy: "",
      terms: "",
    },
  };
}
