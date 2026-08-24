import * as XLSX from "xlsx";

import Product from "../../product/models/product.model.js";
import Category from "../../category/models/category.model.js";
import SubCategory from "../../sub-category/models/sub-category.model.js";

import type { ImportResult } from "../types/import-export.types.js";

/* -------------------------------------------------------------------------- */
/* XLSX UTILS                                                                 */
/* -------------------------------------------------------------------------- */

const xlsxUtils = XLSX.utils as any;

/* -------------------------------------------------------------------------- */
/* PRODUCT EXPORT ROW                                                         */
/* -------------------------------------------------------------------------- */

interface ProductExportRow {
  productCode: string;
  name: string;
  barcode: string;
  category: string;
  subCategory: string;
  purchasePrice: number;
  sellingPrice: number;
  stock: number;
  minimumStock: number;
  unit: string;
  brand: string;
  hsnCode: string;
  tax: number;
  description: string;
  isActive: boolean;
}

/* -------------------------------------------------------------------------- */
/* SERVICE                                                                    */
/* -------------------------------------------------------------------------- */

class ProductImportExportService {
  /* ------------------------------------------------------------------------ */
  /* EXPORT PRODUCTS                                                          */
  /* ------------------------------------------------------------------------ */

  async exportProducts(userId: string): Promise<Buffer> {
    if (!userId) {
      throw new Error("User ID is required.");
    }

    const products = await Product.find({
      createdBy: userId,
      isActive: true,
    })
      .populate("category", "name")
      .populate("subCategory", "name")
      .lean()
      .exec();

    const headers = [
      "productCode",
      "name",
      "barcode",
      "category",
      "subCategory",
      "purchasePrice",
      "sellingPrice",
      "stock",
      "minimumStock",
      "unit",
      "brand",
      "hsnCode",
      "tax",
      "description",
      "isActive",
    ];

    const rows: ProductExportRow[] = products.map((product) => ({
      productCode: String(product.productCode ?? ""),

      name: String(product.name ?? ""),

      barcode: String(product.barcode ?? ""),

      category:
        product.category &&
        typeof product.category === "object" &&
        "name" in product.category
          ? String(product.category.name ?? "")
          : "",

      subCategory:
        product.subCategory &&
        typeof product.subCategory === "object" &&
        "name" in product.subCategory
          ? String(product.subCategory.name ?? "")
          : "",

      purchasePrice: Number(product.purchasePrice ?? 0),

      sellingPrice: Number(product.sellingPrice ?? 0),

      stock: Number(product.stock ?? 0),

      minimumStock: Number(product.minimumStock ?? 0),

      unit: String(product.unit ?? "PCS"),

      brand: String(product.brand ?? ""),

      hsnCode: String(product.hsnCode ?? ""),

      tax: Number(product.tax ?? 0),

      description: String(product.description ?? ""),

      isActive: Boolean(product.isActive),
    }));

    const data: unknown[][] = [
      headers,

      ...rows.map((row) => [
        row.productCode,
        row.name,
        row.barcode,
        row.category,
        row.subCategory,
        row.purchasePrice,
        row.sellingPrice,
        row.stock,
        row.minimumStock,
        row.unit,
        row.brand,
        row.hsnCode,
        row.tax,
        row.description,
        row.isActive,
      ]),
    ];

    const worksheet = xlsxUtils.aoa_to_sheet(data);

    const workbook = xlsxUtils.book_new();

    xlsxUtils.book_append_sheet(workbook, worksheet, "Products");

    return XLSX.write(workbook, {
      type: "buffer",
      bookType: "xlsx",
    }) as Buffer;
  }

  /* ------------------------------------------------------------------------ */
  /* IMPORT PRODUCTS                                                          */
  /* ------------------------------------------------------------------------ */

