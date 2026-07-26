import { ClientSession, Types } from "mongoose";

import StockTransactionRepository from "../repositories/stock-transaction.repository.js";

class StockTransactionService {
  async create(
    data: {
      product: string;

      referenceId?: string;

      referenceNo?: string;

      type:
        | "PURCHASE"
        | "SALE"
        | "PURCHASE_RETURN"
        | "SALE_RETURN"
        | "ADJUSTMENT"
        | "OPENING";

      quantity: number;

      previousStock: number;

      currentStock: number;

      notes?: string;

      createdBy?: string;
    },
    session?: ClientSession,
  ) {
    return StockTransactionRepository.create(
      {
        product: new Types.ObjectId(data.product),

        referenceId: data.referenceId
          ? new Types.ObjectId(data.referenceId)
          : undefined,

        referenceNo: data.referenceNo,

        type: data.type,

        quantity: data.quantity,

        previousStock: data.previousStock,

        currentStock: data.currentStock,

        notes: data.notes,

        createdBy: data.createdBy
          ? new Types.ObjectId(data.createdBy)
          : undefined,
      },
      session,
    );
  }

  async getByProduct(productId: string) {
    return StockTransactionRepository.findByProduct(productId);
  }

  async getAll(page?: number, limit?: number) {
    return StockTransactionRepository.findAll(page, limit);
  }
}

export default new StockTransactionService();
