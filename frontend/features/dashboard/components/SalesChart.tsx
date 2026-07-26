"use client";

import AppCard from "@/components/layout/AppCard";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
} from "recharts";

import type { SalesChartItem } from "../types/dashboard.type";

interface SalesChartProps {
  data: SalesChartItem[];
  totalSales: number;
  growth: number;
}
export default function SalesChart({
  data,
  totalSales,
  growth,
}: SalesChartProps) {
  const total = data.reduce((sum, item) => sum + item.sales, 0);

  return (
    <AppCard className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="mb-8 flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Sales Overview</h2>

          <p className="mt-1 text-sm text-slate-500">
            Performance over the last 7 days
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="rounded-2xl bg-sky-50 px-4 py-2">
            <p className="text-xs text-slate-500">Total Sales</p>

            <p className="text-lg font-bold text-sky-700">
              ₹{total.toLocaleString("en-IN")}
            </p>
          </div>

          <div className="rounded-full bg-emerald-100 px-3 py-1 text-sm font-semibold text-emerald-700">
            ↑ {growth}%
          </div>
        </div>
      </div>

      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={data}
            margin={{
              left: 10,
              right: 10,
              top: 10,
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
                fontSize: 13,
              }}
            />

            <Tooltip
              cursor={{
                stroke: "#0ea5e9",
                strokeWidth: 1,
              }}
              contentStyle={{
                borderRadius: 16,
                border: "1px solid #e2e8f0",
                boxShadow: "0 10px 25px rgba(15,23,42,0.08)",
              }}
              formatter={(value) => [
                `₹{totalSales.toLocaleString("en-IN")}`,
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
                r: 4,
                fill: "#0284c7",
              }}
              activeDot={{
                r: 6,
              }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </AppCard>
  );
}