  async importProducts(
    userId: string,
    file: Express.Multer.File,
  ): Promise<ImportResult> {
    if (!userId) {
      throw new Error("User ID is required.");
    }

    const workbook = XLSX.read(file.buffer, {
      type: "buffer",
    });

    const sheetName = workbook.SheetNames[0];

    if (!sheetName) {
      throw new Error("Excel file does not contain a worksheet.");
    }

    const worksheet = workbook.Sheets[sheetName];

    if (!worksheet) {
      throw new Error("Unable to read the worksheet.");
    }

    const rows = xlsxUtils.sheet_to_json(worksheet) as Record<
      string,
      unknown
    >[];

    const result: ImportResult = {
      entity: "PRODUCT",

      total: rows.length,

      imported: 0,

      skipped: 0,

      failed: 0,

      errors: [],
    };

    /* ---------------------------------------------------------------------- */
    /* PROCESS ROWS                                                           */
    /* ---------------------------------------------------------------------- */

    for (let index = 0; index < rows.length; index += 1) {
      const row = rows[index];

      try {
        const productCode = String(row.productCode ?? "").trim();

        const name = String(row.name ?? "").trim();

        /* ------------------------------------------------------------------ */
        /* REQUIRED FIELDS                                                    */
        /* ------------------------------------------------------------------ */

        if (!productCode || !name) {
          result.failed += 1;

          result.errors.push({
            row: index + 2,
            message: "productCode and name are required.",
          });

          continue;
        }

        /* ------------------------------------------------------------------ */
        /* DUPLICATE PRODUCT CODE                                             */
        /* ------------------------------------------------------------------ */

        const existing = await Product.findOne({
          productCode,
        })
          .select("_id")
          .lean()
          .exec();

        if (existing) {
          result.skipped += 1;

          result.errors.push({
            row: index + 2,

            message: `Product code "${productCode}" already exists.`,
          });

          continue;
        }

        /* ------------------------------------------------------------------ */
        /* CATEGORY                                                            */
        /* ------------------------------------------------------------------ */

        let categoryId = undefined;

        const categoryName = String(row.category ?? "").trim();

        if (categoryName) {
          const category = await Category.findOne({
            name: categoryName,
          })
            .select("_id")
            .lean()
            .exec();

          if (!category) {
            result.failed += 1;

            result.errors.push({
              row: index + 2,

              field: "category",

              message: `Category "${categoryName}" not found.`,
            });

            continue;
          }

          categoryId = category._id;
        }

        /* ------------------------------------------------------------------ */
        /* SUB CATEGORY                                                        */
        /* ------------------------------------------------------------------ */

        let subCategoryId = undefined;

        const subCategoryName = String(row.subCategory ?? "").trim();

        if (subCategoryName) {
          const subCategory = await SubCategory.findOne({
            name: subCategoryName,

            ...(categoryId
              ? {
                  category: categoryId,
                }
              : {}),
          })
            .select("_id")
            .lean()
            .exec();

          if (!subCategory) {
            result.failed += 1;

            result.errors.push({
              row: index + 2,

              field: "subCategory",

              message: `Sub category "${subCategoryName}" not found.`,
            });

            continue;
          }

          subCategoryId = subCategory._id;
        }

        /* ------------------------------------------------------------------ */
        /* CREATE PRODUCT                                                      */
        /* ------------------------------------------------------------------ */

        await Product.create({
          productCode,

          name,

          category: categoryId,

          subCategory: subCategoryId,

          barcode: String(row.barcode ?? "").trim(),

          purchasePrice: parseNumber(row.purchasePrice),

          sellingPrice: parseNumber(row.sellingPrice),

          stock: parseNumber(row.stock),

          minimumStock: parseNumber(row.minimumStock),

          unit: String(row.unit ?? "PCS")
            .trim()
            .toUpperCase(),

          brand: String(row.brand ?? "").trim(),

          hsnCode: String(row.hsnCode ?? "")
            .trim()
            .toUpperCase(),

          tax: parseNumber(row.tax),

          description: String(row.description ?? "").trim(),

          isActive: parseBoolean(row.isActive),

          createdBy: userId,
        });

        result.imported += 1;
      } catch (error) {
        result.failed += 1;

        result.errors.push({
          row: index + 2,

          message:
            error instanceof Error ? error.message : "Unknown import error.",
        });
      }
    }

    return result;
  }
}

/* -------------------------------------------------------------------------- */
/* NUMBER PARSER                                                              */
/* -------------------------------------------------------------------------- */

function parseNumber(value: unknown): number {
  if (value === undefined || value === null || value === "") {
    return 0;
  }

  const number = Number(value);

  if (!Number.isFinite(number) || number < 0) {
    throw new Error(`Invalid number: ${String(value)}`);
  }

  return number;
}

/* -------------------------------------------------------------------------- */
/* BOOLEAN PARSER                                                             */
/* -------------------------------------------------------------------------- */

function parseBoolean(value: unknown): boolean {
  if (value === undefined || value === null || value === "") {
    return true;
  }

  if (typeof value === "boolean") {
    return value;
  }

  const normalized = String(value).trim().toLowerCase();

  return !["false", "0", "no", "inactive"].includes(normalized);
}

export default new ProductImportExportService();
