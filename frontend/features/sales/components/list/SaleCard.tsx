"use client";

import {
  ChevronRight,
  CreditCard,
  Wallet,
  Smartphone,
  ReceiptText,
  Package,
} from "lucide-react";

import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

import type { PaymentMethod, PaymentStatus } from "../../types/Sales.types";

interface SaleCardProps {
  invoiceNo: string;
  customer: string;
  total: number;
  payment: PaymentMethod;
  status: PaymentStatus;
  createdAt: string;
  items: number;
}

export function SaleCard({
  invoiceNo,
  customer,
  total,
  payment,
  status,
  createdAt,
  items,
}: SaleCardProps) {
  const PaymentIcon =
    payment === "CASH" ? Wallet : payment === "UPI" ? Smartphone : CreditCard;

  const statusColor = {
    PAID: "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300",
    PARTIAL:
      "bg-amber-100 text-amber-700 dark:bg-amber-500/15 dark:text-amber-300",
    DUE: "bg-red-100 text-red-700 dark:bg-red-500/15 dark:text-red-300",
  };

  return (
    <Card className="overflow-hidden rounded-3xl border-0 shadow-sm transition-all hover:-translate-y-1 hover:shadow-xl">
      {/* Accent */}
      <div className="h-1 bg-gradient-to-r from-violet-600 via-fuchsia-500 to-purple-500" />

      <div className="space-y-5 p-5">
        {/* Header */}
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-violet-100 dark:bg-violet-500/15">
              <ReceiptText className="h-7 w-7 text-violet-700 dark:text-violet-300" />
            </div>

            <div>
              <h3 className="font-semibold text-lg">{invoiceNo}</h3>

              <p className="text-sm text-muted-foreground">{customer}</p>
            </div>
          </div>

          <Badge
            className={cn(
              "rounded-full border-0 px-3 py-1 font-medium",
              statusColor[status],
            )}
          >
            {status}
          </Badge>
        </div>

        {/* Amount */}
        <div className="rounded-2xl bg-violet-50 p-4 dark:bg-violet-500/10">
          <p className="text-xs uppercase tracking-wide text-violet-600 dark:text-violet-300">
            Invoice Amount
          </p>

          <h2 className="mt-1 text-3xl font-bold">₹{total.toLocaleString()}</h2>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between">
          <div className="space-y-2 text-sm text-muted-foreground">
            <div>{createdAt}</div>

            <div className="flex items-center gap-2">
              <Package className="h-4 w-4" />
              {items} Items
            </div>
          </div>

          <div className="text-right">
            <div className="inline-flex items-center gap-2 rounded-xl bg-muted px-3 py-2">
              <PaymentIcon className="h-4 w-4 text-violet-600 dark:text-violet-300" />

              <span className="text-sm font-medium">{payment}</span>
            </div>

            <div className="mt-3 flex justify-end">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-100 transition-colors hover:bg-violet-200 dark:bg-violet-500/15 dark:hover:bg-violet-500/25">
                <ChevronRight className="h-5 w-5 text-violet-700 dark:text-violet-300" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}
