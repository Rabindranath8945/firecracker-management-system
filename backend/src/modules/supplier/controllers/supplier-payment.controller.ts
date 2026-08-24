import { Request, Response } from "express";

import SupplierPaymentService from "../services/supplier-payment.service.js";

class SupplierPaymentController {
  /* ---------------------------------------------------------------------- */
  /* CREATE                                                                 */
  /* ---------------------------------------------------------------------- */

  create = async (req: Request, res: Response) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const payment = await SupplierPaymentService.create(
      req.body,
      req.user.userId,
    );

    return res.status(201).json({
      success: true,
      message: "Supplier payment created successfully.",
      data: payment,
    });
  };

  /* ---------------------------------------------------------------------- */
  /* GET ALL                                                                */
  /* ---------------------------------------------------------------------- */

  getAll = async (req: Request, res: Response) => {
    const paymentType =
      req.query.paymentType === "CURRENT_PURCHASE" ||
      req.query.paymentType === "PREVIOUS_DUE"
        ? req.query.paymentType
        : undefined;

    const fromDate = req.query.fromDate
      ? new Date(String(req.query.fromDate))
      : undefined;

    const toDate = req.query.toDate
      ? new Date(String(req.query.toDate))
      : undefined;

    const payments = await SupplierPaymentService.getAll({
      supplier: req.query.supplier ? String(req.query.supplier) : undefined,

      paymentType,

      fromDate,

      toDate,

      isActive:
        req.query.isActive !== undefined ? req.query.isActive === "true" : true,
    });

    return res.status(200).json({
      success: true,
      message: "Supplier payments fetched successfully.",
      data: payments,
    });
  };

  /* ---------------------------------------------------------------------- */
  /* GET BY ID                                                              */
  /* ---------------------------------------------------------------------- */

  getById = async (req: Request, res: Response) => {
    const payment = await SupplierPaymentService.getById(String(req.params.id));

    return res.status(200).json({
      success: true,
      message: "Supplier payment fetched successfully.",
      data: payment,
    });
  };

  /* ---------------------------------------------------------------------- */
  /* GET SUPPLIER PAYMENT TOTAL                                             */
  /* ---------------------------------------------------------------------- */

  getTotalBySupplier = async (req: Request, res: Response) => {
    const paymentType =
      req.query.paymentType === "CURRENT_PURCHASE" ||
      req.query.paymentType === "PREVIOUS_DUE"
        ? req.query.paymentType
        : undefined;

    const total = await SupplierPaymentService.getTotalBySupplier(
      String(req.params.supplierId),
      paymentType,
    );

    return res.status(200).json({
      success: true,
      message: "Supplier payment total fetched successfully.",
      data: {
        total,
      },
    });
  };

  /* ---------------------------------------------------------------------- */
  /* UPDATE                                                                 */
  /* ---------------------------------------------------------------------- */

  update = async (req: Request, res: Response) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const payment = await SupplierPaymentService.update(
      String(req.params.id),
      req.body,
      req.user.userId,
    );

    return res.status(200).json({
      success: true,
      message: "Supplier payment updated successfully.",
      data: payment,
    });
  };

  /* ---------------------------------------------------------------------- */
  /* DELETE                                                                 */
  /* ---------------------------------------------------------------------- */

  delete = async (req: Request, res: Response) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    await SupplierPaymentService.delete(String(req.params.id), req.user.userId);

    return res.status(200).json({
      success: true,
      message: "Supplier payment deleted successfully.",
    });
  };
}

export default new SupplierPaymentController();
