"use client";

import AppCard from "@/components/layout/AppCard";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  CartesianGrid,
  Tooltip,
  XAxis,
} from "recharts";

const data = [
  { day: "Mon", sales: 12000 },
  { day: "Tue", sales: 18000 },
  { day: "Wed", sales: 15000 },
  { day: "Thu", sales: 23000 },
  { day: "Fri", sales: 19000 },
  { day: "Sat", sales: 32000 },
  { day: "Sun", sales: 27000 },
];

export default function SalesChart() {
  return (
    <AppCard className="p-5">
      <div className="mb-5 flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold">Sales Overview</h2>

          <p className="text-sm text-slate-500">Last 7 days</p>
        </div>

        <div className="rounded-full bg-red-50 px-3 py-1 text-sm font-medium text-red-600">
          ₹1,46,000
        </div>
      </div>

      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
            <defs>
              <linearGradient id="sales" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#ef4444" stopOpacity={0.4} />

                <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
              </linearGradient>
            </defs>

            <CartesianGrid strokeDasharray="3 3" vertical={false} />

            <XAxis dataKey="day" />

            <Tooltip />

            <Area
              type="monotone"
              dataKey="sales"
              stroke="#dc2626"
              strokeWidth={3}
              fill="url(#sales)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </AppCard>
  );
}
