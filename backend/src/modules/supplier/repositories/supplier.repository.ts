import { Types } from "mongoose";

import Supplier from "../models/supplier.model.js";
import Purchase from "../../purchase/models/purchase.model.js";
import SupplierPayment from "../../supplier/models/supplier-payment.model.js";

import { ISupplier } from "../interfaces/supplier.interface.js";

interface SupplierQueryOptions {
  page?: number;
  limit?: number;
  search?: string;
  sort?: string;
  order?: "asc" | "desc";
  isActive?: boolean;
}

class SupplierRepository {
  /* ---------------------------------------------------------------------- */
  /* MONEY                                                                   */
  /* ---------------------------------------------------------------------- */

  private roundMoney(value: number) {
    return Math.round((value + Number.EPSILON) * 100) / 100;
  }

  /* ---------------------------------------------------------------------- */
  /* CREATE                                                                  */
  /* ---------------------------------------------------------------------- */

  async create(data: Partial<ISupplier>) {
    return Supplier.create(data);
  }

  /* ---------------------------------------------------------------------- */
  /* FIND                                                                    */
  /* ---------------------------------------------------------------------- */

  async find() {
    return Supplier.find();
  }

  async findByName(name: string) {
    return Supplier.findOne({
      name: new RegExp(`^${name}$`, "i"),
    });
  }

  async findById(id: string) {
    return Supplier.findById(id);
  }

  async findByCode(supplierCode: string) {
    return Supplier.findOne({
      supplierCode,
    });
  }

  async findByMobile(mobile: string) {
    return Supplier.findOne({
      mobile,
    });
  }

  /* ---------------------------------------------------------------------- */
  /* BULK LOOKUPS                                                            */
  /* ---------------------------------------------------------------------- */

  async findByMobiles(mobiles: string[]) {
    return Supplier.find({
      mobile: {
        $in: mobiles,
      },
    }).select("mobile");
  }

  async findByCodes(supplierCodes: string[]) {
    return Supplier.find({
      supplierCode: {
        $in: supplierCodes,
      },
    }).select("supplierCode");
  }

  /* ---------------------------------------------------------------------- */
  /* BUSINESS DATA                                                           */
  /* ---------------------------------------------------------------------- */

  async clearBusinessData(businessId: string) {
    return Supplier.deleteMany({
      businessId,
    });
  }

  /* ---------------------------------------------------------------------- */
  /* BULK CREATE                                                             */
  /* ---------------------------------------------------------------------- */

  async bulkCreate(suppliers: Partial<ISupplier>[]) {
    return Supplier.insertMany(suppliers, {
      ordered: false,
    });
  }

  /* ---------------------------------------------------------------------- */
  /* EXPORT                                                                  */
  /* ---------------------------------------------------------------------- */

  async findAllForExport() {
    return Supplier.find({
      isActive: true,
    })
      .sort({
        name: 1,
      })
      .lean()
      .exec();
  }

  /* ---------------------------------------------------------------------- */
  /* FIND ALL                                                                */
  /* ---------------------------------------------------------------------- */

