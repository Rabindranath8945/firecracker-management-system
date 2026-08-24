import { Types } from "mongoose";

import SupplierPayment from "../models/supplier-payment.model.js";
import type { ISupplierPayment } from "../interfaces/supplier-payment.interface.js";

interface SupplierPaymentQueryOptions {
  supplier?: string;
  paymentType?: "CURRENT_PURCHASE" | "PREVIOUS_DUE";
  fromDate?: Date;
  toDate?: Date;
  isActive?: boolean;
}

class SupplierPaymentRepository {
  /* ---------------------------------------------------------------------- */
  /* CREATE                                                                 */
  /* ---------------------------------------------------------------------- */

  async create(data: Partial<ISupplierPayment>) {
    return SupplierPayment.create(data);
  }

  /* ---------------------------------------------------------------------- */
  /* FIND BY ID                                                             */
  /* ---------------------------------------------------------------------- */

  async findById(id: string) {
    if (!Types.ObjectId.isValid(id)) {
      return null;
    }

    return SupplierPayment.findById(id)
      .populate("supplier", "supplierCode name mobile")
      .populate("referencePurchase", "purchaseNo invoiceNo grandTotal")
      .lean()
      .exec();
  }

  /* ---------------------------------------------------------------------- */
  /* FIND ALL                                                               */
  /* ---------------------------------------------------------------------- */

  async findAll(options: SupplierPaymentQueryOptions = {}) {
    const {
      supplier,
      paymentType,
      fromDate,
      toDate,
      isActive = true,
    } = options;

    const query: Record<string, unknown> = {
      isActive,
    };

    /* -------------------------------------------------------------------- */
    /* Supplier                                                             */
    /* -------------------------------------------------------------------- */

    if (supplier && Types.ObjectId.isValid(supplier)) {
      query.supplier = new Types.ObjectId(supplier);
    }

    /* -------------------------------------------------------------------- */
    /* Payment Type                                                          */
    /* -------------------------------------------------------------------- */

    if (paymentType) {
      query.paymentType = paymentType;
    }

    /* -------------------------------------------------------------------- */
    /* Date Range                                                            */
    /* -------------------------------------------------------------------- */

    if (fromDate || toDate) {
      const paymentDate: Record<string, Date> = {};

      if (fromDate) {
        paymentDate.$gte = fromDate;
      }

      if (toDate) {
        paymentDate.$lte = toDate;
      }

      query.paymentDate = paymentDate;
    }

    return SupplierPayment.find(query)
      .populate("supplier", "supplierCode name mobile")
      .populate("referencePurchase", "purchaseNo invoiceNo grandTotal")
      .sort({
        paymentDate: -1,
        createdAt: -1,
      })
      .lean()
      .exec();
  }

  /* ---------------------------------------------------------------------- */
  /* GET SUPPLIER PAYMENT TOTAL                                             */
  /* ---------------------------------------------------------------------- */

  async getTotalBySupplier(
    supplierId: string,
    paymentType?: "CURRENT_PURCHASE" | "PREVIOUS_DUE",
  ) {
    if (!Types.ObjectId.isValid(supplierId)) {
      throw new Error("Invalid supplier id.");
    }

    const match: Record<string, unknown> = {
      supplier: new Types.ObjectId(supplierId),
      isActive: true,
    };

    if (paymentType) {
      match.paymentType = paymentType;
    }

    const result = await SupplierPayment.aggregate([
      {
        $match: match,
      },
      {
        $group: {
          _id: null,
          total: {
            $sum: "$amount",
          },
        },
      },
    ]);

    return Number(result[0]?.total ?? 0);
  }

  /* ---------------------------------------------------------------------- */
  /* UPDATE                                                                 */
  /* ---------------------------------------------------------------------- */

  async update(id: string, data: Partial<ISupplierPayment>) {
    return SupplierPayment.findByIdAndUpdate(id, data, {
      new: true,
      runValidators: true,
    });
  }

  /* ---------------------------------------------------------------------- */
  /* DELETE / SOFT DELETE                                                   */
  /* ---------------------------------------------------------------------- */

  async delete(id: string) {
    return SupplierPayment.findByIdAndUpdate(
      id,
      {
        isActive: false,
      },
      {
        new: true,
      },
    );
  }
}

export default new SupplierPaymentRepository();
