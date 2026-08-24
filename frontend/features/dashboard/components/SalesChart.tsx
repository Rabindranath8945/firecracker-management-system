"use client";

import AppCard from "@/components/layout/AppCard";

import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import type { DashboardSummary } from "../types/dashboard.type";

interface SalesChartProps {
  dashboard: DashboardSummary;
}

function formatCurrency(value: number) {
  return `₹${Number(value ?? 0).toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

export default function SalesChart({ dashboard }: SalesChartProps) {
  const salesChart = dashboard.salesChart ?? [];

  const weeklySales = Number(dashboard.weeklySales ?? 0);

  const salesGrowth = Number(dashboard.salesGrowth ?? 0);

  const hasSalesData = salesChart.some((item) => Number(item.sales ?? 0) > 0);

  return (
    <AppCard
      className="
        rounded-3xl
        border
        border-slate-200
        bg-white
        p-5
        shadow-sm
        dark:border-border
        dark:bg-card
        sm:p-6
      "
    >
      {/* ------------------------------------------------------------------ */}
      {/* Header                                                             */}
      {/* ------------------------------------------------------------------ */}

      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-foreground">
            Sales Overview
          </h2>

          <p className="mt-1 text-sm text-slate-500 dark:text-muted-foreground">
            Performance over the last 7 days
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* Weekly Sales */}

          <div
            className="
              rounded-2xl
              bg-sky-50
              px-3
              py-2
              dark:bg-sky-500/10
            "
          >
            <p className="text-[10px] font-medium text-slate-500 dark:text-muted-foreground">
              7 Days
            </p>

            <p className="text-base font-bold text-sky-700 dark:text-sky-400">
              {formatCurrency(weeklySales)}
            </p>
          </div>

          {/* Growth */}

          <div
            className={`
              rounded-full
              px-3
              py-1.5
              text-xs
              font-bold
              ${
                salesGrowth >= 0
                  ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400"
                  : "bg-red-100 text-red-700 dark:bg-red-500/10 dark:text-red-400"
              }
            `}
          >
            {salesGrowth >= 0 ? "↑" : "↓"} {Math.abs(salesGrowth).toFixed(1)}%
          </div>
        </div>
      </div>

      {/* ------------------------------------------------------------------ */}
      {/* Chart                                                              */}
      {/* ------------------------------------------------------------------ */}

      <div className="h-72 w-full sm:h-80">
        {!hasSalesData ? (
          <div className="flex h-full flex-col items-center justify-center">
            <div
              className="
                flex
                h-12
                w-12
                items-center
                justify-center
                rounded-2xl
                bg-slate-100
                text-slate-400
                dark:bg-muted
              "
            >
              <span className="text-xl">₹</span>
            </div>

            <p className="mt-3 text-sm font-semibold text-slate-700 dark:text-foreground">
              No sales data yet
            </p>

            <p className="mt-1 text-xs text-slate-500 dark:text-muted-foreground">
              Sales from the last 7 days will appear here.
            </p>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={salesChart}
              margin={{
                top: 10,
                right: 8,
                left: 0,
                bottom: 0,
              }}
            >
              <defs>
                <linearGradient id="salesGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.35} />

                  <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0} />
                </linearGradient>
              </defs>

              <CartesianGrid
                vertical={false}
                stroke="#e2e8f0"
                strokeDasharray="4 4"
              />

              <XAxis
                dataKey="day"
                tickLine={false}
                axisLine={false}
                tick={{
                  fill: "#64748b",
                  fontSize: 12,
                }}
              />

              <YAxis
                tickLine={false}
                axisLine={false}
                width={45}
                tick={{
                  fill: "#94a3b8",
                  fontSize: 11,
                }}
                tickFormatter={(value: number) =>
                  `₹${Number(value).toLocaleString("en-IN")}`
                }
              />

              <Tooltip
                cursor={{
                  stroke: "#0ea5e9",
                  strokeWidth: 1,
                  strokeDasharray: "4 4",
                }}
                contentStyle={{
                  borderRadius: 16,
                  border: "1px solid #e2e8f0",
                  background: "white",
                  boxShadow: "0 10px 25px rgba(15,23,42,0.08)",
                }}
                formatter={(value) => [
                  formatCurrency(Number(value ?? 0)),
                  "Sales",
                ]}
              />

              <Area
                type="monotone"
                dataKey="sales"
                stroke="#0284c7"
                strokeWidth={3}
                fill="url(#salesGradient)"
                dot={{
                  r: 3,
                  fill: "#0284c7",
                  strokeWidth: 0,
                }}
                activeDot={{
                  r: 6,
                  strokeWidth: 2,
                  stroke: "#fff",
                }}
                animationDuration={900}
              />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </div>
    </AppCard>
  );
}
