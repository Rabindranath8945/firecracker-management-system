import Supplier from "../models/supplier.model.js";
import { ISupplier } from "../interfaces/supplier.interface.js";

interface SupplierQueryOptions {
  page?: number;
  limit?: number;
  search?: string;
  sort?: string;
  order?: "asc" | "desc";
  isActive?: boolean;
}

class SupplierRepository {
  async create(data: Partial<ISupplier>) {
    return Supplier.create(data);
  }

  async find() {
    return Supplier.find();
  }

  async clearBusinessData(businessId: string) {
    return Supplier.deleteMany({
      businessId,
    });
  }

  async findByName(name: string) {
    return Supplier.findOne({
      name: new RegExp(`^${name}$`, "i"),
    });
  }

  async findById(id: string) {
    return Supplier.findById(id);
  }

  async findByCode(supplierCode: string) {
    return Supplier.findOne({
      supplierCode,
    });
  }

  async findByMobile(mobile: string) {
    return Supplier.findOne({
      mobile,
    });
  }

  async findByMobiles(mobiles: string[]) {
    return Supplier.find({
      mobile: {
        $in: mobiles,
      },
    }).select("mobile");
  }

  async findByCodes(supplierCodes: string[]) {
    return Supplier.find({
      supplierCode: {
        $in: supplierCodes,
      },
    }).select("supplierCode");
  }

  async bulkCreate(suppliers: Partial<ISupplier>[]) {
    return Supplier.insertMany(suppliers, {
      ordered: false,
    });
  }

  async findAllForExport() {
    return Supplier.find({
      isActive: true,
    }).sort({
      name: 1,
    });
  }

  async findAll(options: SupplierQueryOptions = {}) {
    const {
      page = 1,
      limit = 20,
      search,
      sort = "createdAt",
      order = "desc",
      isActive = true,
    } = options;

    const query: Record<string, unknown> = {
      isActive,
    };

    if (search) {
      query.$or = [
        {
          supplierCode: new RegExp(search, "i"),
        },
        {
          name: new RegExp(search, "i"),
        },
        {
          mobile: new RegExp(search, "i"),
        },
        {
          email: new RegExp(search, "i"),
        },
      ];
    }

    const skip = (page - 1) * limit;

    const [items, total] = await Promise.all([
      Supplier.find(query)
        .sort({
          [sort]: order === "asc" ? 1 : -1,
        })
        .skip(skip)
        .limit(limit),

      Supplier.countDocuments(query),
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

  async update(id: string, data: Partial<ISupplier>) {
    return Supplier.findByIdAndUpdate(id, data, {
      new: true,
      runValidators: true,
    });
  }

  async delete(id: string) {
    return Supplier.findByIdAndDelete(id);
  }
}

export default new SupplierRepository();
