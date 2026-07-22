import { Request, Response } from "express";

import ProductService from "../services/product.service.js";
import { uploadService } from "../../../common/uploads/index.js";
import { excelService } from "../../../common/excel/index.js";

class ProductController {
  create = async (req: Request, res: Response) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const product = await ProductService.create(req.body, req.user.userId);

    return res.status(201).json({
      success: true,
      message: "Product created successfully.",
      data: product,
    });
  };

  getAll = async (req: Request, res: Response) => {
    const products = await ProductService.getAll({
      page: Number(req.query.page) || 1,
      limit: Number(req.query.limit) || 20,

      search: req.query.search ? String(req.query.search) : undefined,

      sort: req.query.sort ? String(req.query.sort) : undefined,

      order:
        req.query.order === "asc" || req.query.order === "desc"
          ? req.query.order
          : undefined,

      category: req.query.category ? String(req.query.category) : undefined,

      stock:
        req.query.stock === "low" ||
        req.query.stock === "available" ||
        req.query.stock === "out"
          ? req.query.stock
          : undefined,

      minPrice: req.query.minPrice ? Number(req.query.minPrice) : undefined,

      maxPrice: req.query.maxPrice ? Number(req.query.maxPrice) : undefined,

      isActive:
        req.query.isActive !== undefined ? req.query.isActive === "true" : true,
    });

    return res.status(200).json({
      success: true,
      message: "Products fetched successfully.",
      data: products,
    });
  };

  uploadImage = async (req: Request, res: Response) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const image = uploadService.uploadImage(req.file);

    return res.status(200).json({
      success: true,
      message: "Image uploaded successfully.",
      data: image,
    });
  };

  exportExcel = async (_req: Request, res: Response) => {
    const result = await ProductService.getAll({
      page: 1,
      limit: Number.MAX_SAFE_INTEGER,
    });

    const products = result.items;

    const buffer = await excelService.export({
      fileName: "Products",
      sheetName: "Products",

      columns: [
        {
          header: "Product Code",
          key: "productCode",
          width: 18,
          type: "string",
        },
        {
          header: "Product Name",
          key: "name",
          width: 35,
          type: "string",
        },
        {
          header: "Category",
          key: "categoryName",
          width: 25,
          type: "string",
        },
        {
          header: "Sub Category",
          key: "subCategoryName",
          width: 25,
          type: "string",
        },
        {
          header: "Barcode",
          key: "barcode",
          width: 22,
          type: "string",
        },
        {
          header: "Unit",
          key: "unit",
          width: 12,
          type: "string",
        },
        {
          header: "Purchase Price",
          key: "purchasePrice",
          width: 18,
          type: "currency",
        },
        {
          header: "Selling Price",
          key: "sellingPrice",
          width: 18,
          type: "currency",
        },
        {
          header: "Current Stock",
          key: "stock",
          width: 16,
          type: "number",
        },
        {
          header: "Minimum Stock",
          key: "minimumStock",
          width: 18,
          type: "number",
        },
        {
          header: "GST (%)",
          key: "tax",
          width: 12,
          type: "number",
        },
        {
          header: "Status",
          key: "status",
          width: 18,
          type: "string",
        },
        {
          header: "Description",
          key: "description",
          width: 40,
          type: "string",
        },
        {
          header: "Created At",
          key: "createdAt",
          width: 22,
          type: "date",
        },
        {
          header: "Updated At",
          key: "updatedAt",
          width: 22,
          type: "date",
        },
      ],

      data: products,
    });

    res.setHeader(
      "Content-Disposition",
      'attachment; filename="Products.xlsx"',
    );

    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    );

    return res.end(buffer);
  };

  importExcel = async (req: Request, res: Response) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Excel file is required.",
      });
    }

    const result = await excelService.import(req.file, {
      "Product Code": "productCode",
      "Product Name": "name",
      Category: "category",
      "Sub Category": "subCategory",
      Barcode: "barcode",
      Unit: "unit",
      "Purchase Price": "purchasePrice",
      "Selling Price": "sellingPrice",
      "Current Stock": "stock",
      "Minimum Stock": "minimumStock",
      "GST (%)": "tax",
      Status: "status",
      Description: "description",
      "Created At": "createdAt",
      "Updated At": "updatedAt",
    });

    if (!result.success) {
      return res.status(400).json({
        success: false,
        message: "Excel validation failed.",
        errors: result.errors,
        summary: result.summary,
      });
    }

    const imported = await ProductService.bulkImport(
      result.rows,
      req.user.userId,
    );

    return res.status(201).json({
      success: true,
      message: "Products imported successfully.",
      summary: imported,
    });
  };

  getById = async (req: Request, res: Response) => {
    const product = await ProductService.getById(String(req.params.id));

    return res.status(200).json({
      success: true,
      message: "Product fetched successfully.",
      data: product,
    });
  };

  update = async (req: Request, res: Response) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const product = await ProductService.update(
      String(req.params.id),
      req.body,
      req.user.userId,
    );

    return res.status(200).json({
      success: true,
      message: "Product updated successfully.",
      data: product,
    });
  };

  delete = async (req: Request, res: Response) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    await ProductService.delete(String(req.params.id), req.user.userId);

    return res.status(200).json({
      success: true,
      message: "Product deleted successfully.",
    });
  };
}

export default new ProductController();
