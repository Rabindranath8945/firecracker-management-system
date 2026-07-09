import BusinessInsightsWidget from "@/features/dashboard/components/BusinessInsightsWidget";
import ExecutiveHero from "@/features/dashboard/components/ExecutiveHero";
import KPIGrid from "@/features/dashboard/components/KPIGrid";
import LowStockWidget from "@/features/dashboard/components/LowStockWidget";
import QuickActions from "@/features/dashboard/components/QuickActions";
import RecentActivityWidget from "@/features/dashboard/components/RecentActivityWidget";
import SalesChart from "@/features/dashboard/components/SalesChart";

export default function DashboardPage() {
  return (
    <div className="space-y-5 p-4">
      <ExecutiveHero
        userName="Rabindranath"
        todaySales={12450}
        todayProfit={3820}
        monthlyRevenue={285400}
      />
      <KPIGrid
        todaySales={12450}
        todayProfit={3820}
        totalProducts={486}
        lowStock={12}
      />
      <QuickActions />
      <SalesChart />
      <LowStockWidget />
      <RecentActivityWidget />
      <BusinessInsightsWidget />
    </div>
  );
}
