"use client";

import Link from "next/link";
import {
  CalendarDays,
  ChevronRight,
  Eye,
  Package2,
  Receipt,
  Trash2,
  Truck,
} from "lucide-react";
import { motion } from "framer-motion";

import { Button } from "@/components/ui/button";

import type { Purchase } from "../types/purchase.types";

interface PurchaseListItemProps {
  purchase: Purchase;
  onDelete: (purchase: Purchase) => void;
}

function getStatusStyles(status: string) {
  switch (status) {
    case "PAID":
      return {
        label: "Paid",
        className:
          "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300",
      };

    case "PARTIAL":
      return {
        label: "Partial",
        className:
          "bg-orange-100 text-orange-700 dark:bg-orange-500/15 dark:text-orange-300",
      };

    case "DUE":
      return {
        label: "Due",
        className:
          "bg-red-100 text-red-700 dark:bg-red-500/15 dark:text-red-300",
      };

    case "COMPLETED":
      return {
        label: "Completed",
        className:
          "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300",
      };

    case "DRAFT":
      return {
        label: "Draft",
        className:
          "bg-slate-100 text-slate-700 dark:bg-slate-500/15 dark:text-slate-300",
      };

    case "CANCELED":
      return {
        label: "Canceled",
        className:
          "bg-red-100 text-red-700 dark:bg-red-500/15 dark:text-red-300",
      };

    default:
      return {
        label: status,
        className:
          "bg-slate-100 text-slate-700 dark:bg-slate-500/15 dark:text-slate-300",
      };
  }
}

export default function PurchaseListItem({
  purchase,
  onDelete,
}: PurchaseListItemProps) {
  const status = getStatusStyles(purchase.paymentStatus);

  const totalQuantity = purchase.items.reduce(
    (total, item) => total + item.quantity,
    0,
  );

  const itemCount = purchase.items.length;

  const purchaseDate = new Date(purchase.purchaseDate);

  const formattedDate = Number.isNaN(purchaseDate.getTime())
    ? "Invalid date"
    : purchaseDate.toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      });

  return (
    <motion.article
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -1 }}
      transition={{ duration: 0.2 }}
      className="
        group
        overflow-hidden
        rounded-3xl
        border
        border-slate-200
        bg-white
        shadow-sm
        transition-shadow
        hover:shadow-md
        dark:border-border
        dark:bg-card
      "
    >
      <div className="p-4">
        <div className="flex gap-4">
          {/* Purchase Icon */}

          <Link
            href={`/purchases/${purchase._id}`}
            aria-label={`View purchase ${purchase.purchaseNo}`}
            className="
              flex
              h-16
              w-16
              shrink-0
              items-center
              justify-center
              rounded-2xl
              border
              border-emerald-100
              bg-emerald-50
              transition-all
              group-hover:border-emerald-200
              group-hover:bg-emerald-100
              dark:border-emerald-500/20
              dark:bg-emerald-500/10
            "
          >
            <Truck className="h-7 w-7 text-emerald-600 dark:text-emerald-400" />
          </Link>

          {/* Main Content */}

          <div className="min-w-0 flex-1">
            {/* Top Row */}

            <div className="flex items-start justify-between gap-3">
              <Link
                href={`/purchases/${purchase._id}`}
                className="min-w-0 flex-1"
              >
                <h3 className="truncate text-[15px] font-bold text-slate-900 dark:text-foreground">
                  {purchase.supplier?.name || "Unknown Supplier"}
                </h3>

                <p className="mt-0.5 truncate text-xs text-slate-500 dark:text-muted-foreground">
                  {purchase.purchaseNo}
                </p>
              </Link>

              {/* Actions */}

              <div className="flex shrink-0 items-center gap-1">
                <Link href={`/purchases/${purchase._id}`}>
                  <Button
                    type="button"
                    size="icon"
                    variant="ghost"
                    className="
                      h-8
                      w-8
                      rounded-xl
                      text-slate-500
                      hover:bg-violet-50
                      hover:text-violet-600
                      dark:hover:bg-violet-500/10
                    "
                    aria-label="View purchase"
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                </Link>

                <Button
                  type="button"
                  size="icon"
                  variant="ghost"
                  className="
                    h-8
                    w-8
                    rounded-xl
                    text-red-500
                    hover:bg-red-50
                    hover:text-red-600
                    dark:hover:bg-red-500/10
                  "
                  aria-label="Delete purchase"
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

            {/* Status + Invoice */}

            <div className="mt-3 flex flex-wrap items-center gap-2">
              <span
                className={`
                  rounded-full
                  px-2.5
                  py-1
                  text-[10px]
                  font-bold
                  uppercase
                  tracking-wide
                  ${status.className}
                `}
              >
                {status.label}
              </span>

              <span className="flex items-center gap-1 text-xs text-slate-500 dark:text-muted-foreground">
                <Receipt className="h-3.5 w-3.5" />

                {purchase.invoiceNo || "No Invoice"}
              </span>
            </div>

            {/* Meta */}

            <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2">
              <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-muted-foreground">
                <CalendarDays className="h-3.5 w-3.5" />

                {formattedDate}
              </div>

              <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-muted-foreground">
                <Package2 className="h-3.5 w-3.5" />
                {itemCount} product
                {itemCount !== 1 ? "s" : ""}
                <span className="text-slate-300 dark:text-muted-foreground/40">
                  •
                </span>
                {totalQuantity} qty
              </div>
            </div>

            {/* Bottom */}

            <div className="mt-4 flex items-end justify-between gap-3 border-t border-slate-100 pt-3 dark:border-border">
              <div>
                <p className="text-[10px] font-medium uppercase tracking-wide text-slate-400 dark:text-muted-foreground">
                  Grand Total
                </p>

                <p className="mt-0.5 text-xl font-bold tracking-tight text-slate-900 dark:text-foreground">
                  ₹{purchase.grandTotal.toLocaleString("en-IN")}
                </p>
              </div>

              {purchase.dueAmount > 0 && (
                <div className="text-right">
                  <p className="text-[10px] font-medium uppercase tracking-wide text-red-400">
                    Due
                  </p>

                  <p className="mt-0.5 text-sm font-bold text-red-600 dark:text-red-400">
                    ₹{purchase.dueAmount.toLocaleString("en-IN")}
                  </p>
                </div>
              )}

              <Link
                href={`/purchases/${purchase._id}`}
                className="
                  flex
                  h-9
                  items-center
                  gap-1
                  rounded-xl
                  px-2
                  text-xs
                  font-semibold
                  text-violet-600
                  transition-colors
                  hover:bg-violet-50
                  dark:text-violet-400
                  dark:hover:bg-violet-500/10
                "
              >
                View
                <ChevronRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </motion.article>
  );
}
