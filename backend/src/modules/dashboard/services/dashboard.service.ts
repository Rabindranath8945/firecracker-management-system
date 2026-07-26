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

      todaySales: 0,
      todayProfit: 0,
      weeklySales: 0,
      salesGrowth: 0,

      totalProducts: data.totalProducts,
      totalCustomers: data.totalCustomers,
      totalSuppliers: data.totalSuppliers,
      lowStock: 0,

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
