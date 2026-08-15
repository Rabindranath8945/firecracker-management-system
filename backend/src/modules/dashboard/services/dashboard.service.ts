import DashboardRepository from "../repositories/dashboard.repository.js";

class DashboardService {
  async getDashboard(ownerId: string) {
    const data = await DashboardRepository.getDashboard(ownerId);

    return {
      /* ---------------------------------------------------------------------- */
      /* Business                                                               */
      /* ---------------------------------------------------------------------- */

      business: {
        name: data.business?.name ?? "My Business",
        businessId: data.business?.businessId ?? "-",
      },

      owner: {
        name: "Owner",
      },

      /* ---------------------------------------------------------------------- */
      /* KPI                                                                    */
      /* ---------------------------------------------------------------------- */

      todaySales: Number(data.todaySales ?? 0),

      todayProfit: Number(data.todayProfit ?? 0),

      monthlyRevenue: Number(data.monthlyRevenue ?? 0),

      outstandingPayments: Number(data.outstandingPayments ?? 0),

      totalCustomers: Number(data.totalCustomers ?? 0),

      lowStock: Number(data.lowStock ?? 0),

      weeklySales: Number(data.weeklySales ?? 0),

      salesGrowth: Number(data.salesGrowth ?? 0),

      /* ---------------------------------------------------------------------- */
      /* Sales Chart                                                            */
      /* ---------------------------------------------------------------------- */

      salesChart: data.salesChart.map((item) => ({
        day: item.day,
        sales: Number(item.sales ?? 0),
      })),

      /* ---------------------------------------------------------------------- */
      /* Low Stock                                                             */
      /* ---------------------------------------------------------------------- */

      lowStockProducts: data.lowStockProducts.map((product) => ({
        id: product.id,
        name: product.name,
        stock: Number(product.stock ?? 0),
        minStock: Number(product.minStock ?? 0),
      })),

      /* ---------------------------------------------------------------------- */
      /* Recent Activities                                                      */
      /* ---------------------------------------------------------------------- */

      recentActivities: data.recentActivities.map((activity) => ({
        id: activity.id,
        title: activity.title,
        subtitle: activity.subtitle,
        value: activity.value,
        time: activity.time,
        type: activity.type,
      })),

      /* ---------------------------------------------------------------------- */
      /* Business Insights                                                      */
      /* ---------------------------------------------------------------------- */

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
