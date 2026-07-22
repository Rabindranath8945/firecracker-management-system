import Product from "../models/product.model.js";
import { IProduct } from "../interfaces/product.interface.js";

interface ProductQueryOptions {
  page?: number;
  limit?: number;
  search?: string;
  sort?: string;
  order?: "asc" | "desc";
  category?: string;
  isActive?: boolean;
  stock?: "low" | "available" | "out";
  minPrice?: number;
  maxPrice?: number;
}

class ProductRepository {
  async create(data: Partial<IProduct>) {
    return Product.create(data);
  }

  async findById(id: string) {
    return Product.findById(id)
      .populate("category", "categoryCode name")
      .populate("subCategory", "subCategoryCode name");
  }

  async findByBarcode(barcode: string) {
    return Product.findOne({
      barcode,
    });
  }

  async findByCodes(productCodes: string[]) {
    return Product.find({
      productCode: { $in: productCodes },
    }).select("productCode");
  }

  async findByCode(productCode: string) {
    return Product.findOne({
      productCode,
    });
  }

  async findByBarcodes(barcodes: string[]) {
    return Product.find({
      barcode: { $in: barcodes },
    }).select("barcode");
  }
  async findAll(options: ProductQueryOptions = {}) {
    const {
      page = 1,
      limit = 20,
      search,
      sort = "createdAt",
      order = "desc",
      category,
      isActive = true,
      stock,
      minPrice,
      maxPrice,
    } = options;

    const query: Record<string, unknown> = {
      isActive,
    };

    // Search
    if (search) {
      query.$or = [
        { name: new RegExp(search, "i") },
        { productCode: new RegExp(search, "i") },
        { barcode: new RegExp(search, "i") },
      ];
    }

    // Category
    if (category) {
      query.category = category;
    }

    // Price Range
    if (minPrice !== undefined || maxPrice !== undefined) {
      query.sellingPrice = {};

      if (minPrice !== undefined) {
        (query.sellingPrice as Record<string, number>).$gte = minPrice;
      }

      if (maxPrice !== undefined) {
        (query.sellingPrice as Record<string, number>).$lte = maxPrice;
      }
    }

    // Stock Filters
    if (stock === "out") {
      query.stock = 0;
    }

    if (stock === "available") {
      query.stock = {
        $gt: 0,
      };
    }

    if (stock === "low") {
      query.$expr = {
        $lte: ["$stock", "$minimumStock"],
      };
    }

    const skip = (page - 1) * limit;

    const [items, total] = await Promise.all([
      Product.find(query)
        .populate("category", "categoryCode name")
        .populate("subCategory", "subCategoryCode name")
        .sort({
          [sort]: order === "asc" ? 1 : -1,
        })
        .skip(skip)
        .limit(limit),

      Product.countDocuments(query),
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

  async update(id: string, data: Partial<IProduct>) {
    return Product.findByIdAndUpdate(id, data, {
      new: true,
      runValidators: true,
    });
  }

  async delete(id: string) {
    return Product.findByIdAndDelete(id);
  }

  async bulkCreate(products: Partial<IProduct>[]) {
    return Product.insertMany(products, {
      ordered: false,
    });
  }
}

export default new ProductRepository();
