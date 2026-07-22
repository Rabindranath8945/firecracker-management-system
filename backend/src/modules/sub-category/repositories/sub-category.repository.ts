import SubCategory from "../models/sub-category.model.js";
import { ISubCategory } from "../interfaces/sub-category.interface.js";

interface SubCategoryQueryOptions {
  page?: number;
  limit?: number;
  search?: string;
  sort?: string;
  order?: "asc" | "desc";

  category?: string;

  isActive?: boolean;
}

class SubCategoryRepository {
  async create(data: Partial<ISubCategory>) {
    return SubCategory.create(data);
  }

  async findById(id: string) {
    return SubCategory.findById(id).populate("category", "categoryCode name");
  }

  async findByCode(subCategoryCode: string) {
    return SubCategory.findOne({
      subCategoryCode,
    });
  }

  async findAllForImport() {
    return SubCategory.find({
      isActive: true,
    }).select("_id name category");
  }

  async findAll(options: SubCategoryQueryOptions = {}) {
    const {
      page = 1,
      limit = 20,
      search,
      sort = "createdAt",
      order = "desc",
      category,
      isActive = true,
    } = options;

    const query: Record<string, unknown> = {
      isActive,
    };

    if (category) {
      query.category = category;
    }

    if (search) {
      query.$or = [
        {
          name: new RegExp(search, "i"),
        },
        {
          subCategoryCode: new RegExp(search, "i"),
        },
      ];
    }

    const skip = (page - 1) * limit;

    const [items, total] = await Promise.all([
      SubCategory.find(query)
        .populate("category", "categoryCode name")
        .sort({
          [sort]: order === "asc" ? 1 : -1,
        })
        .skip(skip)
        .limit(limit),

      SubCategory.countDocuments(query),
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

  async update(id: string, data: Partial<ISubCategory>) {
    return SubCategory.findByIdAndUpdate(id, data, {
      new: true,
      runValidators: true,
    }).populate("category", "categoryCode name");
  }

  async delete(id: string) {
    return SubCategory.findByIdAndDelete(id);
  }
}

export default new SubCategoryRepository();
