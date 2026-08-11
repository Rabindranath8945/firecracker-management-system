"use client";

import { CalendarDays, Building2 } from "lucide-react";

interface SupplierHeroProps {
  title?: string;
  description?: string;
}

export default function SupplierHero({
  title = "Suppliers",
  description = "Manage suppliers, purchases and payment history.",
}: SupplierHeroProps) {
  const today = new Intl.DateTimeFormat("en-IN", {
    weekday: "long",
    day: "numeric",
    month: "long",
  }).format(new Date());

  return (
    <section className="space-y-4">
      {/* Module */}

      <div className="flex items-center gap-2">
        <Building2 className="h-4 w-4 text-indigo-600" />

        <span className="text-sm font-semibold text-indigo-600">
          Supplier Management
        </span>
      </div>

      {/* Title */}

      <div>
        <h1 className="text-[44px] font-bold tracking-tight text-slate-900">
          {title}
        </h1>

        <p className="mt-2 max-w-md text-sm leading-6 text-slate-500">
          {description}
        </p>
      </div>

      {/* Date */}

      <div className="flex items-center gap-2 text-sm text-slate-500">
        <CalendarDays className="h-4 w-4" />

        <span>{today}</span>
      </div>
    </section>
  );
}
