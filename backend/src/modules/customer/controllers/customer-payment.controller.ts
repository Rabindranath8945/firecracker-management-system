import { Request, Response } from "express";

import CustomerPaymentService from "../services/customer-payment.service.js";

class CustomerPaymentController {
  /* ------------------------------------------------------------------------ */
  /* Create Due Payment                                                       */
  /* ------------------------------------------------------------------------ */

  create = async (req: Request, res: Response) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const result = await CustomerPaymentService.create(
      {
        customerId: String(req.params.customerId),

        amount: Number(req.body.amount),

        paymentMethod: req.body.paymentMethod,

        referenceSale: req.body.referenceSale
          ? String(req.body.referenceSale)
          : undefined,

        referenceInvoice: req.body.referenceInvoice
          ? String(req.body.referenceInvoice)
          : undefined,

        notes: req.body.notes ? String(req.body.notes) : undefined,
      },

      req.user.userId,
    );

    return res.status(201).json({
      success: true,
      message: "Customer due payment recorded successfully.",
      data: result,
    });
  };

  /* ------------------------------------------------------------------------ */
  /* Customer Payment History                                                 */
  /* ------------------------------------------------------------------------ */

  getCustomerPayments = async (req: Request, res: Response) => {
    const payments = await CustomerPaymentService.getCustomerPayments(
      String(req.params.customerId),
    );

    return res.status(200).json({
      success: true,
      message: "Customer payments fetched successfully.",
      data: payments,
    });
  };

  /* ------------------------------------------------------------------------ */
  /* Customer Current Due                                                     */
  /* ------------------------------------------------------------------------ */

  getCustomerDue = async (req: Request, res: Response) => {
    const due = await CustomerPaymentService.getCustomerDue(
      String(req.params.customerId),
    );

    return res.status(200).json({
      success: true,
      message: "Customer due fetched successfully.",
      data: due,
    });
  };
}

export default new CustomerPaymentController();
