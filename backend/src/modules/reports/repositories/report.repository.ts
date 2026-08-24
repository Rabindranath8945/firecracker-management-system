import Sale from "../../sales/models/sales.model.js";
import Purchase from "../../purchase/models/purchase.model.js";
import Product from "../../product/models/product.model.js";
import Customer from "../../customer/models/customer.model.js";
import Supplier from "../../supplier/models/supplier.model.js";
import Expense from "../../expense/models/expense.model.js";

class ReportRepository {
  /* ------------------------------------------------------------------------ */
  /* SALES                                                                    */
  /* ------------------------------------------------------------------------ */

  async getSalesReport(from: Date, to: Date) {
    return Sale.find({
      saleDate: {
        $gte: from,
        $lte: to,
      },
      isActive: true,
    })
      .populate("customer", "name")
      .sort({
        saleDate: -1,
        createdAt: -1,
      });
  }

  /* ------------------------------------------------------------------------ */
  /* PURCHASE                                                                 */
  /* ------------------------------------------------------------------------ */

  async getPurchaseReport(from: Date, to: Date) {
    return Purchase.find({
      purchaseDate: {
        $gte: from,
        $lte: to,
      },
      isActive: true,
    })
      .populate("supplier", "name")
      .sort({
        purchaseDate: -1,
        createdAt: -1,
      });
  }

  /* ------------------------------------------------------------------------ */
  /* STOCK                                                                    */
  /* ------------------------------------------------------------------------ */

  async getStockReport() {
    const products = await Product.find({
      isActive: true,
    })
      .populate("category", "name")
      .populate("subCategory", "name")
      .sort({ name: 1 })
      .lean();

    return products;
  }

  /* ------------------------------------------------------------------------ */
  /* LOW STOCK                                                                */
  /* ------------------------------------------------------------------------ */

  async getLowStockReport() {
    return Product.find({
      isActive: true,

      $expr: {
        $lte: ["$stock", "$minimumStock"],
      },
    })
      .populate("category", "name")
      .sort({
        stock: 1,
        name: 1,
      });
  }

  /* ------------------------------------------------------------------------ */
  /* CUSTOMER                                                                 */
  /* ------------------------------------------------------------------------ */

  async getCustomerReport(from: Date, to: Date) {
    return Customer.aggregate([
      {
        $match: {
          isActive: true,
        },
      },

      {
        $lookup: {
          from: "sales",

          let: {
            customerId: "$_id",
          },

          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    {
                      $eq: ["$customer", "$$customerId"],
                    },
                    {
                      $gte: ["$saleDate", from],
                    },
                    {
                      $lte: ["$saleDate", to],
                    },
                    {
                      $eq: ["$isActive", true],
                    },
                  ],
                },
              },
            },
          ],

