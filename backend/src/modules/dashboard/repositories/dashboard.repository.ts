import BusinessModel from "../../business/models/business.model.js";
import ProductModel from "../../product/models/product.model.js";
import CustomerModel from "../../customer/models/customer.model.js";
import SupplierModel from "../../supplier/models/supplier.model.js";
import SalesModel from "../../sales/models/sales.model.js";

class DashboardRepository {
  async getDashboard(ownerId: string) {
    /* -------------------------------------------------------------------------- */
    /*                              Business                                      */
    /* -------------------------------------------------------------------------- */

    const today = new Date();

    today.setHours(0, 0, 0, 0);

    const tomorrow = new Date(today);

    tomorrow.setDate(tomorrow.getDate() + 1);

    const todaySalesResult = await SalesModel.aggregate([
      {
        $match: {
          createdAt: {
            $gte: today,
            $lt: tomorrow,
          },
        },
      },
      {
        $group: {
          _id: null,
          total: {
            $sum: "$grandTotal",
          },
        },
      },
    ]);

    const todaySales = todaySalesResult[0]?.total ?? 0;

    const monthStart = new Date();

    monthStart.setDate(1);

    monthStart.setHours(0, 0, 0, 0);

    const nextMonth = new Date(monthStart);

    nextMonth.setMonth(nextMonth.getMonth() + 1);

    const monthlyRevenueResult = await SalesModel.aggregate([
      {
        $match: {
          createdAt: {
            $gte: monthStart,
            $lt: nextMonth,
          },
        },
      },
      {
        $group: {
          _id: null,
          total: {
            $sum: "$grandTotal",
          },
        },
      },
    ]);

    const monthlyRevenue = monthlyRevenueResult[0]?.total ?? 0;

    const lowStock = await ProductModel.countDocuments({
      $expr: {
        $lte: ["$stock", "$minStock"],
      },
    });

    const lowStockProducts = await ProductModel.find({
      $expr: {
        $lte: ["$stock", "$minimumStock"],
      },
    })
      .select("name stock minimumStock")
      .limit(5)
      .lean();

    const todayProfitResult = await SalesModel.aggregate([
      {
        $match: {
          saleDate: {
            $gte: today,
            $lt: tomorrow,
          },
        },
      },
      {
        $unwind: "$items",
      },
      {
        $group: {
          _id: null,
          totalProfit: {
            $sum: "$items.profit",
          },
        },
      },
    ]);

    const todayProfit = todayProfitResult[0]?.totalProfit ?? 0;
    const monthlyProfitResult = await SalesModel.aggregate([
      {
        $match: {
          saleDate: {
            $gte: monthStart,
            $lt: nextMonth,
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
          totalProfit: {
            $sum: "$items.profit",
          },
        },
      },
    ]);

    const monthlyProfit = monthlyProfitResult[0]?.totalProfit ?? 0;

    const outstandingPaymentsResult = await SalesModel.aggregate([
      {
        $match: {
          dueAmount: {
            $gt: 0,
          },
        },
      },
      {
        $group: {
          _id: null,
          total: {
            $sum: "$dueAmount",
          },
        },
      },
    ]);

    const outstandingPayments = outstandingPaymentsResult[0]?.total ?? 0;

    const last7Days = new Date();

    last7Days.setDate(last7Days.getDate() - 6);

    last7Days.setHours(0, 0, 0, 0);

    const salesChart = await SalesModel.aggregate([
      {
        $match: {
          saleDate: {
            $gte: last7Days,
          },
        },
      },
      {
        $group: {
          _id: {
            $dateToString: {
              format: "%d %b",
              date: "$saleDate",
            },
          },

          sales: {
            $sum: "$grandTotal",
          },
        },
      },
      {
        $sort: {
          _id: 1,
        },
      },
    ]);

    const recentSales = await SalesModel.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .lean();

    const recentActivities = recentSales.map((sale) => ({
      id: sale._id.toString(),

      title: "Sale Completed",

      subtitle: sale.invoiceNo,

      value: `₹${sale.grandTotal.toLocaleString("en-IN")}`,

      time: sale.saleDate.toLocaleDateString("en-IN"),

      type: "SALE" as const,
    }));

    const insights = [];

    if (todaySales > 0) {
      insights.push({
        id: "sales",

        title: "Sales Growth",

        description: `Today's sales reached ₹${todaySales.toLocaleString("en-IN")}.`,

        type: "SUCCESS",
      });
    }

    if (lowStock > 0) {
      insights.push({
        id: "stock",

        title: "Low Stock",

        description: `${lowStock} products need restocking.`,

        type: "WARNING",
      });
    }

    if (outstandingPayments > 0) {
      insights.push({
        id: "due",

        title: "Outstanding Payments",

        description: `₹${outstandingPayments.toLocaleString("en-IN")} is pending collection.`,

        type: "SUGGESTION",
      });
    }

    if (monthlyRevenue > 0) {
      insights.push({
        id: "revenue",

        title: "Monthly Revenue",

        description: `Monthly revenue reached ₹${monthlyRevenue.toLocaleString("en-IN")}.`,

        type: "BEST_SELLER",
      });
    }

    const business = await BusinessModel.findOne({
      owner: ownerId,
    }).lean();

    /* -------------------------------------------------------------------------- */
    /*                                Counts                                      */
    /* -------------------------------------------------------------------------- */

    const [totalProducts, totalCustomers, totalSuppliers, totalSales] =
      await Promise.all([
        ProductModel.countDocuments(),
        CustomerModel.countDocuments(),
        SupplierModel.countDocuments(),
        SalesModel.countDocuments(),
      ]);

    return {
      business,

      totalProducts,
      totalCustomers,
      totalSuppliers,
      totalSales,

      todaySales,
      todayProfit,

      monthlyRevenue,
      monthlyProfit,

      outstandingPayments,

      lowStock,

      salesChart,

      lowStockProducts,

      recentActivities,

      insights,
    };
  }
}

export default new DashboardRepository();
