import Sale from "../../sales/models/sales.model.js";
import Purchase from "../../purchase/models/purchase.model.js";
import Product from "../../product/models/product.model.js";
import Customer from "../../customer/models/customer.model.js";
import Supplier from "../../supplier/models/supplier.model.js";
import Expense from "../../expense/models/expense.model.js";

class ReportRepository {
  async getSalesReport(from: Date, to: Date) {
    return Sale.find({
      createdAt: {
        $gte: from,
        $lte: to,
      },
    })
      .populate("customer", "name")
      .sort({ createdAt: -1 });
  }

  async getPurchaseReport(from: Date, to: Date) {
    return Purchase.find({
      createdAt: {
        $gte: from,
        $lte: to,
      },
    })
      .populate("supplier", "name")
      .sort({ createdAt: -1 });
  }

  async getStockReport() {
    return Product.find({
      isActive: true,
    }).sort({
      name: 1,
    });
  }

  async getLowStockReport() {
    return Product.find({
      $expr: {
        $lte: ["$stock", "$minimumStock"],
      },
      isActive: true,
    }).sort({
      stock: 1,
    });
  }

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
          localField: "_id",
          foreignField: "customer",
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
        },
      },
    ]);
  }

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
          localField: "_id",
          foreignField: "supplier",
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
        },
      },
    ]);
  }

  async getExpenses(from: Date, to: Date) {
    return Expense.find({
      createdAt: {
        $gte: from,
        $lte: to,
      },
    }).sort({
      createdAt: -1,
    });
  }
  async getProfitLossReport(from: Date, to: Date) {
    const [sales, purchases, expenses] = await Promise.all([
      Sale.aggregate([
        {
          $match: {
            createdAt: {
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
            _id: null,

            sales: {
              $sum: "$grandTotal",
            },

            purchaseCost: {
              $sum: {
                $multiply: ["$items.purchasePrice", "$items.quantity"],
              },
            },

            sellingAmount: {
              $sum: {
                $multiply: ["$items.sellingPrice", "$items.quantity"],
              },
            },
          },
        },
      ]),

      Purchase.aggregate([
        {
          $match: {
            createdAt: {
              $gte: from,
              $lte: to,
            },
            isActive: true,
          },
        },
        {
          $group: {
            _id: null,

            purchase: {
              $sum: "$grandTotal",
            },
          },
        },
      ]),

      Expense.aggregate([
        {
          $match: {
            createdAt: {
              $gte: from,
              $lte: to,
            },
            isActive: true,
          },
        },
        {
          $group: {
            _id: null,

            expense: {
              $sum: "$amount",
            },
          },
        },
      ]),
    ]);

    const sale = sales[0];

    const grossProfit = (sale?.sellingAmount ?? 0) - (sale?.purchaseCost ?? 0);

    return {
      sales: sale?.sales ?? 0,

      purchase: purchases[0]?.purchase ?? 0,

      expense: expenses[0]?.expense ?? 0,

      purchaseCost: sale?.purchaseCost ?? 0,

      grossProfit,

      netProfit: grossProfit - (expenses[0]?.expense ?? 0),
    };
  }
  async getGSTReport(from: Date, to: Date) {
    return Sale.aggregate([
      {
        $match: {
          createdAt: {
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

  async getSummary(from: Date, to: Date) {
    const [sales, purchases, expenses, customers, suppliers, products] =
      await Promise.all([
        Sale.countDocuments({
          createdAt: {
            $gte: from,
            $lte: to,
          },
        }),

        Purchase.countDocuments({
          createdAt: {
            $gte: from,
            $lte: to,
          },
        }),

        Expense.countDocuments({
          createdAt: {
            $gte: from,
            $lte: to,
          },
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
