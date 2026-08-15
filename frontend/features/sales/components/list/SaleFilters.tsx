"use client";

import { motion } from "framer-motion";

import { cn } from "@/lib/utils";

interface SaleFiltersProps {
  paymentStatus: string;
  paymentMethod: string;

  fromDate: string;
  toDate: string;

  onPaymentStatusChange: (value: string) => void;
  onPaymentMethodChange: (value: string) => void;

  onFromDateChange: (value: string) => void;
  onToDateChange: (value: string) => void;

  onReset?: () => void;
}

const FILTERS = [
  "Today",
  "Yesterday",
  "This Week",
  "Paid",
  "Partial",
  "Due",
  "Cash",
  "UPI",
  "Wholesale",
] as const;

function formatLocalDate(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function getDateRange(label: string): {
  from: string;
  to: string;
} {
  const today = new Date();

  switch (label) {
    case "Today": {
      const date = formatLocalDate(today);

      return {
        from: date,
        to: date,
      };
    }

    case "Yesterday": {
      const yesterday = new Date(today);

      yesterday.setDate(yesterday.getDate() - 1);

      const date = formatLocalDate(yesterday);

      return {
        from: date,
        to: date,
      };
    }

    case "This Week": {
      const start = new Date(today);

      const day = start.getDay();

      const difference = day === 0 ? 6 : day - 1;

      start.setDate(start.getDate() - difference);

      return {
        from: formatLocalDate(start),
        to: formatLocalDate(today),
      };
    }

    default:
      return {
        from: "",
        to: "",
      };
  }
}

export function SaleFilters({
  paymentStatus,
  paymentMethod,

  fromDate,
  toDate,

  onPaymentStatusChange,
  onPaymentMethodChange,

  onFromDateChange,
  onToDateChange,

  onReset,
}: SaleFiltersProps) {
  function clearFilters() {
    onPaymentStatusChange("");
    onPaymentMethodChange("");
    onFromDateChange("");
    onToDateChange("");

    onReset?.();
  }

  function clearOtherFilters() {
    onPaymentStatusChange("");
    onPaymentMethodChange("");
  }

  function handleFilter(label: string) {
    clearOtherFilters();

    if (label === "Today" || label === "Yesterday" || label === "This Week") {
      const range = getDateRange(label);

      onFromDateChange(range.from);
      onToDateChange(range.to);

      return;
    }

    onFromDateChange("");
    onToDateChange("");

    switch (label) {
      case "Paid":
        onPaymentStatusChange("PAID");
        break;

      case "Partial":
        onPaymentStatusChange("PARTIAL");
        break;

      case "Due":
        onPaymentStatusChange("DUE");
        break;

      case "Cash":
        onPaymentMethodChange("CASH");
        break;

      case "UPI":
        onPaymentMethodChange("UPI");
        break;

      case "Wholesale":
        // Do not send anything until backend
        // has a wholesale field/filter.
        break;
    }
  }

  function isActive(label: string): boolean {
    if (label === "Today" || label === "Yesterday" || label === "This Week") {
      const range = getDateRange(label);

      return (
        fromDate === range.from &&
        toDate === range.to &&
        !paymentStatus &&
        !paymentMethod
      );
    }

    if (label === "Paid") {
      return paymentStatus === "PAID";
    }

    if (label === "Partial") {
      return paymentStatus === "PARTIAL";
    }

    if (label === "Due") {
      return paymentStatus === "DUE";
    }

    if (label === "Cash") {
      return paymentMethod === "CASH";
    }

    if (label === "UPI") {
      return paymentMethod === "UPI";
    }

    return false;
  }

  const hasFilters =
    Boolean(paymentStatus) ||
    Boolean(paymentMethod) ||
    Boolean(fromDate) ||
    Boolean(toDate);

  return (
    <section className="rounded-3xl border bg-card p-4 shadow-sm">
      <div className="mb-3 flex items-center justify-between">
        <div>
          <h3 className="text-sm font-semibold text-foreground">
            Quick Filters
          </h3>

          <p className="mt-0.5 text-[11px] text-muted-foreground">
            Filter sales
          </p>
        </div>

        {hasFilters && (
          <button
            type="button"
            onClick={clearFilters}
            className="text-xs font-semibold text-violet-600 hover:text-violet-700"
          >
            Clear
          </button>
        )}
      </div>

      <div className="flex gap-3 overflow-x-auto pb-1 no-scrollbar">
        {FILTERS.map((label) => {
          const active = isActive(label);

          return (
            <motion.button
              key={label}
              type="button"
              whileTap={{ scale: 0.96 }}
              whileHover={{ y: -1 }}
              onClick={() => handleFilter(label)}
              className={cn(
                "flex shrink-0 items-center rounded-2xl border px-4 py-2.5 text-sm font-medium transition-all",
                active
                  ? "border-violet-600 bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white shadow-lg shadow-violet-500/25"
                  : "border-border bg-background hover:border-violet-300 hover:bg-violet-50",
              )}
            >
              {label}
            </motion.button>
          );
        })}
      </div>
    </section>
  );
}
