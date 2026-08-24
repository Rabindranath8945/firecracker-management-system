export interface DashboardBusiness {
  name: string;
  businessId: string;
}

export interface DashboardOwner {
  name: string;
}

export interface DashboardSalesChartItem {
  day: string;
  sales: number;
}

export interface DashboardLowStockProduct {
  id: string;
  name: string;
  stock: number;
  minStock: number;
}

export interface DashboardRecentActivity {
  id: string;
  title: string;
  subtitle: string;
  value?: string;
  time: string;
  type: "SALE" | "PURCHASE" | "STOCK" | "LOGIN";
}

export interface DashboardBusinessInsight {
  id: string;
  title: string;
  description: string;
  type: "SUCCESS" | "WARNING" | "BEST_SELLER" | "SUGGESTION";
}

/* -------------------------------------------------------------------------- */
/* Dashboard Data                                                             */
/* -------------------------------------------------------------------------- */

export interface DashboardData {
  business: DashboardBusiness | null;

  totalProducts: number;
  totalCustomers: number;
  totalSuppliers: number;
  totalSales: number;

  todaySales: number;
  todayProfit: number;

  monthlyRevenue: number;

  outstandingPayments: number;

  weeklySales: number;
  salesGrowth: number;

  lowStock: number;

  salesChart: DashboardSalesChartItem[];

  lowStockProducts: DashboardLowStockProduct[];

  recentActivities: DashboardRecentActivity[];

  insights: DashboardBusinessInsight[];
}

/* -------------------------------------------------------------------------- */
/* Dashboard Response                                                        */
/* -------------------------------------------------------------------------- */

export interface DashboardSummary {
  business: DashboardBusiness;

  owner: DashboardOwner;

  todaySales: number;
  todayProfit: number;

  monthlyRevenue: number;
  outstandingPayments: number;

  totalCustomers: number;
  lowStock: number;

  weeklySales: number;
  salesGrowth: number;

  salesChart: DashboardSalesChartItem[];

  lowStockProducts: DashboardLowStockProduct[];

  recentActivities: DashboardRecentActivity[];

  insights: DashboardBusinessInsight[];
}
