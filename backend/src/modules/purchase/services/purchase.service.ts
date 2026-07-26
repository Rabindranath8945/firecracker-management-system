import { Types } from "mongoose";

import PurchaseRepository from "../repositories/purchase.repository.js";
import InventoryService from "../../inventory/index.js";
import NotificationEngine from "../../notification/engines/notification.engine.js";

import {
  createPurchaseSchema,
  updatePurchaseSchema,
} from "../validators/purchase.validator.js";

class PurchaseService {
  async create(data: unknown, userId: string) {
    if (!Types.ObjectId.isValid(userId)) {
      throw new Error("Invalid user.");
    }

    const validated = createPurchaseSchema.parse(data);

    const existing = await PurchaseRepository.findByPurchaseNo(
      validated.purchaseNo,
    );

    if (existing) {
      throw new Error("Purchase number already exists.");
    }

    const purchase = await PurchaseRepository.create({
      ...validated,

      supplier: new Types.ObjectId(validated.supplier),

      items: validated.items.map((item) => ({
        ...item,
        product: new Types.ObjectId(item.product),
      })),

      createdBy: new Types.ObjectId(userId),
    });

    // Increase stock only after purchase is created
    for (const item of validated.items) {
      await InventoryService.increaseStock(item.product, item.quantity, {
        type: "PURCHASE",
        referenceId: purchase._id.toString(),
        referenceNo: purchase.purchaseNo,
        createdBy: userId,
      });
    }

    const createdPurchase = await PurchaseRepository.findById(purchase.id);

    if (createdPurchase) {
      await NotificationEngine.purchaseCreated({
        userId,

        purchaseId: createdPurchase.id,

        purchaseNo: createdPurchase.purchaseNo,

        supplier:
          createdPurchase.supplier instanceof Types.ObjectId
            ? "Unknown Supplier"
            : createdPurchase.supplier.name,

        total: createdPurchase.grandTotal,
      });
    }

    return purchase;

    // return PurchaseRepository.create({
    //   ...validated,

    //   supplier: new Types.ObjectId(validated.supplier),

    //   items: validated.items.map((item) => ({
    //     ...item,
    //     product: new Types.ObjectId(item.product),
    //   })),

    //   createdBy: new Types.ObjectId(userId),
    // });
  }

  async getAll(options: {
    page?: number;
    limit?: number;
    search?: string;
    supplier?: string;
    paymentStatus?: string;
    fromDate?: Date;
    toDate?: Date;
    isActive?: boolean;
    sort?: string;
    order?: "asc" | "desc";
  }) {
    return PurchaseRepository.findAll(options);
  }

  async getById(id: string) {
    if (!Types.ObjectId.isValid(id)) {
      throw new Error("Invalid purchase id.");
    }

    const purchase = await PurchaseRepository.findById(id);

    if (!purchase) {
      throw new Error("Purchase not found.");
    }

    return purchase;
  }

  async update(id: string, data: unknown, userId: string) {
    if (!Types.ObjectId.isValid(id)) {
      throw new Error("Invalid purchase id.");
    }

    if (!Types.ObjectId.isValid(userId)) {
      throw new Error("Invalid user.");
    }

    const validated = updatePurchaseSchema.parse(data);

    const purchase = await PurchaseRepository.update(id, {
      ...validated,

      supplier: validated.supplier
        ? new Types.ObjectId(validated.supplier)
        : undefined,

      items: validated.items
        ? validated.items.map((item) => ({
            ...item,
            product: new Types.ObjectId(item.product),
          }))
        : undefined,

      updatedBy: new Types.ObjectId(userId),
    });

    if (!purchase) {
      throw new Error("Purchase not found.");
    }

    return purchase;
  }

  async delete(id: string, _userId: string) {
    if (!Types.ObjectId.isValid(id)) {
      throw new Error("Invalid purchase id.");
    }

    const purchase = await PurchaseRepository.delete(id);

    if (!purchase) {
      throw new Error("Purchase not found.");
    }

    return purchase;
  }

  async exportExcel() {
    return PurchaseRepository.findAllForExport();
  }
}

export default new PurchaseService();