          as: "sales",
        },
      },

      {
        $project: {
          name: 1,
          mobile: 1,

          totalInvoices: {
            $size: "$sales",
          },

          totalSales: {
            $sum: "$sales.grandTotal",
          },

          totalDue: {
            $sum: "$sales.dueAmount",
          },
        },
      },

      {
        $sort: {
          totalSales: -1,
          name: 1,
        },
      },
    ]);
  }

  /* ------------------------------------------------------------------------ */
  /* SUPPLIER                                                                 */
  /* ------------------------------------------------------------------------ */

  async getSupplierReport(from: Date, to: Date) {
    return Supplier.aggregate([
      {
        $match: {
          isActive: true,
        },
      },

      {
        $lookup: {
          from: "purchases",

          let: {
            supplierId: "$_id",
          },

          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    {
                      $eq: ["$supplier", "$$supplierId"],
                    },
                    {
                      $gte: ["$purchaseDate", from],
                    },
                    {
                      $lte: ["$purchaseDate", to],
                    },
                    {
                      $eq: ["$isActive", true],
                    },
                  ],
                },
              },
            },
          ],

          as: "purchases",
        },
      },

      {
        $project: {
          name: 1,
          mobile: 1,

          totalPurchases: {
            $size: "$purchases",
          },

          purchaseAmount: {
            $sum: "$purchases.grandTotal",
          },
        },
      },

      {
        $sort: {
          purchaseAmount: -1,
          name: 1,
        },
      },
    ]);
  }

  /* ------------------------------------------------------------------------ */
  /* EXPENSE                                                                  */
  /* ------------------------------------------------------------------------ */

  async getExpenses(from: Date, to: Date) {
    return Expense.find({
      expenseDate: {
        $gte: from,
        $lte: to,
      },

      isActive: true,
    }).sort({
      expenseDate: -1,
      createdAt: -1,
    });
  }

  /* ------------------------------------------------------------------------ */
  /* PROFIT & LOSS                                                            */
  /* ------------------------------------------------------------------------ */

  async getProfitLossReport(from: Date, to: Date) {
    /* ------------------------------------------------------------------------ */
    /* SALES                                                                    */
    /* ------------------------------------------------------------------------ */

    const sales = await Sale.aggregate([
      {
        $match: {
          saleDate: {
            $gte: from,
            $lte: to,
          },
          isActive: true,
        },
      },

      {
        $project: {
          month: {
            $dateToString: {
              format: "%Y-%m",
              date: "$saleDate",
            },
          },

          grandTotal: {
            $ifNull: ["$grandTotal", 0],
          },

          profit: {
            $sum: {
              $map: {
                input: {
                  $ifNull: ["$items", []],
                },

                as: "item",

                in: {
                  $ifNull: ["$$item.profit", 0],
                },
              },
            },
          },
        },
      },

      {
        $group: {
          _id: "$month",

          sales: {
            $sum: "$grandTotal",
          },

          profit: {
            $sum: "$profit",
          },
        },
      },

      {
        $sort: {
          _id: 1,
        },
      },
    ]);

    /* ------------------------------------------------------------------------ */
    /* PURCHASES                                                                */
    /* ------------------------------------------------------------------------ */

    const purchases = await Purchase.aggregate([
      {
        $match: {
          purchaseDate: {
            $gte: from,
            $lte: to,
          },

          isActive: true,
        },
      },

      {
        $project: {
          month: {
            $dateToString: {
              format: "%Y-%m",
              date: "$purchaseDate",
            },
          },

          purchase: {
            $ifNull: ["$grandTotal", 0],
          },
        },
      },

      {
        $group: {
          _id: "$month",

          purchases: {
            $sum: "$purchase",
          },
        },
      },

      {
        $sort: {
          _id: 1,
        },
      },
    ]);

    /* ------------------------------------------------------------------------ */
    /* MERGE MONTHS                                                             */
    /* ------------------------------------------------------------------------ */

    const months = new Map<
      string,
      {
        sales: number;
        purchases: number;
        expenses: number;
        profit: number;
      }
    >();

    /* ------------------------------------------------------------------------ */
    /* SALES                                                                     */
    /* ------------------------------------------------------------------------ */

    for (const row of sales) {
      months.set(row._id, {
        sales: Number(row.sales ?? 0),
        purchases: 0,
        expenses: 0,
        profit: Number(row.profit ?? 0),
      });
    }

    /* ------------------------------------------------------------------------ */
    /* PURCHASES                                                                 */
    /* ------------------------------------------------------------------------ */

    for (const row of purchases) {
      const existing = months.get(row._id);

      if (existing) {
        existing.purchases = Number(row.purchases ?? 0);
      } else {
        months.set(row._id, {
          sales: 0,
          purchases: Number(row.purchases ?? 0),
          expenses: 0,
          profit: 0,
        });
      }
    }

    /* ------------------------------------------------------------------------ */
    /* RESULT                                                                    */
    /* ------------------------------------------------------------------------ */

    return Array.from(months.entries())
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([month, values]) => {
        const date = new Date(`${month}-01T00:00:00`);

        return {
          id: month,

          month: date.toLocaleDateString("en-IN", {
            month: "long",
            year: "numeric",
          }),

          sales: Number(values.sales.toFixed(2)),

          purchases: Number(values.purchases.toFixed(2)),

          /*
           * Expense module is not available yet.
           */
          expenses: 0,

          /*
           * Profit comes from the actual profit stored
           * inside Sale.items.
           */
          profit: Number(values.profit.toFixed(2)),
        };
      });
  }

  /* ------------------------------------------------------------------------ */
  /* GST                                                                      */
  /* ------------------------------------------------------------------------ */

  async getGSTReport(from: Date, to: Date) {
    return Sale.aggregate([
      {
        $match: {
          saleDate: {
            $gte: from,
            $lte: to,
          },

          isActive: true,
        },
      },

      {
        $unwind: "$items",
      },

      {
        $group: {
          _id: "$items.tax",

          taxableAmount: {
            $sum: {
              $multiply: ["$items.quantity", "$items.sellingPrice"],
            },
          },

          gstAmount: {
            $sum: {
              $multiply: [
                {
                  $multiply: ["$items.quantity", "$items.sellingPrice"],
                },

                {
                  $divide: ["$items.tax", 100],
                },
              ],
            },
          },
        },
      },

      {
        $sort: {
          _id: 1,
        },
      },
    ]);
  }

  /* ------------------------------------------------------------------------ */
  /* SUMMARY                                                                  */
  /* ------------------------------------------------------------------------ */

  async getSummary(from: Date, to: Date) {
    const [sales, purchases, expenses, customers, suppliers, products] =
      await Promise.all([
        Sale.countDocuments({
          saleDate: {
            $gte: from,
            $lte: to,
          },

          isActive: true,
        }),

        Purchase.countDocuments({
          purchaseDate: {
            $gte: from,
            $lte: to,
          },

          isActive: true,
        }),

        Expense.countDocuments({
          expenseDate: {
            $gte: from,
            $lte: to,
          },

          isActive: true,
        }),

        Customer.countDocuments({
          isActive: true,
        }),

        Supplier.countDocuments({
          isActive: true,
        }),

        Product.countDocuments({
          isActive: true,
        }),
      ]);

    return {
      sales,
      purchases,
      expenses,
      customers,
      suppliers,
      products,
    };
  }
}

export default new ReportRepository();
