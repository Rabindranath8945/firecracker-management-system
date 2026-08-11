"use client";

import { CalendarDays, Users } from "lucide-react";

interface CustomerHeroProps {
  title?: string;
  description?: string;
}

export default function CustomerHero({
  title = "Customers",
  description = "Manage customers, balances and payment history.",
}: CustomerHeroProps) {
  const today = new Intl.DateTimeFormat("en-IN", {
    weekday: "long",
    day: "numeric",
    month: "long",
  }).format(new Date());

  return (
    <section className="space-y-4">
      {/* Module Badge */}

      <div className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1.5">
        <Users className="h-4 w-4 text-emerald-600" />

        <span className="text-xs font-semibold uppercase tracking-wider text-emerald-700">
          Customer Management
        </span>
      </div>

      {/* Heading */}

      <div className="space-y-2">
        <h1 className="text-4xl font-bold tracking-tight text-slate-900">
          {title}
        </h1>

        <p className="max-w-md text-sm leading-6 text-slate-500">
          {description}
        </p>
      </div>

      {/* Date */}

      <div className="flex items-center gap-2 text-sm text-slate-500">
        <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-slate-100">
          <CalendarDays className="h-4 w-4" />
        </div>

        <span>{today}</span>
      </div>
    </section>
  );
}
