"use client";

import {
  CalendarDays,
  CreditCard,
  FileText,
  IndianRupee,
  TrendingUp,
} from "lucide-react";

import type {
  Supplier,
  SupplierBalance,
} from "@/features/suppliers/types/supplier.type";

interface SupplierInsightsProps {
  supplier: Supplier;
  balance: SupplierBalance;
}

export default function SupplierInsights({
  supplier,
  balance,
}: SupplierInsightsProps) {
  const totalPurchase = Number(balance.totalPurchases ?? 0);

  const totalPaid = Number(balance.totalPaid ?? 0);

  const currentDue = Number(balance.currentDue ?? 0);

  const lastPurchase = balance.lastPurchaseDate
    ? new Date(balance.lastPurchaseDate).toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      })
    : "No purchase";

  return (
    <section className="overflow-hidden rounded-3xl border border-emerald-200 bg-card shadow-sm dark:border-emerald-500/20">
      {/* Header */}
      <div className="border-b border-emerald-100 bg-emerald-50/50 p-5 dark:border-emerald-500/10 dark:bg-emerald-500/5">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-100 dark:bg-emerald-500/15">
            <TrendingUp className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
          </div>

          <div className="min-w-0">
            <h2 className="text-lg font-bold">Supplier Insights</h2>

            <p className="mt-0.5 truncate text-xs text-muted-foreground">
              {supplier.name}
            </p>
          </div>
        </div>
      </div>

      {/* Insight Cards */}
      <div className="grid grid-cols-2 gap-3 p-5">
        {/* Last Purchase */}
        <InsightCard
          icon={<CalendarDays className="h-5 w-5" />}
          title="Last Purchase"
          value={lastPurchase}
          variant="green"
        />

        {/* Total Purchase */}
        <InsightCard
          icon={<IndianRupee className="h-5 w-5" />}
          title="Total Purchase"
          value={`₹${totalPurchase.toLocaleString("en-IN", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })}`}
          variant="green"
        />

        {/* Current Due */}
        <InsightCard
          icon={<CreditCard className="h-5 w-5" />}
          title="Current Due"
          value={`₹${currentDue.toLocaleString("en-IN", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })}`}
          variant={currentDue > 0 ? "red" : "green"}
        />

        {/* Total Paid */}
        <InsightCard
          icon={<FileText className="h-5 w-5" />}
          title="Total Paid"
          value={`₹${totalPaid.toLocaleString("en-IN", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })}`}
          variant="green"
        />
      </div>
    </section>
  );
}

/* -------------------------------------------------------------------------- */
/* INSIGHT CARD                                                               */
/* -------------------------------------------------------------------------- */

interface InsightCardProps {
  icon: React.ReactNode;
  title: string;
  value: string;
  variant: "green" | "red";
}

function InsightCard({ icon, title, value, variant }: InsightCardProps) {
  const styles =
    variant === "red"
      ? {
          container:
            "border-red-100 bg-red-50/60 dark:border-red-500/10 dark:bg-red-500/5",
          icon: "bg-red-100 text-red-600 dark:bg-red-500/15 dark:text-red-400",
          value: "text-red-600 dark:text-red-400",
        }
      : {
          container:
            "border-emerald-100 bg-emerald-50/60 dark:border-emerald-500/10 dark:bg-emerald-500/5",
          icon: "bg-emerald-100 text-emerald-600 dark:bg-emerald-500/15 dark:text-emerald-400",
          value: "text-emerald-600 dark:text-emerald-400",
        };

  return (
    <div className={`rounded-2xl border p-4 ${styles.container}`}>
      <div
        className={`mb-3 flex h-9 w-9 items-center justify-center rounded-xl ${styles.icon}`}
      >
        {icon}
      </div>

      <p className="text-xs font-medium text-muted-foreground">{title}</p>

      <h3 className={`mt-1 truncate text-sm font-bold ${styles.value}`}>
        {value}
      </h3>
    </div>
  );
}
