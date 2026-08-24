import DashboardRepository from "../repositories/dashboard.repository.js";
import UserService from "../../user/services/user.service.js";

class DashboardService {
  async getDashboard(userId: string) {
    /* ---------------------------------------------------------------------- */
    /* Current User                                                           */
    /* ---------------------------------------------------------------------- */

    const user = await UserService.getCurrentUser(userId);

    /*
     * DashboardRepository currently works with the business owner ID.
     *
     * OWNER:
     *   user._id is the owner.
     *
     * EMPLOYEE:
     *   user.owner points to the business owner.
     */
    const businessOwnerId =
      user.role === "OWNER" ? user._id.toString() : user.owner?.toString();

    if (!businessOwnerId) {
      throw new Error("Business owner not found.");
    }

    const data = await DashboardRepository.getDashboard(businessOwnerId);

    /* ---------------------------------------------------------------------- */
    /* User Name                                                              */
    /* ---------------------------------------------------------------------- */

    const userName =
      `${user.firstName} ${user.lastName}`.trim() ||
      user.email.split("@")[0] ||
      "User";

    return {
      /* -------------------------------------------------------------------- */
      /* Business                                                             */
      /* -------------------------------------------------------------------- */

      business: {
        name: data.business?.name ?? "My Business",
        businessId: data.business?.businessId ?? "-",
      },

      /* -------------------------------------------------------------------- */
      /* Current User                                                         */
      /* -------------------------------------------------------------------- */

      owner: {
        name: userName,
        role: user.role,
      },

      /* -------------------------------------------------------------------- */
      /* KPI                                                                  */
      /* -------------------------------------------------------------------- */

      todaySales: Number(data.todaySales ?? 0),

      todayProfit: Number(data.todayProfit ?? 0),

      monthlyRevenue: Number(data.monthlyRevenue ?? 0),

      outstandingPayments: Number(data.outstandingPayments ?? 0),

      totalProducts: Number(data.totalProducts ?? 0),

      totalCustomers: Number(data.totalCustomers ?? 0),

      totalSuppliers: Number(data.totalSuppliers ?? 0),

      lowStock: Number(data.lowStock ?? 0),

      weeklySales: Number(data.weeklySales ?? 0),

      salesGrowth: Number(data.salesGrowth ?? 0),

      /* -------------------------------------------------------------------- */
      /* Sales Chart                                                          */
      /* -------------------------------------------------------------------- */

      salesChart: data.salesChart.map((item) => ({
        day: item.day,
        sales: Number(item.sales ?? 0),
      })),

      /* -------------------------------------------------------------------- */
      /* Low Stock                                                            */
      /* -------------------------------------------------------------------- */

      lowStockProducts: data.lowStockProducts.map((product) => ({
        id: product.id,
        name: product.name,
        stock: Number(product.stock ?? 0),
        minStock: Number(product.minStock ?? 0),
      })),

      /* -------------------------------------------------------------------- */
      /* Recent Activities                                                    */
      /* -------------------------------------------------------------------- */

      recentActivities: data.recentActivities.map((activity) => ({
        id: activity.id,
        title: activity.title,
        subtitle: activity.subtitle,
        value: activity.value,
        time: activity.time,
        type: activity.type,
      })),

      /* -------------------------------------------------------------------- */
      /* Business Insights                                                    */
      /* -------------------------------------------------------------------- */

      insights: data.insights.map((insight) => ({
        id: insight.id,
        title: insight.title,
        description: insight.description,
        type: insight.type,
      })),
    };
  }
}

export default new DashboardService();
