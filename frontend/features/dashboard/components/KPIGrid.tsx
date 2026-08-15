"use client";

import KPIStatCard from "./KPIStatCard";

import { KPI_STATS } from "../constants/dashboard.constants";

import type { DashboardSummary } from "../types/dashboard.type";

interface KPIGridProps {
  dashboard: DashboardSummary;
}

function formatCurrency(value: number) {
  return `₹${Number(value ?? 0).toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

function formatNumber(value: number) {
  return Number(value ?? 0).toLocaleString("en-IN");
}

export default function KPIGrid({ dashboard }: KPIGridProps) {
  return (
    <section
      className="
        grid
        grid-cols-2
        gap-3
        sm:gap-4
        xl:grid-cols-3
      "
    >
      {KPI_STATS.map((item) => {
        let value = "";

        switch (item.key) {
          case "todaySales":
            value = formatCurrency(dashboard.todaySales);
            break;

          case "todayProfit":
            value = formatCurrency(dashboard.todayProfit);
            break;

          case "monthlyRevenue":
            value = formatCurrency(dashboard.monthlyRevenue);
            break;

          case "outstandingPayments":
            value = formatCurrency(dashboard.outstandingPayments);
            break;

          case "totalCustomers":
            value = formatNumber(dashboard.totalCustomers);
            break;

          case "lowStock":
            value = formatNumber(dashboard.lowStock);
            break;

          default:
            value = "₹0.00";
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
