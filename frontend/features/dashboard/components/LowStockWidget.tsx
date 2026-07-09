"use client";

import { TriangleAlert } from "lucide-react";
import DashboardWidget from "./DashboardWidget";

const items = [
  {
    id: 1,
    name: "Rocket Bomb",
    stock: 2,
  },
  {
    id: 2,
    name: "Flower Pot",
    stock: 4,
  },
  {
    id: 3,
    name: "Sparklers",
    stock: 5,
  },
];

export default function LowStockWidget() {
  return (
    <DashboardWidget title="Low Stock" subtitle="Products that need restocking">
      <div className="space-y-3">
        {items.map((item) => (
          <div
            key={item.id}
            className="flex items-center justify-between rounded-xl border border-slate-200 p-3 transition hover:bg-slate-50"
          >
            <div className="flex items-center gap-3">
              <div className="rounded-xl bg-orange-100 p-2 text-orange-600">
                <TriangleAlert size={18} />
              </div>

              <div>
                <p className="font-medium">{item.name}</p>

                <p className="text-xs text-slate-500">Critical Stock</p>
              </div>
            </div>

            <div className="rounded-full bg-red-100 px-3 py-1 text-sm font-semibold text-red-600">
              {item.stock}
            </div>
          </div>
        ))}
      </div>
    </DashboardWidget>
  );
}
