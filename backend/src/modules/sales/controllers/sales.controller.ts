import { Request, Response } from "express";

import SalesService from "../services/sales.service.js";
import { excelService } from "../../../common/excel/index.js";

class SalesController {
  create = async (req: Request, res: Response) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const sale = await SalesService.create(req.body, req.user.userId);

    return res.status(201).json({
      success: true,
      message: "Sale created successfully.",
      data: sale,
    });
  };

  getAll = async (req: Request, res: Response) => {
    const parseStartOfDay = (value: string): Date => {
      const [year, month, day] = value.split("-").map(Number);

      return new Date(year, month - 1, day, 0, 0, 0, 0);
    };

    const parseEndOfDay = (value: string): Date => {
      const [year, month, day] = value.split("-").map(Number);

      return new Date(year, month - 1, day, 23, 59, 59, 999);
    };

    const fromDate = req.query.fromDate
      ? parseStartOfDay(String(req.query.fromDate))
      : undefined;

    const toDate = req.query.toDate
      ? parseEndOfDay(String(req.query.toDate))
      : undefined;

    const sales = await SalesService.getAll({
      page: Number(req.query.page) || 1,

      limit: Number(req.query.limit) || 20,

      search: req.query.search ? String(req.query.search) : undefined,

      customer: req.query.customer ? String(req.query.customer) : undefined,

      paymentStatus: req.query.paymentStatus
        ? String(req.query.paymentStatus)
        : undefined,

      paymentMethod: req.query.paymentMethod
        ? String(req.query.paymentMethod)
        : undefined,

      fromDate,

      toDate,

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
      message: "Sales fetched successfully.",
      data: sales,
    });
  };

  getSummary = async (_req: Request, res: Response) => {
    const summary = await SalesService.getSummary();

    return res.status(200).json({
      success: true,
      data: summary,
    });
  };

  getNextCode = async (_req: Request, res: Response) => {
    const saleNo = await SalesService.getNextCode();

    return res.status(200).json({
      success: true,
      data: {
        saleNo,
      },
    });
  };

  getById = async (req: Request, res: Response) => {
    const sale = await SalesService.getById(String(req.params.id));

    return res.status(200).json({
      success: true,
      message: "Sale fetched successfully.",
      data: sale,
    });
  };

  update = async (req: Request, res: Response) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const sale = await SalesService.update(
      String(req.params.id),
      req.body,
      req.user.userId,
    );

    return res.status(200).json({
      success: true,
      message: "Sale updated successfully.",
      data: sale,
    });
  };

  delete = async (req: Request, res: Response) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    await SalesService.delete(String(req.params.id), req.user.userId);

    return res.status(200).json({
      success: true,
      message: "Sale cancelled successfully.",
    });
  };

  exportExcel = async (_req: Request, res: Response) => {
    return res.status(501).json({
      success: false,
      message: "Sales export not implemented yet.",
    });
  };

  importExcel = async (_req: Request, res: Response) => {
    return res.status(501).json({
      success: false,
      message: "Sales import not implemented yet.",
    });
  };
}

export default new SalesController();
