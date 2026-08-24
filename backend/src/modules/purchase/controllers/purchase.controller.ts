import { Request, Response } from "express";

import PurchaseService from "../services/purchase.service.js";

class PurchaseController {
  create = async (req: Request, res: Response) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const purchase = await PurchaseService.create(req.body, req.user.userId);

    return res.status(201).json({
      success: true,
      message: "Purchase created successfully.",
      data: purchase,
    });
  };

  getAll = async (req: Request, res: Response) => {
    const purchases = await PurchaseService.getAll({
      page: Number(req.query.page) || 1,

      limit: Number(req.query.limit) || 20,

      search: req.query.search ? String(req.query.search) : undefined,

      supplier: req.query.supplier ? String(req.query.supplier) : undefined,

      paymentStatus: req.query.paymentStatus
        ? String(req.query.paymentStatus)
        : undefined,

      fromDate: req.query.fromDate
        ? new Date(String(req.query.fromDate))
        : undefined,

      toDate: req.query.toDate ? new Date(String(req.query.toDate)) : undefined,

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
      message: "Purchases fetched successfully.",
      data: purchases,
    });
  };

  getById = async (req: Request, res: Response) => {
    const purchase = await PurchaseService.getById(String(req.params.id));

    return res.status(200).json({
      success: true,
      message: "Purchase fetched successfully.",
      data: purchase,
    });
  };

  update = async (req: Request, res: Response) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const purchase = await PurchaseService.update(
      String(req.params.id),
      req.body,
      req.user.userId,
    );

    return res.status(200).json({
      success: true,
      message: "Purchase updated successfully.",
      data: purchase,
    });
  };

  delete = async (req: Request, res: Response) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    await PurchaseService.delete(String(req.params.id), req.user.userId);

    return res.status(200).json({
      success: true,
      message: "Purchase deleted successfully.",
    });
  };
}

export default new PurchaseController();
