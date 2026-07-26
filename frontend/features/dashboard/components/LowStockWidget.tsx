"use client";

import { ArrowRight, PackageX, TriangleAlert } from "lucide-react";

import DashboardWidget from "./DashboardWidget";
import { Button } from "@/components/ui/button";
import type { LowStockProduct } from "../types/dashboard.type";

interface LowStockWidgetProps {
  products: LowStockProduct[];
}

export default function LowStockWidget({ products }: LowStockWidgetProps) {
  return (
    <DashboardWidget
      title="Low Stock Products"
      subtitle={`${products.length} products require attention`}
    >
      {products.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-10 text-center">
          <div className="rounded-3xl bg-emerald-100 p-5">
            <PackageX className="h-10 w-10 text-emerald-600" />
          </div>

          <h3 className="mt-5 text-lg font-semibold text-slate-900">
            Inventory looks healthy
          </h3>

          <p className="mt-2 max-w-xs text-sm leading-6 text-slate-500">
            No products are currently below the minimum stock level.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {products.map((item) => {
            const percentage = Math.min(
              (item.stock / item.minStock) * 100,
              100,
            );

            return (
              <div
                key={item.id}
                className="rounded-3xl border border-slate-200 bg-white p-5 transition-all hover:border-amber-200 hover:shadow-md"
              >
                <div className="flex items-start justify-between">
                  <div className="flex gap-4">
                    <div className="rounded-2xl bg-amber-100 p-3">
                      <TriangleAlert className="h-6 w-6 text-amber-600" />
                    </div>

                    <div>
                      <h3 className="font-semibold text-slate-900">
                        {item.name}
                      </h3>

                      <p className="mt-1 text-sm text-slate-500">
                        Current Stock:{" "}
                        <span className="font-medium text-red-600">
                          {item.stock}
                        </span>{" "}
                        / {item.minStock}
                      </p>
                    </div>
                  </div>

                  <div className="rounded-full bg-red-100 px-3 py-1 text-xs font-semibold text-red-600">
                    Critical
                  </div>
                </div>

                <div className="mt-5">
                  <div className="mb-2 flex items-center justify-between text-xs text-slate-500">
                    <span>Stock Level</span>

                    <span>{Math.round(percentage)}%</span>
                  </div>

                  <div className="h-2 overflow-hidden rounded-full bg-slate-100">
                    <div
                      className="h-full rounded-full bg-amber-500 transition-all"
                      style={{
                        width: `${percentage}%`,
                      }}
                    />
                  </div>
                </div>

                <Button variant="outline" className="mt-5 w-full rounded-2xl">
                  Restock Product
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            );
          })}
        </div>
      )}
    </DashboardWidget>
  );
}
