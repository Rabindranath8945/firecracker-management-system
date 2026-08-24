import { Request, Response } from "express";

import CategoryService from "../services/category.service.js";

class CategoryController {
  /* ------------------------------------------------------------------------ */
  /* CREATE                                                                   */
  /* ------------------------------------------------------------------------ */

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

  /* ------------------------------------------------------------------------ */
  /* GET ALL                                                                  */
  /* ------------------------------------------------------------------------ */

  getAll = async (req: Request, res: Response) => {
    const isActive =
      req.query.isActive === undefined
        ? undefined
        : String(req.query.isActive) === "true";

    const categories = await CategoryService.getAll({
      page: Number(req.query.page) || 1,

      limit: Number(req.query.limit) || 20,

      search:
        req.query.search !== undefined ? String(req.query.search) : undefined,

      sort: req.query.sort !== undefined ? String(req.query.sort) : undefined,

      order:
        req.query.order === "asc" || req.query.order === "desc"
          ? req.query.order
          : undefined,

      isActive,
    });

    return res.status(200).json({
      success: true,
      message: "Categories fetched successfully.",
      data: categories,
    });
  };

  /* ------------------------------------------------------------------------ */
  /* GET BY ID                                                                */
  /* ------------------------------------------------------------------------ */

  getById = async (req: Request, res: Response) => {
    const id = String(req.params.id);

    const category = await CategoryService.getById(id);

    return res.status(200).json({
      success: true,
      message: "Category fetched successfully.",
      data: category,
    });
  };

  /* ------------------------------------------------------------------------ */
  /* UPDATE                                                                   */
  /* ------------------------------------------------------------------------ */

  update = async (req: Request, res: Response) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const id = String(req.params.id);

    const category = await CategoryService.update(
      id,
      req.body,
      req.user.userId,
    );

    return res.status(200).json({
      success: true,
      message: "Category updated successfully.",
      data: category,
    });
  };

  /* ------------------------------------------------------------------------ */
  /* DELETE                                                                   */
  /* ------------------------------------------------------------------------ */

  delete = async (req: Request, res: Response) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const id = String(req.params.id);

    await CategoryService.delete(id, req.user.userId);

    return res.status(200).json({
      success: true,
      message: "Category deleted successfully.",
    });
  };
}

export default new CategoryController();
