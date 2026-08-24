"use client";

import { CalendarDays, Truck } from "lucide-react";

interface SupplierManagementHeroProps {
  title?: string;
  description?: string;
}

export default function SupplierManagementHero({
  title = "Suppliers",
  description = "Manage suppliers, purchases, balances and payment history.",
}: SupplierManagementHeroProps) {
  const today = new Intl.DateTimeFormat("en-IN", {
    weekday: "long",
    day: "numeric",
    month: "long",
  }).format(new Date());

  return (
    <section className="space-y-4">
      {/* Module Badge */}

      <div
        className="
          inline-flex
          items-center
          gap-2
          rounded-full
          bg-indigo-50
          px-3
          py-1.5
        "
      >
        <Truck className="h-4 w-4 text-indigo-600" />

        <span
          className="
            text-xs
            font-semibold
            uppercase
            tracking-wider
            text-indigo-700
          "
        >
          Supplier Management
        </span>
      </div>

      {/* Heading */}

      <div className="space-y-2">
        <h1
          className="
            text-4xl
            font-bold
            tracking-tight
            text-slate-900
            dark:text-foreground
          "
        >
          {title}
        </h1>

        <p
          className="
            max-w-md
            text-sm
            leading-6
            text-slate-500
            dark:text-muted-foreground
          "
        >
          {description}
        </p>
      </div>

      {/* Date */}

      <div
        className="
          flex
          items-center
          gap-2
          text-sm
          text-slate-500
          dark:text-muted-foreground
        "
      >
        <div
          className="
            flex
            h-8
            w-8
            items-center
            justify-center
            rounded-xl
            bg-slate-100
            text-slate-500
            dark:bg-muted
          "
        >
          <CalendarDays className="h-4 w-4" />
        </div>

        <span>{today}</span>
      </div>
    </section>
  );
}
