"use client";

import { Archive, CircleCheckBig, CircleX, TriangleAlert } from "lucide-react";

import type { Product } from "../../types/product.types";

interface ProductStockCardProps {
  product: Product;
}

export default function ProductStockCard({ product }: ProductStockCardProps) {
  const outOfStock = product.stock === 0;

  const lowStock = product.stock > 0 && product.stock <= product.minimumStock;

  const status = outOfStock
    ? {
        label: "Out of Stock",
        color: "text-red-600",
        bg: "bg-red-50",
        icon: CircleX,
      }
    : lowStock
      ? {
          label: "Low Stock",
          color: "text-amber-600",
          bg: "bg-amber-50",
          icon: TriangleAlert,
        }
      : {
          label: "Healthy Stock",
          color: "text-emerald-600",
          bg: "bg-emerald-50",
          icon: CircleCheckBig,
        };

  const StatusIcon = status.icon;

  const percentage = Math.min(
    100,
    Math.round(
      (product.stock / Math.max(product.minimumStock * 3, product.stock, 1)) *
        100,
    ),
  );

  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-5">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-base font-semibold text-slate-900">Inventory</h2>

          <p className="text-xs text-slate-500">Current stock overview</p>
        </div>

        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-sky-50">
          <Archive className="h-5 w-5 text-sky-600" />
        </div>
      </div>

      {/* Quantity */}

      <div className="mt-6 flex items-end justify-between">
        <div>
          <p className="text-sm text-slate-500">Available Quantity</p>

          <h3 className="mt-1 text-4xl font-bold text-slate-900">
            {product.stock}
          </h3>

          <p className="text-sm text-slate-500">{product.unit}</p>
        </div>

        <div
          className={`flex items-center gap-2 rounded-full px-3 py-2 text-sm font-semibold ${status.bg} ${status.color}`}
        >
          <StatusIcon className="h-4 w-4" />

          {status.label}
        </div>
      </div>

      {/* Progress */}

      <div className="mt-6">
        <div className="mb-2 flex justify-between text-xs text-slate-500">
          <span>Stock Health</span>

          <span>{percentage}%</span>
        </div>

        <div className="h-2 overflow-hidden rounded-full bg-slate-100">
          <div
            style={{ width: `${percentage}%` }}
            className={`h-full rounded-full ${
              outOfStock
                ? "bg-red-500"
                : lowStock
                  ? "bg-amber-500"
                  : "bg-emerald-500"
            }`}
          />
        </div>
      </div>

      {/* Bottom Info */}

      <div className="mt-6 grid grid-cols-2 gap-3">
        <div className="rounded-2xl bg-slate-50 p-4">
          <p className="text-xs text-slate-500">Minimum Stock</p>

          <h4 className="mt-1 text-xl font-bold text-slate-900">
            {product.minimumStock}
          </h4>

          <p className="text-xs text-slate-500">{product.unit}</p>
        </div>

        <div className="rounded-2xl bg-slate-50 p-4">
          <p className="text-xs text-slate-500">Remaining</p>

          <h4 className="mt-1 text-xl font-bold text-slate-900">
            {Math.max(product.stock - product.minimumStock, 0)}
          </h4>

          <p className="text-xs text-slate-500">Before minimum</p>
        </div>
      </div>
    </section>
  );
}
