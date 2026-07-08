"use client";

import { Plus, ShoppingCart, PackagePlus, ChartColumn } from "lucide-react";

import QuickActionCard from "./QuickActionCard";

export default function QuickActions() {
  return (
    <section className="space-y-3">
      <div>
        <h2 className="text-lg font-semibold text-slate-900">Quick Actions</h2>

        <p className="text-sm text-slate-500">Frequently used operations</p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <QuickActionCard
          title="New Sale"
          subtitle="Create invoice"
          href="/sales/new"
          icon={ShoppingCart}
          iconBgClass="bg-red-100"
          iconTextClass="text-red-600"
        />

        <QuickActionCard
          title="Purchase"
          subtitle="Receive stock"
          href="/purchases/new"
          icon={PackagePlus}
          iconBgClass="bg-blue-100"
          iconTextClass="text-blue-600"
        />

        <QuickActionCard
          title="Add Product"
          subtitle="New inventory"
          href="/products/new"
          icon={Plus}
          iconBgClass="bg-emerald-100"
          iconTextClass="text-emerald-600"
        />

        <QuickActionCard
          title="Reports"
          subtitle="Business analytics"
          href="/reports"
          icon={ChartColumn}
          iconBgClass="bg-violet-100"
          iconTextClass="text-violet-600"
        />
      </div>
    </section>
  );
}
