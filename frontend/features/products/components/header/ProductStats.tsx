"use client";

import { Package, CircleCheckBig, TriangleAlert, PackageX } from "lucide-react";

interface ProductStatsProps {
  stats: {
    total: number;
    inStock: number;
    lowStock: number;
    outOfStock: number;
  };
}

export default function ProductStats({ stats }: ProductStatsProps) {
  const cards = [
    {
      title: "Products",
      value: stats.total,
      icon: Package,
      bg: "bg-sky-100",
      text: "text-sky-600",
    },
    {
      title: "In Stock",
      value: stats.inStock,
      icon: CircleCheckBig,
      bg: "bg-emerald-100",
      text: "text-emerald-600",
    },
    {
      title: "Low Stock",
      value: stats.lowStock,
      icon: TriangleAlert,
      bg: "bg-amber-100",
      text: "text-amber-600",
    },
    {
      title: "Out Stock",
      value: stats.outOfStock,
      icon: PackageX,
      bg: "bg-red-100",
      text: "text-red-600",
    },
  ];

  return (
    <section className="grid grid-cols-2 gap-3">
      {cards.map((card) => {
        const Icon = card.icon;

        return (
          <div
            key={card.title}
            className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm transition-all duration-200 hover:border-sky-200 hover:shadow-md"
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs font-medium text-slate-500">
                  {card.title}
                </p>

                <h3 className="mt-2 text-2xl font-bold text-slate-900">
                  {card.value.toLocaleString("en-IN")}
                </h3>
              </div>

              <div
                className={`flex h-11 w-11 items-center justify-center rounded-2xl ${card.bg}`}
              >
                <Icon className={`h-5 w-5 ${card.text}`} />
              </div>
            </div>
          </div>
        );
      })}
    </section>
  );
}
