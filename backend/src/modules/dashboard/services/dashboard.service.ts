import DashboardRepository from "../repositories/dashboard.repository.js";

class DashboardService {
  async getDashboard(ownerId: string) {
    const data = await DashboardRepository.getDashboard(ownerId);

    return {
      /* ---------------------------------------------------------------------- */
      /* Business                                                                */
      /* ---------------------------------------------------------------------- */

      business: {
        name: data.business?.name ?? "My Business",
        businessId: data.business?.businessId ?? "-",
      },

      owner: {
        name: "Owner",
      },

      /* ---------------------------------------------------------------------- */
      /* KPI                                                                     */
      /* ---------------------------------------------------------------------- */

      todaySales: data.todaySales,
      todayProfit: data.todayProfit,
      monthlyProfit: data.monthlyProfit,

      monthlyRevenue: data.monthlyRevenue,
      outstandingPayments: 0,

      totalCustomers: data.totalCustomers,
      lowStock: data.lowStock,

      weeklySales: 0,
      salesGrowth: 0,

      /* ---------------------------------------------------------------------- */
      /* Sales Chart                                                             */
      /* ---------------------------------------------------------------------- */

      salesChart: [],

      /* ---------------------------------------------------------------------- */
      /* Dashboard Widgets                                                       */
      /* ---------------------------------------------------------------------- */

      lowStockProducts: [],

      recentActivities: [],

      insights: [],
    };
  }
}

export default new DashboardService();
