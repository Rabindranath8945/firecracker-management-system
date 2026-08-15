"use client";

import { Package } from "lucide-react";

import { Card } from "@/components/ui/card";

import type { SuccessSummaryItem } from "./success-sheet.types";

interface SuccessSummaryProps {
  title?: string;
  icon?: React.ReactNode;
  items: SuccessSummaryItem[];
}

export default function SuccessSummary({
  title = "Summary",
  icon,
  items,
}: SuccessSummaryProps) {
  return (
    <Card className="overflow-hidden rounded-3xl border border-slate-200/70 bg-white/80 shadow-lg backdrop-blur-sm dark:border-slate-800 dark:bg-slate-900/80">
      {/* Header */}

      <div className="flex items-center gap-3 border-b border-slate-100 bg-slate-50/70 px-5 py-4 dark:border-slate-800 dark:bg-slate-900/60">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-slate-900 to-slate-700 text-white shadow-md dark:from-slate-700 dark:to-slate-600">
          {icon ?? <Package className="h-6 w-6" />}
        </div>

        <div className="min-w-0">
          <h3 className="text-base font-semibold">{title}</h3>

          <p className="text-sm text-muted-foreground">
            Information saved successfully
          </p>
        </div>
      </div>

      {/* Content */}

      <div className="divide-y divide-slate-100 dark:divide-slate-800">
        {items.map((item, index) => (
          <div
            key={`${item.label}-${index}`}
            className="flex items-center justify-between gap-4 px-5 py-4 transition-colors hover:bg-slate-50/70 dark:hover:bg-slate-800/40"
          >
            <span className="min-w-0 text-sm font-medium text-muted-foreground">
              {item.label}
            </span>

            <span className="max-w-[60%] break-words text-right text-sm font-semibold text-foreground">
              {item.value}
            </span>
          </div>
        ))}
      </div>
    </Card>
  );
}
