"use client";

import {
  IndianRupee,
  Boxes,
  TriangleAlert,
  Users,
  Package,
} from "lucide-react";

import KPIStatCard from "./KPIStatCard";

interface KPIGridProps {
  todaySales: number;
  todayProfit: number;
  totalProducts: number;
  lowStock: number;
  totalCustomers: number;
  totalSuppliers: number;
}

export default function KPIGrid({
  todaySales,
  todayProfit,
  totalProducts,
  lowStock,
  totalCustomers,
  totalSuppliers,
}: KPIGridProps) {
  const stats = [
    {
      title: "Today's Sales",
      value: `₹${todaySales.toLocaleString("en-IN")}`,
      icon: IndianRupee,
      color: "sky" as const,
      trend: "+12%",
    },
    {
      title: "Today's Profit",
      value: `₹${todayProfit.toLocaleString("en-IN")}`,
      icon: IndianRupee,
      color: "emerald" as const,
      trend: "+8%",
    },
    {
      title: "Products",
      value: totalProducts.toLocaleString(),
      icon: Boxes,
      color: "violet" as const,
    },
    {
      title: "Low Stock",
      value: lowStock.toLocaleString(),
      icon: TriangleAlert,
      color: "amber" as const,
    },
    {
      title: "Customers",
      value: totalCustomers.toLocaleString(),
      icon: Users,
      color: "blue" as const,
    },
    {
      title: "Suppliers",
      value: totalSuppliers.toLocaleString(),
      icon: Package,
      color: "indigo" as const,
    },
  ];

  return (
    <section className="grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-6">
      {stats.map((stat) => (
        <KPIStatCard
          key={stat.title}
          title={stat.title}
          value={stat.value}
          icon={stat.icon}
          color={stat.color}
          {...(stat.trend && { trend: stat.trend })}
        />
      ))}
    </section>
  );
}
