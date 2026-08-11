"use client";

import ExecutiveHero from "@/features/dashboard/components/ExecutiveHero";
import KPIGrid from "@/features/dashboard/components/KPIGrid";
import QuickActions from "@/features/dashboard/components/QuickActions";
import SalesChart from "@/features/dashboard/components/SalesChart";
import LowStockWidget from "@/features/dashboard/components/LowStockWidget";
import RecentActivityWidget from "@/features/dashboard/components/RecentActivityWidget";
import BusinessInsightsWidget from "@/features/dashboard/components/BusinessInsightsWidget";

import { useDashboard } from "@/features/dashboard/hooks/useDashboard";
import Header from "@/components/layout/Header";

export default function DashboardPage() {
  const { dashboard, loading, error } = useDashboard();

  if (loading) {
    return (
      <div className="flex h-[70vh] items-center justify-center">
        <p className="text-slate-500">Loading dashboard...</p>
      </div>
    );
  }

  if (error || !dashboard) {
    return (
      <div className="flex h-[70vh] items-center justify-center">
        <p className="text-red-500">{error ?? "Unable to load dashboard."}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-4">
      <Header dashboard={dashboard} />
      <ExecutiveHero dashboard={dashboard} />

      <KPIGrid dashboard={dashboard} />

      <QuickActions />

      <SalesChart dashboard={dashboard} />

      <LowStockWidget dashboard={dashboard} />

      <RecentActivityWidget dashboard={dashboard} />

      <BusinessInsightsWidget dashboard={dashboard} />
    </div>
  );
}
