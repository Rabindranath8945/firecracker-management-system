export interface DashboardSummary {
  business: {
    name: string;
    businessId: string;
  };

  owner: {
    name: string;
    role: string;
  };

  todaySales: number;
  todayProfit: number;

  monthlyRevenue: number;
  outstandingPayments: number;

  totalCustomers: number;
  lowStock: number;

  weeklySales: number;
  salesGrowth: number;

  salesChart: SalesChartItem[];

  lowStockProducts: LowStockProduct[];

  recentActivities: RecentActivity[];

  insights: BusinessInsight[];
}

export interface SalesChartItem {
  day: string;
  sales: number;
}

export interface LowStockProduct {
  id: string;
  name: string;
  stock: number;
  minStock: number;
}

export interface RecentActivity {
  id: string;
  title: string;
  subtitle: string;
  value?: string;
  time: string;
  type: "SALE" | "PURCHASE" | "STOCK" | "LOGIN";
}

export interface BusinessInsight {
  id: string;
  title: string;
  description: string;
  type: "SUCCESS" | "WARNING" | "BEST_SELLER" | "SUGGESTION";
}
