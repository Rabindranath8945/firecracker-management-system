"use client";

import { Archive, TriangleAlert, TrendingUp, PackageCheck } from "lucide-react";

import type { Product } from "../../types/product.types";

interface ProductSummaryCardProps {
  product: Product;
}

export default function ProductSummaryCard({
  product,
}: ProductSummaryCardProps) {
  const profit = product.sellingPrice - product.purchasePrice;

  const lowStock = product.stock <= product.minimumStock;

  const items = [
    {
      title: "Available",
      value: `${product.stock}`,
      subtitle: product.unit,
      icon: Archive,
      color: "text-sky-600",
      bg: "bg-sky-50",
    },
    {
      title: "Minimum",
      value: `${product.minimumStock}`,
      subtitle: product.unit,
      icon: TriangleAlert,
      color: lowStock ? "text-red-600" : "text-amber-600",
      bg: lowStock ? "bg-red-50" : "bg-amber-50",
    },
    {
      title: "Profit / Unit",
      value: `₹${profit}`,
      subtitle: "Per Item",
      icon: TrendingUp,
      color: "text-emerald-600",
      bg: "bg-emerald-50",
    },
    {
      title: "Status",
      value: product.isActive ? "Active" : "Inactive",
      subtitle: lowStock ? "Low Stock" : "Healthy",
      icon: PackageCheck,
      color: product.isActive ? "text-violet-600" : "text-slate-500",
      bg: "bg-violet-50",
    },
  ];

  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-4">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h2 className="text-base font-semibold text-slate-900">
            Quick Analytics
          </h2>

          <p className="text-xs text-slate-500">Inventory overview</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {items.map((item) => {
          const Icon = item.icon;

          return (
            <div
              key={item.title}
              className="rounded-2xl border border-slate-100 bg-slate-50 p-4 transition-all hover:border-sky-100"
            >
              <div
                className={`flex h-10 w-10 items-center justify-center rounded-xl ${item.bg}`}
              >
                <Icon className={`h-5 w-5 ${item.color}`} />
              </div>

              <p className="mt-4 text-xs text-slate-500">{item.title}</p>

              <h3 className="mt-1 text-xl font-bold text-slate-900">
                {item.value}
              </h3>

              <p className="mt-1 text-xs text-slate-400">{item.subtitle}</p>
            </div>
          );
        })}
      </div>
    </section>
  );
}
