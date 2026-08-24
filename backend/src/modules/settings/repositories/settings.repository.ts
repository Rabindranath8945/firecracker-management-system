import Settings from "../models/settings.model.js";
import { ISettings } from "../interfaces/settings.interface.js";

class SettingsRepository {
  async create(data: Partial<ISettings>) {
    return Settings.create(data);
  }

  async find() {
    return Settings.findOne({
      isActive: true,
    });
  }

  async findById(id: string) {
    return Settings.findById(id);
  }

  async findByBusinessId(businessId: string) {
    return Settings.findOne({
      "users.businessId": businessId,
      isActive: true,
    });
  }

  async update(id: string, data: Partial<ISettings>) {
    return Settings.findByIdAndUpdate(id, data, {
      new: true,
      runValidators: true,
    });
  }

  async updateBusiness(userId: string, business: ISettings["business"]) {
    return Settings.findOneAndUpdate(
      {
        createdBy: userId,
        isActive: true,
      },
      {
        $set: {
          business,
        },
      },
      {
        new: true,
        runValidators: true,
      },
    );
  }

  async updateUsers(id: string, users: ISettings["users"]) {
    return Settings.findByIdAndUpdate(
      id,
      {
        users,
      },
      {
        new: true,
        runValidators: true,
      },
    );
  }

  async updatePayment(id: string, payment: ISettings["payment"]) {
    return Settings.findByIdAndUpdate(
      id,
      {
        payment,
      },
      {
        new: true,
        runValidators: true,
      },
    );
  }

  async updateInvoice(userId: string, invoice: ISettings["invoice"]) {
    return Settings.findOneAndUpdate(
      {
        createdBy: userId,
        isActive: true,
      },
      {
        $set: {
          invoice,
        },
      },
      {
        new: true,
        runValidators: true,
      },
    );
  }

  async generateNextInvoiceNumber(userId: string) {
    const settings = await Settings.findOneAndUpdate(
      {
        createdBy: userId,
        isActive: true,
      },
      {
        $inc: {
          "invoice.nextNumber": 1,
        },
      },
      {
        new: false,
        runValidators: true,
      },
    );

    if (!settings) {
      throw new Error("Settings not found for the authenticated user.");
    }

    const prefix = settings.invoice?.prefix?.trim().toUpperCase() || "INV";

    const nextNumber = Math.max(1, Number(settings.invoice?.nextNumber ?? 1));

    return `${prefix}-${nextNumber}`;
  }

  async getNextInvoiceNumber(userId: string) {
    const settings = await Settings.findOneAndUpdate(
      {
        createdBy: userId,
        isActive: true,
      },
      {
        $inc: {
          "invoice.nextNumber": 1,
        },
      },
      {
        new: false,
      },
    );

    if (!settings) {
      throw new Error("Settings not found for the authenticated user.");
    }

    const prefix = settings.invoice?.prefix?.trim().toUpperCase() || "INV";

    const number = Math.max(1, Number(settings.invoice?.nextNumber ?? 1));

    return `${prefix}-${number}`;
  }

  async updateTax(userId: string, tax: ISettings["tax"]) {
    return Settings.findOneAndUpdate(
      {
        createdBy: userId,
        isActive: true,
      },
      {
        $set: {
          tax,
        },
      },
      {
        new: true,
        runValidators: true,
      },
    );
  }

  async findByUserId(userId: string) {
    return Settings.findOne({
      createdBy: userId,
      isActive: true,
    });
  }

  async updateNumbering(userId: string, numbering: ISettings["numbering"]) {
    return Settings.findOneAndUpdate(
      {
        createdBy: userId,
        isActive: true,
      },
      {
        $set: {
          numbering,
        },
      },
      {
        new: true,
        runValidators: true,
      },
    );
  }

  async getNumberingPrefix(userId: string, type: keyof ISettings["numbering"]) {
    const settings = await Settings.findOne({
      createdBy: userId,
      isActive: true,
    }).select("numbering");

    if (!settings) {
      throw new Error("Settings not found for the authenticated user.");
    }

    const prefix = settings.numbering?.[type];

    if (!prefix || !prefix.trim()) {
      throw new Error(
        `Number series prefix is not configured for ${String(type)}.`,
      );
    }

    return prefix.trim().toUpperCase();
  }

  async updateDataManagement(
    id: string,
    dataManagement: ISettings["dataManagement"],
  ) {
    return Settings.findByIdAndUpdate(
      id,
      {
        dataManagement,
      },
      {
        new: true,
        runValidators: true,
      },
    );
  }

  async updateNotification(
    id: string,
    notification: ISettings["notification"],
  ) {
    return Settings.findByIdAndUpdate(
      id,
      {
        notification,
      },
      {
        new: true,
        runValidators: true,
      },
    );
  }

  async updateAppearance(id: string, appearance: ISettings["appearance"]) {
    return Settings.findByIdAndUpdate(
      id,
      {
        appearance,
      },
      {
        new: true,
        runValidators: true,
      },
    );
  }

  async updateSystem(id: string, system: ISettings["system"]) {
    return Settings.findByIdAndUpdate(
      id,
      {
        system,
      },
      {
        new: true,
        runValidators: true,
      },
    );
  }

  async updateSecurity(id: string, security: ISettings["security"]) {
    return Settings.findByIdAndUpdate(
      id,
      {
        security,
      },
      {
        new: true,
        runValidators: true,
      },
    );
  }

  async updateAbout(id: string, about: ISettings["about"]) {
    return Settings.findByIdAndUpdate(
      id,
      {
        about,
      },
      {
        new: true,
        runValidators: true,
      },
    );
  }
  async existsByBusinessId(businessId: string) {
    return Settings.exists({
      "users.businessId": businessId,
    });
  }
  async updateLogo(id: string, logo: string) {
    return Settings.findByIdAndUpdate(
      id,
      {
        "business.logo": logo,
      },
      {
        new: true,
        runValidators: true,
      },
    );
  }
  async updatePaymentQr(id: string, qr: string) {
    return Settings.findByIdAndUpdate(
      id,
      {
        "payment.staticQr": qr,
      },
      {
        new: true,
        runValidators: true,
      },
    );
  }
}

export default new SettingsRepository();
