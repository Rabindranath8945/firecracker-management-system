import { Request, Response } from "express";

import SubCategoryService from "../services/sub-category.service.js";

class SubCategoryController {
  create = async (req: Request, res: Response) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const subCategory = await SubCategoryService.create(
      req.body,
      req.user.userId,
    );

    return res.status(201).json({
      success: true,
      message: "Sub category created successfully.",
      data: subCategory,
    });
  };

  getAll = async (req: Request, res: Response) => {
    const subCategories = await SubCategoryService.getAll({
      page: Number(req.query.page) || 1,
      limit: Number(req.query.limit) || 20,

      search: req.query.search ? String(req.query.search) : undefined,

      sort: req.query.sort ? String(req.query.sort) : undefined,

      order:
        req.query.order === "asc" || req.query.order === "desc"
          ? req.query.order
          : undefined,

      category: req.query.category ? String(req.query.category) : undefined,

      isActive:
        req.query.isActive !== undefined ? req.query.isActive === "true" : true,
    });

    return res.status(200).json({
      success: true,
      message: "Sub categories fetched successfully.",
      data: subCategories,
    });
  };

  getById = async (req: Request, res: Response) => {
    const subCategory = await SubCategoryService.getById(String(req.params.id));

    return res.status(200).json({
      success: true,
      message: "Sub category fetched successfully.",
      data: subCategory,
    });
  };

  update = async (req: Request, res: Response) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const subCategory = await SubCategoryService.update(
      String(req.params.id),
      req.body,
      req.user.userId,
    );

    return res.status(200).json({
      success: true,
      message: "Sub category updated successfully.",
      data: subCategory,
    });
  };

  delete = async (req: Request, res: Response) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    await SubCategoryService.delete(String(req.params.id), req.user.userId);

    return res.status(200).json({
      success: true,
      message: "Sub category deleted successfully.",
    });
  };
}

export default new SubCategoryController();
