import { Types } from "mongoose";

import ProductRepository from "../repositories/product.repository.js";
import CategoryRepository from "../../category/repositories/category.repository.js";
import SubCategoryRepository from "../../sub-category/repositories/sub-category.repository.js";

import { IProduct } from "../interfaces/product.interface.js";
import { ProductExcelRow } from "../../../common/excel/types/excel-row.types.js";

import {
  CreateProductDto,
  UpdateProductDto,
} from "../validators/product.validator.js";

interface ProductQuery {
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

class ProductService {
  private mapDto(data: CreateProductDto | UpdateProductDto) {
    return {
      ...data,

      category: data.category ? new Types.ObjectId(data.category) : undefined,

      subCategory: data.subCategory
        ? new Types.ObjectId(data.subCategory)
        : undefined,
    };
  }

  private async validateCategoryAndSubCategory(
    data: CreateProductDto | UpdateProductDto,
  ) {
    if (data.category) {
      if (!Types.ObjectId.isValid(data.category)) {
        throw new Error("Invalid category.");
      }

      const category = await CategoryRepository.findById(data.category);

      if (!category) {
        throw new Error("Category not found.");
      }
    }

    if (data.subCategory) {
      if (!Types.ObjectId.isValid(data.subCategory)) {
        throw new Error("Invalid sub category.");
      }

      const subCategory = await SubCategoryRepository.findById(
        data.subCategory,
      );

      if (!subCategory) {
        throw new Error("Sub category not found.");
      }

      if (
        data.category &&
        subCategory.category._id.toString() !== data.category
      ) {
        throw new Error(
          "Selected sub category does not belong to the selected category.",
        );
      }
    }
  }

  async create(data: CreateProductDto, userId: string) {
    if (!Types.ObjectId.isValid(userId)) {
      throw new Error("Invalid user.");
    }

    const exists = await ProductRepository.findByCode(data.productCode);

    if (exists) {
      throw new Error("Product code already exists.");
    }

    if (data.barcode) {
      const barcodeExists = await ProductRepository.findByBarcode(data.barcode);

      if (barcodeExists) {
        throw new Error("Barcode already exists.");
      }
    }

    await this.validateCategoryAndSubCategory(data);

    return ProductRepository.create({
      ...this.mapDto(data),
      createdBy: new Types.ObjectId(userId),
    });
  }

  async getAll(query: ProductQuery) {
    return ProductRepository.findAll({
      page: query.page ?? 1,
      limit: query.limit ?? 20,

      search: query.search,

      sort: query.sort,
      order: query.order,

      category: query.category,

      isActive: query.isActive ?? true,

      stock: query.stock,

      minPrice: query.minPrice,
      maxPrice: query.maxPrice,
    });
  }

  async getById(id: string) {
    if (!Types.ObjectId.isValid(id)) {
      throw new Error("Invalid product id.");
    }

    const product = await ProductRepository.findById(id);

    if (!product) {
      throw new Error("Product not found.");
    }

    return product;
  }

  async update(id: string, data: UpdateProductDto, userId: string) {
    if (!Types.ObjectId.isValid(id)) {
      throw new Error("Invalid product id.");
    }

    if (!Types.ObjectId.isValid(userId)) {
      throw new Error("Invalid user.");
    }

    const product = await ProductRepository.findById(id);

    if (!product) {
      throw new Error("Product not found.");
    }

    await this.validateCategoryAndSubCategory(data);

    return ProductRepository.update(id, {
      ...this.mapDto(data),
      updatedBy: new Types.ObjectId(userId),
    });
  }

  async delete(id: string, userId: string) {
    if (!Types.ObjectId.isValid(id)) {
      throw new Error("Invalid product id.");
    }

    if (!Types.ObjectId.isValid(userId)) {
      throw new Error("Invalid user.");
    }

    const product = await ProductRepository.findById(id);

    if (!product) {
      throw new Error("Product not found.");
    }

    return ProductRepository.update(id, {
      isActive: false,
      updatedBy: new Types.ObjectId(userId),
    });
  }

