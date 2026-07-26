import Purchase from "../models/purchase.model.js";
import { IPurchase } from "../interfaces/purchase.interface.js";

interface PurchaseQueryOptions {
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
}

class PurchaseRepository {
  async create(data: Partial<IPurchase>) {
    return Purchase.create(data);
  }

  async find() {
    return Purchase.find();
  }

  async clearBusinessData(businessId: string) {
    return Purchase.deleteMany({
      businessId,
    });
  }

  async findById(id: string) {
    return Purchase.findById(id).populate("supplier").populate("items.product");
  }

  async findByPurchaseNo(purchaseNo: string) {
    return Purchase.findOne({
      purchaseNo,
    });
  }

  async findAll(options: PurchaseQueryOptions = {}) {
    const {
      page = 1,
      limit = 20,
      search,
      supplier,
      paymentStatus,
      fromDate,
      toDate,
      isActive = true,
      sort = "purchaseDate",
      order = "desc",
    } = options;

    const query: Record<string, unknown> = {
      isActive,
    };

    if (search) {
      query.$or = [
        {
          purchaseNo: new RegExp(search, "i"),
        },
        {
          invoiceNo: new RegExp(search, "i"),
        },
      ];
    }

    if (supplier) {
      query.supplier = supplier;
    }

    if (paymentStatus) {
      query.paymentStatus = paymentStatus;
    }

    if (fromDate || toDate) {
      query.purchaseDate = {};

      if (fromDate) {
        (query.purchaseDate as Record<string, unknown>).$gte = fromDate;
      }

      if (toDate) {
        (query.purchaseDate as Record<string, unknown>).$lte = toDate;
      }
    }

    const skip = (page - 1) * limit;

    const [items, total] = await Promise.all([
      Purchase.find(query)
        .populate("supplier")
        .sort({
          [sort]: order === "asc" ? 1 : -1,
        })
        .skip(skip)
        .limit(limit),

      Purchase.countDocuments(query),
    ]);

    return {
      items,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
        hasNextPage: page < Math.ceil(total / limit),
        hasPreviousPage: page > 1,
      },
    };
  }

  async update(id: string, data: Partial<IPurchase>) {
    return Purchase.findByIdAndUpdate(id, data, {
      returnDocument: "after",
      runValidators: true,
    });
  }

  async delete(id: string) {
    return Purchase.findByIdAndDelete(id);
  }

  async findAllForExport() {
    return Purchase.find({
      isActive: true,
    })
      .populate("supplier")
      .sort({
        purchaseDate: -1,
      });
  }

  async bulkCreate(purchases: Partial<IPurchase>[]) {
    return Purchase.insertMany(purchases, {
      ordered: false,
    });
  }

  async findByPurchaseNos(purchaseNos: string[]) {
    return Purchase.find({
      purchaseNo: {
        $in: purchaseNos,
      },
    }).select("purchaseNo");
  }
}

export default new PurchaseRepository();