  async findAll(options: SupplierQueryOptions = {}) {
    const {
      page = 1,
      limit = 20,
      search,
      sort = "createdAt",
      order = "desc",
      isActive = true,
    } = options;

    const query: Record<string, unknown> = {
      isActive,
    };

    /* -------------------------------------------------------------------- */
    /* SEARCH                                                               */
    /* -------------------------------------------------------------------- */

    if (search?.trim()) {
      const keyword = search.trim();

      query.$or = [
        {
          supplierCode: new RegExp(keyword, "i"),
        },
        {
          name: new RegExp(keyword, "i"),
        },
        {
          mobile: new RegExp(keyword, "i"),
        },
        {
          email: new RegExp(keyword, "i"),
        },
      ];
    }

    /* -------------------------------------------------------------------- */
    /* PAGINATION                                                           */
    /* -------------------------------------------------------------------- */

    const safePage = Math.max(1, page);

    const safeLimit = Math.min(Math.max(1, limit), 100);

    const skip = (safePage - 1) * safeLimit;

    /* -------------------------------------------------------------------- */
    /* FETCH SUPPLIERS                                                      */
    /* -------------------------------------------------------------------- */

    const [items, total] = await Promise.all([
      Supplier.find(query)
        .sort({
          [sort]: order === "asc" ? 1 : -1,
        })
        .skip(skip)
        .limit(safeLimit)
        .lean()
        .exec(),

      Supplier.countDocuments(query),
    ]);

    /* -------------------------------------------------------------------- */
    /* SUPPLIER IDS                                                         */
    /* -------------------------------------------------------------------- */

    const supplierIds = items.map((supplier) => supplier._id);

    /* -------------------------------------------------------------------- */
    /* PURCHASE BALANCES                                                    */
    /* -------------------------------------------------------------------- */

    const purchaseBalances =
      supplierIds.length > 0
        ? await Purchase.aggregate([
            {
              $match: {
                supplier: {
                  $in: supplierIds,
                },

                isActive: true,
              },
            },

            {
              $group: {
                _id: "$supplier",

                totalPurchases: {
                  $sum: "$grandTotal",
                },

                totalPurchasePaid: {
                  $sum: "$paidAmount",
                },

                totalPurchaseDue: {
                  $sum: "$dueAmount",
                },

                lastPurchaseDate: {
                  $max: "$purchaseDate",
                },
              },
            },
          ])
        : [];

    /* -------------------------------------------------------------------- */
    /* PREVIOUS DUE PAYMENTS                                                */
    /* -------------------------------------------------------------------- */

    const previousDuePayments =
      supplierIds.length > 0
        ? await SupplierPayment.aggregate([
            {
              $match: {
                supplier: {
                  $in: supplierIds,
                },

                paymentType: "PREVIOUS_DUE",

                isActive: true,
              },
            },

            {
              $group: {
                _id: "$supplier",

                totalPreviousDuePaid: {
                  $sum: "$amount",
                },
              },
            },
          ])
        : [];

    /* -------------------------------------------------------------------- */
    /* PURCHASE BALANCE MAP                                                 */
    /* -------------------------------------------------------------------- */

    const purchaseMap = new Map<
      string,
      {
        totalPurchases: number;
        totalPurchasePaid: number;
        totalPurchaseDue: number;
        lastPurchaseDate: Date | null;
      }
    >();

    for (const balance of purchaseBalances) {
      purchaseMap.set(balance._id.toString(), {
        totalPurchases: this.roundMoney(Number(balance.totalPurchases ?? 0)),

        totalPurchasePaid: this.roundMoney(
          Number(balance.totalPurchasePaid ?? 0),
        ),

        totalPurchaseDue: this.roundMoney(
          Number(balance.totalPurchaseDue ?? 0),
        ),

        lastPurchaseDate: balance.lastPurchaseDate ?? null,
      });
    }

    /* -------------------------------------------------------------------- */
    /* PREVIOUS DUE PAYMENT MAP                                             */
    /* -------------------------------------------------------------------- */

    const previousDueMap = new Map<string, number>();

    for (const payment of previousDuePayments) {
      previousDueMap.set(
        payment._id.toString(),
        this.roundMoney(Number(payment.totalPreviousDuePaid ?? 0)),
      );
    }

    /* -------------------------------------------------------------------- */
    /* ATTACH LIVE BALANCE                                                  */
    /* -------------------------------------------------------------------- */

    const enrichedItems = items.map((supplier) => {
      const supplierId = supplier._id.toString();

      const purchase = purchaseMap.get(supplierId);

      const previousDuePaid = previousDueMap.get(supplierId) ?? 0;

      const openingBalance = this.roundMoney(
        Number(supplier.openingBalance ?? 0),
      );

      const totalPurchases = this.roundMoney(
        Number(purchase?.totalPurchases ?? 0),
      );

      const totalPurchasePaid = this.roundMoney(
        Number(purchase?.totalPurchasePaid ?? 0),
      );

      const totalPurchaseDue = this.roundMoney(
        Number(purchase?.totalPurchaseDue ?? 0),
      );

      /*
       * CURRENT_PURCHASE payments are already
       * included in Purchase.paidAmount.
       *
       * Therefore only PREVIOUS_DUE payments
       * are subtracted separately.
       */

      const currentDue = this.roundMoney(
        Math.max(0, openingBalance + totalPurchaseDue - previousDuePaid),
      );

      const totalPaid = this.roundMoney(totalPurchasePaid + previousDuePaid);

      const totalDue = currentDue;

      return {
        ...supplier,

        totalPurchases,

        totalPaid,

        totalDue,

        currentDue,

        lastPurchaseDate: purchase?.lastPurchaseDate ?? undefined,
      };
    });

    /* -------------------------------------------------------------------- */
    /* PAGINATION RESULT                                                    */
    /* -------------------------------------------------------------------- */

    const totalPages = Math.ceil(total / safeLimit);

    return {
      items: enrichedItems,

      pagination: {
        page: safePage,
        limit: safeLimit,
        total,
        totalPages,

        hasNextPage: safePage < totalPages,

        hasPreviousPage: safePage > 1,
      },
    };
  }

