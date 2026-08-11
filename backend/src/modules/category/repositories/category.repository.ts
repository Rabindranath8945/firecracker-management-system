import Category from "../models/category.model.js";
import { ICategory } from "../interfaces/category.interface.js";

interface CategoryQueryOptions {
  page?: number;
  limit?: number;
  search?: string;
  sort?: string;
  order?: "asc" | "desc";
  isActive?: boolean;
}

class CategoryRepository {
  async create(data: Partial<ICategory>) {
    return Category.create(data);
  }

  async findCodes() {
    return Category.find().select("categoryCode");
  }

  async bulkCreate(data: Partial<ICategory>[]) {
    return Category.insertMany(data, {
      ordered: false,
    });
  }

  async clearBusinessData(businessId: string) {
    return Category.deleteMany({
      businessId,
    });
  }

  async findById(id: string) {
    return Category.findById(id);
  }

  async findByCode(categoryCode: string) {
    return Category.findOne({ categoryCode });
  }

  async findAllForImport() {
    return Category.find({
      isActive: true,
    }).select("_id name");
  }

  async findAll(options: CategoryQueryOptions = {}) {
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
        { name: new RegExp(search, "i") },
        { categoryCode: new RegExp(search, "i") },
      ];
    }

    const skip = (page - 1) * limit;

    const [items, total] = await Promise.all([
      Category.find(query)
        .sort({
          [sort]: order === "asc" ? 1 : -1,
        })
        .skip(skip)
        .limit(limit),

      Category.countDocuments(query),
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

  async update(id: string, data: Partial<ICategory>) {
    return Category.findByIdAndUpdate(id, data, {
      new: true,
      runValidators: true,
    });
  }

  async delete(id: string) {
    return Category.findByIdAndDelete(id);
  }
}

export default new CategoryRepository();
