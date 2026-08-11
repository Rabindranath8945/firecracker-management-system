"use client";

import { ReceiptText } from "lucide-react";

interface SaleHeaderProps {
  title?: string;
  description?: string;
}

export default function SaleHeader({
  title = "Quick POS",
  description = "Search products, add items and create invoices in seconds.",
}: SaleHeaderProps) {
  const today = new Intl.DateTimeFormat("en-IN", {
    weekday: "long",
    day: "numeric",
    month: "long",
  }).format(new Date());

  return (
    <section className="space-y-5">
      {/* Module Badge */}

      <div className="flex items-center gap-2">
        <div
          className="
            flex
            h-9
            w-9
            items-center
            justify-center
            rounded-xl
            bg-emerald-100
            text-emerald-700
            dark:bg-emerald-500/20
            dark:text-emerald-300
          "
        >
          <ReceiptText className="h-5 w-5" />
        </div>

        <span className="text-sm font-semibold text-emerald-700 dark:text-emerald-300">
          Quick Billing
        </span>
      </div>

      {/* Heading */}

      <div className="space-y-2">
        <h1 className="text-4xl font-bold tracking-tight">{title}</h1>

        <p className="max-w-md text-sm leading-6 text-muted-foreground">
          {description}
        </p>
      </div>

      {/* Date */}

      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <div className="h-2 w-2 rounded-full bg-emerald-500" />

        <span>{today}</span>
      </div>
    </section>
  );
}
