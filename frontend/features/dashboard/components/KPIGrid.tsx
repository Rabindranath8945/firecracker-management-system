"use client";

import KPIStatCard from "./KPIStatCard";

import { KPI_STATS } from "../constants/dashboard.constants";

import type { DashboardSummary } from "../types/dashboard.type";

interface KPIGridProps {
  dashboard: DashboardSummary;
}

export default function KPIGrid({ dashboard }: KPIGridProps) {
  return (
    <section className="grid grid-cols-2 gap-4 xl:grid-cols-3">
      {KPI_STATS.map((item) => {
        let value = "";

        switch (item.key) {
          case "todaySales":
            value = `₹${dashboard.todaySales.toLocaleString("en-IN")}`;
            break;

          case "todayProfit":
            value = `₹${dashboard.todayProfit.toLocaleString("en-IN")}`;
            break;

          case "monthlyRevenue":
            value = `₹${dashboard.monthlyRevenue.toLocaleString("en-IN")}`;
            break;

          case "outstandingPayments":
            value = `₹${dashboard.outstandingPayments.toLocaleString("en-IN")}`;
            break;

          case "totalCustomers":
            value = dashboard.totalCustomers.toLocaleString("en-IN");
            break;

          case "lowStock":
            value = dashboard.lowStock.toLocaleString("en-IN");
            break;

          default:
            value = "";
        }

        return (
          <KPIStatCard
            key={item.key}
            title={item.title}
            value={value}
            icon={item.icon}
            color={item.color}
          />
        );
      })}
    </section>
  );
}
