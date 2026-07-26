import SettingsRepository from "../repositories/settings.repository.js";
import { generatePaymentSessionId } from "../helpers/payment-session.js";
import { generateUpiQr } from "../helpers/upi-qr.js";
import { ISettings } from "../interfaces/settings.interface.js";
import { createDefaultSettings } from "../helpers/default-settings.js";
import { generateBusinessId } from "../helpers/business-id.js";
import {
  PAYMENT_CONFIRMATION,
  PAYMENT_STATUS,
} from "../constants/payment.constants.js";

class SettingsService {
  private ensureSettingsExists<T>(settings: T | null): T {
    if (!settings) {
      throw new Error("Settings not found.");
    }

    return settings;
  }

  async get() {
    const settings = await SettingsRepository.find();

    return this.ensureSettingsExists(settings);
  }

  async update(id: string, data: Partial<ISettings>) {
    const settings = await SettingsRepository.update(id, data);

    return this.ensureSettingsExists(settings);
  }

  async updateBusiness(id: string, business: ISettings["business"]) {
    const settings = await SettingsRepository.updateBusiness(id, business);

    return this.ensureSettingsExists(settings);
  }

  async updateUsers(id: string, users: ISettings["users"]) {
    const settings = await SettingsRepository.updateUsers(id, users);

    return this.ensureSettingsExists(settings);
  }

  async updatePayment(id: string, payment: ISettings["payment"]) {
    const settings = await SettingsRepository.updatePayment(id, payment);

    return this.ensureSettingsExists(settings);
  }

  async updateInvoice(id: string, invoice: ISettings["invoice"]) {
    const settings = await SettingsRepository.updateInvoice(id, invoice);

    return this.ensureSettingsExists(settings);
  }

  async updateTax(id: string, tax: ISettings["tax"]) {
    const settings = await SettingsRepository.updateTax(id, tax);

    return this.ensureSettingsExists(settings);
  }

  async updateNumbering(id: string, numbering: ISettings["numbering"]) {
    const settings = await SettingsRepository.updateNumbering(id, numbering);

    return this.ensureSettingsExists(settings);
  }

  async updateDataManagement(
    id: string,
    dataManagement: ISettings["dataManagement"],
  ) {
    const settings = await SettingsRepository.updateDataManagement(
      id,
      dataManagement,
    );

    return this.ensureSettingsExists(settings);
  }
  async updateNotification(
    id: string,
    notification: ISettings["notification"],
  ) {
    const settings = await SettingsRepository.updateNotification(
      id,
      notification,
    );

    return this.ensureSettingsExists(settings);
  }

  async updateAppearance(id: string, appearance: ISettings["appearance"]) {
    const settings = await SettingsRepository.updateAppearance(id, appearance);

    return this.ensureSettingsExists(settings);
  }

  async updateSystem(id: string, system: ISettings["system"]) {
    const settings = await SettingsRepository.updateSystem(id, system);

    return this.ensureSettingsExists(settings);
  }

  async updateSecurity(id: string, security: ISettings["security"]) {
    const settings = await SettingsRepository.updateSecurity(id, security);

    return this.ensureSettingsExists(settings);
  }

  async updateAbout(id: string, about: ISettings["about"]) {
    const settings = await SettingsRepository.updateAbout(id, about);

    return this.ensureSettingsExists(settings);
  }

  async updateLogo(id: string, logo: string) {
    const settings = await SettingsRepository.updateLogo(id, logo);

    return this.ensureSettingsExists(settings);
  }

  async updatePaymentQr(id: string, qr: string) {
    const settings = await SettingsRepository.updatePaymentQr(id, qr);

    return this.ensureSettingsExists(settings);
  }

  async generatePaymentQr(amount: number) {
    const settings = this.ensureSettingsExists(await SettingsRepository.find());

    const payment = settings.payment;

    const merchantName = payment.merchantName.trim() || settings.business.name;

    const upiId = payment.upiId.trim();

    const staticQr = payment.staticQr.trim();

    const sessionId = generatePaymentSessionId();

    const expiresIn = payment.qrExpirySeconds;

    const expiresAt = new Date(Date.now() + expiresIn * 1000);

    let qr = "";

    if (payment.mode === "DYNAMIC_QR" && upiId !== "") {
      qr = await generateUpiQr({
        upiId,
        merchantName,
        amount,
      });
    } else if (payment.mode === "STATIC_QR" && staticQr !== "") {
      qr = staticQr;
    } else {
      throw new Error("Payment QR is not configured.");
    }

    return {
      sessionId,

      mode: payment.mode,

      status: PAYMENT_STATUS[0],

      amount,

      currency: settings.tax.currency,

      merchant: {
        name: merchantName,

        upiId,

        showName: payment.showMerchantName,

        showUpiId: payment.showUpiId,
      },

      voice: {
        enabled: payment.voiceAnnouncement,

        style: payment.announcementStyle,

        volume: payment.volume,
      },

      confirmation: {
        required: true,

        method: PAYMENT_CONFIRMATION[0],
      },

      generatedAt: new Date(),

      expiresAt,

      expiresIn,

      qr,
    };
  }

  async getPaymentStatus() {
    const settings = this.ensureSettingsExists(await SettingsRepository.find());

    const payment = settings.payment;
    const merchantName = payment.merchantName.trim() || settings.business.name;

    const upiId = payment.upiId.trim();

    const staticQr = payment.staticQr.trim();

    const configured =
      (payment.mode === "DYNAMIC_QR" && upiId !== "") ||
      (payment.mode === "STATIC_QR" && staticQr !== "");

    return {
      configured,
      mode: payment.mode,
      merchantName,
      upiId: payment.showUpiId ? upiId : "",
      voiceAnnouncement: payment.voiceAnnouncement,
      qrExpirySeconds: payment.qrExpirySeconds,
    };
  }

  async initialize(data: {
    businessName: string;
    ownerName: string;
    phone: string;
  }) {
    let businessId = generateBusinessId();

    while (await SettingsRepository.existsByBusinessId(businessId)) {
      businessId = generateBusinessId();
    }

    const settings = await createDefaultSettings(
      data.businessName,
      data.ownerName,
      data.phone,
      businessId,
    );

    const createdSettings = await SettingsRepository.create(settings);

    return {
      settings: createdSettings,
      businessId,
    };
  }
}
// settings.constants.ts
export default new SettingsService();
