import BusinessModel from "../../business/models/business.model.js";
import ProductModel from "../../product/models/product.model.js";
import CustomerModel from "../../customer/models/customer.model.js";
import SupplierModel from "../../supplier/models/supplier.model.js";
import SalesModel from "../../sales/models/sales.model.js";
import type { DashboardData } from "../interfaces/dashboard.interface.js";

class DashboardRepository {
  async getDashboard(ownerId: string): Promise<DashboardData> {
    /* ---------------------------------------------------------------------- */
    /* Dates                                                                  */
    /* ---------------------------------------------------------------------- */

    const now = new Date();

    const today = new Date(now);
    today.setHours(0, 0, 0, 0);

    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const monthStart = new Date(now);
    monthStart.setDate(1);
    monthStart.setHours(0, 0, 0, 0);

    const nextMonth = new Date(monthStart);
    nextMonth.setMonth(nextMonth.getMonth() + 1);

    const weekStart = new Date(today);
    weekStart.setDate(weekStart.getDate() - 6);

    /* ---------------------------------------------------------------------- */
    /* Business                                                               */
    /* ---------------------------------------------------------------------- */

    const business = await BusinessModel.findOne({
      owner: ownerId,
    }).lean();

    /* ---------------------------------------------------------------------- */
    /* Today's Sales                                                          */
    /* ---------------------------------------------------------------------- */

    const todaySalesResult = await SalesModel.aggregate([
      {
        $match: {
          saleDate: {
            $gte: today,
            $lt: tomorrow,
          },
          isActive: true,
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

    const todaySales = Number(todaySalesResult[0]?.total ?? 0);

    /* ---------------------------------------------------------------------- */
    /* Today's Profit                                                         */
    /* ---------------------------------------------------------------------- */

    const todayProfitResult = await SalesModel.aggregate([
      {
        $match: {
          saleDate: {
            $gte: today,
            $lt: tomorrow,
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
          total: {
            $sum: "$items.profit",
          },
        },
      },
    ]);

    const todayProfit = Number(todayProfitResult[0]?.total ?? 0);

    /* ---------------------------------------------------------------------- */
    /* Monthly Revenue                                                        */
    /* ---------------------------------------------------------------------- */

    const monthlyRevenueResult = await SalesModel.aggregate([
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
        $group: {
          _id: null,
          total: {
            $sum: "$grandTotal",
          },
        },
      },
    ]);

    const monthlyRevenue = Number(monthlyRevenueResult[0]?.total ?? 0);

    /* ---------------------------------------------------------------------- */
    /* Outstanding Customer Payments                                         */
    /* ---------------------------------------------------------------------- */

    const outstandingPaymentsResult = await SalesModel.aggregate([
      {
        $match: {
          dueAmount: {
            $gt: 0,
          },
          isActive: true,
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

    const outstandingPayments = Number(
      outstandingPaymentsResult[0]?.total ?? 0,
    );

    /* ---------------------------------------------------------------------- */
    /* Weekly Sales                                                           */
    /* ---------------------------------------------------------------------- */

    const weeklySalesResult = await SalesModel.aggregate([
      {
        $match: {
          saleDate: {
            $gte: weekStart,
            $lt: tomorrow,
          },
          isActive: true,
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

    const weeklySales = Number(weeklySalesResult[0]?.total ?? 0);

    /* ---------------------------------------------------------------------- */
    /* Sales Growth                                                           */
    /* ---------------------------------------------------------------------- */

    const previousWeekStart = new Date(weekStart);
    previousWeekStart.setDate(previousWeekStart.getDate() - 7);

    const previousWeekSalesResult = await SalesModel.aggregate([
      {
        $match: {
          saleDate: {
            $gte: previousWeekStart,
            $lt: weekStart,
          },
          isActive: true,
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

    const previousWeekSales = Number(previousWeekSalesResult[0]?.total ?? 0);

    const salesGrowth =
      previousWeekSales === 0
        ? weeklySales > 0
          ? 100
          : 0
        : ((weeklySales - previousWeekSales) / previousWeekSales) * 100;

    /* ---------------------------------------------------------------------- */
    /* Low Stock                                                              */
    /* ---------------------------------------------------------------------- */

    const lowStock = await ProductModel.countDocuments({
      $expr: {
        $lte: ["$stock", "$minimumStock"],
      },
      isActive: true,
    });

    const lowStockProductsRaw = await ProductModel.find({
      $expr: {
        $lte: ["$stock", "$minimumStock"],
      },
      isActive: true,
    })
      .select("_id name stock minimumStock")
      .sort({
        stock: 1,
      })
      .limit(5)
      .lean();

    const lowStockProducts = lowStockProductsRaw.map((product) => ({
      id: product._id.toString(),
      name: product.name,
      stock: Number(product.stock ?? 0),
      minStock: Number(product.minimumStock ?? 0),
    }));

    /* ---------------------------------------------------------------------- */
    /* Sales Chart                                                            */
    /* ---------------------------------------------------------------------- */

    const salesChartRaw = await SalesModel.aggregate([
      {
        $match: {
          saleDate: {
            $gte: weekStart,
            $lt: tomorrow,
          },
          isActive: true,
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

    const salesChart = salesChartRaw.map((item) => ({
      day: item._id,
      sales: Number(item.sales ?? 0),
    }));

    /* ---------------------------------------------------------------------- */
    /* Recent Activities                                                      */
    /* ---------------------------------------------------------------------- */

    const recentSales = await SalesModel.find({
      isActive: true,
    })
      .sort({
        createdAt: -1,
      })
      .limit(5)
      .lean();

    const recentActivities = recentSales.map((sale) => ({
      id: sale._id.toString(),

      title: "Sale Completed",

      subtitle: sale.invoiceNo || sale.saleNo || "Sale",

      value: `₹${Number(sale.grandTotal ?? 0).toLocaleString("en-IN")}`,

      time: new Date(sale.createdAt).toLocaleString("en-IN", {
        day: "2-digit",
        month: "short",
        hour: "2-digit",
        minute: "2-digit",
      }),

      type: "SALE" as const,
    }));

    /* ---------------------------------------------------------------------- */
    /* Insights                                                               */
    /* ---------------------------------------------------------------------- */

    const insights: {
      id: string;
      title: string;
      description: string;
      type: "SUCCESS" | "WARNING" | "BEST_SELLER" | "SUGGESTION";
    }[] = [];

    if (todaySales > 0) {
      insights.push({
        id: "today-sales",
        title: "Today's Sales",
        description: `Today's sales reached ₹${todaySales.toLocaleString(
          "en-IN",
        )}.`,
        type: "SUCCESS",
      });
    }

    if (lowStock > 0) {
      insights.push({
        id: "low-stock",
        title: "Low Stock Alert",
        description: `${lowStock} products need restocking.`,
        type: "WARNING",
      });
    }

    if (outstandingPayments > 0) {
      insights.push({
        id: "outstanding",
        title: "Outstanding Payments",
        description: `₹${outstandingPayments.toLocaleString(
          "en-IN",
        )} is pending collection.`,
        type: "SUGGESTION",
      });
    }

    if (monthlyRevenue > 0) {
      insights.push({
        id: "monthly-revenue",
        title: "Monthly Revenue",
        description: `Monthly revenue is ₹${monthlyRevenue.toLocaleString(
          "en-IN",
        )}.`,
        type: "BEST_SELLER",
      });
    }

    /* ---------------------------------------------------------------------- */
    /* Counts                                                                 */
    /* ---------------------------------------------------------------------- */

    const [totalProducts, totalCustomers, totalSuppliers, totalSales] =
      await Promise.all([
        ProductModel.countDocuments({
          isActive: true,
        }),

        CustomerModel.countDocuments({
          isActive: true,
        }),

        SupplierModel.countDocuments({
          isActive: true,
        }),

        SalesModel.countDocuments({
          isActive: true,
        }),
      ]);

    /* ---------------------------------------------------------------------- */
    /* Return                                                                 */
    /* ---------------------------------------------------------------------- */

    return {
      business,

      totalProducts,
      totalCustomers,
      totalSuppliers,
      totalSales,

      todaySales,
      todayProfit,

      monthlyRevenue,

      outstandingPayments,

      weeklySales,
      salesGrowth,

      lowStock,

      salesChart,

      lowStockProducts,

      recentActivities,

      insights,
    };
  }
}

export default new DashboardRepository();
