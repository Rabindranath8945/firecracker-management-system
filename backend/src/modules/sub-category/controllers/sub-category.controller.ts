import { Request, Response } from "express";

import SubCategoryService from "../services/sub-category.service.js";

class SubCategoryController {
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

  /* ------------------------------------------------------------------------ */
  /* GET ALL                                                                  */
  /* ------------------------------------------------------------------------ */

  getAll = async (req: Request, res: Response) => {
    const isActive =
      req.query.isActive === undefined
        ? undefined
        : String(req.query.isActive) === "true";

    const subCategories = await SubCategoryService.getAll({
      page: Number(req.query.page) || 1,

      limit: Number(req.query.limit) || 20,

      search:
        req.query.search !== undefined ? String(req.query.search) : undefined,

      sort: req.query.sort !== undefined ? String(req.query.sort) : undefined,

      order:
        req.query.order === "asc" || req.query.order === "desc"
          ? req.query.order
          : undefined,

      category:
        req.query.category !== undefined
          ? String(req.query.category)
          : undefined,

      isActive,
    });

    return res.status(200).json({
      success: true,
      message: "Sub categories fetched successfully.",
      data: subCategories,
    });
  };

  /* ------------------------------------------------------------------------ */
  /* GET BY ID                                                                */
  /* ------------------------------------------------------------------------ */

  getById = async (req: Request, res: Response) => {
    const id = String(req.params.id);

    const subCategory = await SubCategoryService.getById(id);

    return res.status(200).json({
      success: true,
      message: "Sub category fetched successfully.",
      data: subCategory,
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

    const subCategory = await SubCategoryService.update(
      id,
      req.body,
      req.user.userId,
    );

    return res.status(200).json({
      success: true,
      message: "Sub category updated successfully.",
      data: subCategory,
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

    await SubCategoryService.delete(id, req.user.userId);

    return res.status(200).json({
      success: true,
      message: "Sub category deleted successfully.",
    });
  };
}

export default new SubCategoryController();
