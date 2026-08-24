import { Types } from "mongoose";

import SalesRepository from "../repositories/sales.repository.js";
import { generateSequenceCode } from "../../../common/utils/generate-code.js";
import SettingsRepository from "../../settings/repositories/settings.repository.js";
import {
  createSaleSchema,
  updateSaleSchema,
} from "../validators/sales.validator.js";

import { createSaleWorkflow } from "../workflows/create-sale.workflow.js";

class SalesService {
  async create(data: unknown, userId: string) {
    if (!Types.ObjectId.isValid(userId)) {
      throw new Error("Invalid user.");
    }

    const validated = createSaleSchema.parse(data);

    return createSaleWorkflow(validated, userId);
  }

  async getAll(options: {
    page?: number;
    limit?: number;
    search?: string;
    customer?: string;
    paymentStatus?: string;
    paymentMethod?: string;
    fromDate?: Date;
    toDate?: Date;
    isActive?: boolean;
    sort?: string;
    order?: "asc" | "desc";
  }) {
    return SalesRepository.findAll(options);
  }

  async getById(id: string) {
    if (!Types.ObjectId.isValid(id)) {
      throw new Error("Invalid sale id.");
    }

    const sale = await SalesRepository.findById(id);

    if (!sale) {
      throw new Error("Sale not found.");
    }

    return sale;
  }

  async getSummary() {
    return SalesRepository.getTodaySummary();
  }

  async getNextCode(userId: string) {
    if (!Types.ObjectId.isValid(userId)) {
      throw new Error("Invalid user.");
    }

    const prefix = await SettingsRepository.getNumberingPrefix(userId, "sale");

    const sales = await SalesRepository.getSaleCodes();

    return generateSequenceCode(
      sales
        .map((sale) => sale.saleNo)
        .filter((code): code is string => Boolean(code)),
      prefix,
    );
  }

  async update(id: string, data: unknown, userId: string) {
    if (!Types.ObjectId.isValid(id)) {
      throw new Error("Invalid sale id.");
    }

    if (!Types.ObjectId.isValid(userId)) {
      throw new Error("Invalid user.");
    }

    const validated = updateSaleSchema.parse(data);

    const sale = await SalesRepository.update(id, {
      customer: validated.customer
        ? new Types.ObjectId(validated.customer)
        : undefined,

      payment: validated.payment,

      paymentStatus: validated.paymentStatus,

      notes: validated.notes,

      updatedBy: new Types.ObjectId(userId),
    });

    if (!sale) {
      throw new Error("Sale not found.");
    }

    return sale;
  }

  async delete(id: string, userId: string) {
    if (!Types.ObjectId.isValid(id)) {
      throw new Error("Invalid sale id.");
    }

    if (!Types.ObjectId.isValid(userId)) {
      throw new Error("Invalid user.");
    }

    const existingSale = await SalesRepository.findById(id);

    if (!existingSale) {
      throw new Error("Sale not found.");
    }

    if (!existingSale.isActive) {
      throw new Error("Sale is already cancelled.");
    }

    const sale = await SalesRepository.update(id, {
      isActive: false,

      updatedBy: new Types.ObjectId(userId),
    });

    if (!sale) {
      throw new Error("Unable to cancel sale.");
    }

    return sale;
  }

  async exportExcel() {
    return SalesRepository.findAllForExport();
  }
}

export default new SalesService();
