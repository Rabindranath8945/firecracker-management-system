import { ClientSession } from "mongoose";
import StockTransaction from "../models/stock-transaction.model.js";
import { IStockTransaction } from "../interfaces/stock-transaction.interface.js";

class StockTransactionRepository {
  async create(data: Partial<IStockTransaction>, session?: ClientSession) {
    const [transaction] = await StockTransaction.create([data], {
      session,
    });

    return transaction;
  }

  async findByProduct(productId: string) {
    return StockTransaction.find({
      product: productId,
    })
      .sort({
        createdAt: -1,
      })
      .populate("product");
  }

  async findAll(page = 1, limit = 20) {
    const skip = (page - 1) * limit;

    const [items, total] = await Promise.all([
      StockTransaction.find()
        .populate("product")
        .sort({
          createdAt: -1,
        })
        .skip(skip)
        .limit(limit),

      StockTransaction.countDocuments(),
    ]);

    return {
      items,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }
}

export default new StockTransactionRepository();
