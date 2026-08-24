import { ClientSession } from "mongoose";

import ProductRepository from "../../product/repositories/product.repository.js";
import StockTransactionService from "../../stock-transaction/services/stock-transaction.service.js";
import NotificationEngine from "../../notification/engines/notification.engine.js";

class InventoryService {
  async increaseStock(
    productId: string,
    quantity: number,
    transaction: {
      type: "PURCHASE" | "OPENING" | "ADJUSTMENT" | "PURCHASE_RETURN";

      referenceId?: string;

      referenceNo?: string;

      createdBy?: string;
    },
    session?: ClientSession,
  ) {
    const product = await ProductRepository.findById(productId);

    if (!product) {
      throw new Error("Product not found.");
    }

    const previousStock = product.stock;

    const updated = await ProductRepository.increaseStock(
      productId,
      quantity,
      session,
    );

    if (!updated) {
      throw new Error("Failed to update stock.");
    }

    await StockTransactionService.create(
      {
        product: productId,

        referenceId: transaction.referenceId,

        referenceNo: transaction.referenceNo,

        type: transaction.type,

        quantity,

        previousStock,

        currentStock: updated.stock,

        createdBy: transaction.createdBy,
      },
      session,
    );

    if (updated.stock <= updated.minimumStock && transaction.createdBy) {
      try {
        await NotificationEngine.lowStock({
          userId: transaction.createdBy,

          productId: updated.id,

          productName: updated.name,

          currentStock: updated.stock,

          minimumStock: updated.minimumStock,
        });
      } catch (error) {
        console.error("Low stock notification failed:", error);
      }
    }

    return updated;
  }

  async decreaseStock(
    productId: string,
    quantity: number,
    transaction: {
      type: "SALE" | "SALE_RETURN" | "ADJUSTMENT";

      referenceId?: string;

      referenceNo?: string;

      createdBy: string;
    },
    session?: ClientSession,
  ) {
    const product = await ProductRepository.findById(productId);

    if (!product) {
      throw new Error("Product not found.");
    }

    if (product.stock < quantity) {
      throw new Error(
        `Insufficient stock for '${product.name}'. Available: ${product.stock}, Requested: ${quantity}.`,
      );
    }

    const previousStock = product.stock;

    const updated = await ProductRepository.decreaseStock(
      productId,
      quantity,
      session,
    );

    if (!updated) {
      throw new Error("Failed to update stock.");
    }

    await StockTransactionService.create(
      {
        product: productId,

        referenceId: transaction.referenceId,

        referenceNo: transaction.referenceNo,

        type: transaction.type,

        quantity,

        previousStock,

        currentStock: updated.stock,

        createdBy: transaction.createdBy,
      },
      session,
    );

    return updated;
  }

  async getCurrentStock(productId: string) {
    const product = await ProductRepository.findById(productId);

    if (!product) {
      throw new Error("Product not found.");
    }

    return product.stock;
  }

  async validateStock(productId: string, quantity: number) {
    const stock = await this.getCurrentStock(productId);

    if (stock < quantity) {
      throw new Error("Insufficient stock.");
    }

    return true;
  }
}

export default new InventoryService();
