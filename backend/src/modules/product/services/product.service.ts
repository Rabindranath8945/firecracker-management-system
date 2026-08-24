import { Types } from "mongoose";

import ProductRepository from "../repositories/product.repository.js";
import CategoryRepository from "../../category/repositories/category.repository.js";
import SubCategoryRepository from "../../sub-category/repositories/sub-category.repository.js";
import SettingsRepository from "../../settings/repositories/settings.repository.js";

import { IProduct } from "../interfaces/product.interface.js";
import { ProductExcelRow } from "../../../common/excel/types/excel-row.types.js";

import { generateSequenceCode } from "../../../common/utils/generate-code.js";

import {
  CreateProductDto,
  UpdateProductDto,
} from "../validators/product.validator.js";

interface ProductQuery {
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

class ProductService {
  /* ---------------------------------------------------------------------- */
  /* DTO Mapping                                                            */
  /* ---------------------------------------------------------------------- */

  private mapDto(data: CreateProductDto | UpdateProductDto) {
    return {
      ...data,

      category: data.category ? new Types.ObjectId(data.category) : undefined,

      subCategory: data.subCategory
        ? new Types.ObjectId(data.subCategory)
        : undefined,
    };
  }

  /* ---------------------------------------------------------------------- */
  /* GST                                                                     */
  /* ---------------------------------------------------------------------- */

  private async getDefaultGST(userId: string): Promise<number> {
    const settings = await SettingsRepository.findByUserId(userId);

    if (!settings?.tax?.enabled) {
      return 0;
    }

    return Math.max(0, Math.min(100, Number(settings.tax.defaultGST ?? 0)));
  }

  /* ---------------------------------------------------------------------- */
  /* Category Validation                                                     */
  /* ---------------------------------------------------------------------- */

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

  /* ---------------------------------------------------------------------- */
  /* Create Product                                                         */
  /* ---------------------------------------------------------------------- */

  async create(data: CreateProductDto, userId: string) {
    if (!Types.ObjectId.isValid(userId)) {
      throw new Error("Invalid user.");
    }

    const prefix = await SettingsRepository.getNumberingPrefix(
      userId,
      "product",
    );

    const products = await ProductRepository.findCodes();

    const productCode = generateSequenceCode(
      products
        .map((product) => product.productCode)
        .filter((code): code is string => Boolean(code)),
      prefix,
    );

    if (data.barcode) {
      const barcodeExists = await ProductRepository.findByBarcode(data.barcode);

      if (barcodeExists) {
        throw new Error("Barcode already exists.");
      }
    }

    await this.validateCategoryAndSubCategory(data);

    const tax =
      data.tax !== undefined ? data.tax : await this.getDefaultGST(userId);

    return ProductRepository.create({
      ...this.mapDto({
        ...data,
        productCode,
        tax,
      }),

      createdBy: new Types.ObjectId(userId),
    });
  }

  /* ---------------------------------------------------------------------- */
  /* Get All                                                                */
  /* ---------------------------------------------------------------------- */

  async getAll(query: ProductQuery) {
    return ProductRepository.findAll({
      page: query.page ?? 1,
      limit: query.limit ?? 20,

      search: query.search,

      sort: query.sort,

      category: query.category,

      subCategory: query.subCategory,

      isActive: query.isActive,

      stock: query.stock,

      minPrice: query.minPrice,

      maxPrice: query.maxPrice,
    });
  }

  /* ---------------------------------------------------------------------- */
  /* Get By ID                                                              */
  /* ---------------------------------------------------------------------- */

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

  /* ---------------------------------------------------------------------- */
  /* Next Product Code                                                      */
  /* ---------------------------------------------------------------------- */
  async getNextCode(userId: string) {
    if (!Types.ObjectId.isValid(userId)) {
      throw new Error("Invalid user.");
    }

    const prefix = await SettingsRepository.getNumberingPrefix(
      userId,
      "product",
    );

    const products = await ProductRepository.findCodes();

    return generateSequenceCode(
      products
        .map((product) => product.productCode)
        .filter((code): code is string => Boolean(code)),
      prefix,
    );
  }

  /* ---------------------------------------------------------------------- */
  /* Update Product                                                         */
  /* ---------------------------------------------------------------------- */

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

    /*
     * IMPORTANT:
     *
     * Existing product GST is NOT automatically changed when
     * Tax Settings changes.
     *
     * If the user explicitly edits tax, use that value.
     * Otherwise keep the existing product tax.
     */