  /* ---------------------------------------------------------------------- */
  /* UPDATE                                                                  */
  /* ---------------------------------------------------------------------- */

  async update(id: string, data: Partial<ISupplier>) {
    return Supplier.findByIdAndUpdate(id, data, {
      new: true,
      runValidators: true,
    });
  }

  /* ---------------------------------------------------------------------- */
  /* DELETE                                                                  */
  /* ---------------------------------------------------------------------- */

  async delete(id: string) {
    return Supplier.findByIdAndDelete(id);
  }

  /* ---------------------------------------------------------------------- */
  /* SUPPLIER BALANCE                                                        */
  /* ---------------------------------------------------------------------- */

  async getBalance(id: string) {
    if (!Types.ObjectId.isValid(id)) {
      throw new Error("Invalid supplier id.");
    }

    const supplier = await Supplier.findById(id)
      .select("_id supplierCode name openingBalance")
      .lean();

    if (!supplier) {
      throw new Error("Supplier not found.");
    }

    /* -------------------------------------------------------------------- */
    /* PURCHASE TOTALS                                                      */
    /* -------------------------------------------------------------------- */

    const purchaseResult = await Purchase.aggregate([
      {
        $match: {
          supplier: supplier._id,

          isActive: true,
        },
      },

      {
        $group: {
          _id: "$supplier",

          totalPurchases: {
            $sum: "$grandTotal",
          },

          totalPurchasePaid: {
            $sum: "$paidAmount",
          },

          totalPurchaseDue: {
            $sum: "$dueAmount",
          },

          lastPurchaseDate: {
            $max: "$purchaseDate",
          },
        },
      },
    ]);

    const purchaseTotals = purchaseResult[0] ?? {
      totalPurchases: 0,
      totalPurchasePaid: 0,
      totalPurchaseDue: 0,
      lastPurchaseDate: null,
    };

    /* -------------------------------------------------------------------- */
    /* PREVIOUS DUE PAYMENTS                                                */
    /* -------------------------------------------------------------------- */

    const paymentResult = await SupplierPayment.aggregate([
      {
        $match: {
          supplier: supplier._id,

          paymentType: "PREVIOUS_DUE",

          isActive: true,
        },
      },

      {
        $group: {
          _id: "$supplier",

          totalPreviousDuePaid: {
            $sum: "$amount",
          },
        },
      },
    ]);

    const paymentTotals = paymentResult[0] ?? {
      totalPreviousDuePaid: 0,
    };

    /* -------------------------------------------------------------------- */
    /* MONEY VALUES                                                         */
    /* -------------------------------------------------------------------- */

    const openingBalance = this.roundMoney(
      Number(supplier.openingBalance ?? 0),
    );

    const totalPurchases = this.roundMoney(
      Number(purchaseTotals.totalPurchases ?? 0),
    );

    const totalPurchasePaid = this.roundMoney(
      Number(purchaseTotals.totalPurchasePaid ?? 0),
    );

    const totalPurchaseDue = this.roundMoney(
      Number(purchaseTotals.totalPurchaseDue ?? 0),
    );

    const totalPreviousDuePaid = this.roundMoney(
      Number(paymentTotals.totalPreviousDuePaid ?? 0),
    );

    /* -------------------------------------------------------------------- */
    /* TOTAL PAID                                                           */
    /* -------------------------------------------------------------------- */

    const totalPaid = this.roundMoney(totalPurchasePaid + totalPreviousDuePaid);

    /* -------------------------------------------------------------------- */
    /* CURRENT DUE                                                          */
    /* -------------------------------------------------------------------- */

    const currentDue = this.roundMoney(
      Math.max(0, openingBalance + totalPurchaseDue - totalPreviousDuePaid),
    );

    /* -------------------------------------------------------------------- */
    /* TOTAL DUE                                                            */
    /* -------------------------------------------------------------------- */

    const totalDue = currentDue;

    /* -------------------------------------------------------------------- */
    /* RETURN                                                               */
    /* -------------------------------------------------------------------- */

    return {
      supplierId: supplier._id.toString(),

      supplierCode: supplier.supplierCode,

      supplierName: supplier.name,

      openingBalance,

      totalPurchases,

      totalPaid,

      totalDue,

      currentDue,

      lastPurchaseDate: purchaseTotals.lastPurchaseDate ?? null,
    };
  }
}

export default new SupplierRepository();
