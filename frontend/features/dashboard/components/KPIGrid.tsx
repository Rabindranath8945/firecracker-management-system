"use client";

import { IndianRupee, Package, Boxes, TriangleAlert } from "lucide-react";

import KPIStatCard from "./KPIStatCard";

interface KPIGridProps {
  todaySales: number;
  todayProfit: number;
  totalProducts: number;
  lowStock: number;
}

export default function KPIGrid({
  todaySales,
  todayProfit,
  totalProducts,
  lowStock,
}: KPIGridProps) {
  return (
    <div className="grid grid-cols-2 gap-4">
      <KPIStatCard
        title="Today's Sales"
        value={`₹${todaySales.toLocaleString()}`}
        icon={IndianRupee}
        change="+12%"
        positive
        iconBgClass="bg-blue-100"
        iconTextClass="text-blue-600"
      />

      <KPIStatCard
        title="Today's Profit"
        value={`₹${todayProfit.toLocaleString()}`}
        icon={IndianRupee}
        change="+8%"
        positive
        iconBgClass="bg-emerald-100"
        iconTextClass="text-emerald-600"
      />

      <KPIStatCard
        title="Products"
        value={totalProducts.toString()}
        icon={Boxes}
        iconBgClass="bg-violet-100"
        iconTextClass="text-violet-600"
      />

      <KPIStatCard
        title="Low Stock"
        value={lowStock.toString()}
        icon={TriangleAlert}
        iconBgClass="bg-orange-100"
        iconTextClass="text-orange-600"
      />
    </div>
  );
}
