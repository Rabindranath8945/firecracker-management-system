"use client";

import { BadgeCheck, Package, CircleAlert } from "lucide-react";

import type { Product } from "../../types/product.types";

interface Props {
  product: Product;
}

export default function ProductHeroCard({ product }: Props) {
  const profit = product.sellingPrice - product.purchasePrice;

  const lowStock = product.stock <= product.minimumStock;

  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-5">
      {/* Image */}

      <div className="flex justify-center">
        <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-slate-100">
          <Package className="h-10 w-10 text-sky-600" />
        </div>
      </div>

      {/* Name */}

      <div className="mt-4 text-center">
        <h1 className="text-2xl font-bold text-slate-900">{product.name}</h1>

        <p className="mt-1 text-sm text-slate-500">{product.productCode}</p>
      </div>

      {/* Status */}

      <div className="mt-5 flex items-center justify-center gap-2">
        <span className="inline-flex items-center rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
          <BadgeCheck className="mr-1 h-3.5 w-3.5" />
          Active
        </span>

        <span
          className={`rounded-full px-3 py-1 text-xs font-semibold ${
            lowStock ? "bg-red-50 text-red-600" : "bg-sky-50 text-sky-600"
          }`}
        >
          {lowStock ? (
            <>
              <CircleAlert className="mr-1 inline h-3.5 w-3.5" />
              Low {product.stock}
            </>
          ) : (
            `Stock ${product.stock}`
          )}
        </span>

        <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">
          {product.unit}
        </span>
      </div>

      {/* Prices */}

      <div className="mt-6 grid grid-cols-3 divide-x rounded-2xl border border-slate-200">
        <div className="py-3 text-center">
          <p className="text-[11px] text-slate-500">Purchase</p>

          <h3 className="mt-1 text-lg font-bold text-slate-900">
            ₹{product.purchasePrice}
          </h3>
        </div>

        <div className="py-3 text-center">
          <p className="text-[11px] text-slate-500">Selling</p>

          <h3 className="mt-1 text-lg font-bold text-emerald-600">
            ₹{product.sellingPrice}
          </h3>
        </div>

        <div className="py-3 text-center">
          <p className="text-[11px] text-slate-500">Profit</p>

          <h3 className="mt-1 text-lg font-bold text-sky-600">₹{profit}</h3>
        </div>
      </div>
    </section>
  );
}