  // Part 2 starts here
  async bulkImport(rows: ProductExcelRow[], userId: string) {
    if (!Types.ObjectId.isValid(userId)) {
      throw new Error("Invalid user.");
    }

    // Load master data
    const [categories, subCategories] = await Promise.all([
      CategoryRepository.findAllForImport(),
      SubCategoryRepository.findAllForImport(),
    ]);

    // Category lookup
    const categoryMap = new Map<string, Types.ObjectId>();

    categories.forEach((category) => {
      categoryMap.set(
        category.name.trim().toLowerCase(),
        category._id as Types.ObjectId,
      );
    });

    // Sub Category lookup
    const subCategoryMap = new Map<
      string,
      {
        id: Types.ObjectId;
        categoryId: Types.ObjectId;
      }
    >();

    subCategories.forEach((subCategory) => {
      subCategoryMap.set(subCategory.name.trim().toLowerCase(), {
        id: subCategory._id as Types.ObjectId,
        categoryId: subCategory.category as Types.ObjectId,
      });
    });

    // Existing database values
    const productCodes = rows
      .map((row) => row.productCode)
      .filter((code): code is string => Boolean(code));

    const barcodes = rows
      .map((row) => row.barcode)
      .filter((barcode): barcode is string => Boolean(barcode));

    const [existingProducts, existingBarcodeProducts] = await Promise.all([
      ProductRepository.findByCodes(productCodes),
      ProductRepository.findByBarcodes(barcodes),
    ]);

    const existingCodes = new Set(
      existingProducts.map((product) => product.productCode),
    );

    const existingBarcodes = new Set(
      existingBarcodeProducts.map((product) => product.barcode).filter(Boolean),
    );

    const products: Partial<IProduct>[] = [];

    const errors: {
      row: number;
      field: string;
      message: string;
    }[] = [];

    // Process every Excel row
    for (let index = 0; index < rows.length; index++) {
      const row = rows[index];
      const rowNumber = index + 2;

      // Resolve Category
      let categoryId: Types.ObjectId | undefined;

      if (row.category) {
        categoryId = categoryMap.get(row.category.trim().toLowerCase());

        if (!categoryId) {
          errors.push({
            row: rowNumber,
            field: "Category",
            message: `Category '${row.category}' not found.`,
          });

          continue;
        }
      }

      // Resolve Sub Category
      let subCategoryId: Types.ObjectId | undefined;

      if (row.subCategory) {
        const subCategory = subCategoryMap.get(
          row.subCategory.trim().toLowerCase(),
        );

        if (!subCategory) {
          errors.push({
            row: rowNumber,
            field: "Sub Category",
            message: `Sub Category '${row.subCategory}' not found.`,
          });

          continue;
        }

        if (categoryId && !subCategory.categoryId.equals(categoryId)) {
          errors.push({
            row: rowNumber,
            field: "Sub Category",
            message: "Sub Category does not belong to selected Category.",
          });

          continue;
        }

        subCategoryId = subCategory.id;
      }

      // Duplicate Product Code
      if (existingCodes.has(row.productCode)) {
        errors.push({
          row: rowNumber,
          field: "Product Code",
          message: "Product code already exists.",
        });

        continue;
      }

      // Duplicate Barcode
      if (row.barcode && existingBarcodes.has(row.barcode)) {
        errors.push({
          row: rowNumber,
          field: "Barcode",
          message: "Barcode already exists.",
        });

        continue;
      }

      // Prevent duplicate values inside same Excel
      existingCodes.add(row.productCode);

      if (row.barcode) {
        existingBarcodes.add(row.barcode);
      }

      products.push({
        productCode: row.productCode,
        name: row.name,

        category: categoryId,
        subCategory: subCategoryId,

        barcode: row.barcode,

        unit: row.unit,

        purchasePrice: row.purchasePrice,
        sellingPrice: row.sellingPrice,

        stock: row.stock,
        minimumStock: row.minimumStock,

        tax: row.tax,

        description: row.description ?? "",

        isActive: row.isActive ?? true,

        createdBy: new Types.ObjectId(userId),
      });
    }

    // Insert products
    if (products.length > 0) {
      await ProductRepository.bulkCreate(products);
    }

    return {
      success: true,

      summary: {
        total: rows.length,
        imported: products.length,
        skipped: errors.length,
      },

      errors,
    };
  }
}

export default new ProductService();
