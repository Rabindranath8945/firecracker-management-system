import { Types } from "mongoose";
import BusinessRepository from "../../business/repositories/business.repository.js";
import UserService from "../../user/services/user.service.js";
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
    userId: string;
  }) {
    if (!Types.ObjectId.isValid(data.userId)) {
      throw new Error("Invalid user.");
    }

    // Check whether active settings already exist.
    const existingSettings = await SettingsRepository.find();

    if (existingSettings) {
      return {
        settings: existingSettings,
        businessId: existingSettings.users.businessId,
      };
    }

    let businessId = generateBusinessId();

    while (await SettingsRepository.existsByBusinessId(businessId)) {
      businessId = generateBusinessId();
    }

    const defaultSettings = await createDefaultSettings(
      data.businessName,
      data.ownerName,
      data.phone,
      businessId,
    );

    const createdSettings = await SettingsRepository.create({
      ...defaultSettings,
      createdBy: new Types.ObjectId(data.userId),
    });

    return {
      settings: createdSettings,
      businessId,
    };
  }

  async initializeFromBusiness(businessId: string, userId: string) {
    if (!Types.ObjectId.isValid(userId)) {
      throw new Error("Invalid user.");
    }

    console.log("Settings initialization businessId:", businessId);

    const business = await BusinessRepository.findByBusinessId(businessId);

    console.log("Business found:", business);

    if (!business) {
      throw new Error("Business not found.");
    }

    const existingSettings = await SettingsRepository.findByBusinessId(
      business.businessId,
    );

    if (existingSettings) {
      return {
        settings: existingSettings,
        businessId: business.businessId,
      };
    }

    const businessName = business.name ?? "";
    const phone = business.phone ?? "";

    const defaultSettings = await createDefaultSettings(
      businessName,
      "",
      phone,
      business.businessId,
    );

    const settings = await SettingsRepository.create({
      ...defaultSettings,

      business: {
        ...defaultSettings.business,

        name: businessName,
        ownerName: "",
        logo: business.logo ?? "",
        businessType: business.type ?? "",
        phone,
        address: business.address ?? "",
      },

      createdBy: new Types.ObjectId(userId),
    });

    return {
      settings,
      businessId: business.businessId,
    };
  }

  async initializeForUser(userId: string) {
    if (!Types.ObjectId.isValid(userId)) {
      throw new Error("Invalid user.");
    }

    // User.currentBusiness stores the Business MongoDB _id
    const currentBusinessId = await UserService.getCurrentBusiness(userId);

    if (!currentBusinessId) {
      throw new Error("No current business selected.");
    }

    // Find the selected business by MongoDB _id
    const business = await BusinessRepository.findById(currentBusinessId);

    if (!business) {
      throw new Error(`Business '${currentBusinessId}' not found.`);
    }

    // Check whether Settings already exists
    const existingSettings = await SettingsRepository.findByBusinessId(
      business.businessId,
    );

    if (existingSettings) {
      return existingSettings;
    }

    // Get business owner
    const owner = await UserService.getUserById(business.owner.toString());

    if (!owner) {
      throw new Error("Business owner not found.");
    }

    // Your User model currently has email but no firstName/lastName.
    const ownerName = owner.email.trim();

    if (!ownerName) {
      throw new Error("Business owner name is missing.");
    }

    // Create default settings
    const defaultSettings = await createDefaultSettings(
      business.name,
      ownerName,
      business.phone ?? "",
      business.businessId,
    );

    // Create Settings
    const settings = await SettingsRepository.create({
      ...defaultSettings,

      business: {
        ...defaultSettings.business,

        name: business.name,
        ownerName,

        logo: business.logo ?? "",
        businessType: business.type ?? "",
        phone: business.phone ?? "",
        email: business.email ?? "",
        address: business.address ?? "",
      },

      createdBy: new Types.ObjectId(userId),
    });

    return settings;
  }
}
// settings.constants.ts
export default new SettingsService();