    const updateData: UpdateProductDto & {
      updatedBy: Types.ObjectId;
    } = {
      ...data,

      tax: data.tax !== undefined ? data.tax : product.tax,

      updatedBy: new Types.ObjectId(userId),
    };

    return ProductRepository.update(id, {
      ...this.mapDto(updateData),
      updatedBy: new Types.ObjectId(userId),
    });
  }

  /* ---------------------------------------------------------------------- */
  /* Delete Product                                                         */
  /* ---------------------------------------------------------------------- */

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

    return ProductRepository.delete(id);
  }

  /* ---------------------------------------------------------------------- */
  /* Bulk Import                                                            */
  /* ---------------------------------------------------------------------- */

  async bulkImport(rows: ProductExcelRow[], userId: string) {
    if (!Types.ObjectId.isValid(userId)) {
      throw new Error("Invalid user.");
    }

    /* -------------------------------------------------------------------- */
    /* Load Settings + Master Data                                          */
    /* -------------------------------------------------------------------- */

    const [categories, subCategories, defaultGST] = await Promise.all([
      CategoryRepository.findAllForImport(),
      SubCategoryRepository.findAllForImport(),
      this.getDefaultGST(userId),
    ]);

    /* -------------------------------------------------------------------- */
    /* Category Lookup                                                       */
    /* -------------------------------------------------------------------- */

    const categoryMap = new Map<string, Types.ObjectId>();

    categories.forEach((category) => {
      categoryMap.set(
        category.name.trim().toLowerCase(),
        category._id as Types.ObjectId,
      );
    });

    /* -------------------------------------------------------------------- */
    /* Sub Category Lookup                                                   */
    /* -------------------------------------------------------------------- */

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

    /* -------------------------------------------------------------------- */
    /* Existing Products                                                     */
    /* -------------------------------------------------------------------- */

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

    /* -------------------------------------------------------------------- */
    /* Import Containers                                                     */
    /* -------------------------------------------------------------------- */

    const products: Partial<IProduct>[] = [];

    const errors: {
      row: number;
      field: string;
      message: string;
    }[] = [];

    /* -------------------------------------------------------------------- */
    /* Process Rows                                                          */
    /* -------------------------------------------------------------------- */

    for (let index = 0; index < rows.length; index++) {
      const row = rows[index];

      const rowNumber = index + 2;

      /* ------------------------------------------------------------------ */
      /* Category                                                            */
      /* ------------------------------------------------------------------ */

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

      /* ------------------------------------------------------------------ */
      /* Sub Category                                                        */
      /* ------------------------------------------------------------------ */

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

      /* ------------------------------------------------------------------ */
      /* Duplicate Product Code                                              */
      /* ------------------------------------------------------------------ */

      if (existingCodes.has(row.productCode)) {
        errors.push({
          row: rowNumber,
          field: "Product Code",
          message: "Product code already exists.",
        });

        continue;
      }

      /* ------------------------------------------------------------------ */
      /* Duplicate Barcode                                                   */
      /* ------------------------------------------------------------------ */

      if (row.barcode && existingBarcodes.has(row.barcode)) {
        errors.push({
          row: rowNumber,
          field: "Barcode",
          message: "Barcode already exists.",
        });

        continue;
      }

      /* ------------------------------------------------------------------ */
      /* Prevent Duplicate Values Inside Excel                               */
      /* ------------------------------------------------------------------ */

      existingCodes.add(row.productCode);

      if (row.barcode) {
        existingBarcodes.add(row.barcode);
      }

      /* ------------------------------------------------------------------ */
      /* GST                                                                 */
      /* ------------------------------------------------------------------ */

      const tax =
        row.tax !== undefined && row.tax !== null && !Number.isNaN(row.tax)
          ? row.tax
          : defaultGST;

      /* ------------------------------------------------------------------ */
      /* Product                                                             */
      /* ------------------------------------------------------------------ */

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

        tax,

        description: row.description ?? "",

        isActive: row.isActive ?? true,

        createdBy: new Types.ObjectId(userId),
      });
    }

    /* -------------------------------------------------------------------- */
    /* Insert Products                                                       */
    /* -------------------------------------------------------------------- */

    if (products.length > 0) {
      await ProductRepository.bulkCreate(products);
    }

    /* -------------------------------------------------------------------- */
    /* Response                                                              */
    /* -------------------------------------------------------------------- */

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
