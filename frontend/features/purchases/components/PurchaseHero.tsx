"use client";

import { CalendarDays, ShoppingCart } from "lucide-react";

export function PurchaseHero() {
  const today = new Intl.DateTimeFormat("en-IN", {
    weekday: "long",
    day: "numeric",
    month: "long",
  }).format(new Date());

  return (
    <section className="space-y-3">
      <div className="flex items-center gap-2">
        <ShoppingCart className="h-4 w-4 text-emerald-600" />

        <span className="text-sm font-semibold text-emerald-700">
          Purchases
        </span>
      </div>

      <div>
        <h1 className="text-4xl font-black tracking-tight text-slate-900">
          Purchases
        </h1>

        <p className="mt-2 max-w-xl text-sm text-slate-500">
          Manage supplier purchases, inventory stock updates and purchase
          invoices from one place.
        </p>
      </div>

      <div className="flex items-center gap-2 pt-1 text-sm text-slate-500">
        <CalendarDays className="h-4 w-4" />

        <span>{today}</span>
      </div>
    </section>
  );
}
