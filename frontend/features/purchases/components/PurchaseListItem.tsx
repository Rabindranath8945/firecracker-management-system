"use client";

import Link from "next/link";
import { Eye, ShoppingCart, Trash2, CalendarDays, Receipt } from "lucide-react";

import { Button } from "@/components/ui/button";

import type { Purchase } from "../types/purchase.types";

interface PurchaseListItemProps {
  purchase: Purchase;
  onDelete: (purchase: Purchase) => void;
}

export default function PurchaseListItem({
  purchase,
  onDelete,
}: PurchaseListItemProps) {
  const paymentStatus = purchase.paymentStatus ?? "PENDING";

  const badgeClass =
    paymentStatus === "PAID"
      ? "bg-green-100 text-green-700"
      : paymentStatus === "PARTIAL"
        ? "bg-orange-100 text-orange-700"
        : "bg-red-100 text-red-700";

  return (
    <article className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm transition-all hover:shadow-md">
      <div className="flex gap-4">
        {/* Purchase Icon */}

        <Link
          href={`/purchases/${purchase._id}`}
          className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl border border-slate-200 bg-emerald-50"
        >
          <ShoppingCart className="h-7 w-7 text-emerald-600" />
        </Link>

        {/* Details */}

        <div className="min-w-0 flex-1">
          {/* Header */}

          <div className="flex items-start justify-between gap-2">
            <Link
              href={`/purchases/${purchase._id}`}
              className="min-w-0 flex-1"
            >
              <h3 className="truncate text-[15px] font-semibold text-slate-900">
                {purchase.supplierName ?? "Walk-in Supplier"}
              </h3>
            </Link>

            <div className="flex items-center gap-1">
              <Link href={`/purchases/${purchase._id}`}>
                <Button
                  size="icon"
                  variant="ghost"
                  className="h-8 w-8 rounded-lg"
                >
                  <Eye className="h-4 w-4" />
                </Button>
              </Link>

              <Button
                size="icon"
                variant="ghost"
                className="h-8 w-8 rounded-lg text-red-600 hover:bg-red-50"
                onClick={(event) => {
                  event.preventDefault();
                  event.stopPropagation();

                  onDelete(purchase);
                }}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Purchase No */}

          <div className="mt-1 flex items-center justify-between">
            <p className="text-xs text-slate-500">{purchase.purchaseNo}</p>

            <span
              className={`rounded-full px-2 py-0.5 text-[11px] font-semibold ${badgeClass}`}
            >
              {paymentStatus}
            </span>
          </div>

          {/* Invoice */}

          <div className="mt-2 flex items-center gap-2 text-xs text-slate-500">
            <Receipt className="h-3.5 w-3.5" />

            <span>{purchase.invoiceNo || "No Invoice"}</span>
          </div>

          {/* Date */}

          <div className="mt-2 flex items-center gap-2 text-xs text-slate-500">
            <CalendarDays className="h-3.5 w-3.5" />

            <span>
              {new Date(purchase.purchaseDate).toLocaleDateString("en-IN")}
            </span>
          </div>

          {/* Footer */}

          <div className="mt-3 flex items-end justify-between">
            <span className="text-lg font-bold text-slate-900">
              ₹{purchase.grandTotal.toLocaleString("en-IN")}
            </span>

            <span className="text-xs text-slate-500">
              {purchase.items.length} Item
              {purchase.items.length !== 1 && "s"}
            </span>
          </div>
        </div>
      </div>
    </article>
  );
}
