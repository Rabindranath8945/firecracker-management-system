"use client";

import Link from "next/link";
import { ArrowRight, PackageX, TriangleAlert } from "lucide-react";

import DashboardWidget from "./DashboardWidget";
import { Button } from "@/components/ui/button";

import type { DashboardSummary } from "../types/dashboard.type";

interface LowStockWidgetProps {
  dashboard: DashboardSummary;
}

export default function LowStockWidget({ dashboard }: LowStockWidgetProps) {
  const lowStockProducts = dashboard.lowStockProducts ?? [];

  return (
    <DashboardWidget
      title="Low Stock Products"
      subtitle={
        lowStockProducts.length === 0
          ? "Inventory is healthy"
          : `${lowStockProducts.length} product${
              lowStockProducts.length !== 1 ? "s" : ""
            } require attention`
      }
    >
      {/* ------------------------------------------------------------------ */}
      {/* EMPTY STATE                                                        */}
      {/* ------------------------------------------------------------------ */}

      {lowStockProducts.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-10 text-center">
          <div
            className="
              flex
              h-16
              w-16
              items-center
              justify-center
              rounded-3xl
              bg-emerald-100
              dark:bg-emerald-500/10
            "
          >
            <PackageX className="h-8 w-8 text-emerald-600 dark:text-emerald-400" />
          </div>

          <h3 className="mt-5 text-lg font-semibold text-slate-900 dark:text-foreground">
            Inventory looks healthy
          </h3>

          <p className="mt-2 max-w-xs text-sm leading-6 text-slate-500 dark:text-muted-foreground">
            No products are currently below the minimum stock level.
          </p>
        </div>
      ) : (
        /* ---------------------------------------------------------------- */
        /* PRODUCT LIST                                                     */
        /* ---------------------------------------------------------------- */

        <div className="space-y-3">
          {lowStockProducts.map((item) => {
            const stock = Number(item.stock ?? 0);

            const minStock = Number(item.minStock ?? 0);

            const percentage =
              minStock > 0 ? Math.min((stock / minStock) * 100, 100) : 0;

            const isOutOfStock = stock <= 0;

            return (
              <div
                key={item.id}
                className="
                  rounded-3xl
                  border
                  border-slate-200
                  bg-white
                  p-4
                  transition-all
                  duration-300
                  hover:-translate-y-0.5
                  hover:border-amber-200
                  hover:shadow-md
                  dark:border-border
                  dark:bg-card
                "
              >
                {/* Product Header */}

                <div className="flex items-start justify-between gap-3">
                  <div className="flex min-w-0 gap-3">
                    <div
                      className="
                        flex
                        h-11
                        w-11
                        shrink-0
                        items-center
                        justify-center
                        rounded-2xl
                        bg-amber-100
                        dark:bg-amber-500/10
                      "
                    >
                      <TriangleAlert className="h-5 w-5 text-amber-600 dark:text-amber-400" />
                    </div>

                    <div className="min-w-0">
                      <h3 className="truncate font-semibold text-slate-900 dark:text-foreground">
                        {item.name}
                      </h3>

                      <p className="mt-1 text-xs text-slate-500 dark:text-muted-foreground">
                        Current Stock{" "}
                        <span
                          className={
                            isOutOfStock
                              ? "font-bold text-red-600"
                              : "font-semibold text-amber-600"
                          }
                        >
                          {stock}
                        </span>{" "}
                        / {minStock}
                      </p>
                    </div>
                  </div>

                  {/* Status */}

                  <span
                    className={`
                      shrink-0
                      rounded-full
                      px-2.5
                      py-1
                      text-[10px]
                      font-bold
                      uppercase
                      tracking-wide
                      ${
                        isOutOfStock
                          ? "bg-red-100 text-red-600 dark:bg-red-500/10 dark:text-red-400"
                          : "bg-amber-100 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400"
                      }
                    `}
                  >
                    {isOutOfStock ? "Out of Stock" : "Low Stock"}
                  </span>
                </div>

                {/* Stock Progress */}

                <div className="mt-4">
                  <div className="mb-2 flex items-center justify-between text-xs text-slate-500 dark:text-muted-foreground">
                    <span>Stock Level</span>

                    <span className="font-semibold">
                      {Math.round(percentage)}%
                    </span>
                  </div>

                  <div className="h-2 overflow-hidden rounded-full bg-slate-100 dark:bg-muted">
                    <div
                      className={`
                        h-full
                        rounded-full
                        transition-all
                        duration-500
                        ${isOutOfStock ? "bg-red-500" : "bg-amber-500"}
                      `}
                      style={{
                        width: `${percentage}%`,
                      }}
                    />
                  </div>
                </div>

                {/* Restock */}

                <Link href={`/products/${item.id}`} className="block">
                  <Button
                    type="button"
                    variant="outline"
                    className="
                      mt-4
                      h-10
                      w-full
                      rounded-2xl
                      text-xs
                      font-semibold
                      transition-all
                      hover:border-amber-300
                      hover:bg-amber-50
                      hover:text-amber-700
                      dark:hover:bg-amber-500/10
                    "
                  >
                    Restock Product
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </div>
            );
          })}
        </div>
      )}
    </DashboardWidget>
  );
}
