"use client";

import { useState } from "react";
import { motion } from "framer-motion";

import { cn } from "@/lib/utils";

interface SaleFiltersProps {
  paymentStatus: string;

  onPaymentStatusChange: (value: string) => void;

  fromDate: string;

  toDate: string;

  onFromDateChange: (value: string) => void;

  onToDateChange: (value: string) => void;
}

const FILTERS = [
  {
    label: "Today",
    count: 0,
  },
  {
    label: "Yesterday",
    count: 0,
  },
  {
    label: "This Week",
    count: 0,
  },
  {
    label: "Paid",
    count: 0,
  },
  {
    label: "Partial",
    count: 0,
  },
  {
    label: "Due",
    count: 0,
  },
  {
    label: "Cash",
    count: 0,
  },
  {
    label: "UPI",
    count: 0,
  },
  {
    label: "Wholesale",
    count: 0,
  },
];

export function SaleFilters({
  paymentStatus,
  onPaymentStatusChange,
  fromDate,
  toDate,
  onFromDateChange,
  onToDateChange,
}: SaleFiltersProps) {
  const [selected, setSelected] = useState("Today");

  return (
    <section className="rounded-3xl border bg-card p-4 shadow-sm">
      <div className="mb-3 flex items-center justify-between">
        <h3 className="text-sm font-semibold text-foreground">Quick Filters</h3>

        <span className="text-xs text-muted-foreground">
          {FILTERS.length} Filters
        </span>
      </div>

      <div className="flex gap-3 overflow-x-auto pb-1 no-scrollbar">
        {FILTERS.map((filter) => {
          const active = selected === filter.label;

          return (
            <motion.button
              key={filter.label}
              whileTap={{ scale: 0.96 }}
              whileHover={{ y: -1 }}
              onClick={() => setSelected(filter.label)}
              className={cn(
                "flex shrink-0 items-center gap-2 rounded-2xl border px-4 py-2.5 text-sm font-medium transition-all duration-200",
                active
                  ? "border-violet-600 bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white shadow-lg shadow-violet-500/25"
                  : "border-border bg-background hover:border-violet-300 hover:bg-violet-50 dark:hover:bg-violet-500/10",
              )}
            >
              <span>{filter.label}</span>

              <span
                className={cn(
                  "flex h-5 min-w-5 items-center justify-center rounded-full px-1 text-[10px] font-bold",
                  active
                    ? "bg-white/20 text-white"
                    : "bg-violet-100 text-violet-700 dark:bg-violet-500/20 dark:text-violet-300",
                )}
              >
                {filter.count}
              </span>
            </motion.button>
          );
        })}
      </div>
    </section>
  );
}
