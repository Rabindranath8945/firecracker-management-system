"use client";

import { CalendarDays, ReceiptText } from "lucide-react";

interface SalesHeroProps {
  title?: string;
  description?: string;
}

export function SalesHero({
  title = "Sales",
  description = "Manage invoices and daily sales.",
}: SalesHeroProps) {
  const today = new Intl.DateTimeFormat("en-IN", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date());

  return (
    <section className="space-y-5">
      {/* Module Badge */}

      <div className="flex items-center gap-2">
        <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-violet-100 text-violet-700 dark:bg-violet-500/20 dark:text-violet-300">
          <ReceiptText className="h-4 w-4" />
        </div>

        <span className="text-sm font-semibold text-violet-700 dark:text-violet-300">
          Sales
        </span>
      </div>

      {/* Title */}

      <div className="space-y-2">
        <h1 className="text-4xl font-bold tracking-tight">{title}</h1>

        <p className="text-muted-foreground">{description}</p>
      </div>

      {/* Information */}

      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <CalendarDays className="h-4 w-4 text-violet-600" />

        <span>{today}</span>

        <span className="text-muted-foreground/50">•</span>

        <span className="font-medium text-violet-700 dark:text-violet-300">
          24 Orders Today
        </span>
      </div>
    </section>
  );
}
