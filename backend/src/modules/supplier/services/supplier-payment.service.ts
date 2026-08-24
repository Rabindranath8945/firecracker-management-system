import { Types } from "mongoose";

import SupplierRepository from "../../supplier/repositories/supplier.repository.js";
import SupplierPaymentRepository from "../repositories/supplier-payment.repository.js";

import {
  createSupplierPaymentSchema,
  updateSupplierPaymentSchema,
} from "../validators/supplier-payment.validator.js";

class SupplierPaymentService {
  /* ---------------------------------------------------------------------- */
  /* CREATE                                                                 */
  /* ---------------------------------------------------------------------- */

  async create(data: unknown, userId: string) {
    if (!Types.ObjectId.isValid(userId)) {
      throw new Error("Invalid user.");
    }

    const validated = createSupplierPaymentSchema.parse(data);

    if (!Types.ObjectId.isValid(validated.supplier)) {
      throw new Error("Invalid supplier id.");
    }

    const supplier = await SupplierRepository.findById(validated.supplier);

    if (!supplier) {
      throw new Error("Supplier not found.");
    }

    if (
      validated.referencePurchase &&
      !Types.ObjectId.isValid(validated.referencePurchase)
    ) {
      throw new Error("Invalid purchase id.");
    }

    return SupplierPaymentRepository.create({
      supplier: new Types.ObjectId(validated.supplier),

      amount: validated.amount,

      paymentMethod: validated.paymentMethod,

      paymentType: validated.paymentType,

      paymentDate: validated.paymentDate,

      ...(validated.referencePurchase
        ? {
            referencePurchase: new Types.ObjectId(validated.referencePurchase),
          }
        : {}),

      notes: validated.notes ?? "",

      createdBy: new Types.ObjectId(userId),
    });
  }

  /* ---------------------------------------------------------------------- */
  /* GET BY ID                                                              */
  /* ---------------------------------------------------------------------- */

  async getById(id: string) {
    if (!Types.ObjectId.isValid(id)) {
      throw new Error("Invalid supplier payment id.");
    }

    const payment = await SupplierPaymentRepository.findById(id);

    if (!payment) {
      throw new Error("Supplier payment not found.");
    }

    return payment;
  }

  /* ---------------------------------------------------------------------- */
  /* GET ALL                                                                */
  /* ---------------------------------------------------------------------- */

  async getAll(options: {
    supplier?: string;
    paymentType?: "CURRENT_PURCHASE" | "PREVIOUS_DUE";
    fromDate?: Date;
    toDate?: Date;
    isActive?: boolean;
  }) {
    return SupplierPaymentRepository.findAll(options);
  }

  /* ---------------------------------------------------------------------- */
  /* GET TOTAL BY SUPPLIER                                                   */
  /* ---------------------------------------------------------------------- */

  async getTotalBySupplier(
    supplierId: string,
    paymentType?: "CURRENT_PURCHASE" | "PREVIOUS_DUE",
  ) {
    if (!Types.ObjectId.isValid(supplierId)) {
      throw new Error("Invalid supplier id.");
    }

    const supplier = await SupplierRepository.findById(supplierId);

    if (!supplier) {
      throw new Error("Supplier not found.");
    }

    return SupplierPaymentRepository.getTotalBySupplier(
      supplierId,
      paymentType,
    );
  }

  /* ---------------------------------------------------------------------- */
  /* UPDATE                                                                 */
  /* ---------------------------------------------------------------------- */

  async update(id: string, data: unknown, userId: string) {
    if (!Types.ObjectId.isValid(id)) {
      throw new Error("Invalid supplier payment id.");
    }

    if (!Types.ObjectId.isValid(userId)) {
      throw new Error("Invalid user.");
    }

    const validated = updateSupplierPaymentSchema.parse(data);

    const existingPayment = await SupplierPaymentRepository.findById(id);

    if (!existingPayment) {
      throw new Error("Supplier payment not found.");
    }

    const updateData: Record<string, unknown> = {
      updatedBy: new Types.ObjectId(userId),
    };

    if (validated.supplier !== undefined) {
      if (!Types.ObjectId.isValid(validated.supplier)) {
        throw new Error("Invalid supplier id.");
      }

      const supplier = await SupplierRepository.findById(validated.supplier);

      if (!supplier) {
        throw new Error("Supplier not found.");
      }

      updateData.supplier = new Types.ObjectId(validated.supplier);
    }

    if (validated.amount !== undefined) {
      updateData.amount = validated.amount;
    }

    if (validated.paymentMethod !== undefined) {
      updateData.paymentMethod = validated.paymentMethod;
    }

    if (validated.paymentType !== undefined) {
      updateData.paymentType = validated.paymentType;
    }

    if (validated.paymentDate !== undefined) {
      updateData.paymentDate = validated.paymentDate;
    }

    if (validated.referencePurchase !== undefined) {
      if (
        validated.referencePurchase &&
        !Types.ObjectId.isValid(validated.referencePurchase)
      ) {
        throw new Error("Invalid purchase id.");
      }

      updateData.referencePurchase = validated.referencePurchase
        ? new Types.ObjectId(validated.referencePurchase)
        : undefined;
    }

    if (validated.notes !== undefined) {
      updateData.notes = validated.notes;
    }

    const payment = await SupplierPaymentRepository.update(id, updateData);

    if (!payment) {
      throw new Error("Supplier payment could not be updated.");
    }

    return payment;
  }

  /* ---------------------------------------------------------------------- */
  /* DELETE                                                                 */
  /* ---------------------------------------------------------------------- */

  async delete(id: string, userId: string) {
    if (!Types.ObjectId.isValid(id)) {
      throw new Error("Invalid supplier payment id.");
    }

    if (!Types.ObjectId.isValid(userId)) {
      throw new Error("Invalid user.");
    }

    const payment = await SupplierPaymentRepository.delete(id);

    if (!payment) {
      throw new Error("Supplier payment not found.");
    }

    return payment;
  }
}

export default new SupplierPaymentService();
