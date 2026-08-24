import Product from "../models/product.model.js";
import { IProduct } from "../interfaces/product.interface.js";
import { ClientSession } from "mongoose";

interface ProductQueryOptions {
  page?: number;
  limit?: number;

  search?: string;

  sort?:
    | "NAME_ASC"
    | "NAME_DESC"
    | "PRICE_ASC"
    | "PRICE_DESC"
    | "STOCK_ASC"
    | "STOCK_DESC";

  category?: string;

  subCategory?: string;

  isActive?: boolean;

  stock?: "IN_STOCK" | "LOW_STOCK" | "OUT_OF_STOCK";

  minPrice?: number;
  maxPrice?: number;
}

class ProductRepository {
  async create(data: Partial<IProduct>) {
    return Product.create(data);
  }

  async findCodes() {
    return Product.find({}).select("productCode");
  }
  async findByName(name: string) {
    return Product.findOne({
      name: new RegExp(`^${name}$`, "i"),
    });
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

      category,

      subCategory,

      isActive = true,

      stock,

      sort,

      minPrice,
      maxPrice,
    } = options;

    const query: Record<string, unknown> = {};

    if (isActive !== undefined) {
      query.isActive = isActive;
    }

    // Search
    if (search) {
      query.$or = [
        { name: new RegExp(search, "i") },
        { productCode: new RegExp(search, "i") },
        { barcode: new RegExp(search, "i") },
      ];
    }

    // Category & SubCategory
    if (category) {
      query.category = category;
    }
    if (subCategory) {
      query.subCategory = subCategory;
    }

    // Price
    if (minPrice !== undefined || maxPrice !== undefined) {
      query.sellingPrice = {};

      if (minPrice !== undefined) {
        (query.sellingPrice as Record<string, number>).$gte = minPrice;
      }

      if (maxPrice !== undefined) {
        (query.sellingPrice as Record<string, number>).$lte = maxPrice;
      }
    }

    // Stock Filter
    switch (stock) {
      case "IN_STOCK":
        query.$expr = {
          $gt: ["$stock", "$minimumStock"],
        };
        break;

      case "LOW_STOCK":
        query.$expr = {
          $and: [{ $gt: ["$stock", 0] }, { $lte: ["$stock", "$minimumStock"] }],
        };
        break;

      case "OUT_OF_STOCK":
        query.stock = 0;
        break;
    }

    // Sorting
    let sortOption: Record<string, 1 | -1> = {
      name: 1,
    };

    switch (sort) {
      case "NAME_ASC":
        sortOption = { name: 1 };
        break;

      case "NAME_DESC":
        sortOption = { name: -1 };
        break;

      case "PRICE_ASC":
        sortOption = { sellingPrice: 1 };
        break;

      case "PRICE_DESC":
        sortOption = { sellingPrice: -1 };
        break;

      case "STOCK_ASC":
        sortOption = { stock: 1 };
        break;

      case "STOCK_DESC":
        sortOption = { stock: -1 };
        break;
    }

    const skip = (page - 1) * limit;

    const [items, total] = await Promise.all([
      Product.find(query)
        .populate("category", "categoryCode name")
        .populate("subCategory", "subCategoryCode name")
        .sort(sortOption)
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

  async bulkCreate(products: Partial<IProduct>[]) {
    return Product.insertMany(products, {
      ordered: false,
    });
  }
  async increaseStock(
    productId: string,
    quantity: number,
    session?: ClientSession,
  ) {
    return Product.findByIdAndUpdate(
      productId,
      {
        $inc: {
          stock: quantity,
        },
      },
      {
        new: true,
        session,
      },
    );
  }

  async decreaseStock(
    productId: string,
    quantity: number,
    session?: ClientSession,
  ) {
    return Product.findOneAndUpdate(
      {
        _id: productId,
      },
      {
        $inc: {
          stock: -quantity,
        },
      },
      {
        new: true,
        session,
      },
    );
  }

  async delete(id: string) {
    return Product.findByIdAndDelete(id);
  }

  async bulkReplace(businessId: string, data: Partial<IProduct>[]) {
    await Product.deleteMany({
      businessId,
    });

    return Product.insertMany(data);
  }

  async clearBusinessData(businessId: string) {
    return Product.deleteMany({
      businessId,
    });
  }
}

export default new ProductRepository();
