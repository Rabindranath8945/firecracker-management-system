import { Request, Response } from "express";

import CategoryService from "../services/category.service.js";

class CategoryController {
  create = async (req: Request, res: Response) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const category = await CategoryService.create(req.body, req.user.userId);

    return res.status(201).json({
      success: true,
      message: "Category created successfully.",
      data: category,
    });
  };

  getAll = async (req: Request, res: Response) => {
    const categories = await CategoryService.getAll({
      page: Number(req.query.page) || 1,
      limit: Number(req.query.limit) || 20,

      search: req.query.search ? String(req.query.search) : undefined,

      sort: req.query.sort ? String(req.query.sort) : undefined,

      order:
        req.query.order === "asc" || req.query.order === "desc"
          ? req.query.order
          : undefined,

      isActive:
        req.query.isActive !== undefined ? req.query.isActive === "true" : true,
    });

    return res.status(200).json({
      success: true,
      message: "Categories fetched successfully.",
      data: categories,
    });
  };

  getById = async (req: Request, res: Response) => {
    const category = await CategoryService.getById(String(req.params.id));

    return res.status(200).json({
      success: true,
      message: "Category fetched successfully.",
      data: category,
    });
  };

  update = async (req: Request, res: Response) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const category = await CategoryService.update(
      String(req.params.id),
      req.body,
      req.user.userId,
    );

    return res.status(200).json({
      success: true,
      message: "Category updated successfully.",
      data: category,
    });
  };

  delete = async (req: Request, res: Response) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    await CategoryService.delete(String(req.params.id), req.user.userId);

    return res.status(200).json({
      success: true,
      message: "Category deleted successfully.",
    });
  };
}

export default new CategoryController();
