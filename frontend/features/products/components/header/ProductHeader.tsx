"use client";

import { CalendarDays, Package2 } from "lucide-react";

interface ProductHeaderProps {
  totalProducts?: number;
}

export default function ProductHeader({
  totalProducts = 0,
}: ProductHeaderProps) {
  const today = new Intl.DateTimeFormat("en-IN", {
    weekday: "long",
    day: "numeric",
    month: "long",
  }).format(new Date());

  return (
    <section className="space-y-4">
      <div className="flex items-start justify-between">
        {/* Left */}

        <div>
          <div className="flex items-center gap-2">
            <Package2 className="h-5 w-5 text-sky-600" />

            <span className="text-sm font-semibold text-sky-600">
              Inventory
            </span>
          </div>

          <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-900">
            Products
          </h1>

          <p className="mt-2 text-sm leading-6 text-slate-500">
            Manage your inventory, pricing and stock from one place.
          </p>
        </div>

        {/* Right */}
      </div>

      {/* Date */}

      <div className="flex items-center gap-2 text-sm text-slate-500">
        <CalendarDays className="h-4 w-4" />

        <span>{today}</span>
      </div>
    </section>
  );
}
